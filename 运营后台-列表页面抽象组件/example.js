import React, { Component } from 'react';
import { Form,Row } from 'antd';
import send from '../../util/send';
import { ListPageContainer } from '../../components/ListPageContainer';
import { Link } from 'react-router-dom';
import { listPageParams } from "../../util/listPageParams";
import { CompanyAndShopSelect } from '../../components/CommonSelect';

const { FormItemTypes } = ListPageContainer;
const RangeTimeFormat = 'YYYY-MM-DD';

class AfterSaleList extends Component {
  state = {
    afterSaleList: [],
    statusList: [],
    total: 0,
  }
  currentPage;
  pageSize;
  columns = [
    {
      title: '售后单号',
      dataIndex: 'refund_no',
    },
    {
      title: '订单号',
      dataIndex: 'order_no',
    },
    {
      title: '售后类型',
      dataIndex: 'type_desc',
    },
    {
      title: '申请人',
      dataIndex: 'apply_name',
    },
    {
      title: '申请人电话',
      dataIndex: 'apply_mobile'
    },
    {
      title: '退款总金额',
      dataIndex: 'refund_amount',
    },
    {
      title: '退货理由',
      dataIndex: 'reason_desc'
    },
    {
      title: '公司名称',
      dataIndex: 'company_name',
    },
    {
      title: '门店名称',
      dataIndex: 'shop_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '审核状态',
      dataIndex: 'status_desc'
    },
    {
      title: '操作',
      dataIndex: 'op',
      render: (text,item) => {
        return <Link to={`/order/aftersalelist/detail/${item.refund_no}`} onClick={this.setPageParams}>详情</Link>
      },
      fixed: 'right',
      width: 100
    }
  ];
  getFormattedRangeTime = (momentRangeTime) => {
    if (momentRangeTime) {
      let startTimeStr = momentRangeTime[0] ? momentRangeTime[0].format(RangeTimeFormat): undefined;
      let endTimeStr = momentRangeTime[1] ? momentRangeTime[1].format(RangeTimeFormat): undefined;
      return [startTimeStr, endTimeStr]
    }
    return [undefined, undefined]
  }
  getQueryParams = (currentPage, pageSize) => {
    const formValue = this.props.form.getFieldsValue();
    let rangeTimeArr = this.getFormattedRangeTime(formValue.rangeTime);
    return {
      offset: currentPage,
      limit: pageSize,
      company_id: formValue.companyId,
      shop_id: formValue.shopId,
      refund_no: formValue.refund_no,
      order_no: formValue.order_no,
      status: formValue.status,
      start_time: rangeTimeArr[0],
      end_time: rangeTimeArr[1],
    }
  }
  getAfterSaleList = (currentPage, pageSize) => {
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    let postData = this.getQueryParams(this.currentPage,this.pageSize);
    return send({
      method: 'POST',
      url: '/refund/list',
      data: postData
    }).then(res => {
      if (res.data.code === 200) {
        let info = res.data.data;
        this.setState({
          afterSaleList: info.data || [],
          statusList: info.refund_status,
          total: Number(info.total)
        })
      }
    })
  }
  setPageParams = () => {
    let pagination = {currentPage: this.currentPage, pageSize: this.pageSize};
    listPageParams.setParams(this.props, pagination);
  }

  render() {
    const { afterSaleList, total,statusList } = this.state;
    const { location, form } = this.props;
    const formRows = [
      {
        render: () => {
          return (
            <Row>
              <CompanyAndShopSelect form={form}/>
            </Row>
          )
        }
      },
      {
        cols: [
          {
            label: '售后单号',
            dataIndex: 'refund_no'
          },
          {
            label: '订单号',
            dataIndex: 'order_no',
          },
          {
            label: '创建时间',
            type: FormItemTypes.type_rangePicker,
            dataIndex: 'rangeTime',
          },
        ]
      },
      {
        cols: [
          {
            label: '审核状态',
            type: FormItemTypes.type_select,
            dataIndex: 'status',
            options: statusList,
            nameKey: 'text',
            valueKey: 'value'
          },
          {
            type: FormItemTypes.type_submit,
            span: 5,
            offset: 10,
          }
        ]
      }
    ];
    this.columns.forEach(item => {
      if(!item.align) {
        item.align = 'center'
      }
    })
    const tableProps = {
      columns: this.columns,
      rowKey: 'refund_id',
      dataSource: afterSaleList,
      scroll: {x: 1500}
    };
    return (
      <ListPageContainer
        total={total}
        formRows={formRows}
        location={location}
        form={form}
        query={this.getAfterSaleList}
        tableProps={tableProps}
        autoQuery={true}
      >
      </ListPageContainer>
    )
  }
}

const WrappedAfterSaleList = Form.create()(AfterSaleList);
export default WrappedAfterSaleList;
