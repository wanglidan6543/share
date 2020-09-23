import React, { Component } from "react";
import CpForm from "../../components/CpForm/CpForm";
import CpSection from "../../components/CpForm/CpSection";
import CpButton from "../../components/CpForm/CpButton";
import { forMat } from "../../util/dataConvert";
import { Toast } from "antd-mobile";
import send from "../../util/send";

const { CpDateItem, CpPickerItem, CpInputItem } = CpForm;
class Drug extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saveAble: false,
      drugSpecifications: "",
      method: "ADD",
    };
  }
  componentDidMount() {}

  changeDrugFeed = (val) => {
    let { feedProductList } = this.props;
    let formCode = val.join();
    feedProductList.forEach((item) => {
      if (item.value == formCode) {
        this.setState({
          drugSpecifications: item,
        });
      }
    });
  };
  getDrugTotal = () => {
    let formData = this.props.form.getFieldValues();
    const { form } = this.props;
    form.setFieldValues({
      drugTotalAmount:
        Number(formData.drugNumber ? formData.drugNumber : "") *
        Number(formData.drugUnit ? formData.drugUnit : ""),
    });
  };
  onSave = () => {
    let form = this.props.form.getFieldValues();
    let { drugSpecifications } = this.state;
    send({
      url: "/api/chicken/input/egg-purchase/save",
      method: "POST",
      data: {
        breederCode: "", // 品类名称代码
        documentDate: forMat(form.drugDate),
        documentNo: "",
        expireDate: forMat(form.failureDate), // 药品有效期,
        licenseNo: form.drugCar ? form.drugCar.join() : "", // 车牌号
        method: this.state.method,
        productCode: form.drugFeedName ? form.drugFeedName.join() : "", // 产品代码
        productCul: drugSpecifications.calculate, // 产品计算方式代码
        productPackingSize: drugSpecifications.pagesize, // 产品单位规格
        productUnitCode:
          drugSpecifications.calculate == "Q"
            ? drugSpecifications.numunitcode
            : drugSpecifications.unitweightcode, // 产品单位代码
        stockType: 20, // // 10-饲料 20-药品疫苗 33-鸡苗
        totalAmount: form.drugTotalAmount, // 总金额
        totalQty: drugSpecifications.calculate == "Q" ? form.drugNumber : 0, // 总数量
        unitPrice: form.drugUnit, // 单价
        vendorCode: form.drugSupplier ? form.drugSupplier.join() : "", // 供应商代码
        wareHouse: form.drugCar ? form.drugCar.join() : "", // 仓库代码，同orgCode
        details: [
          {
            farmOrg: form.drugFormOrg ? form.drugFormOrg.join() : "",
            qty: drugSpecifications.calculate == "Q" ? form.drugNumber : 0, // 数量
            wgh: drugSpecifications.calculate == "W" ? form.drugNumber : 0, // 重量
            amount: form.drugTotalAmount,
          },
        ],
      },
    }).then((res) => {
      if (res.data.code === 200) {
        Toast.success("保存成功", 1, () => {
          this.setState({ saveAble: true });
        });
      } else {
        Toast.info(res.data.msg, 2);
      }
    });
  };
  render() {
    let { saveAble, drugSpecifications } = this.state;
    return (
      <React.Fragment>
        <CpForm>
          <CpSection>
            <CpDateItem name={"drugDate"}>日期</CpDateItem>
            <CpPickerItem
              name={"drugFormOrg"}
              data={this.props.buildingGroupList}
            >
              栋批
            </CpPickerItem>
            <CpPickerItem
              name={"drugFeedName"}
              data={this.props.feedProductList}
              onChange={this.changeDrugFeed}
            >
              饲料名称
            </CpPickerItem>
          </CpSection>
          <CpSection value="">
            <CpInputItem
              name={"drugProductsPecifications"}
              value={
                drugSpecifications
                  ? drugSpecifications.pagesize + drugSpecifications.unitname
                  : ""
              }
              disable
            >
              产品规格
            </CpInputItem>
            <CpInputItem name={"drugNumber"} onChange={this.getDrugTotal}>
              {drugSpecifications.calculate == "W" ? "重量" : "数量"}
            </CpInputItem>
            <CpDateItem name={"failureDate"}>失效日期</CpDateItem>
            <CpPickerItem name={"drugSupplier"} data={this.props.supplierList}>
              供应商
            </CpPickerItem>
            <CpPickerItem name={"drugCar"} data={this.props.carList} disable>
              车牌号
            </CpPickerItem>
            <CpInputItem name={"drugUnit"} onChange={this.getDrugTotal}>
              单价(元/瓶)
            </CpInputItem>
            <CpInputItem name={"drugTotalAmount"} disable>
              总金额(元)
            </CpInputItem>
          </CpSection>
          <CpButton
            disable={saveAble}
            onClick={this.onSave}
            text="保存"
            type="primary"
          ></CpButton>
        </CpForm>
      </React.Fragment>
    );
  }
}
export default CpForm.withForm(Drug);
