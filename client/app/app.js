
var analyser;
var addDeg;
var socket;
var init = false;
var filter;
var source,player,audioContext;
var deg;

/*=========
  FFT周り
=========*/
function createAnalyser(){
  console.log("createAnalyser");
  player = document.querySelector("audio");
  audioContext = new AudioContext();
  source = audioContext.createMediaElementSource(player);
  var an = audioContext.createAnalyser();
  source.connect(audioContext.destination);
  an.fftSize = 256;
  an.minDecibels = -140;
  an.maxDecibels = -10;
  source.connect(an);
  return an;
}
function getData(){
  //  var data = new Float32Array(analyser.frequencyBinCount);
  var data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  return data;
}


/*=========
  p5.js
=========*/

function setup(){
  cnv = createCanvas(windowWidth, windowHeight);
  analyser = createAnalyser();
  colorMode(HSL);
  initWebSocket();
  player.play();
  init = true;
}
function draw(){
  if(init){
    drewer();
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


/*=========
  websocket
=========*/

function initWebSocket() {
  socket = io('http://192.168.0.47:3000');
  socket.on("connect", function() {
    console.log("connect");
    var remain  = 5;
    var intervalId = setInterval(function() {
        socket.emit("Client::INITIALIZE_CONNECTION", { remain: --remain, time: Date.now() });
        if (remain === 0) { clearInterval(intervalId); }
    }, 20);
  });

  socket.on("Server::SYNCHRONIZE", function(msg) {
    console.log(msg);
    delay=msg.delay;
    positionNum=msg.index;
    connectNum=msg.clientCount;
    if(positionNum == 0){
      socket.emit("Server::SEND_PLAY_TIME", Date.now());
    }else{
      if(msg.spendTime){
        player.currentTime = msg.spendTime;
      }else{
        location.reload();
      }
    }
  });
}
