console.log('before');
setTimeout(() => {console.log('async print')}, 0); // This callback is queued up to execute at the end of the event queue. Can also use setImmediate
console.log('after');