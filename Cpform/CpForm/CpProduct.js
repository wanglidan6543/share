import React, { Component } from "react";
import { List, Radio, NavBar, Flex } from "antd-mobile";
import { forMat } from "../../util/dataConvert";
import send from "../../util/send";
import df from "dateformat";
import { isArray } from "util";

const RadioItem = Radio.RadioItem;
const Item = List.Item;
export default class Product extends Component {
  constructor(props) {
    super(props);
    // 用于交互数据
    this.state = {
      list: [],
    };
  }
  componentDidMount() {
    this.getFeedProduct();
  }
  getFeedProduct = () => {
    send({
      url: "/api/chicken/input/common-input/feedProduct",
      method: "GET",
      params: {
        documentDate: forMat(),
      },
    }).then((res) => {
      if (res.data.code === 200) {
        let resData = res.data.data;
        let arr = [];
        resData &&
          resData.length > 0 &&
          resData.forEach((item) => {
            let obj = {
              label: item.productName,
              value: item.productCode,
              cfQty: item.cfQty, // 当日库存
              actualQty: item.actualQty, // 实际库存
              productCode: item.productCode,
            };
            arr.push(obj);
          });
        this.setState({
          list: arr,
        });
        console.log(this.state.list);
      }
    });
  };
  onChange = (val) => {
    console.log(val);
  };
  render() {
    return (
      <React.Fragment>
        <Flex
          direction="column"
          align="stretch"
          style={{ height: "100%", width: "100%" }}
        >
          <NavBar mode="light">产品列表</NavBar>
          <List>
            {this.state.list.map((item) => (
              <RadioItem
                key={item.value}
                // checked={this.props.current === item.value}
                onChange={() => this.onChange(item)}
              >
                {item.label}
                <div>
                  <ul></ul>
                </div>
                <List className="my-list">
                  <Item extra={"产品规格:" + item.packingSize + "吨/车"}>
                    库存:{item.cfWgh}kg
                  </Item>
                </List>
              </RadioItem>
            ))}
          </List>
        </Flex>
      </React.Fragment>
    );
  }
}
