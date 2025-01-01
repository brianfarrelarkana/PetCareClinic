// Import module firebase yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Fungsi untuk formulir login
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  function handleLoginError(error) {
    const errorCode = error.code;
    let errorMessage = 'Ada error saat login';

    switch (errorCode) {
      case 'auth/invalid-email':
        errorMessage = 'Email invalid';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Akun ini sudah tidak bisa digunakan';
        break;
      case 'auth/user-not-found':
        errorMessage = 'Email belum terdaftar, register dulu yuk!';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Password salah';
        break;
      default:
        errorMessage = error.message;
    }

    alert('Error: ' + errorMessage);
    console.error('Login error:', error);
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const timestamp = new Date().toISOString();

    const updates = {
      lastLogin: timestamp,
      email: user.email
    };

    await update(ref(db, 'users/' + user.uid), updates);

    alert('Login successful!');

    window.location.href = 'admin-dashboard.html';

  } catch (error) {
    handleLoginError(error)
  }
})

// Menambahkan event listener untuk toggle password
document.addEventListener('DOMContentLoaded', () => {
  const togglePassword = document.querySelector('.toggle-password');
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.querySelector('.eye-icon');
  const eyeOffIcon = document.querySelector('.eye-off-icon');

  if (!togglePassword || !passwordInput || !eyeIcon || !eyeOffIcon) {
    console.error('Toggle password elements not found!');
    return;
  }

  togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

    eyeIcon.classList.toggle('hidden', !isPassword);
    eyeOffIcon.classList.toggle('hidden', isPassword);
  });
});