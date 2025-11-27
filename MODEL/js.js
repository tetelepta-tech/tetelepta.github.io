const API_KEY = "PASTE_API_KEY_DISINI"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');


const SYSTEM_INSTRUCTION = `
PERAN:
Kamu adalah "HealthBot", asisten informasi kesehatan virtual. 
Tugasmu adalah memberikan edukasi kesehatan, tips hidup sehat, dan panduan awal, TAPI kamu bukan dokter.

SCOPE (YANG BISA KAMU LAKUKAN):
1. Berikan tips hidup sehat (nutrisi, olahraga, tidur).
2. Pandu user melakukan self-assessment gejala ringan (misal: "Apakah demamnya sudah 3 hari?").
3. Berikan informasi umum tentang vaksinasi dan pencegahan penyakit (seperti COVID-19).
4. Jika ditanya statistik COVID atau lokasi RS, berikan jawaban umum atau data simulasi (karena kamu tidak terhubung internet real-time).

LIMITATION (YANG DILARANG KERAS):
1. JANGAN PERNAH mendiagnosis penyakit. Gunakan kalimat: "Kemungkinan ini gejala...", "Bisa jadi...", "Sebaiknya periksa ke dokter."
2. JANGAN PERNAH meresepkan obat (antibiotik, obat keras, dll). Hanya boleh sarankan obat bebas (OTC) seperti paracetamol atau istirahat/minum air.
3. JANGAN menangani kondisi darurat.

PROSEDUR DARURAT:
Jika pengguna menyebutkan kata kunci bahaya seperti: "sesak nafas", "nyeri dada hebat", "pingsan", "muntah darah", "kecelakaan", atau "ingin bunuh diri":
1. JANGAN berikan tips kesehatan.
2. LANGSUNG suruh mereka menghubungi 119 atau segera ke IGD terdekat.
3. Gunakan nada tegas dan mendesak.

Gaya Bicara: Empatik, Tenang, dan Terpercaya. Gunakan Bahasa Indonesia.
`;


async function fetchGeminiResponse(userMessage) {

    if (API_KEY === "PASTE_API_KEY_DISINI" || API_KEY === "") {
        return "⚠️ Error: API Key belum dimasukkan di file js.js!";
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: SYSTEM_INSTRUCTION }, 
                            { text: userMessage }        
                        ]
                    }
                ]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "Maaf, saya tidak mengerti. Coba tanya yang lain.";
        }

    } catch (error) {
        console.error("Error Gemini:", error);
        return "⚠️ Gagal terhubung ke AI. Cek koneksi internet atau API Key kamu.";
    }
}

function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender + '-message');
    
    messageElement.innerText = message; 

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function handleSendMessage() {
    const userText = userInput.value.toLowerCase();
    if (userText.trim() === '') return;

    // 1. Tampilkan pesan user
    displayMessage(userText, 'user');
    userInput.value = '';

    const bahayaKeywords = ['bunuh diri', 'mati', 'sesak nafas', 'jantung berhenti', 'pendarahan hebat', 'tidak sadar', 'pingsan'];
    
    // Cek apakah ada kata bahaya di pesan user
    const isEmergency = bahayaKeywords.some(keyword => userText.includes(keyword));

    if (isEmergency) {
        setTimeout(() => {
            const emergencyMessage = `
            🚨 **PERINGATAN DARURAT** 🚨<br><br>
            Maaf, saya mendeteksi kondisi gawat darurat yang tidak bisa saya tangani.<br>
            Mohon **SEGERA hubungi 119** atau langsung pergi ke **IGD Rumah Sakit terdekat**.<br><br>
            Jangan menunggu balasan chat ini demi keselamatan jiwa.
            `;
            displayMessage(emergencyMessage, 'bot');
        }, 500);
        return;
    }

    // 2. Tampilkan indikator loading
    const loadingId = "loading-" + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'bot-message');
    loadingDiv.id = loadingId;
    loadingDiv.innerText = "Sedang mengetik...";
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 3. Minta jawaban ke Gemini
    const botResponse = await fetchGeminiResponse(userText);

    document.getElementById(loadingId).remove();
    displayMessage(botResponse, 'bot');
}

// Event Listeners Chatbot
if(sendButton && userInput) {
    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') handleSendMessage();
    });
}



const URL_MODEL = "./"; 

let model, webcam, ctx, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL_MODEL + "model.json";
    const metadataURL = URL_MODEL + "metadata.json";

    try {
        model = await tmPose.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    } catch (error) {
        alert("Error: File model.json tidak ditemukan! Pastikan file ada di folder yang sama.");
        return;
    }

    const size = 200;
    const flip = true; 
    webcam = new tmPose.Webcam(size, size, flip); 
    await webcam.setup(); 
    await webcam.play();
    window.requestAnimationFrame(loop);

    const canvas = document.getElementById("canvas");
    canvas.width = size; canvas.height = size;
    ctx = canvas.getContext("2d");
    labelContainer = document.getElementById("label-container");
    
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) { 
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop(timestamp) {
    webcam.update(); 
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    const prediction = await model.predict(posenetOutput);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(0) + "%";
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    drawPose(pose);
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}