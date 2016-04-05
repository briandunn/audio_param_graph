import React from 'react';
import takeSamples from './take_samples';

const ResultLine = ({points}) => {
  return (
    <polyline
      style={{fill:'none', stroke:'blue', strokeWidth: '0.5%'}}
      points={ points.map(({t,v}) => [t,1 - v].join(' ')).join(' ') }/>
  );
}

const Circle = ({point}) => {
  return (
    <circle r="1%" cx={point.t} cy={1 - point.v} style={{fill: 'red'}}/>
  );
}

const Segment = ({segment: {method, t, v}, remove, change}) =>
  <li>
    <button onClick={remove}>X</button>
    <label>method
      <select value={method} name='method' onChange={change}>
        <option>cancelScheduledValues</option>
        <option>exponentialRampToValueAtTime</option>
        <option>linearRampToValueAtTime</option>
        <option>setValueAtTime</option>
      </select>
    </label>
    <label>t
      <input type='range' name='t' min='0' max='1' step='0.01' value={t} onChange={change} />
    </label>
    <label>v
      <input type='range' name='v' min='0' max='1' step='0.01' value={v} onChange={change} />
    </label>
  </li>

export default ({model, store}) => {
  const addPoint = e => {
    const {left: l, top: t, height: h, width: w} = e.currentTarget.getClientRects()[0],
          {clientX: x, clientY: y} = e;
    store.dispatch({type: 'ADD_SEGMENT', v: 1 - (y - t) / h , t: (x - l) / w});
    takeSamples(store);
  },
  removeSegment = i => {
    return (e) => {
      e.preventDefault();
      store.dispatch({type: 'REMOVE_SEGMENT', index: i});
      takeSamples(store);
    }
  },
  changeSegment = i => {
    return (e) => {
      store.dispatch({type: 'CHANGE_SEGMENT', index: i, k: e.target.name, v: e.target.value});
      takeSamples(store);
    }
  };

  return (
    <article>
      <svg width={model.get('width')} onClick={addPoint} viewBox="0 0 1 1" style={{borderStyle: 'solid'}}>
        <g>
          <ResultLine points={model.get('points')}/>
        </g>
        {model.get('segments').map( (s,i) => <Circle key={i} point={s.toObject()}/>)}
      </svg>
      <form style={{float: 'right'}}>
        <ul>
          {model.get('segments').map( (s,i) => <Segment
                                                 key={i}
                                                 segment={s.toObject()}
                                                 remove={removeSegment(i)}
                                                 change={changeSegment(i)} />)}
        </ul>
      </form>
    </article>
  );
}
