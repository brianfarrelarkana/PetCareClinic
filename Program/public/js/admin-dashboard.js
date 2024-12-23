// Import module firebase yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, updateDoc, doc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
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
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

// Autentikasi untuk memastikan hanya user dengan role admin yang bisa masuk
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'admin-login.html';
  } else {
    try {
      console.log("Authenticated User UID:", user.uid);
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

      console.log("Admin user authenticated:", userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Terjadi kesalahan. Silakan coba lagi nanti");
      window.location.href = 'admin-login.html';
    }
  }
});

// Fungsi untuk membuat kartu informasi pemesanan
function createBookingCard(booking, docId) {
  const card = document.createElement('div');
  card.className = 'booking-card';
  card.innerHTML = `
    <div class="booking-header">
      <span class="booking-id">#${docId.slice(-5)}</span>
      <span class="booking-status ${booking.status.toLowerCase()}">${booking.status}</span>
    </div>
    <div class="booking-details">
      <div class="booking-info">
        <h3>${booking.ownerName} | ${booking.clinicName}</h3>
        <p>Pet: ${booking.petName} (${booking.petType}) | ${booking.serviceType}</p>
        <p>Date: ${booking.bookingDate} | Time: ${booking.bookingTime}</p>
        ${booking.paymentProofUrl ? `
          <div class="payment-proof">
            <h4>Payment Proof:</h4>
            <img src="${booking.paymentProofUrl}" alt="Payment Proof" class="payment-proof-img" />
          </div>
          ` : ''}
      </div>
      <div class="booking-actions">
        ${booking.status === 'Pending' ? `
          <button class="approve-btn completed" data-id="${docId}">Approve</button>
          <button class="reject-btn cancelled" data-id="${docId}">Reject</button>
        ` : booking.status === 'Completed' ? `
          <button class="view-details-btn completed" disabled>Completed</button>
        ` : booking.status === 'Cancelled' ? `
          <button class="view-details-btn cancelled" disabled>Cancelled</button>
        ` : `
          <button class="view-details-btn completed">View Details</button>
        `}
      </div>
    </div>
  `;
  return card;
}

// Fungsi untuk mengambil data pemesanan dari firestore
async function fetchBookings() {
  const bookingContainer = document.querySelector('.booking-list');
  if (!bookingContainer) return;

  bookingContainer.innerHTML = '<div class="loading">Loading bookings...</div>';

  try {
    const q = query(
      collection(db, "bookings"),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      bookingContainer.innerHTML = '<p>No bookings found.</p>';
      updateBookingStats(0, 0, 0);
      return;
    }

    bookingContainer.innerHTML = '';

    let totalBookings = 0;
    let pendingBookings = 0;
    let completedBookings = 0;
    let cancelledBookings = 0;

    querySnapshot.forEach((docSnapshot) => {
      const booking = docSnapshot.data();

      const bookingCard = createBookingCard(booking, docSnapshot.id);
      bookingContainer.appendChild(bookingCard);

      totalBookings++;
      if (booking.status === 'Pending') pendingBookings++;
      if (booking.status === 'Completed') completedBookings++;
      if (booking.status === 'Cancelled') cancelledBookings++;
    });

    updateBookingStats(totalBookings, pendingBookings, completedBookings, cancelledBookings);
    addBookingActionListeners();
  } catch (error) {
    console.error("Error fetching bookings: ", error);
    bookingContainer.innerHTML = '<p class="error">Error loading bookings. Please try again later.</p>';
  }
}

// Fungsi untuk memperbarui status pemesanan di firestore
async function updateBookingStatus(docId, status) {
  try {
    const bookingRef = doc(db, "bookings", docId);

    await updateDoc(bookingRef, {
      status: status,
      updatedAt: new Date().toISOString()
    });

    alert(`Booking successfully ${status.toLowerCase()}!`);

    fetchBookings();
  } catch (error) {
    console.error("Detailed error updating booking status:", error);

    if (error.code === 'permission-denied') {
      alert("You do not have permission to update this booking.");
    } else if (error.code === 'not-found') {
      alert("Booking not found. It may have been deleted.");
    } else {
      alert(`Error updating booking status: ${error.message}`);
    }
  }
}

// Fungsi untuk memperbarui statistik pemesanan di dashboard admin
function updateBookingStats(total, pending, completed, cancelled) {
  const totalStat = document.querySelector('.dashboard-stats .stat-card:nth-child(1) .stat-number');
  const pendingStat = document.querySelector('.dashboard-stats .stat-card:nth-child(2) .stat-number');
  const completedStat = document.querySelector('.dashboard-stats .stat-card:nth-child(3) .stat-number');
  const cancelledStat = document.querySelector('.dashboard-stats .stat-card:nth-child(4) .stat-number');

  if (totalStat) totalStat.textContent = total;
  if (pendingStat) pendingStat.textContent = pending;
  if (completedStat) completedStat.textContent = completed;
  if (cancelledStat) cancelledStat.textContent = cancelled;
}

// Menambahkan event listener untuk tombol perubahan status di kartu pemesanan
function addBookingActionListeners() {
  const approveButtons = document.querySelectorAll('.approve-btn');
  const rejectButtons = document.querySelectorAll('.reject-btn');

  approveButtons.forEach(button => {
    button.addEventListener('click', () => {
      const bookingId = button.getAttribute('data-id');
      updateBookingStatus(bookingId, 'Completed');
    });
  });

  rejectButtons.forEach(button => {
    button.addEventListener('click', () => {
      const bookingId = button.getAttribute('data-id');
      updateBookingStatus(bookingId, 'Cancelled');
    });
  });
}

// Menambahkan event listener untuk sidebar menu navigasi admin
document.addEventListener('DOMContentLoaded', () => {
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

  fetchBookings();
});