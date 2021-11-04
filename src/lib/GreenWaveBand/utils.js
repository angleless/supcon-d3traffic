/**
* 复制对象
* @param obj 目标对象
**/
function deepCopy (obj) {
  var result = Array.isArray(obj) ? [] : {}
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = deepCopy(obj[key]) // 递归复制
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}

/**
 * 提取补余函数
 * @param data 源数据数组
 * @param callback 回调函数
 *
 * 接受原始数据数组为参数，返回补余数据数组
 **/
function getRestLength (data, callback) {
  const resultList = []
  let distance = 0
  data.map((item, index) => {
    const operateList = deepCopy(item.phase).reverse()
    let time = 0
    operateList.map((ite, ind) => {
      const originTime = time
      let renderObj = {}
      time += ite.split_time
      renderObj = {
        index, // 原始数据下标--用于关联原始数据
        timeStart: originTime, // 时间坐标轴坐标（若x轴为时间，则此数据为x坐标）
        timeEnd: item.offset > time ? time : item.offset, // 时间坐标轴坐标（若x轴为时间，则此数据为x坐标）
        distance: distance, // 距离坐标轴坐标（若x轴为距离，则此数据为x距离）
        isCophase: ite.is_co_phase // 是否是绿灯  1 为绿灯   0 为红灯
      }
      resultList.push(renderObj)
      callback && callback(renderObj)
    })
    distance += item.roadlen
  })
  return resultList
}

export {
  deepCopy,
  getRestLength
}
