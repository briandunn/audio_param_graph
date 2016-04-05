import _ from 'lodash';

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
  param       = gainNode.gain;

  osc.connect(gainNode);
  gainNode.connect(audio.destination);
  osc.start(0);

  param.setValueAtTime(0, 0);
  segments.sortBy(s => s.t).map(s => s.toObject()).forEach(({method, v, t}) => {
    param[method](v, t * duration);
  });
  param.setValueAtTime(0, duration);

  audio.startRendering().then( buffer => {
    const samples = Array.from(buffer.getChannelData(0)),
          data    = _.chunk(samples, Math.floor(samples.length / width)).map((d,i) => {
                      return {t: i / width, v: _.max(d) };
                    });
    store.dispatch({ type: 'REPLACE_SAMPLES', data: data });
  });
}
