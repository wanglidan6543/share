import React, { Component } from "react";
import FormContext from "./FormContext";
import "./cpbutton.less";

export default class CpDateItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        className={this.props.dele ? "dele" : "ceratAdd"}
        onClick={this.props.onClick}
      >
        {this.props.text}
      </div>
    );
  }
}
CpDateItem.contextType = FormContext;
