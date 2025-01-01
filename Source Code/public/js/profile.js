// Import module firebase yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const database = getDatabase(app);
const auth = getAuth(app);

// Autentikasi untuk memastikan hanya user login yang bisa masuk
onAuthStateChanged(auth, (user) => {
    if (user) {
        updateProfileDisplay(user);
    } else {
        window.location.href = 'login.html';
    }
});

// Fungsi untuk mengupdate display profil
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
        alert("Tidak bisa memuat informasi profil.");
    }
};

// Fungsi untuk Logout
document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Logout error:", error);
        alert("Tidak bisa keluar, silakan coba lagi nanti.");
    }
});