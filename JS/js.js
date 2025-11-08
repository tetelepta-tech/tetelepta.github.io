document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================
    // 1. FUNGSI TEMA DINAMIS (DARK/LIGHT MODE DENGAN LOCAL STORAGE)
    // ==========================================================
    const themeBody = document.getElementById('theme-body');
    const themeToggle = document.getElementById('theme-toggle');
    
    function setTheme(mode) {
        if (mode === 'light') {
            themeBody.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = 'Dark Mode';
        } else {
            themeBody.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = 'Light Mode';
        }
    }

    // A. MODE PERSISTENCE (Memuat tema yang tersimpan)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('dark'); // Default
    }

    // B. MENDENGARKAN KLIK TOMBOL
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (themeBody.classList.contains('light-theme')) {
                setTheme('dark');
            } else {
                setTheme('light');
            }
        });
    }

    // ==========================================================
    // 2. FUNGSI SAPAAN DINAMIS (Waktu Nyata)
    // ==========================================================
    const greetingElement = document.getElementById('greeting');
    const hour = new Date().getHours(); 
    let greetingText = '';

    if (hour >= 5 && hour < 12) {
        greetingText = '🌄 Good Morning!';
    } else if (hour >= 12 && hour < 17) {
        greetingText = '☀️ Good Afternoon!';
    } else if (hour >= 17 && hour < 21) {
        greetingText = '🌆 Good Evening!';
    } else {
        greetingText = '🌃 Good Night!';
    }

    if (greetingElement) {
        greetingElement.textContent = greetingText;
    }

    // ==========================================================
    // 3. FUNGSI TOGGLE DETAIL HOBI
    // ==========================================================
    const toggleButton = document.getElementById('toggleHobbyBtn');
    const hobbyList = document.getElementById('hobbyList');
    
    if (toggleButton && hobbyList) {
        toggleButton.addEventListener('click', function() {
            hobbyList.classList.toggle('hidden');

            // Menggunakan getComputedStyle untuk mengambil nilai --color-primary yang sedang aktif
            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');

            if (hobbyList.classList.contains('hidden')) {
                toggleButton.textContent = 'Tampilkan Hobi';
                toggleButton.style.backgroundColor = primaryColor;
            } else {
                toggleButton.textContent = 'Sembunyikan Hobi';
                toggleButton.style.backgroundColor = '#dc3545'; // Merah solid
            }
        });
    }

    // ==========================================================
    // 4. FUNGSI NAVIGASI AKTIF (HIGHLIGHT MENU SAAT SCROLL)
    // ==========================================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            // Cek posisi scroll dengan offset navbar (80px)
            const sectionTop = section.offsetTop - 80; 
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
    
    // ==========================================================
    // 5. SIMPLE FORM VALIDATION WITH PERSONALITY
    // ==========================================================
    const contactForm = document.getElementById('contactForm');
    const validationMessage = document.getElementById('validationMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); 

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            
            validationMessage.textContent = '';
            validationMessage.className = 'message-area';

            // 5a. Validasi Kolom Kosong
            if (!name || !email || !password) {
                validationMessage.classList.add('message-error');
                validationMessage.textContent = "⚠️ Oops! Sebagai mahasiswa Informatika, kamu tahu semua kolom itu penting. Jangan ada yang kosong, ya!";
                return; 
            }
            
            // 5b. Validasi Email (@gmail.com)
            if (!email.endsWith('@gmail.com')) {
                validationMessage.classList.add('message-error');
                validationMessage.textContent = "❌ Validasi Gagal! Email harus diakhiri dengan '@gmail.com'. Cek lagi sintaksnya!";
                return; 
            }

            // 5c. Validasi Password (minimal 6 karakter)
            if (password.length < 6) {
                validationMessage.classList.add('message-error');
                validationMessage.textContent = "🔒 Password terlalu lemah. Minimal 6 karakter untuk keamanan data, bro!";
                return;
            }

            // 5d. Sukses!
            validationMessage.classList.add('message-success');
            validationMessage.textContent = "✅ Data Valid! Terima kasih, T.I. Nabasa akan segera menerima pesanmu. Tugasmu selesai!";
            
            // Reset form
            contactForm.reset(); 
        });
    }
});