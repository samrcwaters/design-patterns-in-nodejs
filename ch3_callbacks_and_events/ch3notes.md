## The Callback Pattern
* Callbacks = the materialization of the handlers of the Reactor pattern
* Callbacks are functions that are invoked to propagate the result of an operation
* Callbacks are perfect with JS since functions are first-class objects and can be easily assigned to variables

### The continuation-passing style
* Propagating a result by means of passing a function as an argument to another function, and invoking that passed function when an operation completes
  * Passing a result back using a `return` statement is called **direct style**
* Closures make it trivial to maintain the context of the caller of an async function even if the callback is invoked at a different time and from a different location

#### Non-CPS Callbacks
* Just because a function is passed as an argument to another function doesn't make it an async CPS. Eg: the `map` function executes in a `direct style`