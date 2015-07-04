var deg = 0;
function drewer(){
  translate(windowWidth/2,windowHeight/2);
  rotate(deg);
  scale(0.5);
  deg+=0.05;
  noStroke();
  var data = new Uint8Array(samples);
  fft.getByteFrequencyData(data);
  blendMode(BLEND);
  background(0, 100, 30);
  blendMode(ADD);
  for (var i = 0; i< data.length; i++){
    rotate(10);
    var x = map(i, 0, data.length, 0, width);
    var h = - width/2 + map(data[i], 0, 255, width/2, 0);
    var c = color(data[i]*2.5, 60, 20, data[i]/50);
    fill(c);
    rect(width/2,i*10-30, h, 10);
    rect(width/2,30+height-(i*10), -h, 10);
  }
}