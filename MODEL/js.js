// =================================================================
// LOGIKA CHATBOT TEKS (Logic Bot)
// =================================================================

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

const defaultBotMessages = [
    "Saya siap merespons tentang **hobi**, **negara**, **perkenalan**, **tujuan saya**, atau **tanggal Natal**. Coba tanyakan salah satunya!",
    "Topik yang menarik! Tapi saya hanya diprogram untuk menjawab tentang 5 topik yang sudah saya sebutkan."
];

function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender + '-message');
    messageElement.innerHTML = message;

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(userText) {
    const text = userText.toLowerCase().trim();

    // 1. Memperkenalkan diri sendiri (chatbot)
    if (text.includes('siapa kamu') || text.includes('perkenalkan diri')) {
        return "Saya adalah **Galaxy Bot AI**, sebuah program kecerdasan buatan. Saya dirancang untuk berinteraksi dan membantu Anda dalam proyek web ini.";
    } 
    // 2. Apa gunanya dia (chatbot)
    else if (text.includes('guna') || text.includes('fungsi') || text.includes('tujuan')) {
        return "Fungsi utama saya adalah mendemonstrasikan pengembangan web (HTML/CSS/JS) dan memberikan respons teks berdasarkan kata kunci spesifik yang telah ditentukan.";
    } 
    // 3. Hobi
    else if (text.includes('hobi') || text.includes('suka') || text.includes('favorit')) {
        return "Hobi saya adalah memproses data dan belajar. Saya juga suka tema galaksi gelap!";
    }
    // 4. Topik tentang negara
    else if (text.includes('negara') || text.includes('ibukota') || text.includes('populasi')) {
        return "Saya tahu **Indonesia** adalah negara dengan populasi Muslim terbesar di dunia dan memiliki lebih dari 17.000 pulau. Menarik, bukan?";
    } 
    // 5. Menghitung hari menuju Natal
    else if (text.includes('natal') || text.includes('25 desember') || text.includes('hari menuju')) {
        const today = new Date();
        const year = today.getFullYear();
        let christmas = new Date(year, 11, 25); 

        if (today.getMonth() === 11 && today.getDate() > 25) {
            christmas = new Date(year + 1, 11, 25);
        }

        const oneDay = 1000 * 60 * 60 * 24; 
        const diffTime = christmas.getTime() - today.getTime();
        const daysToChristmas = Math.ceil(diffTime / oneDay);
        
        return `Tinggal **${daysToChristmas}** hari lagi menuju Hari Natal (${christmas.toDateString()})!`;
    }
    
    // Jawaban Default
    else {
        const randomIndex = Math.floor(Math.random() * defaultBotMessages.length);
        return defaultBotMessages[randomIndex];
    }
}

function handleSendMessage() {
    const userText = userInput.value;
    
    if (userText === '') {
        return;
    }

    displayMessage(userText, 'user');
    userInput.value = '';

    setTimeout(() => {
        const botResponse = getBotResponse(userText);
        displayMessage(botResponse, 'bot');
    }, 500); 
}

// Event Listeners untuk Logic Bot
sendButton.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSendMessage();
    }
});


// =================================================================
// LOGIKA CHATBOT WEBCAM (Teachable Machine)
// =================================================================

const URL = "./model/"; // Ganti jika folder model Anda berbeda
let model, webcam, maxPredictions;

const webcamElement = document.getElementById("webcam");
const predictionElement = document.getElementById("prediction");
const startButton = document.getElementById("start-webcam");

// Fungsi dipicu oleh tombol
async function init() {
    startButton.disabled = true;
    predictionElement.innerHTML = "Model dimuat... Harap tunggu.";

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        // Load the model
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        predictionElement.innerHTML = "Model berhasil dimuat. Memulai webcam...";
    } catch (error) {
        predictionElement.innerHTML = "Gagal memuat model. **Pastikan folder ./model sudah ada dan berisi file TM!**";
        console.error("Error loading model:", error);
        startButton.disabled = false;
        return;
    }

    // Start the webcam
    try {
        const flip = true; 
        webcam = new tmImage.Webcam(240, 240, flip); 
        await webcam.setup(); 
        await webcam.play();
        webcamElement.srcObject = webcam.webcam.srcObject; 

        predictionElement.innerHTML = "Webcam aktif. Menunggu prediksi...";
        
        // Mulai loop prediksi
        window.requestAnimationFrame(loop);
    } catch (error) {
        predictionElement.innerHTML = "Gagal memulai webcam. Pastikan izin kamera diberikan dan browser didukung (Chrome/Firefox).";
        console.error("Error starting webcam:", error);
        startButton.disabled = false;
    }
}

// Loop untuk prediksi
async function loop() {
    webcam.update(); 
    await predict();
    window.requestAnimationFrame(loop); 
}

// Fungsi Prediksi
async function predict() {
    const prediction = await model.predict(webcamElement);
    
    let topPrediction = prediction[0];
    
    for (let i = 1; i < maxPredictions; i++) {
        if (prediction[i].probability > topPrediction.probability) {
            topPrediction = prediction[i];
        }
    }

    const confidence = (topPrediction.probability * 100).toFixed(2); 

    predictionElement.innerHTML = 
        `**${topPrediction.className}** (${confidence}%)`;
}

<div>Teachable Machine Pose Model</div>
<button type="button" onclick="init()">Start</button>
<div><canvas id="canvas"></canvas></div>
<div id="label-container"></div>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@teachablemachine/pose@0.8/dist/teachablemachine-pose.min.js"></script>
<script type="text/javascript">
    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

    // the link to your model provided by Teachable Machine export panel
    const URL = "./my_model/";
    let model, webcam, ctx, labelContainer, maxPredictions;

    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // Note: the pose library adds a tmPose object to your window (window.tmPose)
        model = await tmPose.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const size = 200;
        const flip = true; // whether to flip the webcam
        webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append/get elements to the DOM
        const canvas = document.getElementById("canvas");
        canvas.width = size; canvas.height = size;
        ctx = canvas.getContext("2d");
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop(timestamp) {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    async function predict() {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element
        const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
        // Prediction 2: run input through teachable machine classification model
        const prediction = await model.predict(posenetOutput);

        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }

        // finally draw the poses
        drawPose(pose);
    }

    function drawPose(pose) {
        if (webcam.canvas) {
            ctx.drawImage(webcam.canvas, 0, 0);
            // draw the keypoints and skeleton
            if (pose) {
                const minPartConfidence = 0.5;
                tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
                tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
            }
        }
    }
</script>
