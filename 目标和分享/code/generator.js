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

for (let v of foo()) {
  console.log(v);
}