// Global state
let mediaRecorder;
const recordedChunks = [];

// Elements
const videoElement = document.querySelector('video');

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');

// Start recording
startBtn.onclick = () => {
  if (!mediaRecorder || mediaRecorder.state === 'recording') return;

  mediaRecorder.start();
  startBtn.classList.add('is-danger');
  startBtn.innerText = 'Recording';
};

stopBtn.onclick = () => {
  if (!mediaRecorder || mediaRecorder.state !== 'recording') return;

  mediaRecorder.stop();
  startBtn.classList.remove('is-danger');
  startBtn.innerText = 'Start';
};

// Select video source
videoSelectBtn.onclick = getVideoSources;

// Get available screens / windows
async function getVideoSources() {
  const inputSources = await window.electronAPI.getSources();

  // Ask main process to show menu
  const source = await window.electronAPI.showSourceMenu(
  inputSources.map(source => ({
    id: source.id,
    name: source.name
  }))
);


  if (source) {
    console.log('Selected source:', source);
    selectSource(source);
  }

}

// Change the video source to record
async function selectSource(source) {
  videoSelectBtn.innerText = source.name;

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id
      }
    }
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  // Preview
  videoElement.srcObject = stream;
  await videoElement.play();

  // MediaRecorder
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm; codecs=vp9'
  });

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;
}

// Capture chunks
function handleDataAvailable(e) {
  if (e.data.size > 0) {
    recordedChunks.push(e.data);
  }
}

async function handleStop() {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm; codecs=vp9'
  });

  const arrayBuffer = await blob.arrayBuffer();
  recordedChunks.length = 0;

  await window.electronAPI.saveVideo(arrayBuffer);
}

