// ============================================
// KONFIGURASI AI (GEMINI API)
// ============================================
const API_KEY = "AIzaSyBfbwDqWq3UGV77uSMQab4dbEhi3hYOF78"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

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
 * Fungsi untuk meminta jawaban ke Google Gemini
 */
async function fetchGeminiResponse(userMessage) {
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
        
        // Ambil teks jawaban dari respon JSON
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "Maaf, saya sedang bingung. Bisa ulangi pertanyaanmu?";
        }

    } catch (error) {
        console.error("Error API:", error);
        return "⚠️ Terjadi kesalahan koneksi ke otak AI saya. Cek API Key atau internetmu.";
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