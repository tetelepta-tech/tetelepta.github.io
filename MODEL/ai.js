// ==========================================
// FILE: ai.js
// FUNGSI: Mengelola Webcam dan Logika AI Teachable Machine
// ==========================================

const URL = "./"; 

let model, webcam, ctx, labelContainer, maxPredictions;

/**
 * Fungsi ini dipanggil saat tombol "Mulai AI" diklik di HTML
 */
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // 1. Load Model Teachable Machine
    try {
        model = await tmPose.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    } catch (error) {
        alert("Gagal memuat model. Pastikan file model.json & metadata.json ada di folder yang sama!");
        console.error(error);
        return;
    }

    // 2. Setup Webcam
    const size = 200; 
    const flip = true; 
    webcam = new tmPose.Webcam(size, size, flip); 
    await webcam.setup(); 
    await webcam.play(); 
    
    // Mulai animasi looping
    window.requestAnimationFrame(loop);

    // 3. Setup Canvas (Tempat gambar kamera & garis tulang muncul)
    const canvas = document.getElementById("canvas");
    canvas.width = size; canvas.height = size;
    ctx = canvas.getContext("2d");
    
    // 4. Setup Label (Tempat tulisan hasil prediksi muncul)
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = ""; 
    
    // Buat div kosong untuk setiap kelas prediksi
    for (let i = 0; i < maxPredictions; i++) { 
        labelContainer.appendChild(document.createElement("div"));
    }
}

/**
 * Fungsi looping untuk mengupdate frame kamera terus menerus
 */
async function loop(timestamp) {
    webcam.update(); 
    await predict(); 
    window.requestAnimationFrame(loop); 
}

/**
 * Fungsi untuk memprediksi pose tubuh
 */
async function predict() {
    // Estimasi posisi tubuh (Pose Estimation)
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    
    // Prediksi gerakan/kelas (Classification)
    const prediction = await model.predict(posenetOutput);

    // Tampilkan hasil prediksi dalam bentuk teks
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    drawPose(pose);
}

/**
 * Fungsi untuk menggambar titik sendi dan garis tulang
 */
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
