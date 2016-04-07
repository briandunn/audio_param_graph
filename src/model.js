import { Map, List } from 'immutable';

const params = {
  cancelScheduledValues: {
    args: ['t'],
    fn: (node, args) => node.cancelScheduledValues(args.t)
  },
  exponentialRampToValueAtTime: {
    args: ['v', 't'],
    fn: (node, args) =>
      node.exponentialRampToValueAtTime(Math.max(args.v, Number.MIN_VALUE + Number.EPSILON), args.t)
  },
  linearRampToValueAtTime: {
    args: ['v', 't'],
    fn: (node, args) => node.linearRampToValueAtTime(args.v, args.t)
  },
  setValueAtTime: {
    args: ['v', 't'],
    fn: (node, args) => node.setValueAtTime(args.v, args.t)
  },
  setTargetAtTime: {
    args: ['v', 't', 'c'],
    fn: (node, args) =>
      node.setTargetAtTime(args.v, args.t, Math.max(args.c || 0, Number.MIN_VALUE))
  }
}

export const paramSignatures = _.mapValues(params, 'args')

export function applyParam(node,segment) {
  params[segment.method].fn(node, segment)
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
