// 三种状态 
const STATUS = {
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
}
class MyPromise {
  constructor(fn) {
    // 初始化状态
    this.status = STATUS.PENDING
    // resolve事件队列
    this.resolves = []
    // reject事件队列
    this.rejects = []
    // resolve和reject是内部提供的，用以改变状态。
    const resovle = (val) => {
      // 显然这里应该是改变状态触发回调
      this.triggerResolve(val)
    }
    const reject = (val) => {
      // 显然这里应该是改变状态触发回调
      this.triggerReject(val)
    }
    // 执行fn
    try {
      fn(resolve, reject)
    } catch (err) {
      // 运行异常要触发reject，就需要在这里catch了
      this.triggerReject(err)
    }
  }

  // 触发 reject回调  
  triggerReject(val) {
    // 保存当前值，以供后面调用
    this.value = val
    // promise状态一经变化就不再更新，所以对于非pending状态，不再操作
    if (this.status === STATUS.PENDING) {
      // 更新状态
      this.status = STATUS.REJECTED
      // 循环执行回调队列中事件
      this.rejects.forEach((it) => {
        it(val)
      })
    }
  }
  // resolve 功能类似
  // 触发 resolve回调
  triggerResolve(val) {
    this.value = val
    if (this.status === STATUS.PENDING) {
      this.status = STATUS.RESOLVED
      this.resolves.forEach((it, i) => {
        it(val)
      })
    }
  }

  then(onResolved, onRejected) {
    // 返回promise 保证链式调用，注意这里每次then都新建了promise
    return new MyPromise((resolve, reject) => {
      const resolvehandle = (val) => {
        // 对于值，回调方法存在就直接执行，否则不变传递下去。
        let res = onResolved ? onResolved(val) : val
        if (res instanceof MyPromise) {
          // 如果onResolved 是promise，那么就增加then
          return res.then((val) => {
            resolve(val)
          })
        } else {
          // 更新状态，执行完了，后面的随便
          return resolve(val)
        }
      },
        rejecthandle = (val) => {
          var res = onRejected ? onRejected(val) : val;
          if (res instanceof MyPromise) {
            res.then(function (val) {
              reject(val);
            })
          } else {
            reject(val);
          }
        }
      // 正常加入队列
      this.resolves.push(resolvehandle)
      this.rejects.push(rejecthandle)

      if (this.status === STATUS.RESOLVED) {
        return resolvehandle(this.value)
      }
      if (this.status === STATUS.REJECTED) {
        return rejecthandle(this.value)
      }
    })
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  // 转为promise resolve 状态
  static resolve(obj) {
    if (res instanceof MyPromise) {
      return obj;
    }
    // 非promise 转为promise
    return new MyPromise(function (resolve, reject) {
      resolve(obj);
    })
  }
}

// 测试代码
new MyPromise(resolve => {
  console.log(1);
  resolve(3);
  MyPromise.resolve().then(() => console.log(4)).then(() => console.log(5))
}).then(num => { console.log(num) }).then(() => { console.log(6) });
console.log(2)
// 依次输出：1 2 4 3 5 6


new MyPromise(resolve => {
  setTimeout(() => {
    resolve('done');
  }, 200);
}).then(res => {
  console.log(res);
})