# 前端代码规范

## React 项目

### 基础规则

* 一个文件声明一个组件： 尽管可以在一个文件中声明多个 React 组件，但是最好不要这样做；推荐一个文件声明一个 React 组件，并只导出一个组件；
* 使用 JSX 表达式： 不要使用 React.createElement 的写法；
* 函数组件和 class 类组件的使用场景： 如果定义的组件不需要 props 和 state ，建议将组件定义成函数组件，否则定义成 class 类组件。

### 命名规则

* 文件夹：使用首字母小写的驼峰命名法，比如 `activityList`
* 组件名称： 使用首字母的驼峰命名法，比如 `ActivityList`
* 样式文件：使用首字母小写的驼峰命名法，比如 `index.less`
* 图片资源：首字母小写，多个单词使用 `-` 或 `_` 进行连接，比如 `icon_arrow.png`
* 属性名称： 使用首字母小写的驼峰命名法来定义属性的名称，比如 `userName`
* 函数名：使用首字母小写的驼峰命名法，比如 `attributedUpdated()`

### JSX 写法

* 当标签没有子元素的时候，始终使用自闭合的标签，并且在自闭标签之前留一个空格。比如 `<Component />`
* 如果标签有多行属性，关闭标签要另起一行。如下:
* 当组件跨行时，要用括号包裹 JSX 标签。如下:
* 多行属性要进行缩进，且属性左对齐。如下:
* JSX的属性都采用双引号，其他的JS属性，比如样式属性使用单引号，如下:
* 如果属性值为true，可直接忽略。如下:
```html
render() {
  return (
    <MyComponent className="long" foo="bar">
      <MyChild />
      <OtherChild
        hidden
        bar="bar"
        baz="baz"
        style={{ left: '20px' }}
      />
    </MyComponent>
  );
}
```

### 文件位置

* 组件类文件 放在 `components` 文件夹下
* 布局类文件 放在 `layout` 文件夹下
* 路由类文件 放在 `pages` 文件夹下
* 工具类或公共文件 放在 `util` 或 `common` 文件夹下
* 图片资源文件 放在 `assets` 文件夹下
* mock类文件，放在 `mock` 文件夹下
* 其他类型的文件，视情况而定，放在相应的位置上

### 代码顺序

组件应该有严格的代码顺序，这样有利于代码维护，我们推荐每个组件中的代码顺序一致性

```js
// 引入外部文件
import send from '../../util/send';
import { ROOTPATH } from '../../config';
import './index.css';

// 定义全局变量
const limitSize = 5 * 1024 * 1024;

class Example extends Component {
  // 静态属性
  static defaultProps = {}

  // 构造函数
  constructor(props) {
    super(props);
    this.state = {}
  }

  // 声明周期钩子函数
  // 按照它们执行的顺序
  // 1. componentWillMount
  // 2. componentWillReceiveProps
  // 3. shouldComponentUpdate
  // 4. componentDidMount
  // 5. componentDidUpdate
  // 6. componentWillUnmount
  componentDidMount() { ... }

  // 事件函数/普通函数
  handleClick = (e) => { ... }

  // 最后，render 方法
  render() { ... }
}
```

### 其他

* 使用 2 空格缩进
* 避免出现连续的空行
* 临时方案或待实现的地方可以使用 `// TODO:` 进行标注
* 文件内尽量不要有大量且无用的变量和代码片段
* 文件内各个函数之间空一行
* 每个函数代码不要过长，如果有可能，可以拆分成其他小的函数

## 小程序

### 基础规则

* 页面路径需要在 `app.json` 中进行配置，否则报错
* 页面中引入组件，需要在对应页面的json文件中，进行配置
* 一个页面或组件由4个文件组成，分别是 页面逻辑文件 xxx.js、页面配置文件 xxx.json、页面布局文件 xxx.wxml、页面样式文件 xxx.wxss

### 命名规则

* 文件夹：使用首字母小写的驼峰命名法或使用 `_` 、`-` 进行连接，比如 `activityList`、`activity_list`
* 文件名： 使用首字母小写的驼峰命名法或使用 `_` 、`-` 进行连接，比如 `activityList`、`activity_list`
* 图片资源：首字母小写，多个单词使用 `_` 或 `-` 进行连接，比如 `icon_arrow.png`
* 属性名称：使用首字母小写的驼峰命名法来定义属性的名称，比如 `userName`
* 函数名：使用首字母小写的驼峰命名法，比如 `attributedUpdated()`

### WXML规范

* 标签和属性命名均使用小写字母，多单词可使用 `-` 连接
* 标签必须闭合，可使用自闭合标签
* 属性值必须用双引号 `" "` 包裹
```html
<view class="btnview" bindtap="btnChecked" data-item="{{item}}">
  <!-- 其他嵌套内容 -->
</view>
<view class="content" />
```

### 文件位置

* 组件类文件 放在 `components` 文件夹下
* 页面类文件 放在 `pages` 文件夹下
* 工具类或公共文件 放在 `util` 或 `common` 文件夹下
* 图片资源文件 放在 `images` 文件夹下

### js代码顺序

```js
// 引入外部文件
const { amountToString } = require('../../util/amountFormat');

// 定义全局变量
const limitSize = 5 * 1024 * 1024;

Page({
  // 数据
  data: { ... }

  // 生命周期函数 按照它们的执行顺序
  // onLoad
  // onShow 
  // onReady
  // onHide
  // onUnload
  onLoad() { ... },
  
  // 事件处理函数或普通函数
  btnClicked() { ... },
  
})
```

### 其他

* 使用 2 空格缩进
* 避免出现连续的空行
* 临时方案或待实现的地方可以使用 `// TODO:` 进行标注
* 文件内尽量不要有大量且无用的变量和代码片段
* 文件内各个函数之间空一行
* 每个函数代码不要过长，如果有可能，可以拆分成其他小的函数