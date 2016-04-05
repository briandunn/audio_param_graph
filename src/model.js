import { Map, List } from 'immutable';

export default () => {
  return Map({
    points: List([]),
    width: 640,
    segments: List([
      Map({method: 'setValueAtTime', v: 1, t: 0}),
      Map({method: 'linearRampToValueAtTime', v: 0.01, t: 0.5}),
      Map({method: 'setValueAtTime', v: 0.01, t: 0.5}),
      Map({method: 'exponentialRampToValueAtTime', v: 1, t: 1})
    ])
  });
}
