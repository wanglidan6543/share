import React from 'react';
export default React.createContext({
  registerField() {}, //表单绑定初始值
  changeFieldValue() {}, //更新表单值
  bindForm() {}, //获取form事例
  formData: {},
});
