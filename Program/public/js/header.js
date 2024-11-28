import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);


// Periksa apakah pengguna sudah login
onAuthStateChanged(auth, (user) => {
    const authContainer = document.getElementById('authContainer'); // Pastikan ini adalah elemen di mana Anda ingin menampilkan login atau profil

    // Kosongkan kontainer untuk mencegah duplikasi
    authContainer.innerHTML = '';

    if (user) {
        // Ambil data pengguna dari Realtime Database
        const userRef = ref(database, 'users/' + user.uid);

        // Ambil data pengguna
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();

                // Mengambil username dari data yang ada di Realtime Database
                const username = userData.username || 'User'; // Jika tidak ada username, gunakan 'User' sebagai fallback

                // Mengambil inisial dari username
                const initials = username.substring(0, 2).toUpperCase();

                // Membuat elemen profil dengan inisial
                const loginprofile = document.createElement('div');
                loginprofile.innerHTML = `
                    <div class="account">
                        <a href="profile.html">
                            <div class="initials">${initials}</div>
                        </a>
                    </div>
                `;
                authContainer.appendChild(loginprofile); // Menambahkan elemen ke kontainer
            } else {
                console.log("Data pengguna tidak ditemukan");
            }
        }).catch((error) => {
            console.error("Error mengambil data pengguna:", error);
        });
    } else {
        // Jika user belum login, buat elemen tombol login
        const loginprofile = document.createElement('div');
        loginprofile.className = 'login';
        loginprofile.innerHTML = `
            <div class="login">
                <a href="login.html">
                    <button id="loginButton" class="login-button">Login</button>
                </a>
            </div>
        `;
        authContainer.appendChild(loginprofile); // Menambahkan elemen ke kontainer
    }
});