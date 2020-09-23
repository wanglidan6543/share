import React from 'react';

export default function (Component) {
  return function ValidateListItem(props) {
    const { error, extra } = props;
    let currentExtra = extra;
    if (error) {
      currentExtra = (
        <div className="cp-list-item-extra">
          {extra}
          {error ? <div className="cp-warnning-icon"></div> : null}
        </div>
      );
    }
    
    return (
      <Component {...props} error={false} extra={currentExtra}>
        {props.children}
      </Component>
    );
  };
}
