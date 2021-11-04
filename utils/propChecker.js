const R = require('ramda')
require('colors')

function kv2kt (obj) {
  // convert obj from {key:value} to {key:typeString}
  const srcKeys = Object.keys(obj)
  const srcTypes = Object.values(obj).map(v => Object.prototype.toString.call(v))
  return Object.fromEntries(R.zip(srcKeys, srcTypes))
}

function propChecker (srcObj, destObj) {
  let result = true
  const srcKeys = Object.keys(srcObj)
  const destKeys = Object.keys(destObj)
  const srcAddedKeys = R.difference(srcKeys, destKeys)
  const srcNeedKeys = R.without(srcKeys, destKeys)
  const intersectionKeys = R.intersection(srcKeys, destKeys)

  const srcKT = kv2kt(srcObj)
  const destKT = kv2kt(destObj)

  if (R.length(srcAddedKeys)) {
    result = false
    console.log(`--- ${srcObj} Delete these keys: ${srcAddedKeys}`.red)
  }

  if (R.length(srcNeedKeys)) {
    result = false
    console.log(`+++ ${srcObj} Add these keys: ${srcNeedKeys}`.green)
  }

  intersectionKeys.forEach(v => {
    if (srcKT[v] !== destKT[v]) {
      result = false
      console.log(`### Type error: '${v}' ${srcKT[v].red} --> ${destKT[v].green}`)
    } else if (srcKT[v] === '[object Object]') {
      console.log(`       ### Recursive check: '${v}'`.rainbow)
      result = propChecker(srcObj[v], destObj[v])
    }
  })

  return result
}

module.exports = propChecker
