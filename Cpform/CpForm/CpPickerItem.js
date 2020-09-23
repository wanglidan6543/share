import React, { Component } from 'react';
import { Picker, List } from 'antd-mobile';
import withValidateListItem from './withValidateListItem';
import FormContext from './FormContext';
import classnames from 'classnames';

const defaultPickerProps = {};
const defaultItemProps = {
  arrow: 'horizontal',
  extraSize: 'large',
};
const CpListItem = withValidateListItem(List.Item);
export default class CpPickerItem extends Component {
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
  onOk = (value) => {
    const { changeFieldValue } = this.context;
    const { name, onChange } = this.props;
    changeFieldValue({
      name,
      value: value.length > 1 ? value[0] : value,
    });
    onChange && onChange(value.length > 1 ? value[0] : value);
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
    delete pickerProps['extraSize'];
    delete ItemProps['extraSize'];
    delete ItemProps['extra'];
    // delete ItemProps['onClick'];

    let required = false;
    Array.isArray(rules) &&
      rules.forEach((rule) => {
        rule.required && (required = true);
      });
    let value = '';
    let error = false;
    if (formData[name]) {
      value = formData[name].value;
      error = formData[name].error;
    }
    if (!Array.isArray(value)) {
      value = [value];
    }
    return (
      <React.Fragment>
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
          <Picker cols={1} {...pickerProps} value={value} onOk={this.onOk}>
            <CpListItem error={error} {...ItemProps}>
              {this.props.children}
              {required ? <span className="cp-require-sign">*</span> : null}
            </CpListItem>
          </Picker>
        </div>
      </React.Fragment>
    );
  }
}
CpPickerItem.contextType = FormContext;
