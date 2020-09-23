import React, {Component,Fragment} from 'react';
import {Input, InputNumber, Select, Form, Row, Col, DatePicker, Button, Cascader, Radio} from 'antd';
import PropTypes from 'prop-types';
import { FormItemTypes } from './FormItemTypes';
const Option = Select.Option;
const {RangePicker} = DatePicker;

export class SearchForm extends Component {
  formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  }
  style = {
    marginBottom: 10,
  }
  getFormItemComponent = (record) => {
    let InputCom = null;
    let otherOption = record.otherOption || {};
    let commonProps = {
      ...otherOption
    }
    let propsData = null;
    switch (record.type) {
      // 数字类型
      case FormItemTypes.type_number:
        let inputNumberStyle = {width: '100%'};
        propsData = {
          ...commonProps,
          style: otherOption.style || inputNumberStyle,
          placeholder: "请输入",
        };
        InputCom = <InputNumber {...propsData}/>;
        break;
        // 普通下拉框
      case FormItemTypes.type_select:
        propsData = {
          ...commonProps,
          placeholder: '请选择',
        };
        InputCom = <Select {...propsData}>
          {record.options.map(item => {
            return <Option value={item[record.valueKey]} key={item[record.valueKey]}>{item[record.nameKey]}</Option>
          })}
        </Select>;
        break;
        // 带有前端搜索的下拉框
      case FormItemTypes.type_searchSelect:
        propsData = {
          ...commonProps,
          placeholder: '请选择',
          showSearch: true,
          filterOption: (input, option) => option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
        };
        InputCom = <Select {...propsData}>
          {record.options.map(item => {
            return <Option value={item[record.valueKey]} key={item[record.valueKey]}>{item[record.nameKey]}</Option>
          })}
        </Select>;
        break;
        //时间范围选择器
      case FormItemTypes.type_rangePicker:
        propsData = {
          ...commonProps,
          allowClear: otherOption.allowClear || false,
          placeholder: '请选择',
        };
        InputCom = <RangePicker {...propsData}/>;
        break;
        //级联选择
      case FormItemTypes.type_cascader:
        propsData = {
          ...commonProps,
          placeholder: '请选择',
        };
        InputCom = <Cascader {...propsData}/>;
        break;
        // 单选框
      case FormItemTypes.type_radio:
        propsData = {
          ...commonProps,
        };
        InputCom = <Radio.Group {...propsData}>
          {record.options.map(item => {
            return <Radio value={item[record.valueKey]} key={item[record.valueKey]}>{item[record.nameKey]}</Radio>
          })}
        </Radio.Group>
        break;
        // 搜索和重置按钮
      case FormItemTypes.type_submit:
        InputCom = <Fragment>
          <Button type="primary" onClick={this.props.submit} style={{marginRight: 20}}>查询</Button>
          <Button type="primary" onClick={this.props.reset}>重置</Button>
        </Fragment>
        break;
        // 默认普通输入框
      default:
        propsData = {
          ...commonProps,
          placeholder: '请输入',
        }
        InputCom = <Input {...propsData}/>
        break;
    }
    return InputCom;
  }
  renderCol = (col) => {
    // 如果该列有render方法
    if (col.render) {
      return col.render();
    }
    let colLayOut = col.formItemLayout || {};
    const { getFieldDecorator } = this.props.form;
    if (col.label) {
      return <Form.Item label={col.label} {...colLayOut}>
        {getFieldDecorator(col.dataIndex,{
          initialValue: col.initialValue
        })(this.getFormItemComponent(col))}
      </Form.Item>
    } else {
      return <Form.Item {...colLayOut}>
        {this.getFormItemComponent(col)}
      </Form.Item>
    }
  }

  render() {
    const {formRows = [], formItemLayout = this.formItemLayout, style = this.style} = this.props;
    return (
      <Form {...formItemLayout} style={style}>
        {formRows.map((formRow, index) => {
          // 如果该行有render方法
          if (formRow.render) {
            return <Fragment key={index}>
              {formRow.render()}
            </Fragment>
          } else {
            return <Fragment key={index}>
              <Row style={formRow.style}>
                {formRow.cols.map((col, colIndex) => {
                  return <Col span={col.span || 8} offset={col.offset || 0} key={colIndex}>
                    {this.renderCol(col)}
                  </Col>
                })}
              </Row>
            </Fragment>
          }
        })}
      </Form>
    )
  }
}

SearchForm.FormItemTypes = FormItemTypes;
SearchForm.propTypes = {
  formRows: PropTypes.array.isRequired,// 表单数据 具体格式见demo
  form: PropTypes.object.isRequired,// antd 的form对象
  submit: PropTypes.func.isRequired,// 查询的方法
  reset: PropTypes.func.isRequired,//  重置的方法
  style: PropTypes.object,// form的样式
  formItemLayout: PropTypes.object,//form的布局
}
