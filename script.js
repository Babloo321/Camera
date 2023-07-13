let gallery = document.querySelector(".gallery");
gallery.addEventListener("click", () => {
    location.assign("./gallery.html");
});

var uid = new ShortUniqueId();
let video = document.querySelector("video");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let transparentColor = "transparent";
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");

let recorder;
let chunks = [];
let constraints = {
    video: true,
    audio: true,
};

let shouldRecord = false;

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;

    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start", (e) => {
        //memory
        chunks = [];
        console.log("recording started");
    });

    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
        console.log("recording push in chunks array");
    });

    recorder.addEventListener("stop", () => {
        //convert video
        let blob = new Blob(chunks, {type: 'video/mp4'});
        console.log("recording stop");
        //download video on desktop
        let vidUrl = URL.createObjectURL(blob);
        console.log(vidUrl);

        // let a = document.createElement("a");
        // a.href = vidUrl;
        // a.download = "myVideo.mp4";
        // a.click();

            // store in dataBase
        if(db){
            let videoId = uid();
            let dbTransaction = db.transaction('video', "readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id: `vid-${videoId}`,
               blobData: blob,
            };
            let addRequest = videoStore.add(videoEntry);
            addRequest.onsuccess = () => {
                console.log("video added to db successfully");
            };
        }
    });
});

// click photo
captureBtnCont.addEventListener("click", () => {
    captureBtn.classList.add("scale-capture");
    let canvas = document.createElement("canvas");

    let tool = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // to draw image
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);
    //appley filter on photo
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageUrl = canvas.toDataURL();
    // let img = document.createElement("img");
    // img.src = imageUrl;
    // document.body.append(img);

    if(db){
        let imageId = uid();
        let dbTransaction = db.transaction('image', "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id: `img-${imageId}`,
            url: imageUrl,
        };
        let addRequest = imageStore.add(imageEntry);
        addRequest.onsuccess = () =>{
            console.log("image added to db successfully");
        }
    }
    setTimeout(() => {
        captureBtn.classList.remove('scale-capture');
    }, 550)
});

recordBtnCont.addEventListener("click", () => {
    shouldRecord = !shouldRecord;
    if(shouldRecord){
        recordBtn.classList.add("scale-record");
        // start recording
        recorder.start();
        // start timer
        startTimer();
    }else{
            recordBtn.classList.remove('scale-record');
        // stop recording
        recorder.stop();
        // stop timer
        stopTimer();
    }
});

let timer = document.querySelector(".timer");

let counter = 0;
let timerId;
function startTimer(){
    timer.style.display = 'block';
    function displayTimer(){
        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;

        let seconds = totalSeconds;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;
        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;
    }

   timerId = setInterval(displayTimer, 1000);
   counter = 0;
}

function stopTimer(){
    clearInterval(timerId);
    timer.innerText = "00:00:00";
    timer.style.display = 'none';
}

// add filters on camera
let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");

allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", () => {
        transparentColor = 
        getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;
    });
});