import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase configuration (same as in register.js)
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

// Function to update profile display
const updateProfileDisplay = async (user) => {
    try {
        const userRef = ref(database, 'users/' + user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();

            // Update display elements
            document.getElementById('username-display').textContent = userData.username;
            document.getElementById('email-display').textContent = userData.email;

            document.getElementById('username-info').textContent = userData.username;
            document.getElementById('email-info').textContent = userData.email;

            // Format and display creation date
            const createdAt = new Date(userData.createdAt);
            document.getElementById('created-at').textContent = createdAt.toLocaleDateString();

            // Set initials in profile icon
            const initials = userData.username.substring(0, 2).toUpperCase();
            document.querySelector('.initials').textContent = initials;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Could not load profile information.");
    }
};

// Authentication state listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        updateProfileDisplay(user);
    } else {
        // No user is signed in, redirect to login
        window.location.href = 'login.html';
    }
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Logout error:", error);
        alert("Could not log out. Please try again.");
    }
});