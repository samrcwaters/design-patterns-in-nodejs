function loadModule(filename, module, require) {
  const wrappedSrc =
    `(function (module, exports, require){
      ${fs.readFileSync(filename, 'utf8')}
    })(module, module.exports, require)`;
  eval(wrappedSrc)
}

function require(moduleName) {
  console.log(`Require invoked for module: ${moduleName}`);
  const id = require.resolve(moduleName); // (1) Resolve the full path of the module, which we call id.
  if (require.cache[id]) { // (2)_If the module has already been loaded in the past, it should be available in the cache, so we can return it immediately.
    return require.cache[id].exports;
  }

  // module metadata
  const module = { // (3) If the module has never been loaded before, we set up the environment for the first load by creating a module object that contains an exports property initialized with an empty object literal. This object will be populated by the code of the module to export to its public API
    exports: {},
    id
  };

  // update the cache
  require.cache[id] = module; // (4) After the first load, the object needs to be cached.

  // load the module
  loadModule(id, module, require); // Module source code is read from its file and the code is evaluated. In your code, you'd assign something to module.exports, which would actually change the underlying module object from our require function, since objects are passed by reference in JavaScript.

  // return exported variables
  return module.exports; // (6) The public API is returned to the caller.
}

require.cache = {};

require.resolve = (moduleName) => {
  /* Resolve a full module id from the moduleName */
}