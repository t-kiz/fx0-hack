var ctx;
var buf;
var fft;
var samples = 128;
var setup2 = false;
initWebSocket();

function setup(){
  cnv = createCanvas(windowWidth, windowHeight);
  console.log("setup");
  colorMode(HSL);
  init();
}
function init() {
  console.log("initing");
    try {
        ctx = new AudioContext();
        loadFile();
    } catch(e) {
        alert('you need webaudio support' + e);
    }
}
//load the mp3 file
function loadFile() {
    console.log("loadFile");
    var req = new XMLHttpRequest();
    req.open("GET","music.mp3",true);
    //we can't use jquery because we need the arraybuffer type
    req.responseType = "arraybuffer";
    req.onload = function() {
        //decode the loaded data
        ctx.decodeAudioData(req.response, function(buffer) {
            buf = buffer;
            play();
        });
    };
    req.send();
}
function play() {
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
function draw(){
  if(setup2){
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
