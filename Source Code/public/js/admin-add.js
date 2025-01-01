// Import module firebase yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref as dbRef, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
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
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

// Autentikasi untuk memastikan hanya user dengan role admin yang bisa masuk
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'admin-login.html';
  } else {
    try {
      const userDocRef = dbRef(database, `users/` + user.uid);
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

// Fungsi untuk menambahkan klinik
async function addClinic(clinic_name, location, description, photoFile) {
  try {
    const storageRef = ref(storage, `clinic_photos/${Date.now()}_${photoFile.name}`);
    await uploadBytes(storageRef, photoFile);
    const photoURL = await getDownloadURL(storageRef);

    const docRef = await addDoc(collection(db, "clinics"), {
      clinic_name: clinic_name,
      location: location,
      description: description,
      photoURL: photoURL,
      createdAt: new Date().toISOString()
    });

    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = "Clinic added successfully!";
    successMessage.style.display = "block";

    document.getElementById("clinicForm").reset();

    setTimeout(() => {
      successMessage.style.display = "none";
    }, 3000);
  } catch (error) {
    console.error("Error adding clinic: ", error);
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = "Error adding clinic. Please try again.";
    errorMessage.style.display = "block";

    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 3000);
  }
}

// Menambahkan event listener untuk formulir penambahan klinik
document.addEventListener('DOMContentLoaded', () => {
  const clinicForm = document.getElementById("clinicForm");
  if (clinicForm) {
    clinicForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const clinic_name = document.getElementById("clinic_name").value;
      const location = document.getElementById("location").value;
      const description = document.getElementById("description").value;
      const photoFile = document.getElementById("photo").files[0];

      if (photoFile) {
        addClinic(clinic_name, location, description, photoFile);
      } else {
        alert("Please upload a photo.");
      }
    });
  }
});

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
});