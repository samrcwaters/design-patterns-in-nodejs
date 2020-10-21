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

### Best Practices
* Always choose a direct style for purely synchronous functions
* Use blocking APIs sparingly and only when they don't affect the ability of the application to handle concurrent async operations

### Dealing with inconsistencies
* Could use only synchronous APIs OR
* Guarantee asynchronicity with deferred execution

### Guaranteeing asynchronicity with deferred execution
* Make everything purely asynchronous by scheduling synchronous callback invocations to be executed in the future instead of run immediately in the same event loop cycle
  * Use process.nextTick()

#### `process.nextTick` vs `setImmediate`
* Callbacks deferred with `process.nextTick()` are called **microtasks** -- they're execute just after the current operation completes, and BEFORE any other I/O event is fired
* With `setImmediate()`, the execution is queued up for AFTER all I/O events. This can help avoid I/O starvation
  * `setTimeout(cb, 0)` behaves similarly to `setImmediate`, but can sometimes have a lower priority

### Node.js callback conventions
* If a function accepts a callback as an argument, it should be the last argument.
* Errors should be passed as the first argument to a callback
  * In the case of an error, you should call the callback and pass the error. Eg:

        if (err) {
          return callback(err)
        }

* It's best practice to never leave an application running after an uncaught exception -- instead you should exit immediately. This is known as the **fail fast** approach.
  * Can, and probably should, be run with some tasks to do cleanup and restart the app

## The Observer pattern
* The observer pattern defines an object (called subject) that can notify a set of observers (or listeners) when a change in its state occurs
  * A traditional CPS callback will typically only propagate a result to one listener, while a subject can propagate to many
* Works well with the Reactor pattern and callbacks

### The EventEmitter
* Allows us to register one or more functions as listeners, which will be invoked when a particular event type fires
* Emits a special `error` event on error
* Common for other classes to extend `EventEmitter`, thus becoming an observable object

#### EventEmitter vs Callbacks
* General rule: Callbacks should be used when a result must be returned asynchronously, and events should be used when there is a need to communicate that something has happened
* Which to use?
  * EventEmitter is better for differentiating between types of events that spawn an action
  * EventEmitter should be used when the same event can occur multiple times or not at all
  * EventEmitter is better for multiple listeners