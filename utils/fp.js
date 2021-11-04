function curry (fn) {
  let result
  var args = [] // 装总的参数的数组
  var n = fn.length // 传入的函数的参数个数
  return function core () { // 返回一个接任意个参数的函数
    var arg = [].slice.call(arguments) // 获取当前函数的参数
    args = args.concat(arg)
    n -= arg.length
    result = n === 0 ? (n = fn.length, fn.apply(null, args)) : core
    return result
  }
}

function compose (...fns) {
  return function composed (result) {
    // 拷贝一份保存函数的数组
    var list = fns.slice()

    while (list.length > 0) {
      // 将最后一个函数从列表尾部拿出
      // 并执行它
      result = list.pop()(result)
    }
    return result
  }
}

module.exports = {
  curry,
  compose
}
