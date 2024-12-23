// Import module firebase yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

// Fungsi untuk mendapatkan detail pemesanan
let currentBookingDetails = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    const bookingDetails = JSON.parse(localStorage.getItem('selectedBookingDetails'));

    if (bookingDetails) {
      currentBookingDetails = bookingDetails;

      document.getElementById("owner-name").textContent = bookingDetails.ownerName;
      document.getElementById("owner-email").textContent = bookingDetails.email;
      document.getElementById("owner-phone").textContent = bookingDetails.phone;
      document.getElementById("pet-name").textContent = bookingDetails.petName;
      document.getElementById("pet-type").textContent = bookingDetails.petType;
      document.getElementById("pet-age").textContent = bookingDetails.petAge;
      document.getElementById("service-type").textContent = bookingDetails.serviceType;
      document.getElementById("booking-date").textContent = bookingDetails.bookingDate;
      document.getElementById("booking-time").textContent = bookingDetails.bookingTime;
      document.getElementById("additional-notes").textContent = bookingDetails.additionalNotes || "-";

      const statusElement = document.getElementById("booking-status");
      statusElement.textContent = `Status: ${bookingDetails.status}`;
      statusElement.className = `status ${bookingDetails.status.toLowerCase()}`;

      localStorage.removeItem('selectedBookingDetails');
    } else {
      window.location.href = 'order-list.html';
    }
  }
});

// Menambahkan event listener untuk tombol kembali
document.addEventListener('DOMContentLoaded', () => {
  const backBtn = document.getElementById('back');

  backBtn.addEventListener('click', () => {
    window.location.href = 'order-list.html';
  });
});