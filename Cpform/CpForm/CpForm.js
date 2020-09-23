import React, { Component } from 'react';
import FormContext from './FormContext';
import CpDateItem from './CpDateItem';
import CpPickerItem from './CpPickerItem';
import CpInputItem from './CpInputItem';
import CpInputNumber from './CpInputNumber'
import CpLabel from './CpLabel';
import CpSection from './CpSection';
import widthFormDecorator from './widthFormDecorator';
import './cpform.less';

const validateType = {
  required: function (value) {
    if (
      typeof value === 'undefined' ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      return false;
    }
    return true;
  },
};
/**
 * CpForm：获取所有cell当前值，校验cell
 * CpList: 输入或选择值，弹出列表，显示error状态
 */
export default class CpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
    };
  }
  componentDidMount() {
    const { bindForm } = this.context;
    const { initialValues = {} } = this.props;
    const { formData } = this.state;
    Object.keys(initialValues).forEach((name) => {
      formData[name] = formData[name] || {};
      formData[name]['value'] = initialValues[name];
    });
    this.setState({
      formData,
    });
    bindForm(this);
  }
  _registerField = (args) => {
    const name = args.name;
    const value = args.initialValue || '';
    const { formData } = this.state;
    formData[name] = {
      value,
      rules: args.rules,
    };
    this.setState({
      formData,
    });
  };
  _changeFieldValue = (args) => {
    const name = args.name;
    const value = args.value;
    const { formData } = this.state;
    formData[name] = formData[name] || {};
    formData[name].value = value;
    formData[name].error = false;
    this.setState({
      formData,
    });
  };

  getFieldValues = (args) => {
    const { formData } = this.state;
    const data = {};
    Object.keys(formData).forEach((name) => {
      data[name] = formData[name].value;
    });

    if (typeof args === 'undefined') {
      return data;
    }
    if (typeof args === 'string') {
      return data[args];
    }
    if (Array.isArray(args)) {
      let result = {};
      args.forEach((name) => {
        result[name] = data[name];
      });
      return result;
    }
  };
  setFieldValues = (args) => {
    const { formData } = this.state;
    Object.keys(args).forEach((name) => {
      formData[name] = formData[name] || {};
      formData[name].value = args[name];
      formData[name].error = false;
    });
    this.setState({
      formData,
    });
  };
  validateFieldValues = () => {
    const { formData } = this.state;
    let result = [];
    const fields = Object.keys(formData);
    outer: for (let i = 0, len = fields.length; i < len; i++) {
      const field = fields[i];
      formData[field].error = false;
      const rules = formData[field].rules;
      if (!Array.isArray(rules)) {
        break;
      }
      for (let j = 0, len2 = rules.length; j < len2; j++) {
        const rule = rules[j];
        if (rule.required && !validateType['required'](formData[field].value)) {
          formData[field].error = true;
          result.push({
            message: rule.message || '',
          });
          break outer;
        }
      }
    }
    this.setState({ formData });
    return result;
  };

  render() {
    return (
      <FormContext.Provider
        value={{
          registerField: this._registerField,
          changeFieldValue: this._changeFieldValue,
          formData: this.state.formData,
        }}
      >
        {this.props.children}
      </FormContext.Provider>
    );
  }
}
CpForm.contextType = FormContext;

CpForm.CpDateItem = CpDateItem;

CpForm.CpPickerItem = CpPickerItem;

CpForm.CpInputItem = CpInputItem;

CpForm.CpInputNumber = CpInputNumber;


CpForm.CpLabel = CpLabel;

CpForm.CpSection = CpSection;

CpForm.withForm = widthFormDecorator;
