// Import module firebase yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
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
const db = getFirestore(app);
const auth = getAuth(app);

// Autentikasi untuk memastikan hanya user login yang bisa masuk
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    document.querySelector("#email").value = user.email || "";
    document.querySelector("#owner-name").value = user.username || "";
  }
});

// Fungsi untuk mengambil nama klinik dari halaman sebelumnya
let clinicNameParam;

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  clinicNameParam = urlParams.get("clinic");

  const clinicNameElement = document.querySelector("#clinic-name");
  if (clinicNameParam) {
    clinicNameElement.textContent = clinicNameParam;
  } else {
    alert("Pilih klinik dulu yaa");
    window.location.href = "../clinics.html";
    return;
  }

  try {
    const q = query(
      collection(db, "clinics"),
      where("clinic_name", "==", clinicNameParam)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const clinicData = querySnapshot.docs[0].data();
      if (!clinicNameElement.textContent || clinicNameElement.textContent === "Klinik tidak ada.") {
        clinicNameElement.textContent = clinicData.name || "Nama klinik tidak ditemukan.";
      }
    } else {
      clinicNameElement.textContent = "Klinik tidak ditemukan.";
    }
  } catch (error) {
    console.error("Error fetching clinic name:", error);
    clinicNameElement.textContent = "Gagal memuat nama klinik.";
  }
});

// Fungsi untuk formulir pemesanan
const form = document.querySelector(".main-container");

if (!form) {
  console.error("Form not found!");
} else {
  const submitButton = form.querySelector("button[type='submit']");
  if (submitButton) {
    submitButton.addEventListener("click", async (e) => {
      e.preventDefault();

      const ownerName = document.querySelector("#owner-name").value.trim();
      const email = document.querySelector("#email").value.trim();
      const phone = document.querySelector("#phone").value.trim();
      const petName = document.querySelector("#pet-name").value.trim();
      const petType = document.querySelector("#pet-type").value;
      const petAge = document.querySelector("#pet-age").value.trim() || "Tidak Diketahui";
      const serviceType = document.querySelector("#service-type").value;
      const bookingDate = document.querySelector("#booking-date").value;
      const bookingTime = document.querySelector("#booking-time").value;
      const additionalNotes = document.querySelector("#notes").value.trim() || "";

      if (!ownerName || !email || !phone || !petName || !petType || !serviceType || !bookingDate || !bookingTime) {
        alert("Isi semua pertanyaan pada formulir yaa");
        return;
      }

      try {
        const q = query(
          collection(db, "bookings"),
          where("clinicName", "==", clinicNameParam),
          where("bookingDate", "==", bookingDate),
          where("bookingTime", "==", bookingTime)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          alert("Yah... udah ada yang pesan di tanggal dan waktu yang kamu pilih, yuk coba tanggal atau waktu lain");
          return;
        }

        const bookingData = {
          clinicName: clinicNameParam,
          ownerName,
          email,
          phone,
          petName,
          petType,
          petAge,
          serviceType,
          bookingDate,
          bookingTime,
          additionalNotes
        };
        localStorage.setItem("bookingData", JSON.stringify(bookingData));

        window.location.href = "../payment.html";
      } catch (error) {
        console.error("Error saving booking data: ", error);
      }
    });
  }
}