

dispatch(createAction('TODO'));

createAction(type) {
    return {
        type: type,
        payload: 'text'
    }
}

createAction(type) {
    return function() {
        dispatch(action)
        return ajax('').then(res => {
            dispatch(action2)
        })
    }
}



mobx 

1. 定义状态 并可观察

const appState = observable({
    timer: 0
})

2. 创建视图来响应状态的变化

@observer
class View {
    render() {
        return <div>{{this.props.appState.userId}}</div>
    }
}

3. 更新状态

setInteral(action(function tick() {
    appState.timer += 1;
}), 1000)


mobx 单向数据流

action  -> state -> view

