// Promise 的基本写法
// let p = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('FULFILLED')
//   }, 1000)
// })
// .then(res => {
// 	console.log(res); // FULFILLED
// })
// .then(res => {
// 	console.log(res);
// })

// p.then(res=> {
// 	console.log(res); 
// })

// p.then((res) => {
// 	console.log('res: ' + res);
// })

// p.then((res) => {
// 	console.log('res: ' + res);
// })

// let promise1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
// 		resolve('success')
// 		// reject('fail');
//   }, 1000)
// });
// promise2 = promise1.then(res => {
//   // 返回一个普通值
//   return '这里返回一个普通值'
// })
// promise2.then(res => {
//   console.log(res) //1秒后打印出：这里返回一个普通值
// })

// promise2 = promise1.then(res => {
//   // 返回一个Promise对象
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//      resolve('这里返回一个Promise')
//     }, 2000)
//   })
// })
// promise2.then(res => {
//   console.log(res) //3秒后打印出：这里返回一个Promise
// })

// promise2 = promise1.then('这里的onFulfilled本来是一个函数，但现在不是')
// promise2.then(res => {
//   console.log(res) // 1秒后打印出：success
// }, err => {
//   console.log(err)
// })

// promise2 = promise1.then(res => res, '这里的onRejected本来是一个函数，但现在不是')
// promise2.then(res => {
//   console.log(res)
// }, err => {
//   console.log(err)  // 1秒后打印出：fail
// })

//////////////////////////////////////////////////////
// https://www.jianshu.com/p/43de678e918a
// https://www.jianshu.com/p/4f3bef72758c

// _resolve改为同步执行，而then里onFulfilled、onRejected改为异步执行，并捕获异常；静态方法resolve有修改

// 判断一个变量是否是函数
const isFunction = variable => typeof variable === 'function';

// 定义三种状态常量
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

var executeAsync
if (typeof process === 'object' && process.nextTick) {
  executeAsync = process.nextTick
} else if (typeof setImmediate === 'function') {
  executeAsync = setImmediate
} else {
  executeAsync = function (fn) { setTimeout(fn, 0) }
}

function callAsync(fn, arg, callback, onError) {
  executeAsync(function () {
    try {
      callback ? callback(fn(arg)) : fn(arg)
    } catch (e) {
      onError(e)
    }
  })
}

class MyPromise {
  constructor(handle) {
    if (!isFunction(handle)) {
      throw new Error('MyPromise must accept a function as a parameter');
    }
    // 添加状态
    this._status = PENDING;
    // 添加值
    this._value = null;
    // 添加成功回调函数队列
    this._fulFilledQueues = [];
    // 添加失败回调函数队列
    this._rejectedQueues = [];

    // 执行handle
    try {
      handle(this._resolve.bind(this), this._reject.bind(this))
    } catch (err) {
      this._reject(err);
    }
  }
  // 添加resolve时执行的函数
  _resolve(val) {
    if (this._status !== PENDING) return;
    this._status = FULFILLED;

    // 依次执行成功队列中的函数，并清空队列
    const runFulfilled = (value) => {
      let cb;
      while (cb = this._fulFilledQueues.shift()) {
        cb(value);
      }
    }
    // 依次执行失败队列中的函数，并清空队列
    const runRejected = (err) => {
      let cb;
      while (cb = this._rejectedQueues.shift()) {
        cb(err);
      }
    }
		/* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
		当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态
		*/
    if (val instanceof MyPromise) {
      val.then(value => {
        this._value = value
        runFulfilled(value)
      }, err => {
        this._value = err
        runRejected(err)
      })
    } else {
      this._value = val
      runFulfilled(val)
    }
  }
  // 添加reject时执行的函数
  _reject(err) {
    if (this._status !== PENDING) return;
    // 依次执行失败队列中的函数，并清空队列
    this._status = REJECTED;
    this._value = err;
    let cb;
    while (cb = this._rejectedQueues.shift()) {
      cb(err);
    }
  }
  // 添加then方法
  then(onFulfilled, onRejected) {
    const { _value, _status } = this
    // 返回一个新的Promise对象
    return new MyPromise((onFulfilledNext, onRejectedNext) => {
      // 封装一个成功时执行的函数
      let fulfilled = value => {
        try {
          if (!isFunction(onFulfilled)) {
            onFulfilledNext(value)
          } else {
            callAsync(onFulfilled, value, (res) => {
              if (res instanceof MyPromise) {
                // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                res.then(onFulfilledNext, onRejectedNext)
              } else {
                //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                onFulfilledNext(res)
              }
            }, onRejectedNext);
          }
        } catch (err) {
          // 如果函数执行出错，新的Promise对象的状态为失败
          onRejectedNext(err)
        }
      }
      // 封装一个失败时执行的函数
      let rejected = error => {
        try {
          if (!isFunction(onRejected)) {
            onRejectedNext(error)
          } else {
            callAsync(onRejected, error, (res) => {
              if (res instanceof MyPromise) {
                // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                res.then(onFulfilledNext, onRejectedNext)
              } else {
                //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                onFulfilledNext(res)
              }
            }, onRejectedNext);
          }
        } catch (err) {
          // 如果函数执行出错，新的Promise对象的状态为失败
          onRejectedNext(err)
        }
      }
      switch (_status) {
        // 当状态为pending时，将then方法回调函数加入执行队列等待执行
        case PENDING:
          this._fulfilledQueues.push(fulfilled)
          this._rejectedQueues.push(rejected)
          break
        // 当状态已经改变时，立即执行对应的回调函数
        case FULFILLED:
          fulfilled(_value)
          break
        case REJECTED:
          rejected(_value)
          break
      }
    })
  }
  // 添加catch方法
  catch(onRejected) {
    return this.then(null, onRejected)
  }
  // 添加静态resolve方法
  static resolve(value) {
    // 如果参数是MyPromise实例或thenable对象，直接返回value
    if (value instanceof MyPromise) { return value; }
    if (value && isFunction(value.then)) { return value; }

    return new MyPromise(resolve => resolve(value))
  }
  // 添加静态reject方法
  static reject(value) {
    return new MyPromise((resolve, reject) => reject(value))
  }
  // 添加静态all方法
  static all(list) {
    return new MyPromise((resolve, reject) => {
			/**
			 * 返回值的集合
			 */
      let values = []
      let count = 0
      for (let [i, p] of list.entries()) {
        // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
        this.resolve(p).then(res => {
          values[i] = res
          count++
          // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
          if (count === list.length) resolve(values)
        }, err => {
          // 有一个被rejected时返回的MyPromise状态就变成rejected
          reject(err)
        })
      }
    })
  }
  // 添加静态race方法
  static race(list) {
    return new MyPromise((resolve, reject) => {
      for (let p of list) {
        // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
        this.resolve(p).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      }
    })
  }
  finally(cb) {
    return this.then(
      value => MyPromise.resolve(cb()).then(() => value),
      reason => MyPromise.resolve(cb()).then(() => { throw reason })
    );
  };
}

// new MyPromise(resolve => {
// 	console.log(1);
// 	resolve(3);
// 	MyPromise.resolve()
// 	.then(() => console.log(4))
// 	.then(() => console.log(5))
// })
// .then(num => { console.log(num) })
// .then(() => { console.log(6) });
// console.log(2)

// 1 4 5 3 2 6  不对

// 举例1：
// new Promise(resolve => {
// 	console.log(1);
// 	resolve(3);
// 	new Promise(resolve => { 
// 		console.log(7)
// 		resolve();
// 	})
// 	.then(() => console.log(4))
// 	.then(() => console.log(5))
// })
// .then(num => { console.log(num) })
// .then(() => { console.log(6) });
// console.log(2)

// 1 7 2 4 3 5 6

// 举例2：
// new Promise(resolve => {
// 	console.log(1);
// 	resolve(3);
// 	new Promise(resolve => { 
// 		console.log(7)
// 		resolve();

// 		new Promise(resolve => { 
// 			console.log(8)
// 			resolve()
// 		})
// 		.then(() => console.log(9))
// 		.then(() => console.log(10))
// 	})
// 	.then(() => console.log(4))
// 	.then(() => console.log(5))
// })
// .then(num => { console.log(num) })
// .then(() => { console.log(6) });
// console.log(2)

// 1 7 8 2 9 4 3 10 5 6


// 举例3：
// new Promise(resolve => {
// 	console.log(1);
// 	resolve(3);

// 	new Promise(resolve => resolve())
// 		.then(() => console.log(4))
// 		.then(() => console.log(5))
// })
// 	.then(num => { console.log(num) })
// 	.then(() => { console.log(6) });

// new Promise(resolve => resolve())
// 	.then(() => console.log(7))
// 	.then(() => console.log(8))

// console.log(2)

// 1 2 4 3 7 5 6 8 


// 举例4：
// new Promise(resolve => {
//   console.log('Promise')
//   resolve()
// })
//   .then(function () {
//     new Promise(resolve => {
//       console.log('promise1')
//       resolve()
//     })
//       .then(function () {
//         console.log('promise1-1')
//       })
//       .then(function () {
//         console.log('promise1-2')
//       })
//       .then(function () {
//         console.log('promise1-3')
//       })
//       .then(function () {
//         console.log('promise1-4')
//       })
//     console.log('after promise1')
//   })
//   .then(function () {
//     new Promise(resolve => {
//       console.log('promise2')
//       resolve()
//     })
//       .then(function () {
//         console.log('promise2-1')
//       })
//       .then(function () {
//         console.log('promise2-2')
//       })
//       .then(function () {
//         console.log('promise2-3')
//       })
//       .then(function () {
//         console.log('promise2-4')
//       })
//     console.log('after promise2')
//   })
//   .then(function () {
//     new Promise(resolve => {
//       console.log('promise3')
//       resolve()
//     })
//       .then(function () {
//         console.log('promise3-1')
//       })
//       .then(function () {
//         console.log('promise3-2')
//       })
//       .then(function () {
//         console.log('promise3-3')
//       })
//       .then(function () {
//         console.log('promise3-4')
//       })
//     console.log('after promise3')
//   })


  // 优先级： 里 - 外