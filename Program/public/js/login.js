// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Get login form element
const loginForm = document.getElementById('login-form');

// Add submit event listener to form
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Sign in user with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get current date and time
        const timestamp = new Date().toISOString();

        // Update user data in database
        const updates = {
            lastLogin: timestamp,
            // You can add more user data here if needed
            email: user.email
        };

        // Update the database
        await update(ref(db, 'users/' + user.uid), updates);

        // Show success message
        alert('Login successful!');

        // Redirect to dashboard
        window.location.href = 'index.html';

    } catch (error) {
        // Handle errors
        const errorCode = error.code;
        let errorMessage = 'An error occurred during login.';

        // Customize error messages
        switch (errorCode) {
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address format.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled.';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password.';
                break;
            default:
                errorMessage = error.message;
        }

        // Show error message
        alert('Error: ' + errorMessage);
        console.error('Login error:', error);
    }
});

// Optional: Add authentication state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.email);
    } else {
        // User is signed out
        console.log('User is signed out');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Pilih elemen toggle password
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.eye-icon');
    const eyeOffIcon = document.querySelector('.eye-off-icon');

    // Pastikan elemen ditemukan
    if (!togglePassword || !passwordInput || !eyeIcon || !eyeOffIcon) {
        console.error('Toggle password elements not found!');
        return; // Hentikan skrip jika elemen tidak ditemukan
    }

    // Tambahkan event listener
    togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

        // Toggle visibility icon
        eyeIcon.classList.toggle('hidden', !isPassword);
        eyeOffIcon.classList.toggle('hidden', isPassword);
    });
});