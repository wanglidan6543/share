import React, {Component} from 'react';
import {Table} from 'antd';
import CustomerBreadcrumb from '../../components/CustomerBreadcrumb';
import PropTypes from 'prop-types';
import {SearchForm} from './SearchForm';
import {getDataType} from '../../util/customTools';
import {listPageParams} from "../../util/listPageParams";
import { FormItemTypes } from './FormItemTypes';

export class ListPageContainer extends Component {
  state = {
    pageSize: 10,
    currentPage: 0,
    tableLoading: false,
  };
  tableStyle = {
    minHeight: '600px',
    backgroundColor: '#fff',
    padding: 20
  };
  constructor(props) {
    super(props);
    this.state.pageSize = props.defaultPageSize || 10;
    this.state.currentPage = props.defaultCurrentPage || 0;
  }
  componentDidMount() {
    if (this.props.autoQuery === true) {
      let pagination = listPageParams.getParams(this.props);
      if (pagination) {
        let {currentPage, pageSize} = pagination;
        this.setState({
          currentPage, pageSize
        }, this.queryTableData)
      } else {
        this.queryTableData();
      }
    }
  }

  queryTableData = () => {
    const {pageSize, currentPage} = this.state;
    const { query } = this.props;
    let resData = query(currentPage, pageSize);
    let type = getDataType(resData);
    // 如果queryList的返回值是个promise 则给table做loading效果
    if (type === 'Promise') {
      this.setState({
        tableLoading: true
      })
      resData.then(res => {
        this.setState({tableLoading: false})
      })
    }
  }

  submit = () => {
    this.setState({
      currentPage: 0
    }, () => {
      this.queryTableData();
    })
  }
  reset = () => {
    this.props.form.resetFields();
    this.submit();
  }
  changePage = (currentPage, pageSize) => {
    this.setState({
      currentPage: currentPage - 1,
      pageSize
    }, () => {
      this.queryTableData();
    })
  }
  changePageSize = (currentPage, pageSize) => {
    this.setState({
      pageSize,
      currentPage: 0,
    }, () => {
      this.queryTableData();
    })
  }

  render() {
    const {form, formRows = [], hideBreadcrumb = false, tableProps = {},
      formTop,formBottom,
      total = 0, showSizeChanger = false} = this.props;
    const {pageSize, currentPage, tableLoading,renderTable} = this.state;
    const pagination = {
      pageSize,
      total,
      current: currentPage + 1,
      onChange: this.changePage,
      showSizeChanger,
      onShowSizeChange: this.changePageSize
    };
    let isShowFormArea = !!(formRows.length || formTop || formBottom);
    return (
      <div>
        {hideBreadcrumb ? null : <CustomerBreadcrumb className="breadcrumb"></CustomerBreadcrumb>}
        { isShowFormArea ?
          <div style={{background: "#fff", padding: "20px", marginBottom: 20, paddingBottom: 0}}>
            {formTop}
            <SearchForm formRows={formRows} form={form} reset={this.reset} submit={this.submit}/>
            {formBottom}
          </div> : null}
        <div style={{background: "#fff", paddingTop: 10, paddingLeft: 20}}>
          {this.props.children}
        </div>
        {tableProps ? <Table style={this.tableStyle} loading={tableLoading} {...tableProps} pagination={pagination} />: null}
        {renderTable ? renderTable({style: this.tableStyle,loading: tableLoading,pagination:pagination}): null}
      </div>
    )
  }
}
ListPageContainer.FormItemTypes = FormItemTypes;

ListPageContainer.propTypes = {
  hideBreadcrumb: PropTypes.bool,// 是否隐藏Breadcrumb 默认 false
  formTop: PropTypes.node,//form上方的元素 默认 undefined
  form: PropTypes.object.isRequired,// antd的form对象
  formBottom: PropTypes.node,// form下方的元素 默认 undefined
  location: PropTypes.object.isRequired,// 路由的location 用于获取列表页面存储的查询参数
  formRows: PropTypes.array.isRequired,// 列表上方的表单 具体配置见demo
  query: PropTypes.func.isRequired,//请求列表数据的方法 如果返回值是个promise 则会自动做loading效果
  autoQuery: PropTypes.bool,// 是否自动查询列表数据,默认false 不自动请求列表数据
  tableProps: PropTypes.object.isRequired,// Table的属性 具体见antd Table
  total: PropTypes.number.isRequired,// 页码总数 默认 0
  defaultPageSize: PropTypes.number,//默认每页数量 默认 10
  defaultCurrentPage: PropTypes.number,//默认当前第几页 默认 0
  showSizeChanger: PropTypes.bool,//是否展示 修改每页数量的选项 默认false
  renderTable: PropTypes.func,// 参数是table的一些属性配置 返回一个Table
}
