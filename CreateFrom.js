import React, { Component, Children } from 'react';

function createFrom() {
  return function decorate(WrapComponent) {
    class Form extends Component {
      getForm() {
        return {
          getFieldDecorator: this.getFieldDecorator,
          getFieldsValue: this.getFieldsValue,
          validateFields: this.validateFields,
          resetFields: this.resetFields,
        }
      }
      getFieldDecorator(name, fieldOption) {
        const props = this.getFieldProps(name, fieldOption);
        return element => {
          return React.cloneElement(element, {
            ...props
          })
        }
      }
      getFieldProps() {}
      submit() {}
      validateFields() {}
      resetFields() {}
      render() {
        const { wrappedComponentRef, ...restProps } = this.props;

        const props = {
          ref: wrappedComponentRef,
          form: this.getForm(),
          ...restProps,
        }
        return <WrapComponent {...props} />
      }
    }
  }
}