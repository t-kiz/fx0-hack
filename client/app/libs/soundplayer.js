function soundPlayer(){
  //create a source node from the buffer
  console.log("play");
  var src = ctx.createBufferSource();
  src.buffer = buf;

  //create fft
  fft = ctx.createAnalyser();
  fft.fftSize = samples;

  //connect them up into a chain
  src.connect(fft);
  fft.connect(ctx.destination);

  //play immediately
  src.start();
  setup2 = true;
}