import React, { Component } from 'react';
import PropTypes from "prop-types";

export class FormItem extends Component{
  render(){
    const { label } = this.props;
    return (
      <div>
        <label>{label}</label>
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
}
FormItem.propTypes = {
  label: PropTypes.string,
}

export default class CustomForm extends React.Component{
  render(){
     return (
       <div>
         {this.props.children}
       </div>
     )
  }
}

CustomForm.Item = FormItem;
CustomForm.create = function(option) {
  return function(Component) {
    class Form extends React.Component {
      fieldsValue = {};
      originFieldsValue = {};
      getFieldDecorator = (dataIndex,option) => {
        if(this.fieldsValue[dataIndex] === undefined) {
          this.fieldsValue[dataIndex] = option.initialValue;
          this.originFieldsValue[dataIndex] = option.initialValue;
        }
        const props = {
          valuePropsName: option.valuePropsName || 'value',
          triggerName: option.trigger || 'onChange',
        }
        return (JSXInputComponent) => {
          const filedProps = {
            [props.valuePropsName]: this.fieldsValue[dataIndex],
            [props.triggerName]: (e) => {this.onChange(dataIndex,e,JSXInputComponent)}
          }
          return React.cloneElement(JSXInputComponent,{...filedProps})
        }
      }
      onChange = (dataIndex,e,JSXInputComponent) => {
        if(JSXInputComponent.props.onChange) {
          JSXInputComponent.props.onChange(e);
        }
        if(e.target) {
          this.setFieldValue(dataIndex,e.target.value)
        } else {
          this.setFieldValue(dataIndex,e)
        }
      }
      setFieldValue = (dataIndex,value) => {
        this.fieldsValue[dataIndex] = value;
        this.forceUpdate();
      }
      getFieldsValue = () => {
        return this.fieldsValue;
      }
      resetFields = () => {
        this.fieldsValue = JSON.parse(JSON.stringify(this.originFieldsValue));
        this.forceUpdate();
      }
      render() {
        const form = {
          getFieldDecorator: this.getFieldDecorator,
          setFieldValue: this.setFieldValue,
          getFieldsValue: this.getFieldsValue,
          resetFields: this.resetFields
        }
        return <Component {...this.props} form={form}/>
      }
    }
    return Form;
  }
}
