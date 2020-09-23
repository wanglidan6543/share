redux

JavaScript 需要管理比任何时候都要多的 state （状态）。 这些 state 可能包括服务器响应、缓存数据、本地生成尚未持久化到服务器的数据，也包括 UI 状态，如激活的路由，被选中的标签，是否显示加载动效或者分页器等等

一组 state 数据
一组 action 动作，可以触发修改state
reducer函数将 state和action关联起来，并返回最新 state

三大原则：
1. 单一数据源
整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中

2. state是只读的
唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。

3. 使用纯函数来执行修改
为了描述 action 如何改变 state tree ，你需要编写 reducers。


Action: {
    type: 字符串常量,
    text: 'data'
}

我们应该尽量减少在 action 中传递的数据

Action 创建函数 就是生成 action 的方法

function AddAction(text) {
    return {
        type: ADD,
        text
    }
}

Reducer指定了应用状态的变化如何响应actions并发送到store

reducer 就是一个纯函数，接收旧的 state 和 action，返回新的 state。

永远不要在 reducer 里做这些操作：
修改传入参数；
执行有副作用的操作，如 API 请求和路由跳转；
调用非纯函数，如 Date.now() 或 Math.random()。

注意每个 reducer 只负责管理全局 state 中它负责的一部分。每个 reducer 的 state 参数都不同，分别对应它管理的那部分 state 数据。



使用 action 来描述“发生了什么”，和使用 reducers 来根据 action 更新 state


Store 就是把它们联系到一起的对象。Store 有以下职责：

维持应用的 state；
提供 getState() 方法获取 state；
提供 dispatch(action) 方法更新 state；
通过 subscribe(listener) 注册监听器;
通过 subscribe(listener) 返回的函数注销监听器。


https://www.jianshu.com/p/c7e06cee4ea6 react 和 mobx 的区别
https://blog.csdn.net/weixin_44369568/article/details/90713881


react react-redux 解析
https://www.cnblogs.com/pluslius/p/10580727.html

https://www.cnblogs.com/pluslius/p/10580727.html
https://segmentfault.com/a/1190000012142449

rc-form 源码解读
https://blog.csdn.net/chencl1986/article/details/102326854

mobx
https://segmentfault.com/a/1190000013810512
