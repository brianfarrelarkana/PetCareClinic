// Import module firebase yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDe216vNolSH650o58ncd2h2XEbL-3hEZU",
    authDomain: "petcareclinic-4d101.firebaseapp.com",
    databaseURL: "https://petcareclinic-4d101-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "petcareclinic-4d101",
    storageBucket: "petcareclinic-4d101.appspot.com",
    messagingSenderId: "150253577009",
    appId: "1:150253577009:web:e36d74c7abd268ae1a8610",
    measurementId: "G-YYJ26582HP"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Fungsi untuk validasi password
const validatePassword = (password) => {
    return password.length >= 6;
};

// Fungsi untuk memvalidasi email
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Fungsi untuk formulir registrasi
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!username || !email || !password || !confirmPassword) {
        alert('Tolong isi semua kolom jawaban yang ada yaa');
        return;
    }

    if (!validateEmail(email)) {
        alert('Masukkin email nya yang valid dong');
        return;
    }

    if (!validatePassword(password)) {
        alert('Password nya minimal 6 karakter yaa');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords nya beda sama yang atas, coba samain');
        return;
    }

    function handleRegisterError(error) {
        let errorMessage = 'Yahh... registrasi gagal';

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += 'Email udah dipakai nih';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Email invalid';
                break;
            case 'auth/operation-not-allowed':
                errorMessage += 'Email/password akun ga boleh';
                break;
            case 'auth/weak-password':
                errorMessage += 'Password terlalu lemah, jangan pake nama123';
                break;
            default:
                errorMessage += error.message;
        }

        alert(errorMessage);
        console.error("Registrasi error:", error);
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userData = {
            username,
            email,
            createdAt: new Date().toISOString(),
            isActive: true,
            role: "user"
        };

        await set(ref(database, 'users/' + user.uid), userData);

        alert('Yeay.. registrasi berhasil, coba login yuk!');
        window.location.href = 'login.html';
    } catch (error) {
        handleRegisterError(error)
    }
});

// Menambahkan event listener untuk toggle password
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const eyeIcons = document.querySelectorAll('.eye-icon');
    const eyeOffIcons = document.querySelectorAll('.eye-off-icon');

    [passwordInput, confirmPasswordInput].forEach((input, index) => {
        if (input && eyeIcons[index] && eyeOffIcons[index]) {
            const eyeIcon = eyeIcons[index];
            const eyeOffIcon = eyeOffIcons[index];

            eyeIcon.addEventListener('click', () => {
                input.type = 'text';
                eyeIcon.classList.add('hidden');
                eyeOffIcon.classList.remove('hidden');
            });

            eyeOffIcon.addEventListener('click', () => {
                input.type = 'password';
                eyeOffIcon.classList.add('hidden');
                eyeIcon.classList.remove('hidden');
            });
        }
    });
});