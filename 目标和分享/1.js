
var obj = new Proxy({}, {
  get: function(target, key, receiver) {
    console.log(`getting ${key}!`);
    return Reflect.get(target, key, receiver);
  },
  set: function(target, key, value, receiver) {
    console.log(`setting ${key}!`);
    return Reflect.set(target, key, value, receiver);
  }
})

obj.count = 1;

obj.count += 1;

// 运行结果：
// setting count!
// getting count!
// setting count!

var mult = function() {
  console.log('开始计算');
  let a = 1;
  for (let i = 0; i < arguments.length; i++) {
    a = a * arguments[i];
  }
  return a;
}

var proxyMult = (function() {
  let cache = {};
  return function() {
    let args = Array.prototype.join.call(arguments);
    if (args in cache) {
      return cache[args];
    }
    return cache[args] = mult.apply(this, arguments);
  }
})();

console.log(proxyMult(1,3,4));
console.log(proxyMult(3,4,1));
console.log(proxyMult(1,3,4));