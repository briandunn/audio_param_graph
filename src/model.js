import { Map, List } from 'immutable'
import _ from 'lodash'

const params = {
  cancelScheduledValues: {
    args: ['t'],
    defaults: _ => ({}),
    apply: (node, args) => node.cancelScheduledValues(args.t)
  },
  exponentialRampToValueAtTime: {
    args: ['v', 't'],
    defaults: _ => ({v: 1}),
    apply: (node, args) =>
      node.exponentialRampToValueAtTime(Math.max(args.v, Number.MIN_VALUE + Number.EPSILON), args.t)
  },
  linearRampToValueAtTime: {
    args: ['v', 't'],
    defaults: _ => ({v:  1}),
    apply: (node, args) => node.linearRampToValueAtTime(args.v, args.t)
  },
  setValueAtTime: {
    args: ['v', 't'],
    defaults: _ => ({v: 1}),
    apply: (node, args) => node.setValueAtTime(args.v, args.t)
  },
  setTargetAtTime: {
    args: ['v', 't', 'c'],
    defaults: _ => ({v: 1, c: 1}),
    apply: (node, args) =>
      node.setTargetAtTime(args.v, args.t, Math.max(args.c, Number.MIN_VALUE))
  },
  setValueCurveAtTime: {
    args: ['t', 'd'],
    defaults: () => ({vs: new Float32Array(_.times(30, Math.random)), d: 1}),
    apply: (node, args, duration) =>
      node.setValueCurveAtTime(
        args.vs,
        args.t,
        Math.max(args.d * duration - args.t , Number.MIN_VALUE)
      )
  }
}

export const paramSignatures = _.mapValues(params, 'args')

export const paramDefaults = _.mapValues(params, 'defaults')

export function applyParam(node,segment, duration) {
  params[segment.method].apply(node, segment, duration)
}

export default function model() {
  return Map({
    points: List([]),
    width: 640,
    segments: List([
      Map({method: 'setValueAtTime', v: 1, t: 0}),
      Map({method: 'linearRampToValueAtTime', v: 0.01, t: 0.5}),
      Map({method: 'setValueAtTime', v: 0.01, t: 0.5}),
      Map({method: 'exponentialRampToValueAtTime', v: 1, t: 1})
    ])
  })
}
