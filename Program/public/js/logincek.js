import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
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

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Fungsi untuk memvalidasi status login
function checkAuthentication(redirectUrl = 'index.html') {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // Jika tidak ada pengguna yang login, arahkan ke halaman home
            alert('You need to login first!');
            window.location.href = redirectUrl;
        }
    });
}

export { checkAuthentication };