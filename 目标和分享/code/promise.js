function funA() {
  console.log('funA() 执行');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('A');
    }, 2000);
  })
}

function funB() {
  console.log('funB() 执行');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // resolve('B');
      reject('B执行失败');
    }, 1000);
  })
}

function funC() {
  console.log('funC() 执行');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('C');
    }, 2000);
  })
}

// funA().then(res => {
//   console.log(res);
//   console.log('funA 执行完毕');
//   return funB();
// }).then(res => {
//   console.log(res);
//   console.log('funB 执行完毕');
//   return funC();
// }).then(res => {
//   console.log(res);
//   console.log('funC 执行完毕');
// }).catch(res => {
//   console.log(res);
// })


function cook() {
  console.log('开始做饭');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('做饭完毕');
      resolve('鸡蛋炒饭');
    }, 1000);
  })
}

function eat(data) {
  console.log('开始吃饭: ' + data);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('吃饭完毕');
      resolve('一个碗和一双筷子');
    }, 2000);
  })
}

function wash(data) {
  console.log('开始洗：' + data);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('洗完了');
      resolve('干净的碗筷')
    }, 2000);
  })
}

// cook()
// .then(res => {
//   return eat(res);
// })
// .then(res => {
//   return wash(res);
// })
// .then(res => {
//   console.log(res);
// })

// 更简洁的写法
// cook()
// .then(eat)
// .then(wash)
// .then(res => {
//   console.log(res);
// })


// let p = new Promise((resolve, reject) => {
//     console.log('1');
//     console.log('2')
//     resolve('success');
//   });

// p.then((value) => {
//   console.log('3');
//   console.log(value);
// });

// console.log('4');

// 1 2 4 3 success
// Promise 一创建会立即执行，then将在当前脚本所有同步任务执行完才会执行

// let p1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     reject('p1 finished');
//   }, 1000);
// })

// let p2 = new Promise((resolve, reject) => {
//   resolve(p1);
// })

// p1.then(res => {
//   console.log('p1 then:', res);
// }, err => {
//   console.log('p1 err:', err);
// })

// p2.then(res => {
//   console.log('p2 then:', res);
// })
// .catch(err => {
//   console.log('p2 catch err:', err);
// })

// p1 err: p1 finished
// p2 err: p1 finished


// 下面三种写法等价
// let p = Promise.resolve('foo');

// let p1 = new Promise(resolve => resolve('foo'))

// let p2 = new Promise((resolve, reject) => {
//   resolve('foo')
// })

//立即resolve()的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时。

// 执行顺序
new Promise(resolve => {
	console.log(1);
	resolve(3);
	Promise.resolve()
	.then(() => console.log(4))
	.then(() => console.log(5))
})
.then(num => { console.log(num) })
.then(() => { console.log(6) });

console.log(2)

// 1 2 4 3 5 6