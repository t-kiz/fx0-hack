function drewer(){
  noStroke();
  var data = new Uint8Array(samples);
  fft.getByteFrequencyData(data);
  blendMode(BLEND);
  background(0, 100, 30);
  blendMode(ADD);
  for (var i = 0; i< data.length; i++){
    var x = map(i, 0, data.length, 0, width);
    var h = - width/2 + map(data[i], 0, 255, width/2, 0);
    var c = color(data[i]*2.5, 60, 40, 1);
    fill(c);
    rect(width/2,i*10, h, 10);
    rect(width/2,height-(i*10), -h, 10);
  }
}