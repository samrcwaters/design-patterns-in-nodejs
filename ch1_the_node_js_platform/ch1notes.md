# The Node.js Philosophy
### Small core
* Node.js has a small runtime and small built-in modules
### Small modules: modules do one thing well
* Easier to test, maintain, understand, and use.
* Modules are created to be used, rather than extended
* Expose functions instead of classes, don't expose internals to the outside world
### Simplicity and Pragmatism
* K.I.S.S.
* Prefer an uncomplicated and practical approach

# How Node.js Works
### I/O Is Slow
* Keep this in mind for later.
### Blocking I/O
* In traditional blocking I/O programming, a function call associated with an I/O requests blocks the execution of a thread until the operation completes.
  * The delay from syscalls like `read()` and `write()` is usually quite long.
  * Using syscalls that block is sometimes called synchronous programming.
  * This isn't usually a problem, but a web server implemented using blocking I/O won't be able to handle multiple concurrent connections. Each I/O operation on a socket will block the processing of another connection.
    * The traditional solution to this is threads.

### Non-blocking I/O
* A system call always returns immediately without waiting for the data to be read or written
* If no results are available at the moment of the call, the function returns a predefined constant indicating that there is no data to return.
  * One way to deal with this is the **busy-waiting** pattern, in which a process actively polls the resource within a loop until data is returned (while hogging CPU)

### Event Demultiplexing
* Busy waiting is inefficient, but **synchronous event demultiplexing** (aka: the event notification interface) is more efficient.
* **Multiplexing** = the method by which multiple signals are combined into one so they can be easily transmitted over a medium with limited capacity.
* **Demultiplexing** = the signal is split again into its original components
* The synchronous event demux **watches multiple resources** and returns a new event (or set of events) when a read or write operation executed over one of those resources completes.

### The Event Loop
* The event loop allows for single-threaded concurrency by using a synchronous event demux and an event queue
* The flow:
  1. Resources are added to a data structure, associating each one of them with a specific operation (eg: a read or write)
  2. The demux is set up with the group of resources to be watched. Watching a resource is synchronous and blocks until any of the watched resources are ready (to be read from or written to). When this occurs, the event demux returns from the call and a new set of events is available to be processed.
  3. Each event returned by the event demux is processed. At this point, the resource associated with each event is guaranteed to be ready to be read from or written to and to not block during the operation (remember how I/O is slow?). When all the events are processed, the flow blocks again on the event demux until new events are again available to be processed. This is called the **event loop**.
* Important note: the event loop goes to sleep when the event queue is empty.
* A callback executed by an async function is put at the back of the event queue.

### The Reactor Pattern
* One callback is associated with each I/O operation. 
  * A handler in Node.js is represented by a callback (or cb for short) function
* Handler is invoked as soon as an event is produced and processed by the event loop.
* Reactor Pattern Flow:
    1. The app generates a new I/O operation by submitting a request to the event demux. The app specifies a handler, which will be invoked when the op completes. Submitting a new request to the event demux is a non-blocking call and it immediately returns control to the application.
    2. When a set of I/O operations completes, the event demux pushes a set of corresponding events to the event queue.
    3. At this point, the event loop iterates over the items in the event queue.
    4. For each event, the associated handler is invoked
    5. The handler, which is part of the application code, gives back control to the event loop when its execution completes. While the handler executes, it can request new async operations, causing new items to be added to the event demux.
    6. When all the items in the event queue have been processed, the event loop blocks again on the event demux, which then triggers another cycle when a new event is available.
* Summary: The Reactor Pattern handles I/O by blocking until new events are available from a set of observed resources, and then reacts by dispatching each event to an associated handler.

### The Node.js Recipe
* `libuv` is the library used by Node.js which implements the Reactor Pattern. It is the low-level I/O engine for Node.js.
* Node uses Google's V8 engine for its JavaScript engine, and a core JavaScript librayr that implements the high-level Node.js API

### The Module System
* Original Node.js module system is called CommonJS -- this is what uses the `require` keyword to import functions, variables, and classes exported by modules.