'use strict';

// const electron = require('electron');
let server='192.168.x.x';
let video;
function ajaxRequest(serverUrl, responseType, cbOnload, cbOnreadystatechange) {
    // $.ajax({
    //     url: serverUrl,
    //     type: 'get',
    //     async: true,
    //     processData: false,
    // })

    let authStr="Basic " + btoa("sy:shenyue");

    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', serverUrl, true);
    // httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.setRequestHeader('Authorization', authStr);
    if(responseType) {
        httpRequest.responseType = responseType;
    }
    
    if(typeof(cbOnreadystatechange)=='function') {
        httpRequest.onreadystatechange = () => {
            cbOnreadystatechange(httpRequest);
        };
    }
    if(typeof(cbOnload)=='function') {
        httpRequest.onload = () => {
            cbOnload(httpRequest);
        };
    }
    
    httpRequest.send();
}

function takeStaticImage() {
    let serverUrl='http://' + server + '/?action=snapshot';
    let cbOnload = (httpRequest) => {
        // console.log('onload. readyState:' + httpRequest.readyState
        //     + '  status:' + httpRequest.status
        //     + '  responseType:' + httpRequest.responseType
        // );
        var blob = httpRequest.response;
        loadImgStatic(blob);
    }

    ajaxRequest(serverUrl, 'blob', cbOnload, null);
}

let multipartContentLength=0;

let abortFlg=false;
function getLength() {
    return multipartContentLength;
}
function setLength(len) {
    multipartContentLength=len;
}
function calcLength(len) {
    return len - multipartContentLength;
}
let callCnt=0;
function incrCallCnt() {
    callCnt++;
    return callCnt;
}
let lastIndexOfBoundaryStr = 0;  // 
let boundaryStr='';
function takeMjpegStream() {
    let serverUrl='http://' + server + '/?action=stream';

    let cbOnreadystatechange = (httpRequest) => {
        if(abortFlg) { httpRequest.abort(); return; }
        // console.log('onreadystatechange. readyState:' + httpRequest.readyState
        //     + '  status:' + httpRequest.status
        //     + '  responseType:' + httpRequest.responseType
        // );
        // console.log('onreadystatechange. headers:' + httpRequest.getAllResponseHeaders());
        var blob = httpRequest.responseText;
        let cnt = incrCallCnt();
        console.log('onreadystatechange. callCnt:' + cnt + '  responseText.length:' + blob.length);
        if(boundaryStr=='') {
            let contentTypeStr = httpRequest.getResponseHeader('Content-type');
            console.log('onreadystatechange. header:' + contentTypeStr);
            let m = contentTypeStr.match(/boundary=(.*)/);
            if(m) {
                boundaryStr=m[1];
                console.log('found boundaryStr:' + boundaryStr);
            }
        }
        else {
            let lastIndex = blob.lastIndexOf('--' + boundaryStr);
            // console.log('lastIndex:' + lastIndex);
            if(lastIndex > lastIndexOfBoundaryStr) {
                console.log('got new frame from ' + lastIndexOfBoundaryStr + ' to ' + (lastIndex-1));
                lastIndexOfBoundaryStr=lastIndex;
                let frameStr=blob.substr(lastIndexOfBoundaryStr, lastIndex-1);
                console.log('frameStr: ' + frameStr);
                let beginIndexForJpeg = frameStr.indexOf('\r\n\r\n');
                if(beginIndexForJpeg>0) {
                    let jpegStr = frameStr.substr(beginIndexForJpeg+4);
                    console.log('got jpegStr: ' + jpegStr);
                }
                
            }
        }
        if(cnt<10) {

        }
        else {
            abortFlg=true;
        }
        
        let deltaLen=blob.length-getLength();
        console.log('onreadystatechange. deltaLen:' + deltaLen);
        // loadImgStatic(blob);
        setLength(blob.length);
        
        
    };
    

    ajaxRequest(serverUrl, "text", null, cbOnreadystatechange);
}

function loadImgStatic(blob) {
    // console.log('loadImgStatic. blob:' + blob);
    let lastLength = calcLength(blob.length);
    console.log('loadImgStatic. type:' + typeof(blob) + '  ' + lastLength + '  ' + blob.substr(lastLength));
    
    // let imgSrc = window.URL.createObjectURL(blob);
    // $('img').attr('src', imgSrc);
}

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

    // takeStaticImage();
    takeMjpegStream();
    // $('img').attr('src', "");
}

window.onload = initialize;
