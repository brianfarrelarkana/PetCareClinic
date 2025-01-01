// Import module firebase yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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

// Autentikasi untuk menampilkan profil pada user login dan tombol login/register untuk user non login
onAuthStateChanged(auth, (user) => {
    const authContainer = document.getElementById('authContainer');

    authContainer.innerHTML = '';

    if (user) {
        const userRef = ref(database, 'users/' + user.uid);

        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();

                const username = userData.username || 'User';

                const initials = username.substring(0, 2).toUpperCase();

                const loginprofile = document.createElement('div');
                loginprofile.innerHTML = `
                    <div class="user-actions">
                        <div class="action-icons">
                            <a href="order-list.html" class="list-icon">
                                <img src="img/list.png" alt="Bookings" width="28" height="28">
                            </a>
                        </div>
                        <div class="account">
                            <a href="profile.html">
                                <div class="initials">${initials}</div>
                            </a>
                        </div>
                    </div>
                `;
                authContainer.appendChild(loginprofile);
            } else {
                console.log("Data pengguna tidak ditemukan");
            }
        }).catch((error) => {
            console.error("Error mengambil data pengguna:", error);
        });
    } else {
        const loginprofile = document.createElement('div');
        loginprofile.className = 'login';
        loginprofile.innerHTML = `
            <div class="login">
                <a href="login.html">
                    <button id="loginButton" class="login-button">Daftar/Masuk</button>
                </a>
            </div>
        `;
        authContainer.appendChild(loginprofile);
    }
});