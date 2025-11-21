const video = document.getElementById("webcam");
const output = document.getElementById("output");

// 1. Turn on webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  });

// 2. Load a simple hand pose model
async function loadModel() {
  const model = await handPoseDetection.createDetector(
    handPoseDetection.SupportedModels.MediaPipeHands,
    { runtime: "tfjs" }
  );
  return model;
}

async function start() {
  const model = await loadModel();

  async function detect() {
    const hands = await model.estimateHands(video);

    if (hands.length > 0) {
      output.innerText = "Hand Detected 👋";
    } else {
      output.innerText = "No Hand";
    }

    requestAnimationFrame(detect);
  }

  detect();
}

start();