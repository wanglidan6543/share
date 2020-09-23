import React from 'react';
import FormContext from './FormContext';

export default function widthFormDecorator(Component) {
  Component.contextType = FormContext
  return class FormDecorator extends React.Component {
    state = {
      form: {},
    };
    bindForm = (form) => {
      this.setState({
        form
      })
    };
    render() {
      return (
        <FormContext.Provider
          value={{
            bindForm: this.bindForm,
          }}
        >
          <Component form={this.state.form} {...this.props}></Component>
        </FormContext.Provider>
      );
    }
  };
}
