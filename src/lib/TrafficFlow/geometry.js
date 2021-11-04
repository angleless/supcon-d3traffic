function fixed (n, digits = 10) {
  // fixed(0.1 + 0.2) === 0.3
  return parseFloat(n.toFixed(digits))
}

/**
 * 输入一个直角坐标点p1，输出另一个直角坐标点p2，满足：
 * 1. 正北方向顺时针方向旋转 angle 到 p1p2
 * 2. p1 到 p2 的长度为 distance
 * @param {{number, number}} { x, y } 一个点直角坐标点坐标
 * @param {{number, number}} { x, y } 另一个点直角坐标点坐标
 * @param {number} angle 两个点的角度
 * @returns { k, b } 返回点斜式的方程常量
 */
function pointOblique ({ x: x1, y: y1 }, { x: x2, y: y2 }, angle = 0) {
  if (x2 - x1 === 0) {
    return null
  } else {
    const b = (y1 * x2 - y2 * x1) / (x2 - x1)
    const k = (y2 - y1) / (x2 - x1)
    return {
      k,
      b
    }
  }
}

/**
 * 输入一个直角坐标点p1，输出另一个直角坐标点p2，满足：
 * 1. 正北方向顺时针方向旋转 angle 到 p1p2
 * 2. p1 到 p2 的长度为 distance
 * @param {{number, number}} { x, y } 起点直角坐标点坐标
 * @param {number} angle 起点到目标点与正北方向的角度
 * @param {number} [distance=100] 目标点与起点之间距离
 * @returns { x, y } 返回目标点直角坐标点
 */
function polar2rect ({ x, y }, angle = 0, distance = 100) {
  return {
    x: fixed(x + distance * Math.sin(ang2rad(angle))),
    y: fixed(y + distance * Math.cos(ang2rad(angle)))
  }
}

/**
 * 输入两个直角坐标点，输出对应的二元一次函数参数 { a, b }
 * i.e. y = ax + b
 * @param {{number, number}} { x1, y1 }
 * @param {{number, number}} { x2, y2 }
 * @returns {a, b} i.e. y = ax + b
 */
function linePoints ({ x1, y1 }, { x2, y2 }) {
  const a = (y1 - y2) / (x1 - x2)
  const b = y1 - a * x1
  return { a, b }
}
/**
 * 输入 二元一次函数斜率 slope
 * 输入 线上一个坐标点 p0
 * 返回 函数 { a, b }
 * @param {number} slope
 * @param {{number, number}} { x, y }
 * @returns {a, b} i.e. y = ax + b
 */
function lineSlopePoint (slope, { x, y }) {
  const [radx] = radians(slope)
  const a = fixed(Math.tan(radx))
  const b = fixed(y - a * x)

  return { a, b }
}
/**
 *输入 线上一个坐标点 {x1, y1}
 *输入线上另一个坐标点 {x2, y2}
 * 返回 函数 { a, b, c } i.e. ax + by + c = 0
 * @param {number, number} { x1, y1 }
 * @param {number, number} { x2, y2 }
 * @returns
 */
function linescalePoint ({ x1, y1 }, { x2, y2 }) {
  let a
  let b
  let c
  if (x2 - x1 === 0) {
    b = 0
    a = -1
    c = x1
  } else if (y2 - y1 === 0) {
    a = 0
    b = -1
    c = y1
  } else {
    a = -1
    b = (y2 - y1) / (x2 - x1)
    c = x1 - b * y1
  }
  return { a, b, c }
}
/**
 * 输入 二元一次函数与y轴正向夹角 alpha
 * 输入 线上一个坐标点 p0
 * 返回 函数 { a, b, c } i.e. ax + by + c = 0
 * @param {number} angle
 * @param {{number, number}} { x, y }
 * @returns {-1, b, c}
 */
function lineAnglePoint (angle, { x, y }) {
  let a
  let b
  let c
  if (angle % 180 === 0) {
    b = 0
    a = -1
    c = x
  } else if (angle % 90 === 0) {
    a = 0
    b = -1
    c = y
  } else {
    a = -1
    b = Math.tan(ang2rad(angle))
    c = x - b * y
  }
  return { a, b, c }
}

function ang2rad (n) {
  return (n / 180) * Math.PI
}

function rad2ang (n) {
  return (n / Math.PI) * 180
}
/**
 *
 *输入一个坐标点{ x: x1, y: y1 }
 *输入另一个坐标点{ x: x2, y: y2 }
 *返回两点连线的长度
 * @param {number, number} { x: x1, y: y1 }
 * @param {number, number} { x: x2, y: y2 }
 * @returns number
 */
function pointLenth ({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)))
}
/**
 *
 *输入一个坐标点{ x: x1, y: y1 }
 *输入另一个坐标点{ x: x2, y: y2 }
 *返回两点连线的cos比值
 * @param {nubmer, number} { x: x1, y: y1 }
 * @param {number, number} { x: x2, y: y2 }
 * @returns number
 */
function pointCos ({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  return (x2 - x1) / Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)))
}
/**
 *
 *输入一个坐标点{ x: x1, y: y1 }
 *输入另一个坐标点{ x: x2, y: y2 }
 *返回两点连线的斜率
 * @param {nubmer, number} { x: x1, y: y1 }
 * @param {number, number} { x: x2, y: y2 }
 * @returns number
 */
function pointSin ({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  return (y2 - y1) / Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)))
}
/**
 * 输入斜率slope
 * 求二元一次函数与x轴，y轴的狐度数组
 *
 * @param {number} slope
 * @returns [radx, rady]
 */
function radians (slope) {
  return [Math.atan2(slope, 1), Math.atan2(1, slope)]
}

/**
 * 输入函数 {a, b, c}  i.e. ax + by + c = 0
 * 输入函数的角度
 * 输入函数要平行移动的距离
 * 输入函数平行移动的方向
 * 返回 函数 { a1, b1, c1 } i.e. a1x + b1y + c1 = 0
 * @param {*} { a, b, c }
 * @param {*} angle
 * @param {number} [distance=5]
 * @param {boolean} [bForward=true]
 * @returns { x, y, z }
 */
function parallellines ({ a, b, c }, angle, distance = 5, bForward = true) {
  let a1
  let b1
  let c1
  const sign = bForward ? 1 : -1
  if (angle % 180 === 0 || angle % 90 === 0) {
    a1 = 0
    b1 = -1
    c1 = c + (sign * distance)
  } else {
    a1 = -1
    b1 = Math.tan(ang2rad(angle))
    c1 = c + (sign * distance / Math.cos(ang2rad(angle)))
  }
  return { a1, b1, c1 }
}
/**
 * 求二元一次函数按法线方向移动 distance 后的新函数 { a, b }
 * distance 为负时代表向上移动
 * i.e. y = ax + b
 * @param {{number, number}} { a, b }
 * @param {number} distance
 * @returns {a, b} i.e. y = ax + b
 */
function normalMoveLine ({ a, b }, distance) {
  const angle = Math.atan(a)
  const distanceY = distance / Math.cos(angle)
  return { a, b: b + distanceY }
}

/**
 * 输入 二元一次函数斜率 angle
 * 输入 线上一个坐标点 p0
 * 输入 p0 想在法线上的移动距离
 * distance 为负时代表向上移动
 * 返回 对应的坐标点
 * @param {number} angle
 * @param {{number, number}} { x, y }
 * @param {number} [distance=10]
 */
function normalMovePoint (angle, { x, y }, distance = 10, bForward = true) {
  const sign = bForward ? 1 : -1
  const dx = distance * Math.cos(ang2rad(angle))
  const dy = distance * Math.sin(ang2rad(angle))

  const result = {
    x: fixed(x + dx * sign),
    y: fixed(y - dy * sign)
  }
  // console.log(`####normalMovePoint:(${x},${y}), alpha=${angle} bForward=${bForward}, dist=${distance}, dx=${dx}, dy=${dy}`)
  // console.log('normalMovePoint2 reslut: ', result)

  return result
}
/**
 *求两点的中点
 *输入一个坐标点 {x, y}
 *输入另一个坐标点{x, y}
 *输入取点在两坐标点之间的比例
 *返回新的中点坐标{x, y}
 * @param {{number, number}} { x: a1, y: b1 }
 * @param {{number, number}} { x: a2, y: b2 }
 * @param {number} 0.5
 * @returns {x, y}
 */
function centerPoint ({ x: a1, y: b1 }, { x: a2, y: b2 }, scale = 0.5) {
  return { x: Math.min(a1, a2) + (Math.abs(a1 - a2) * scale), y: Math.min(b1, b2) + (Math.abs(b1 - b2) * scale) }
}
/**
 *求两点的中点
 *输入一个坐标点 {x, y}
 *输入另一个坐标点{x, y}
 *输入取点在两坐标点之间的比例
 *返回新的中点坐标{x, y}
 * @param {{number, number}} { x: a1, y: b1 }
 * @param {{number, number}} { x: a2, y: b2 }
 * @param {number} 0.5
 * @returns {x, y}
 */
function splitPoint ({ x: a1, y: b1 }, { x: a2, y: b2 }, scale = 0.5) {
  return { x: a1 + ((a2 - a1) * scale), y: b1 + ((b2 - b1) * scale) }
}
/**
 * 求两条直线的交点
 * line1: y = a1 * x + b1
 * line2: y = a2 * x + b2
 * @param {{number, number}} { a1, b1 }
 * @param {{number, number}} { a2, b2 }
 * @returns { x, y } 交点直角坐标点
 */
function intersectionPoint ({ a1, b1 }, { a2, b2 }) {
  let x0 = Infinity
  const result = (a1 === a2)
    ? { x: Infinity, y: Infinity }
    : (x0 = (b1 - b2) / (a2 - a1), { x: x0, y: a1 * x0 + b1 })
  return result
}
/**
 *比较两点的倾斜度
 *返回boolean值
 * @param {*} { x: a1, y: b1 }
 * @param {*} { x: a2, y: b2 }
 * @returns
 */
function comparePoint ({ x: a1, y: b1 }, { x: a2, y: b2 }) {
  return Math.abs(a1 - a2) >= Math.abs(b1 - b2)
}
/**
 * 求两条直线的交点
 * line1: a1 * x + b1 * y + c1 = 0
 * line2: a2 * x + b2 * y + c2 = 0
 * @param {{number, number, number}} { a1, b1, c1 }
 * @param {{number, number, number}} { a2, b2, c2 }
 * @returns { x, y } 交点直角坐标点
 */
function intersectionPoint2 ({ a1, b1, c1 }, { a2, b2, c2 }) {
  const result = { x: Infinity, y: Infinity }
  if (a2 * b1 !== a1 * b2) {
    let x0
    let y0
    if (a1 !== 0) {
      y0 = (a1 * c2 - a2 * c1) / (a2 * b1 - a1 * b2)
      x0 = (-b1 * y0 - c1) / a1
    } else {
      y0 = -c1 / b1
      x0 = (b2 * c1) / (b1 * a2) - c2 / a2
    }
    result.x = x0 === 0 ? 0 : x0
    result.y = y0 === 0 ? 0 : y0
  }
  // console.log('intersectionPoint result:', result)
  return result
}

/**
 * 已经直线方程 ax + by + c = 0 及 其上一个点x0 {x, y}
 * 求直线上距离x0长度为d的点 （d > 0 时有两个点）
 * @param {{number, number, number}} { a, b, c }
 * line: a * x + b * y + c = 0
 * @param {{number, number}} { x, y }
 * @param {number} [distance=100]
 * @return [{ x, y }, { x, y }] (离原点近的点排在前面)
 */
function distancePoints ({ a, b, c }, { x, y }, d = 100) {
  const x1 = -(b * (Math.sqrt(b ** 2 * (d ** 2 - y ** 2) + c * ((-2 * b * y) - 2 * a * x) - 2 * a * b * x * y + a ** 2 * (d ** 2 - x ** 2) - c ** 2) + a * y) - b ** 2 * x + a * c) / (b ** 2 + a ** 2)
  const y1 = -((-a * Math.sqrt(b ** 2 * (d ** 2 - y ** 2) + c * ((-2 * b * y) - 2 * a * x) - 2 * a * b * x * y + a ** 2 * (d ** 2 - x ** 2) - c ** 2)) - a ** 2 * y + a * b * x + b * c) / (b ** 2 + a ** 2)
  const x2 = -(b * (a * y - Math.sqrt(b ** 2 * (d ** 2 - y ** 2) + c * ((-2 * b * y) - 2 * a * x) - 2 * a * b * x * y + a ** 2 * (d ** 2 - x ** 2) - c ** 2)) - b ** 2 * x + a * c) / (b ** 2 + a ** 2)
  const y2 = -(a * Math.sqrt(b ** 2 * (d ** 2 - y ** 2) + c * ((-2 * b * y) - 2 * a * x) - 2 * a * b * x * y + a ** 2 * (d ** 2 - x ** 2) - c ** 2) - a ** 2 * y + a * b * x + b * c) / (b ** 2 + a ** 2)
  const result = [{ x: parseFloat(x1), y: parseFloat(y1) }, { x: parseFloat(x2), y: parseFloat(y2) }].sort((a, b) => Math.abs(a.x) + Math.abs(a.y) - Math.abs(b.x) - Math.abs(b.y))
  return result
}

/**
 * 已知线段 p1p2
 * 求 N 等分的 n-1 个点
 * @param {{number, number}} { x, y }
 * @param {{number, number}} { x, y }
 * @returns {[{number, number}]}
 */
function segmentDividePoints ({ x: x1, y: y1 }, { x: x2, y: y2 }, n) {
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
  const alpha = Math.atan2((y2 - y1), (x2 - x1))
  const step = distance / n
  const arrN = Array.from(Array(n - 1))
  const result = arrN.reduce((p, v, i) => {
    const num = (i + 1)
    const len = num * step
    const xnum = fixed(x1 + len * Math.cos(alpha))
    const ynum = fixed(y1 + len * Math.sin(alpha))
    return [
      ...p,
      {
        x: xnum,
        y: ynum
      }
    ]
  }, [])
  return result
}

export {
  ang2rad,
  rad2ang,
  polar2rect,
  linePoints,
  lineSlopePoint,
  linescalePoint,
  lineAnglePoint,
  normalMoveLine,
  normalMovePoint,
  intersectionPoint2,
  centerPoint,
  splitPoint,
  distancePoints,
  segmentDividePoints,
  intersectionPoint,
  parallellines,
  pointLenth,
  pointSin,
  comparePoint,
  pointCos,
  pointOblique
}
