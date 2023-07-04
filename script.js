let video = document.querySelector("video");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture");
let recordBtnCont = document.getElementsByClassName("record-btn-cont");
let recordBtn = document.getElementsByClassName("record-btn");
let transparentColor = "transparent";
let recorder;
let shouldRecord = false;
let chunks = [];
let constraints={
    video: true,
    // audio: true
}
navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream;
    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start", () => {
        chunks = [];
    })

    recorder.addEventListener("dataavailable", (e)=>{
        chunks.push(e.data);
    })
    recorder.addEventListener("stop", () => {

    })
});

// click photo
captureBtnCont.addEventListener("click", () => {
    let canvas = document.createElement("canvas");
    let tool = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // to draw image
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);
    //filtering the image
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageUrl = canvas.toDataURL("image/jpeg");
    let img = document.createElement("img");
    img.src = imageUrl;
    document.body.append(img);
});

recordBtnCont.addEventListener("click", () => {
    shouldRecord = !shouldRecord;
    if(shouldRecord){
        // start recording
        recorder.start();
        // start timer
        startTimer();
    }else{
        // stop recording
        recorder.stop();
        // stop timer
        stopTimer();
    }
})