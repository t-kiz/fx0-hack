function drewer(){
  translate(windowWidth/2,windowHeight/2);
  rotate(deg);
  scale(0.5);
  noStroke();
  var data = getData();
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
  deg+=addDeg;
}
function touchStarted() {
  addDeg = 0.01 * (windowHeight/touchY);
  if(addDeg<0) addDeg = 0;
}
function touchMoved() {
  addDeg = 1 * (windowHeight/touchY);
  if(addDeg<0) addDeg = 0;
}

function touchEnded() {
  addDeg = 0;
}