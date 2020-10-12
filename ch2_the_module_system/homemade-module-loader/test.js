function changeObject(obj) {
  obj.hello = 'hellllooooo';
}

function reassignObject(obj) {
  obj = {
    newProp: "newval"
  };
}

function changeProperty(prop) {
  prop.foo = "bar"
}

function changePropertyByClosure(obj) {
  const f = ((subobj) => {
    subobj = "baz";
  })(obj.subobj)
}

obj = {
  hello: 'hi!',
  subobj: {}
};

console.log(obj);

reassignObject(obj);
console.log(obj);

// changeObject(obj);
// console.log(obj);

// changeProperty(obj.subobj);
// console.log(obj);

// changePropertyByClosure(obj)
// console.log(obj);