var ctx;
var buf;
var fft;
var samples = 128;
var setup2 = false;
initWebSocket();
var test = 1000;
var filter;
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
    req.open("GET","music2.mp3",true);
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
    
    //create filter
    filter = ctx.createBiquadFilter();
    
    //connect them up into a chain
    src.connect(filter);
    src.connect(fft);
    filter.connect(ctx.destination);
    
    filter.type = "lowshelf";
    filter.frequency.value = 1000;
    filter.gain.value = 25;
    
    //play immediately
    src.start();
    setup2 = true;
}
function draw(){
  filter.frequency.value = test;
    test+=1;
    test%=2000;
  if(setup2){
    drewer();
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
