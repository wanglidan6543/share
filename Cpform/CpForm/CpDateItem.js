import React, { Component } from 'react';
import { DatePicker, List } from 'antd-mobile';
import withValidateListItem from './withValidateListItem';
import dateFormat from 'dateformat';
import FormContext from './FormContext';
import classnames from 'classnames';

const defaultPickerProps = {
  mode: 'date',
};
const defaultItemProps = {
  arrow: 'horizontal',
};
const CpListItem = withValidateListItem(List.Item);
export default class CpDateItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }
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
      name,
      value: dateFormat(value, 'yyyy-mm-dd'),
    });
    onChange && onChange(dateFormat(value, 'yyyy-mm-dd'));
  };
  render() {
    const pickerProps = Object.assign(
      {},
      { ...defaultPickerProps },
      { ...this.props }
    );
    const ItemProps = Object.assign(
      {},
      { ...defaultItemProps },
      { ...this.props }
    );
    const { name, extraSize, rules } = this.props;
    const { formData } = this.context;
    delete ItemProps['extra'];
    delete ItemProps['onClick'];

    let required = false;
    Array.isArray(rules) &&
      rules.forEach((rule) => {
        rule.required && (required = true);
      });
    let error = false;
    if (formData[name]) {
      error = formData[name].error;
    }
    let value = formData[name] && formData[name].value;
    if (!!value) {
      value = new Date(value);
    } else {
      value = null;
    }

    return (
      <div
        className={classnames({
          'cp-picker': true,
          'cp-error': error,
          'extra-xsmall': extraSize === 'xsmall',
          'extra-small': extraSize === 'small',
          'extra-normal': extraSize === 'normal',
          'extra-large': extraSize === 'large',
          'extra-xlarge': extraSize === 'xlarge',
        })}
      >
        <DatePicker
          cols={1}
          {...pickerProps}
          value={value}
          onChange={this.onChange}
        >
          <CpListItem error={error} {...ItemProps}>
            {this.props.children}
            {required ? <span className="cp-require-sign">*</span> : null}
          </CpListItem>
        </DatePicker>
      </div>
    );
  }
}
CpDateItem.contextType = FormContext;
