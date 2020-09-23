import React, { Component } from 'react';
import CpInputItem from './CpInputItem';

export default function (props) {
  return (
    <div className="cp-label">
      <CpInputItem {...props} editable={false} placeholder="" />
    </div>
  );
}
