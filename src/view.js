import React from 'react'
import takeSamples from './take_samples'
import {paramSignatures} from './model'

const ResultLine = ({points}) =>
  <polyline
    style={{fill:'none', stroke:'blue', strokeWidth: '0.5%'}}
    points={ points.map(({t,v}) => [t,1 - v].join(' ')).join(' ') }/>

const Circle = ({point}) =>
  <circle r="1%" cx={point.t} cy={1 - (point.v || 0)} style={{fill: 'red'}}/>

const Segment = ({segment, remove, change}) => {
  return (
    <li>
      <form onChange={ e => {
        let method = e.currentTarget.method.value
        change(
          _.merge(
            {method: method},
            paramSignatures[method]
            .map(label => ({[label]: +_.get(e.currentTarget, [label, 'value'], 0)}))
            .reduce(_.merge)
          )
        )}}>
        <button onClick={remove}>X</button>
        <label>method
          <select value={segment.method} name='method' onChange={ _ => {} }>
            {_.keys(paramSignatures).map(method => <option key={method}>{method}</option>)}
          </select>
        </label>
        {paramSignatures[segment.method].map( (label) =>
          <label key={label}>{label}
            <input type='range' name={label} min='0' max='1' step='0.01' value={segment[label]} onChange={ _ => {} }/>
          </label>)
        }
      </form>
    </li>
  )
}

export default ({model, store}) => {
  const addPoint = e => {
    const {left: l, top: t, height: h, width: w} = e.currentTarget.getClientRects()[0],
          {clientX: x, clientY: y} = e
    store.dispatch({type: 'ADD_SEGMENT', v: 1 - (y - t) / h , t: (x - l) / w})
    takeSamples(store)
  },
  removeSegment = i => {
    return (e) => {
      e.preventDefault()
      store.dispatch({type: 'REMOVE_SEGMENT', index: i})
      takeSamples(store)
    }
  },
  changeSegment = i => {
    return (e) => {
      store.dispatch(_.merge(e, {type: 'CHANGE_SEGMENT', index: i}))
      takeSamples(store)
    }
  }

  return (
    <article>
      <svg width={model.get('width')} onClick={addPoint} viewBox="0 0 1 1" style={{borderStyle: 'solid'}}>
        <g>
          <ResultLine points={model.get('points')}/>
          {model.get('segments').map( (s,i) => <Circle key={i} point={s.toJS()}/>)}
        </g>
      </svg>
      <ul style={{float: 'right'}} >
        {model.get('segments').map( (s,i) => <Segment
                                               key={i}
                                               segment={s.toJS()}
                                               remove={removeSegment(i)}
                                               change={changeSegment(i)} />)}
      </ul>
    </article>
  )
}
