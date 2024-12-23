// Import module firebase yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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

// Autentikasi untuk memastikan hanya user dengan role admin yang bisa masuk
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'admin-login.html';
    } else {
        try {
            const userDocRef = ref(database, `users/` + user.uid);
            const userSnapshot = await get(userDocRef);

            if (!userSnapshot.exists()) {
                alert("Data pengguna tidak ditemukan!");
                window.location.href = 'admin-login.html';
                return;
            }

            const userData = userSnapshot.val();

            if (userData.role !== 'admin') {
                alert("Akses ditolak. Hanya admin yang diizinkan!");
                window.location.href = 'index.html';
                return;
            }
            updateProfileDisplay(user);
        } catch (error) {
            console.error("Error fetching user data:", error);
            alert("Terjadi kesalahan. Silakan coba lagi nanti");
            window.location.href = 'admin-login.html';
        }
    }
});

// Fungsi untuk mengupdate display profil user
const updateProfileDisplay = async (user) => {
    try {
        const userRef = ref(database, 'users/' + user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();

            document.getElementById('username-display').textContent = userData.username;
            document.getElementById('email-display').textContent = userData.email;

            document.getElementById('username-info').textContent = userData.username;
            document.getElementById('email-info').textContent = userData.email;

            const initials = userData.username.substring(0, 2).toUpperCase();
            document.querySelector('.initials').textContent = initials;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Could not load profile information.");
    }
};

// Menambahkan event listener untuk sidebar menu navigasi admin
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            if (e.target.textContent.trim() === 'Dashboard') {
                window.location.href = 'admin-dashboard.html';
            } else if (e.target.textContent.trim() === 'Tambah Klinik') {
                window.location.href = 'admin-add.html';
            } else if (e.target.textContent.trim() === 'Lihat Klinik') {
                window.location.href = 'admin-view.html';
            } else if (e.target.textContent.trim() === 'Akun') {
                window.location.href = 'admin-account.html';
            }
        });
    }

    if (document.getElementById("clinicContainer")) {
        fetchAndDisplayClinics();
    }
});

// Fungsi Logout
document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'admin-login.html';
    } catch (error) {
        console.error("Logout error:", error);
        alert("Could not log out. Please try again.");
    }
});