import { readFile } from 'fs';

const cache = new Map();

function consistentReadAsync(filename, callback) {
  if (cache.has(filename)) {
    // deferred callback invocation
    process.nextTick(() => callback(cache.get(filename)));
  } else {
    // async function
    readFile(filename, 'utf8', (err, data) => {
      cache.set(filename, data);
      callback(data);
    })
  }
}