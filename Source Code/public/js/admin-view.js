// Import module firebase yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
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
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

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

      console.log("Admin user authenticated:", userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Terjadi kesalahan. Silakan coba lagi nanti");
      window.location.href = 'admin-login.html';
    }
  }
});

// Fungsi untuk membuat kartu klinik
function createClinicCard(data, docId) {
  const clinicCard = document.createElement("div");
  clinicCard.className = "clinic-card";

  clinicCard.innerHTML = `
    <div class="clinic-card-image">
      <img src="${data.photoURL || 'default-image.png'}" alt="Clinic Photo" class="clinic-photo">
    </div>
    <div class="clinic-card-content">
      <h3 class="clinic-name">${data.clinic_name}</h3>
      <div class="clinic-location">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        ${data.location}
      </div>
      <p class="clinic-description">${data.description}</p>
      <div class="clinic-date">Added: ${new Date(data.createdAt).toLocaleDateString()}</div>
      <a href="admin-edit.html?clinicId=${docId}" class="edit-clinic-link">Edit Clinic</a>
      </div>
  `;

  return clinicCard;
}

// Fungsi untuk mengambil data klinik dari firestore
async function fetchAndDisplayClinics() {
  const clinicContainer = document.getElementById("clinicContainer");
  if (!clinicContainer) return;

  clinicContainer.innerHTML = '<div class="loading">Loading clinics...</div>';

  try {
    const q = query(collection(db, "clinics"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      clinicContainer.innerHTML = '<p>No clinics found. Add some clinics to see them here.</p>';
      return;
    }

    clinicContainer.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const clinicCard = createClinicCard(doc.data(), doc.id);
      clinicContainer.appendChild(clinicCard);
    });
  } catch (error) {
    console.error("Error fetching clinics: ", error);
    clinicContainer.innerHTML = '<p class="error">Error loading clinics. Please try again later.</p>';
  }
}

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