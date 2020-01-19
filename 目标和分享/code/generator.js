function* generator() {
  yield 'hello';
  yield 'world';
  return 'end';
}

let g = generator();
console.log(g);  // 返回一个指向内部状态的指针对象
console.log(g.next());  // { value: 'hello', done: false }
console.log(g.next());  // { value: 'world', done: false }
console.log(g.next());  // { value: 'end', done: true }
console.log(g.next());  // { value: undefined, done: true }

for (let v of generator()) {
  console.log(v);
}

function* demo() {
  console.log('Hello' + (yield)); // OK
  console.log('Hello' + (yield 123)); // OK
}

function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

//这里需要注意，一旦next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象，
//所以上面代码的return语句返回的6，不包括在for...of循环之中。
for (let v of foo()) {
  console.log(v);
}

function* gen() {
  yield 1;
  return 2;
}

let gg = gen();
console.log(gg.next().value, gg.next().value);