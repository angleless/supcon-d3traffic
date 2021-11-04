const test = require('ava')
const { curry, compose } = require('./fp.js')

function doMath(num, add2, multiply3, subtract4) {
  const [number, ...fns] = [...arguments]
  fns.reverse()
  return compose(...fns)(num)
}
function addN(n) {
  return function(params){
    return params + n
  }
}
function multipleN(n) {
  return function(params){
    return params * n
  }
}
function subtractN(n) {
  return function(params){
    return params - n
  }
}
const add2 = addN(2)
const multiply3 = multipleN(3)
const subtract4 = subtractN(4)


var doMath_curry = curry(doMath)


test('doMath_curry', t => {
  t.is(8, doMath_curry(2)(add2)(multiply3)(subtract4))
})


