'use strict';

// const electron = require('electron');
let video;

function initialize () {
    video = window.document.querySelector('video');
    let errorCallback = (error) => {
        console.log(`error cam: ${error.message}`);
    }

    window.navigator.webkitGetUserMedia({video: true}, (localMediaStream) => {
        // video.src = window.URL.createObjectURL(localMediaStream);
        // console.log("111111 " + typeof(localMediaStream));
        // console.log("video.srcObject: ", video.srcObject);
        // for(let p in video) {
        //     console.log("   " + p + ": " + video[p]);
        // }
        video.srcObject = localMediaStream;
    }, errorCallback);

    $('img').attr('src', "");
}

window.onload = initialize;
