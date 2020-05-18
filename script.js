//sdp handshake

// const tomaz = new RTCPeerConnection();
// const yuliya = new RTCPeerConnection();

// yuliya.createOffer()
//     .then((offer) => yuliya.setLocalDescription(new RTCSessionDescription(offer)))
//     .then(() => tomaz.setRemoteDescription(yuliya.localDescription))
//     .then(() => tomaz.createAnswer())
//     .then((answer) => tomaz.setLocalDescription(new RTCSessionDescription(answer)))
//     .then(() => yuliya.setRemoteDescription(tomaz.localDescription));

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

const startBtn = document.getElementById('startBtn');
const callBtn = document.getElementById('callBtn');
// const stopBtn = document.getElementById('stoptBtn');
startBtn.addEventListener('click', start);
callBtn.addEventListener('click', call);

let startTime;
let localStream;
let yuliya;
let tomaz;
const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
}


async function start() {
    // return the repr of my webcam
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = stream;
        localStream = stream;
    } catch (e) {
        alert(`getUserMedia() error: ${e.name}`);
    }
}

async function call() {
    // ????????
    startTime = window.performance.now;
    const videoTracks = localStream.getVideoTracks();
    const audioTracks = localStream.getAudioTracks();

    tomaz = new RTCPeerConnection();
    yuliya = new RTCPeerConnection();
    // listen for ICE candidates
    yuliya.addEventListener('icecandidate', ({ candidate }) => tomaz.addIceCandidate(candidate));
    tomaz.addEventListener('icecandidate', ({ candidate }) => yuliya.addIceCandidate(candidate));

    localStream.getTracks().forEach((track) => yuliya.addTrack(track, localStream));

    tomaz.addEventListener('track', ({ streams: [stream] }) => {
        remoteVideo.srcObject = stream;
    });

    const offer = await yuliya.createOffer(offerOptions);

    await yuliya.setLocalDescription(offer);
    await tomaz.setRemoteDescription(offer);

    const answer = await tomaz.createAnswer();

    await yuliya.setRemoteDescription(answer);
    await tomaz.setLocalDescription(answer);

}




start();