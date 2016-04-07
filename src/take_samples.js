import _ from 'lodash'
import {applyParam} from './model'

export default (store) => {
  const state = store.getState(),
  width       = state.get('width'),
  segments    = state.get('segments'),
  scale       = width / 6,
  sampleRate  = 22050,
  duration    = (width * scale) / sampleRate,
  audio       = new OfflineAudioContext(1, width * scale, sampleRate),
  osc         = audio.createOscillator(),
  gainNode    = audio.createGain(),
  param       = gainNode.gain

  osc.connect(gainNode)
  gainNode.connect(audio.destination)
  osc.start(0);
  param.setValueAtTime(0, 0);
  segments
  .map(s => s.update('t', t => t * duration))
  .map(s => s.toJS())
  .sortBy(s => s.t)
  .forEach(segment => applyParam(param, segment))
  param.setValueAtTime(0, duration)

  audio.startRendering().then( buffer => {
    const samples = Array.from(buffer.getChannelData(0)),
          data    = _.chunk(samples, Math.floor(samples.length / width))
                       .map((d,i) => ({t: i / width, v: Math.max(_.max(d), 0)}))
    store.dispatch({ type: 'REPLACE_SAMPLES', data: data })
  });
}
