
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

function each(arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    // callback.call(arr[i], i, arr[i]);
    // callback.apply(arr[i], [i, arr[i]]);
    callback(i, arr[i]);
  }
}

each(['a','b','c'], function(i,n) {
  console.log(i,n)
})

function target() {
  console.log('target func');
}
target._name = 'name';

function hofFunc(func) {
  console.log('hofFunc');
  return function(args) {
    func.apply(this, args);
  }
}

function hofFunc2(func) {
  console.log('hofFunc2');
  return new Proxy(func, {
    apply(_, _this, args) {
      console.log('hofFunc2 apply');
      func._value = 'value';
      func.apply(_this, args)
    }
  })
}

console.log(target._name);

console.log('---------------')

hofFunc(target)();
console.log(hofFunc(target)._name);

console.log('---------------')

hofFunc2(target)();
console.log(hofFunc2(target)._name);

console.log(target._value);



console.log('1');
setTimeout(() => {
  console.log('2');
}, 0);
console.log('3');