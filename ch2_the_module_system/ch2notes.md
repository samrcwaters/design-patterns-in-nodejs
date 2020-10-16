## Overview
* Node.js comes with 2 different module systems: CommonJS and ES Modules.

## The Module System and Its Patterns

### The need for modules
* A good module system should address the following needs:
  1. Having a way to split a codebase into multiple files
  2. Allowing code reuse across multiple projects
  3. Encapsulation (or information-hiding)
  4. Managing dependencies

### The Revealing Module Pattern
* Everything belongs to the global namespace by default, so redefining some variable name could overwrite some dependency using that same name
* A popular technique to solve this problem is called the *Revealing Module Pattern*
  * Example:
        
        const myModule = (() => {
            const privateFoo = () => {}
            const privateBar = []

            const exported = {
            publicFoo: () => {},
            publicBar: () => {}
            }
            return exported
        })() // once the parenthesis here are parsed, the function
             // will be invoked
        console.log(myModule)
        console.log(myModule.privateFoo, myModule.privateBar)

* This pattern leverages an IIFE in order to create a private scope, exporting only the parts meant to be public.
* Remember that all variables created inside a function are not accessible from the outer scope. Functions can use the return statement to selectively propagate info to the outer scope.

### CommonJS Modules (A Debrief)
* `require` is a function that lets you import a module from the local filesystem
* `exports` and `module.exports` are special variables that can be used to export public functionality from the current module

### `module.exports` vs `exports`
* The exports variable is just a *reference* to the initial value of `module.exports`, which is simply an object literal created before the module is loaded.
  * Due to this, we can only attach new properties to the object referenced by the exports variable, eg: `exports.hello = () => { /*...*/ }`
  * Remember that if we pass some object into a function, reassigning that object to something else would only change its local copy, but assigning a new property to that object would change the original object itself (see test.js for examples of this). 
* In conclusion, you can either assign properties to `exports`, eg: `exports.hello = ...` or you can reassign `module.exports` itself (eg: `module.exports = "hello"`), since `module` was the object passed in to our `loadModule` function in the first place, and reassigning `module.exports` would follow the same principle as assigning `module.hello` -- you're modifying a property of an object, not reassigning the object itself.

### The Resolving Algorithm
* 3 branches
  1. File modules: absolute and relative paths
  2. Core modules: If a module isn't prefixed with / or ./, the algo searches core Node.js modules
  3. Package modules: If no core module is found matching `moduleName`, the algo searches other packages in the `node_modules` directory
* Matches both files and directories (eg: `<modulename>.js`, `<modulename>/index.js`, or the dir/file combo specified in main property of `<modulename>/package.json)

## Module Definition Patterns
* A module system serves as a tool for defining APIs. Need to consider the balance between private and public functionality.

### Named exports
* Most basic
* Assign values we want to make public to properties of the object referenced by `exports`
* Eg:
  
        // file logger.js
        exports.info = (message) => {
          console.log(`info: ${message}`)
        }
        exports.verbose = (message) => {
          console.log(`verbose: ${message}`)
        }

### Exporting a function
* One of the most popular approaches
* Involves reassigning the whole `module.exports` tvariable to a function
* Eg:

        // file logger.js
        module.exports = (message) => {
          console.log(`info: ${message}`)
        }
* Exporting just a function could be seen as a limitation, but in reality it's a good way to emphasize the **Single Responsibility Principle**

### Exporting a class
* A specialization of a module that exports a function
* Allows for the user to:
  * Create new instances of the exported class using a constructor
  * Extend its prototype and forge new classes
* Provides a single entry-point for the module while exposing more of the module's internals

### Exporting an instance
* Leveraging the **caching mechanism** of `require()` to define stateful instances created from a constructor or factory
  * These stateful instances can be shared across different modules, thus sharing a single state.
* Very similar to creating a **singleton**
* Eg:

        // file logger.js
        class Logger {
          constructor (name) {
            this.count = 0
            this.name = name
          }
          log (message) {
            this.count++
            console.log('[' + this.name + '] ' + message)
          }
        }
        module.exports = new Logger('DEFAULT')

### Modifying other modules or the global scope
* A module modifying other modules or objects in the global scope is called **monkey patching**.
* Produces unpredictable behavior
* Eg: nock node module

## ESM: ECMAScript modules
* ES modules are static -- this means imports are described at the top level of a module and outside any control flow statement.
  * Allows for static analysis of the dependency tree, which allows for dead code elimination (tree-shaking)
* Can't conditionally import modules

### How to use ESM in Node.js
* Give the module file the extension `.mjs` or add to the nearest parent package.json a field called "type" with a value of "module"

### Async imports (aka dynamic imports)
* Use special `import()` operator to import some heavy module that might only be accessed in a rare case
  * returns a promise

### Circular Dependencies
* ESM is better than CommonJS at handling circular dependencies
  * Module exports are just read-only live bindings
  * Swapping the import ordering of modules that form circular dependencies doesn't changea anything, whereas it does for CommonJS
  * Paths are ignored if that module has already been imported

### 3 Phases of ESM imports
1. Parsing: The dependency graph is explored in a depth first fashion. Every module is visited only once
2. Instantiation: The interpreter walks the tree generated in phase 1 from the bottom to the top, building out a map of the exported names from each module. The names are passed to the module importing that dependecy.
3. Evaluation: All code in every file is executed (bottom-up).