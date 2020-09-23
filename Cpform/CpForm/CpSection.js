import React from 'react';
import { List } from 'antd-mobile';

export default function (props) {
  return (
    <div style={{ marginTop: '8px', marginBottom: '8px' }}>
      <List>{props.children}</List>
    </div>
  );
}
