function preload() {
  sound = loadSound('music2.mp3');
  initWebSocket();
}

function setup(){
  cnv = createCanvas(windowWidth, windowHeight);
  sound.amp(0.05);
  sound.loop();
  fft = new p5.FFT();
  fft.smooth(0.2);
  colorMode(HSL);
}

function draw(){
  noStroke();
  var spectrum = fft.analyze();
  if(screen.mozOrientation != 'landscape'){
    blendMode(BLEND);
    background(200, 100, 50, 1);
    for (var i = 0; i< spectrum.length; i++){
      var x = map(i, 0, spectrum.length, 0, width);
      var h = - width + map(spectrum[i], 0, 255, width, 0);
      var c = color(255-spectrum[i]*2.5, 100, 80, spectrum[i]/200);
      fill(c);
      rect(width/2,x*3, h, 5 );
      rect(width/2,x*3, -h, 5 );
    }
  }else{
    blendMode(BLEND);
    background(100, 100, 50, 1);
    blendMode(ADD);
    for (var i = 0; i< spectrum.length; i++){
      var x = map(i, 0, spectrum.length, 0, width);
      var h = - height + map(spectrum[i], 0, 255, height, 0);
      var c = color(255-spectrum[i]*2.5, 100, 50, spectrum[i]/200);
      fill(c);
      rect(x*3, height, 5, h);
    }
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function initWebSocket() {
  socket = io('http://192.168.0.47:3000');
  var count = 0;
  var intervalId = setInterval(function() {
    socket.emit("Server::INITIALIZE_CONNECTION", Date.now());
    count++;
    if (count > 4) { clearInterval(intervalId); }
  }, 20);
}
