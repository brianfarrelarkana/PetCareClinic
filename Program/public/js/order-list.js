// Import module firebase yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
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

// Autentikasi untuk memastikan hanya user login yang bisa masuk dan melihat daftar pemesanan mereka
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    try {
      const q = query(
        collection(db, "bookings"),
        where("email", "==", user.email)
      );

      const bookingsContainer = document.getElementById("bookings-list");
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        bookingsContainer.innerHTML = "<p>Anda belum melakukan pemesanan.</p>";
        return;
      }

      querySnapshot.forEach((doc) => {
        const booking = doc.data();
        const bookingCard = document.createElement("div");
        bookingCard.className = "booking-card";
        bookingCard.innerHTML = `
          <h2>${booking.petName}</h2>
          <p>Layanan : ${booking.serviceType}</p>
          <p>Tanggal : ${booking.bookingDate}</p>
          <p>Waktu   : ${booking.bookingTime}</p>
          <span class="booking-status status-${booking.status.toLowerCase()}">${booking.status}</span>
        `;

        bookingCard.addEventListener("click", () => {
          localStorage.setItem('selectedBookingDetails', JSON.stringify(booking));
          window.location.href = 'detail-order.html';
        });

        bookingsContainer.appendChild(bookingCard);
      });
    } catch (error) {
      console.error("Error fetching bookings: ", error);
    }
  }
});