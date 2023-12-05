const fs = require('fs');

fs.readFile(__filename, () => {
  console.log('readFile');
})

setImmediate(() => {
  console.log('setImmediate');
})

setTimeout(() => {
  console.log('setTimeout');
}, 0)

process.nextTick(() => {
  console.log('nextTick');
})

Promise.resolve().then(() => {
  console.log('promise');
  process.nextTick(() => {
    console.log('nextTick inside promise');
  })
})

for (let i = 0; i < 1000000000; i++) {}

console.log('LOG AFTER FOR LOOP');

process.nextTick(() => {
  console.log('nextTick after for loop');
})


// setTimeout(() => console.log('This is the setTimeout'), 0);
// setTimeout(() => {
//   console.log('This is the setTimeout 2');
//   Promise.resolve().then(() => console.log('This is the promise inside the setTimeout 2'));
//   process.nextTick(() => console.log('This is the inner nextTick inside the setTimeout 2'));
// }, 0);
// Promise.resolve().then(() => console.log('This is the promise 1 resolve'));
// Promise.resolve().then(() => {
//   console.log('This is the promise 2 resolve');
//   process.nextTick(() => console.log('This is the inner nextTick inside the promise.then block 2'));
// });
// Promise.resolve().then(() => {
//   process.nextTick(() => console.log('This is the inner nextTick inside the promise.then block 3'));
//   console.log('This is the promise 3 resolve')
// });
// process.nextTick(() => console.log('this is process.nextTick 1'));
// process.nextTick(() => {
//   console.log('This is process.nextTick 2');
//   process.nextTick(() => console.log('This is the inner nextTick inside the nextTick 2'));
// });
// process.nextTick(() => console.log('this is process.nextTick 3'));

/**
 * Output:
 * this is process.nextTick 1
 * this is process.nextTick 2
 * this is process.nextTick 3
 * This is the inner nextTick inside the nextTick 2
 * This is the promise 2 resolve
 * This is the inner nextTick inside the promise.then block 2
 *
 *
 *
 *
 *
 *
 * event loop:
 * 1. timers
 * 2. pending callbacks
 * 3. idle, prepare
 * 4. poll
 * 5. check
 * 6. close callbacks
 *
 *
 * nextTickQueue: [
 *  () => console.log('this is process.nextTick 1'),
 *  () => {
      console.log('This is process.nextTick 2');
      process.nextTick(() => console.log('This is the inner nextTick inside the nextTick 2'));
    },
    () => console.log('this is process.nextTick 3'),
    () => console.log('This is the inner nextTick inside the nextTick 2'),
    () => console.log('This is the inner nextTick inside the promise.then block 2')
 * ]
 * promiseQueue: [
 *  () => console.log('This is the promise 1 resolve'),
 *  () => {
      console.log('This is the promise 2 resolve');
      process.nextTick(() => console.log('This is the inner nextTick inside the promise.then block 2'));
    },
    () => console.log('This is the promise 3 resolve')
 * ]
 * callstack: [
 *  console.log('this is process.nextTick 1')
 *  console.log('This is process.nextTick 2');
 *  console.log('this is process.nextTick 3')
 *  console.log('This is the inner nextTick inside the nextTick 2')
 *  console.log('This is the promise 1 resolve'),
 *  console.log('This is the promise 2 resolve');
 *  console.log('This is the inner nextTick inside the promise.then block 2')
 *  console.log('This is the promise 3 resolve')
 * ]
 *
 * nexttick 1
 * promise 1
 * timeout 1
 * readfile 1
 * inner nextick
 * inner promise
 * inner immediate
 */
