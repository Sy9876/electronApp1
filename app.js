'use strict';

// const electron = require('electron');
let server=myConfig.server;
let authUser = myConfig.authUser;
let authPwd = myConfig.authPwd;

let video;
function ajaxRequest(serverUrl, responseType, cbOnload, cbOnreadystatechange) {
    // $.ajax({
    //     url: serverUrl,
    //     type: 'get',
    //     async: true,
    //     processData: false,
    // })

    let authStr="Basic " + btoa(authUser + ":" + authPwd);

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


function processHttpAuth(cb) {
    var httpRequest = new XMLHttpRequest();
    let serverUrl = 'http://' + server + '/java.html';

    /* open方法中设置认证信息，能够作用与之后的其它请求，不止ajax，还包括img iframe的src触发的浏览器请求 */
    httpRequest.open('GET', serverUrl, true, authUser, authPwd);
    
    /* 通过http header传递认证信息，不能生效于之后的其它请求。 */
    // let authStr="Basic " + btoa(authUser + ":" + authPwd);
    // httpRequest.open('GET', serverUrl, true);
    // httpRequest.setRequestHeader('Authorization', authStr);
    
    httpRequest.responseType = 'text';
    
    httpRequest.onload = () => {
        if(httpRequest.status==200) {
            console.log('processHttpAuth success');
            if(typeof(cb)=='function') {
                cb();
            }
        }
        else if(httpRequest.status==401) {
            console.log('processHttpAuth failed. user password wrong.');
        }
        else {
            console.log('processHttpAuth failed. responseText: ' + httpRequest.responseText);
        }
    };

    httpRequest.onerror = () => {
        console.log('processHttpAuth onerror. failed.');
    };
    
    httpRequest.send();
}

function takeStaticImage2() {
    let serverUrl='http://' + server + '/?action=snapshot';
    console.log('takeStaticImage2 serverUrl: ' + serverUrl);
    $('img').attr('src', serverUrl);
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
function loadImgStatic(blob) {
    // console.log('loadImgStatic. blob:' + blob);
    let imgSrc = window.URL.createObjectURL(blob);
    $('img').attr('src', imgSrc);
}


/**/
function takeMjpegStream() {
    let serverUrl='http://' + server + '/?action=stream';
    console.log('takeMjpegStream. set iframe:' + serverUrl);
    $('iframe').attr('src', serverUrl);
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


    // http auth
    processHttpAuth(() => {
        // takeStaticImage();
        takeMjpegStream();
        // $('img').attr('src', "");
    });

}

window.onload = initialize;
