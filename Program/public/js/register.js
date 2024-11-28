import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const database = getDatabase(app);
const auth = getAuth(app);

// Test database connection
//const testConnection = async () => {
//console.log("Testing Firebase Database connection...");
//try {
//const testRef = ref(database, 'testConnection');
//await set(testRef, { test: "Connection Successful" });
//console.log("Database connection successful!");
//} catch (error) {
//console.error("Database connection failed:", error);
//}
//};
//testConnection();

// Form validation functions
const validatePassword = (password) => {
    // Add your password validation rules here
    return password.length >= 6; // Basic example: minimum 6 characters
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Form submission handling
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (!validatePassword(password)) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userData = {
            username,
            email,
            createdAt: new Date().toISOString(),
            isActive: true,
        };

        await set(ref(database, 'users/' + user.uid), userData);

        alert('Registration successful!');
        window.location.href = 'login.html';
    } catch (error) {
        let errorMessage = 'Registration failed: ';

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += 'Email is already registered.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage += 'Email/password accounts are not enabled.';
                break;
            case 'auth/weak-password':
                errorMessage += 'Password is too weak.';
                break;
            default:
                errorMessage += error.message;
        }

        alert(errorMessage);
        console.error("Registration error:", error);
    }
});

// Handle password visibility toggle
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const eyeIcons = document.querySelectorAll('.eye-icon');
    const eyeOffIcons = document.querySelectorAll('.eye-off-icon');

    // Setup toggle for each password field
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