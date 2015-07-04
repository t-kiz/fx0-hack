
var analyser;
var addDeg;
var socket;
var delay;
var wetlevel;
var drylevel;
var feedback;
var init = false;
var filter;
var source,player,audioContext;
var deg=0;
var seekTime = 0;
var seekTiming = 0;

/*=========
  FFT周り
=========*/
function createAnalyser(){
  console.log("createAnalyser");
  player = document.querySelector("audio");
  audioContext = new AudioContext();
  source = audioContext.createMediaElementSource(player);
  var an = audioContext.createAnalyser();
  var effectNumber = 2;
  if(effectNumber == 1){
       //create filter
       filter = audioContext.createBiquadFilter();

       //connect them up into a chain
       source.connect(filter);
       filter.connect(audioContext.destination);

       filter.type = "lowshelf";
       filter.gain.value = 25;


  }
  else if(effectNumber == 2){
        delay = audioContext.createDelay();
        wetlevel = audioContext.createGain();
        drylevel = audioContext.createGain();
        feedback = audioContext.createGain();
        source.connect(delay);
        source.connect(drylevel);
        delay.connect(wetlevel);
        delay.connect(feedback);
        feedback.connect(delay);
        wetlevel.connect(audioContext.destination);
        drylevel.connect(audioContext.destination);
        delay.delayTime.value = 0.25;
        feedback.gain.value = 0.4;
        wetlevel.gain.value = 0.5;
        drylevel.gain.value = 0.5;
  }
  an.fftSize = 256;
  an.minDecibels = -140;
  an.maxDecibels = -10;
  source.connect(an);
  return an;
}
function getData(){
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
  console.log("曲のロード完了");
  colorMode(HSL);
  initWebSocket();
  init = true;
}
function draw(){
  console.log(player.currentTime);
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
    if(positionNum == 0 && msg.spendTime == null){
      console.log('Client::REQUEST_PLAY');
      socket.emit("Client::REQUEST_PLAY", Date.now());
      player.play(0);
    }else{
      if(msg.spendTime){
        player.play(msg.spendTime/1000);
        player.volume = 0;
        setTimeout(function(time){
          player.currentTime = time/1000+4.5;
          player.volume = 1;
          console.log('時間セット2');
        }, 5000,msg.spendTime);
        console.log('時間セット');
      }else{
        location.reload();
      }
    }
  });
}
