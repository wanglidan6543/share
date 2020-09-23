import React, { Component } from 'react';
import { InputItem } from 'antd-mobile';
import FormContext from './FormContext';
import classnames from 'classnames';

const defaultItemProps = {
  extraSize: 'large',
};

export default class CpInputItem extends Component {
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
    const { changeFieldValue } = this.context;
    const { name, onChange } = this.props;
    changeFieldValue({
      name: name,
      value: value,
    });
    onChange && onChange(value);
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
CpInputItem.contextType = FormContext;
