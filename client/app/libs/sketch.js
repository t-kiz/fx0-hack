function preload() {
  sound = loadSound('music.mp3');
}

function setup(){
  cnv = createCanvas(500,500);
  //sound.setVolume(0.01);
  sound.amp(0);
  sound.loop();
  fft = new p5.FFT();
}

function draw(){
  background(0);

  var spectrum = fft.analyze();
  noStroke();
  fill(0,255,0); // spectrum is green
  for (var i = 0; i< spectrum.length; i++){
    var x = map(i, 0, spectrum.length, 0, width);
    var h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length*10, h );
  }

  var waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(255,0,0); // waveform is red
  strokeWeight(1);
  for (var i = 0; i< waveform.length; i++){
    var x = map(i, 0, waveform.length, 0, width);
    var y = map( waveform[i], -1, 1, 0, height);
    vertex(x,y);
  }
  endShape();

  isMouseOverCanvas();
}

// fade sound if mouse is over canvas
function isMouseOverCanvas() {
  sound.amp(0.01);
}