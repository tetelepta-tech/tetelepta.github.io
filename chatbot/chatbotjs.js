// B. Ketentuan Menggunakan JS: Variables (let/const)
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Variabel untuk menyimpan pesan bot default jika input tidak dikenali
const defaultBotMessages = [
    "Saya siap merespons tentang **hobi**, **negara**, **perkenalan**, **tujuan saya**, atau **tanggal Natal**. Coba tanyakan salah satunya!",
    "Topik yang menarik! Tapi saya hanya diprogram untuk menjawab tentang **hobi**, **negara**, **perkenalan diri**, **fungsi saya**, dan **hari menuju Natal**."
];

// B. Ketentuan Menggunakan JS: Function
/**
 * Menampilkan pesan di kotak obrolan.
 * @param {string} message - Teks pesan.
 * @param {string} sender - 'user' atau 'bot'.
 */
function displayMessage(message, sender) {
    // B. Ketentuan Menggunakan JS: DOM manipulation
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender + '-message');
    messageElement.innerHTML = message;

    chatBox.appendChild(messageElement);
    // Gulir ke bawah agar pesan terbaru terlihat
    chatBox.scrollTop = chatBox.scrollHeight;
}

// B. Ketentuan Menggunakan JS: Function
/**
 * Logika inti untuk mendapatkan respons bot.
 * @param {string} userText - Input teks dari pengguna.
 * @returns {string} - Respons dari bot.
 */
function getBotResponse(userText) {
    // Normalisasi input
    const text = userText.toLowerCase().trim();

    // C. Ketentuan 5 Varian Jawaban (menggunakan if-else)

    // 1. Varian Jawaban: Memperkenalkan diri sendiri (chatbot)
    if (text.includes('siapa kamu') || text.includes('perkenalkan diri')) {
        return "Saya adalah Galaxy Bot AI, sebuah program kecerdasan buatan yang bertema galaksi gelap. Saya dirancang untuk berinteraksi dan memberikan informasi dasar.";
    } 
    // 2. Varian Jawaban: Apa gunanya dia (chatbot)
    else if (text.includes('guna') || text.includes('fungsi') || text.includes('tujuan')) {
        return "Fungsi utama saya adalah untuk mendemonstrasikan kapabilitas dasar pengembangan web menggunakan HTML, CSS, dan JavaScript, serta untuk menjawab pertanyaan spesifik Anda dengan cepat.";
    } 
    // 3. Varian Jawaban: Hobi
    else if (text.includes('hobi') || text.includes('suka') || text.includes('favorit')) {
        return "Hobi saya adalah memproses data, menjalankan algoritma kompleks, dan belajar bahasa pemrograman baru. Saya tidak pernah bosan!";
    }
    // 4. Varian Jawaban: Topik tentang negara
    else if (text.includes('negara') || text.includes('ibukota') || text.includes('populasi')) {
        return "Saya suka topik negara! Saya tahu Indonesia adalah negara kepulauan terbesar di dunia. Coba tanyakan fakta menarik tentang negara lain!";
    } 
    // 5. Varian Jawaban: Menghitung hari menuju Natal
    else if (text.includes('natal') || text.includes('25 desember') || text.includes('hari menuju')) {
        // Logika Perhitungan Hari
        const today = new Date();
        const year = today.getFullYear();
        // Set tanggal Natal (bulan 11 adalah Desember)
        let christmas = new Date(year, 11, 25); 

        // B. Ketentuan Menggunakan JS: if-else statements
        // Jika hari ini sudah lewat 25 Desember, hitung untuk tahun depan
        if (today.getMonth() === 11 && today.getDate() > 25) {
            christmas = new Date(year + 1, 11, 25);
        }

        const oneDay = 1000 * 60 * 60 * 24; // milidetik dalam sehari
        const diffTime = christmas.getTime() - today.getTime();
        const daysToChristmas = Math.ceil(diffTime / oneDay);
        
        return `Tinggal **${daysToChristmas}** hari lagi menuju Hari Natal (${christmas.toDateString()})! Selamat menanti.`;
    }
    
    // Jawaban Default (Jika tidak ada yang cocok)
    // B. Ketentuan Menggunakan JS: if-else statements
    else {
        // Pilih pesan default secara acak dari array
        const randomIndex = Math.floor(Math.random() * defaultBotMessages.length);
        return defaultBotMessages[randomIndex];
    }
}

// B. Ketentuan Menggunakan JS: Function
/**
 * Menangani pengiriman pesan.
 */
function handleSendMessage() {
    // B. Ketentuan Menggunakan JS: Variables (let/const)
    const userText = userInput.value;
    
    // Pastikan input tidak kosong
    if (userText === '') {
        return;
    }

    // Tampilkan pesan pengguna
    displayMessage(userText, 'user');

    // Kosongkan input
    userInput.value = '';

    // Dapatkan respons bot setelah jeda singkat untuk efek mengetik
    setTimeout(() => {
        const botResponse = getBotResponse(userText);
        displayMessage(botResponse, 'bot');
    }, 500); // Jeda 0.5 detik
}

// B. Ketentuan Menggunakan JS: Event listeners
// 1. Event Listener untuk Tombol Kirim
sendButton.addEventListener('click', handleSendMessage);

// 2. Event Listener untuk tombol 'Enter' pada input
userInput.addEventListener('keypress', (event) => {
    // B. Ketentuan Menggunakan JS: if-else statements
    if (event.key === 'Enter') {
        handleSendMessage();
    }
});