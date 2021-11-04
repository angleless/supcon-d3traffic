import test from 'ava'
import { 
  polar2rect,
  linePoints,
  lineSlopePoint,
  normalMoveLine,
  normalMovePoint,
  intersectionPoint2,
  segmentDividePoints,
  distancePoints,
  intersectionPoint
 } from './geometry'

import { 
  SVGCoord
 } from './utils'



 test('polar2rect 1:', t => {
  t.deepEqual(polar2rect({ x: 120, y: 240 }), { x: 120, y: 340})
 })
 test('polar2rect 2:', t => {
  t.deepEqual(polar2rect({ x: 120, y: 240 }, 90, 20), { x: 140, y: 240})
 })

 test('linePoints 1:', t => {
  t.deepEqual(linePoints({ x1: 1, y1: 8 }, { x2: 0.1, y2: 5.3 }), { a: 3, b: 5})
 })

 test('lineSlopePoint 1:', t => {
  t.deepEqual(lineSlopePoint(1, { x: 20, y: 10 }), { a: 1, b: -10 })
 })

 test('normalMoveLine 1:', t => {
  t.deepEqual(normalMoveLine({ a: 1, b: 5 }, Math.sqrt(2)), { a: 1, b: 7})
 })

 test('normalMovePoint 1:', t => {
  t.deepEqual(normalMovePoint(45, { x: 100, y: 100 }, 10 * Math.sqrt(2), true), { x: 110, y: 90 })
 })

 test('intersectionPoint 1:', t => {
  t.deepEqual(intersectionPoint({ a1: 1, b1: 5 }, { a2: 2, b2: 3 }), { x: 2, y: 7 })
 })

 test('intersectionPoint2 1:', t => {
  t.deepEqual(intersectionPoint2({ a1: -1, b1: 5, c1: 1 }, { a2: -1, b2: 3, c2: 1 }), { x: 1, y: 0 })
 })
 test('intersectionPoint2 2:', t => {
  t.deepEqual(intersectionPoint2({ a1: -1, b1: 0, c1: 5 }, { a2: 0, b2: -1, c2: 10 }), { x: 5, y: 10 })
 })

 test('SVGCoord 1', t => {
  const s1 = new SVGCoord({ x: 0, y: 0 }, { x: 150, y: 150 })
  t.deepEqual(s1.math2svg({ x: 150, y: 0 }), { x: 300, y: 150 })
  const s2 = new SVGCoord({ x: 0, y: 0 }, { x: 100, y: 100 })
  t.deepEqual(s2.math2svg({ x: 10, y: 10 }), { x: 110, y: 90 })
 })

 test('distancePoints 1', t => {
   t.deepEqual(distancePoints({ a: 0, b: 1, c: 0 }, { x: -50, y: 0 }, 10)[0], { x: -40, y: 0 })
   t.deepEqual(distancePoints({ a: 1, b: -1, c: 0 }, { x: 100, y: 100 }, 10 * Math.sqrt(2))[1], { x: 110, y: 110 })
 })

 test('segmentDividePoints 1', t => {
   t.deepEqual(segmentDividePoints({ x: -100, y: 0 }, { x: 100, y: 0 }, 5)[0], { x: -60, y: 0 })
   t.deepEqual(segmentDividePoints({ x: 10, y: 20 }, { x: 100, y: 200 }, 2)[0], { x: 55, y: 110 })
   t.deepEqual(segmentDividePoints({ x: 0, y: 20 }, { x: 0, y: 100 }, 8)[2], { x: 0, y: 50 })
 })