import React, { Component } from "react";
import { Button } from "antd-mobile";
import FormContext from "./FormContext";
import "./cpbutton.less";

export default class CpDateItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Button
        className="cpbtn"
        type={this.props.type}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
      >
        {this.props.text}
      </Button>
    );
  }
}
CpDateItem.contextType = FormContext;
