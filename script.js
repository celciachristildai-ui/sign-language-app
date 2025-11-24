/* ------------------------------
    MODEL URLS
------------------------------ */
const MODEL_URLS = {
    letters: "https://teachablemachine.withgoogle.com/models/s5nwlHSug/",
    words: "https://teachablemachine.withgoogle.com/models/EbOpeyL__/"
};

/* ------------------------------
    GLOBAL VARIABLES
------------------------------ */
let model, webcam, maxPredictions;
let currentMode = "letters";

/* ------------------------------
    LOAD MODEL FUNCTION
------------------------------ */
async function loadModel(mode) {
    try {
        const URL = MODEL_URLS[mode];
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        document.getElementById("output").innerText = "Loading Model...";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        document.getElementById("output").innerText = "Model Loaded ✔";

        startPredictionLoop();

    } catch (error) {
        console.error("Model loading failed:", error);
        document.getElementById("output").innerText = "Model load failed!";
    }
}

/* ------------------------------
    START WEBCAM
------------------------------ */
async function initWebcam() {
    webcam = new tmImage.Webcam(400, 400, true); // width, height, flip
    await webcam.setup();
    await webcam.play();

    document.getElementById("webcam").replaceWith(webcam.canvas);

    window.requestAnimationFrame(loop);

    console.log("Webcam started!");
}

/* ------------------------------
    MAIN PREDICTION LOOP
------------------------------ */
function loop() {
    webcam.update();
    window.requestAnimationFrame(loop);
}

/* ------------------------------
    CONTINUOUS PREDICTION
------------------------------ */
async function startPredictionLoop() {
    setInterval(async () => {
        if (!model) return;

        const prediction = await model.predict(webcam.canvas);

        let highest = prediction[0];
        for (let i = 1; i < prediction.length; i++) {
            if (prediction[i].probability > highest.probability) {
                highest = prediction[i];
            }
        }

        document.getElementById("output").innerText = highest.className;

    }, 150);
}

/* ------------------------------
    MODE CHANGE HANDLER
------------------------------ */
document.getElementById("modeSelect").addEventListener("change", function () {
    currentMode = this.value;
    loadModel(currentMode);
});

/* ------------------------------
    INITIAL APP START
------------------------------ */
(async function () {
    await initWebcam();
    loadModel(currentMode);
})();
