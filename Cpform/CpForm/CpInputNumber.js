import React, { Component } from 'react';
import FormContext from './FormContext';
import { InputItem } from 'antd-mobile';
import classnames from 'classnames';
const defaultItemProps = {
  extraSize: 'large',
};
class CpInputNumber extends Component {
  componentDidMount() {
    const { registerField } = this.context;
    const { initialValue, name, rules } = this.props;
    registerField({
      name,
      value: initialValue || '',
      rules,
    });
  }
  onChange = (value) => {
    const { changeFieldValue, formData } = this.context;
    const { name, onChange } = this.props;
    value = this.format(value);
    if (!this.numValidate(value)) {
      return;
    }
    let prevValue = formData[name].value;
    if (value !== prevValue) {
      changeFieldValue({
        name: name,
        value: value,
      });
      onChange && onChange(value);
    }
  };
  numValidate = (val) => {
    val = val + '';
    const { precision = 0, sign = false } = this.props;
    let reg = /^(([1-9]\d*)|0)$/;
    if (precision && sign) {
      reg = /^-?((([1-9]\d*)|0)\.\d*)?$/;
    } else if (precision) {
      reg = /^(([1-9]\d*)|0)(\.\d*)?$/;
    } else if (sign) {
      reg = /^-?(([1-9]\d*)|0)$/;
    }
    if (val === '') {
      return true;
    }
    if (!reg.test(val)) {
      return false;
    }
    return true;
  };
  rangeFormat = (val) => {
    const { min, max } = this.props;
    let numVal = parseFloat(val);
    if (typeof min === 'number' && numVal < min) {
      return min + '';
    }
    if (typeof max === 'number' && numVal > max) {
      return max + '';
    }
    return val + '';
  };
  precisionFormat = (val) => {
    const precision = this.props.precision;
    val = val + '';
    if (precision && val.indexOf('.') !== -1) {
      let vals = val.split('.');
      let head = vals[0];
      let tail = vals[1];
      if (tail.length > precision) {
        tail = tail.substring(0, precision);
      }
      return head + '.' + tail;
    } else {
      return val;
    }
  };
  format = (val) => {
    if (typeof val === 'undefined' || val === '') {
      return '';
    }
    if (/^0[0-9]$/.test(val)) {
      return val.substring(1, val.length);
    }
    val = this.rangeFormat(val);
    val = this.precisionFormat(val);
    return val;
  };
  render() {
    const ItemProps = Object.assign(
      {},
      { ...defaultItemProps },
      { ...this.props }
    );
    const { name, suffix } = this.props;
    const { formData } = this.context;
    delete ItemProps['extra'];
    delete ItemProps['onChange'];
    const { extraSize } = ItemProps;
    delete ItemProps['extraSize'];
    const error = formData[name] && !!formData[name].error;
    const value = formData[name] && (formData[name].value || '');

    const rules = formData[name] ? formData[name].rules : null;
    let required = false;
    Array.isArray(rules) &&
      rules.forEach((rule) => {
        rule.required && (required = true);
      });
    return (
      <div
        className={classnames({
          'cp-input-item': true,
          'extra-xsmall': extraSize === 'xsmall',
          'extra-small': extraSize === 'small',
          'extra-normal': extraSize === 'normal',
          'extra-large': extraSize === 'large',
          'extra-xlarge': extraSize === 'xlarge',
        })}
      >
        <InputItem
          onChange={this.onChange}
          align="right"
          placeholder="请输入"
          error={error}
          {...ItemProps}
          value={value}
          extra={suffix}
        >
          {this.props.children}
          {required ? <span className="cp-require-sign">*</span> : null}
        </InputItem>
      </div>
    );
  }
}
CpInputNumber.contextType = FormContext;
export default CpInputNumber;
