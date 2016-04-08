import { Map, List, fromJS } from 'immutable'
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
    defaults: () => ({vs: _.times(30, Math.random), d: 1}),
    apply: (node, args, duration) =>
      node.setValueCurveAtTime(
        new Float32Array(args.vs),
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
  var segments = [
    {method: 'setValueAtTime', v: 2, t: 0},
    {method: 'linearRampToValueAtTime', v: 0.01, t: 0.5},
    {method: 'setValueAtTime', v: 0.01, t: 0.5},
    {method: 'exponentialRampToValueAtTime', v: 1, t: 1}
  ]

  if(location.hash)
    segments = JSON.parse(atob(location.hash.slice(1)))

  return Map({
    points: List([]),
    width: 640,
    segments: fromJS(segments)
  })
}
