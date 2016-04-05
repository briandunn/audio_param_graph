window.Params = {
  init: function(canvas) {
    var draw      = canvas.getContext('2d'),
        audio     = new AudioContext(),
        startTime = audio.currentTime,
        osc       = audio.createOscillator(),
        analyser  = audio.createAnalyser(),
        data      = new Float32Array(analyser.frequencyBinCount),
        gainNode  = audio.createGain();
        duration  = 3,
        param     = gainNode.gain;

    osc.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(audio.destination);
    osc.start();

    param.setValueAtTime(1, audio.currentTime);

    param.linearRampToValueAtTime(0.01, audio.currentTime + duration / 2);
    param.setValueAtTime(0.01, audio.currentTime + duration / 2);
    param.exponentialRampToValueAtTime(1, audio.currentTime + duration);

    var toCoords = function(e) {
      var canvasRect = canvas.getClientRects()[0];
      return {
        s: ((e.x - canvasRect.left) / canvasRect.width) * duration,
        v: ((e.y - canvasRect.top) / canvasRect.height)
      };
    };

    canvas.onmousemove = function(e) {
      var coords = toCoords(e);
      s.innerText = coords.s;
      v.innerText = coords.v;
    };

    canvas.onclick = function(e) {
      toCoords(e)
    };

    draw.strokeStyle = 'red';
    draw.textBaseline = 'bottom';
    draw.strokeText('0s',0,1 * canvas.height);
    draw.textAlign = 'end';
    draw.strokeText(duration + 's', canvas.width, 1 * canvas.height);
    draw.text
    draw.strokeStyle = 'black';
    draw.moveTo(0, param.value * canvas.height);
    draw.beginPath();

    var loop = function(){
      analyser.getFloatTimeDomainData(data);
      draw.lineTo(
        ((audio.currentTime - startTime) / duration) * canvas.width,
        (1 - Math.max.apply(null,data)) * canvas.height
      );
      draw.stroke();
      if(audio.currentTime > startTime + duration)
        osc.stop();
      else
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
};
