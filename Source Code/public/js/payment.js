// Import module firebase yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
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
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

// Autentikasi untuk memastikan hanya user login yang bisa masuk
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'index.html';
  }
});

// Fungsi untuk menyimpan data pemesanan dan bukti pembayaran ke firestore
async function addProof(photoProof, bookingData) {
  try {
    const storageRef = ref(storage, `photo_Proof/${Date.now()}_${photoProof.name}`);
    await uploadBytes(storageRef, photoProof);
    const photoURL = await getDownloadURL(storageRef);

    const paymentDoc = await addDoc(collection(db, "bookings"), {
      ...bookingData,
      paymentProofUrl: photoURL,
      status: "Pending",
      timestamp: new Date().toISOString(),
    });

    alert("Pembayaran Berhasil Terkirim!");

    localStorage.removeItem("bookingData");
    window.location.href = "../order-list.html";
  } catch (error) {
    console.error("Error adding photo: ", error);
    console.error("Error adding payment: ", error);
    alert("Pembayaran Gagal. Silakan Coba Lagi");
  }
}

// Fungsi untuk konfirmasi atau batal pemesanan
document.addEventListener('DOMContentLoaded', () => {
  const bookingData = JSON.parse(localStorage.getItem("bookingData"));
  if (!bookingData) {
    alert("Isi formulir pemesanan dulu yaa");
    window.location.href = "../booking.html";
    return;
  }

  document.querySelector("#clinic-name").textContent = bookingData.clinicName || "Not specified";
  document.querySelector("#owner-name").textContent = bookingData.ownerName || "Not specified";
  document.querySelector("#pet-name").textContent = bookingData.petName || "Not specified";
  document.querySelector("#service-type").textContent = bookingData.serviceType || "Not specified";
  document.querySelector("#booking-date").textContent = bookingData.bookingDate || "Not specified";
  document.querySelector("#booking-time").textContent = bookingData.bookingTime || "Not specified";

  document.querySelector(".amount").textContent = `Rp ${bookingData.amount || "20.000,-"}`;

  const confirmButton = document.querySelector(".confirm-payment");
  confirmButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const photoProofInput = document.getElementById("photoProof");
    const photoProof = photoProofInput.files[0];

    const userConfirmed = confirm("Anda yakin ingin konfirmasi pemesanan ini? Coba cek dulu bukti pembayaran udah di unggah belum.");
    if (!userConfirmed) return;

    if (!photoProof) {
      alert("Unggah bukti pembayaran dulu ya sebelum konfirmasi pemesanan.");
      return;
    }

    await addProof(photoProof, bookingData);
  });

  const cancelButton = document.querySelector(".cancel-payment");
  cancelButton.addEventListener("click", (e) => {
    e.preventDefault();

    const userConfirmed = confirm("Anda yakin ingin membatalkan pemesanan ini? Detail pemesanan Anda akan hilang loh apabila di batalkan.");
    if (userConfirmed) {
      localStorage.removeItem("bookingData");
      window.location.href = "index.html";
    }
  });
});