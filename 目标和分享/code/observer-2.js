// let salesOffices = {}; // 定义售楼处

// salesOffices.clinetList = {};  // 缓存列表，存放订阅者的回调函数

// salesOffices.listen = function(key, fn) {  // 增加订阅者
//   if (!this.clinetList[key]) {
//     this.clinetList[key] = [];
//   }
//   this.clinetList[key].push(fn);
// }

// salesOffices.trigger = function(key, data) {  // 发布消息
//   let fns = this.clinetList[key];
//   if (!fns || fns.length === 0) { return; }

//   fns.forEach(fn => {
//     // fn.apply(this, [data]);   // arguments 是发布消息时带上的参数
//     fn.call(this, data);
//   })
// }

// // 测试
// salesOffices.listen('88', (price) =>{
//   console.log(price);
// })
// salesOffices.listen('99', (price) =>{
//   console.log(price);
// })

// salesOffices.trigger('88', 100000);
// salesOffices.trigger('99', 200000);


// 通用实现
let event = {
  clinetList: {},
  listen: function(key, fn) {
    if (!this.clinetList[key]) {
      this.clinetList[key] = [];
    }
    this.clinetList[key].push(fn);
  },
  trigger: function() {
    let key = Array.prototype.shift.call(arguments);
    let fns = this.clinetList[key];
    if (!fns || fns.length === 0) { return; }
    fns.forEach(fn => {
      fn.apply(this, arguments);   // arguments 是发布消息时带上的参数
    })
  },
  remove: function(key, fn) {
    let fns = this.clinetList[key];
    if (!fns || fns.length === 0) { return; }
    if (!fn) {
      fns = [];
    } else {
      for (let i = 0; i < fns.length; i++) {
        let tempFn = fns[i];
        if (tempFn === fn) {
          fns.splice(i, 1);
          break;
        }
      }
    }
  }
}

// 给所有的对象都动态安装发布—订阅功能:
function installEvent(obj) {
  for (let i in event) {
    obj[i] = event[i];
  }
}

let salesOffices = {};
// 给售楼处增加发布订阅功能
installEvent(salesOffices);



// 发布订阅模式
// 创建一个全局的Event中心

function Event() {
  this.clinetList = {};

  this.listen = function(key, fn) {
    if (!this.clinetList[key]) {
      this.clinetList[key] = [];
    }
    this.clinetList[key].push(fn);
  };

  this.trigger = function() {
    let key = Array.prototype.shift.call(arguments);
    let fns = this.clinetList[key];
    if (!fns || fns.length === 0) { return; }
    fns.forEach(fn => {
      fn.apply(this, arguments);   // arguments 是发布消息时带上的参数
    })
  };

  this.remove = function(key, fn) {
    let fns = this.clinetList[key];
    if (!fns || fns.length === 0) { return; }
    if (!fn) {
      fns = [];
    } else {
      for (let i = 0; i < fns.length; i++) {
        let tempFn = fns[i];
        if (tempFn === fn) {
          fns.splice(i, 1);
          break;
        }
      }
    }
  }
}

let e = new Event();
e.listen('100', function(price) {
  console.log('100: ' + price);
})
e.trigger('100', 100000000);