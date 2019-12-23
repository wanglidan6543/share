/**
 * 观察者模式：
 * 
 * 观察者（Observer）直接订阅（Subscribe）主题（Subject），
 * 而当主题被激活的时候，会触发（Fire Event）观察者里的事件。
 * 
 * 
 * 发布订阅模式：
 * 
 * 订阅者（Subscriber）把自己想订阅的事件注册（Subscribe）到调度中心（Topic），
 * 当发布者（Publisher）发布该事件（Publish topic）到调度中心，
 * 也就是该事件触发时，由调度中心统一调度（Fire Event）订阅者注册到调度中心的处理代码。
 */

// 观察者模式

//有一家猎人工会，其中每个猎人都具有发布任务(publish)，订阅任务(subscribe)的功能
//他们都有一个订阅列表来记录谁订阅了自己

// 猎人们(观察者)关联他们感兴趣的猎人(目标对象)，如小正，当小正有困难时，会自动通知给他们（观察者）

//定义一个猎人类
//包括姓名，级别，订阅列表
// function Hunter(name, level) {
//   this.name = name;
//   this.level = level;
//   this.list = [];

//   this.publish = function() {
//     console.log(this.level + '猎人' + this.name + '寻找帮助');
//     this.list.forEach((item, index) => {
//       item(index);
//     })
//   };

//   this.subscribe = function(target, fn) {
//     console.log(this.level + '猎人' + this.name + '订阅了'  + target.name);
//     target.list.push(fn);
//   }
// }

// let hunter1 = new Hunter('小明', '黄金');
// let hunter2 = new Hunter('小金', '白银');
// let hunter3 = new Hunter('小张', '黄金');
// let hunter4 = new Hunter('小正', '青铜');

// //小正等级较低，可能需要帮助，所以小明，小金，小张都订阅了Peter
// hunter1.subscribe(hunter4, (money) => {
//   console.log('小明表示：' + (money > 200 ? '' : '暂时很忙，不能') + '给予帮助')
// })
// hunter2.subscribe(hunter4, function(){
//   console.log('小金表示：给予帮助')
// })
// hunter3.subscribe(hunter4, function(){
//   console.log('小张表示：给予帮助')
// })

// //小正发布事件 遇到困难，赏金198寻求帮助
// hunter4.publish(198);


// 发布订阅模式

//定义一家猎人工会
//主要功能包括任务发布大厅(topics)，以及订阅任务(subscribe)，发布任务(publish)

//猎人们发布(发布者)或订阅(观察者/订阅者)任务都是通过猎人工会(调度中心)关联起来的，他们没有直接的交流。

let HunterUnion = {
  type: 'hunt',
  topics: {},
  subscribe: function(topic, fn) {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }
    this.topics[topic].push(fn);
  },
  publish: function(topic, money) {
    if (!this.topics[topic]) { return; }
    for(let fn of this.topics[topic]) {
      fn(money);
    }
  }
}

function Hunter(name, level) {
  this.name = name;
  this.level = level;

  this.subscribe = function(topic, fn) {
    console.log(this.level + '猎人' + this.name + '订阅了狩猎' + topic + '的任务')
    HunterUnion.subscribe(topic, fn);
  }

  this.publish = function(topic, money) {
    console.log(this.level + '猎人' + this.name + '发布了狩猎' + topic + '的任务')
    HunterUnion.publish(topic, money)
  };
}

let hunter1 = new Hunter('小明', '黄金');
let hunter2 = new Hunter('小金', '白银');
let hunter3 = new Hunter('小张', '黄金');
let hunter4 = new Hunter('小正', '青铜');

//小明，小金分别订阅了狩猎tiger的任务
hunter1.subscribe('tiger', (money) => {
  console.log('小明表示：' + (money > 200 ? '' : '不') + '接取任务')
})
hunter2.subscribe('tiger', function(money){
  console.log('小金表示：接取任务')
})

//小张订阅了狩猎sheep的任务
hunter3.subscribe('sheep', function(money){
  console.log('小正表示：接取任务')
})

//小正发布了狩猎tiger的任务
hunter4.publish('tiger', 198)
hunter4.publish('tiger', 300)
hunter4.publish('sheep', 198)