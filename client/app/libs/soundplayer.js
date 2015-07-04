function soundPlayer() {
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
    
    console.log(deg)
    filter.gain.value = 25;
    
    //play immediately
    src.start();
    setup2 = true;
}