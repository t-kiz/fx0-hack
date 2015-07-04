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
    drewer();
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function initWebSocket() {
  socket = io('http://192.168.0.47:3000');
  var remain  = 5;
  var intervalId = setInterval(function() {
    socket.emit("Client::INITIALIZE_CONNECTION", { remain: --remain, time: Date.now() });
    if (remain === 0) { clearInterval(intervalId); }
  }, 20);

  socket.on("Server::SYNCHRONIZE", function(msg) {
    // { delay: -407.8, index: 3, clientCount: 4 }
    // index: zero based numbering
    console.log(msg);
  });
}
