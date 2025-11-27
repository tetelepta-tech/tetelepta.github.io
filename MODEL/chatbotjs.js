// ============================================
// KONFIGURASI AI (GEMINI API)
// ============================================
const API_KEY = "AIzaSyDai5PhNUH65TR_oYftQnlKGAEOvi_9tlM"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// Instruksi agar AI punya kepribadian (Persona)
const SYSTEM_INSTRUCTION = `
Kamu adalah "Team 1 Bot", asisten virtual cerdas buatan mahasiswa Team 1.
Gunakan bahasa Indonesia yang santai, sopan, dan membantu.
Jika ditanya siapa pembuatmu, jawab dengan bangga bahwa kamu dibuat oleh Team 1.
Jawablah pertanyaan pengguna dengan ringkas tapi jelas.
`;

// ============================================
// ELEMEN DOM
// ============================================
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// ============================================
// FUNGSI UTAMA
// ============================================

/**
 * Fungsi: Mengirim pesan ke server Google Gemini (VERSI SAFE MODE)
 */
async function fetchGeminiResponse(userMessage) {
    // 1. Cek Ketersediaan API Key di Awal
    if (!API_KEY || API_KEY.length < 30 || API_KEY.includes("PASTE")) {
        console.error("API Key bermasalah:", API_KEY);
        return "⚠️ ERROR FATAL: API Key belum diisi atau formatnya salah di file chatbot.js!";
    }

    // 2. Gabungkan Text (Cara Paling Aman)
    const finalPrompt = SYSTEM_INSTRUCTION + "\n\nUser bertanya: " + userMessage;

    try {
        console.log("Sedang mengirim request ke Gemini..."); // Log untuk cek jalan/tidak

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: finalPrompt }]
                }]
            })
        });

        // 3. JIKA ERROR, TANGKAP PENYEBABNYA
        if (!response.ok) {
            const errorBody = await response.text(); // Kita baca pesan error asli dari Google
            console.error("DETAIL ERROR GOOGLE:", errorBody);

            // Cek jenis error umum
            if (errorBody.includes("API_KEY_INVALID")) {
                return "⛔ API KEY SALAH/MATI. Silakan buat key baru di aistudio.google.com";
            } else if (errorBody.includes("INVALID_ARGUMENT")) {
                return "⛔ FORMAT DATA SALAH. Cek console untuk detail.";
            } else {
                return "⚠️ Error dari Google: " + response.status + ". Cek Console (F12) untuk detailnya.";
            }
        }

        // 4. JIKA SUKSES
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "Maaf, bot tidak dapat menyusun kata-kata (Respon kosong).";
        }

    } catch (error) {
        console.error("KONEKSI GAGAL:", error);
        return "⚠️ Gagal terhubung ke internet atau API diblokir browser.";
    }
}

/**
 * Menampilkan pesan ke layar chat
 */
function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender + '-message');

   
    if (sender === 'bot' && typeof marked !== 'undefined') {
        messageElement.innerHTML = marked.parse(message);
    } else {
        messageElement.innerText = message;
    }

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll ke bawah
}

/**
 * Handle tombol kirim
 */
async function handleSendMessage() {
    const userText = userInput.value.trim();
    if (!userText) return;

    // 1. Tampilkan pesan user
    displayMessage(userText, 'user');
    userInput.value = '';

    // 2. Tampilkan indikator "Sedang mengetik..."
    const loadingId = "loading-" + Date.now();
    const loadingElement = document.createElement('div');
    loadingElement.classList.add('message', 'bot-message');
    loadingElement.id = loadingId;
    loadingElement.innerText = "Sedang mengetik...";
    chatBox.appendChild(loadingElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 3. Minta jawaban ke Gemini (Proses Async)
    const botResponse = await fetchGeminiResponse(userText);

    // 4. Hapus loading & Tampilkan jawaban
    document.getElementById(loadingId).remove();
    displayMessage(botResponse, 'bot');
}

// ============================================
// EVENT LISTENERS
// ============================================
sendButton.addEventListener('click', handleSendMessage);

userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleSendMessage();
    }
});