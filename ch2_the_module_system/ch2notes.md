### Overview
* Node.js comes with 2 different module systems: CommonJS and ES Modules.

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