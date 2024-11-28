import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
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
const db = getFirestore(app);
const auth = getAuth(app);

// Fungsi untuk memvalidasi status login
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Jika tidak ada pengguna yang login, arahkan ke halaman home
    window.location.href = "index.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".main-container");

  if (!form) {
    console.error("Form not found!");
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  if (submitButton) {
    submitButton.addEventListener("click", async (e) => {

      // Form Elements
      const ownerName = document.querySelector("#owner-name").value.trim();
      const email = document.querySelector("#email").value.trim();
      const phone = document.querySelector("#phone").value.trim();
      const petName = document.querySelector("#pet-name").value.trim();
      const petType = document.querySelector("#pet-type").value;
      const petAge = document.querySelector("#pet-age").value.trim() || "Not Specified";
      const serviceType = document.querySelector("#service-type").value;
      const bookingDate = document.querySelector("#booking-date").value;
      const bookingTime = document.querySelector("#booking-time").value;
      const additionalNotes = document.querySelector("#notes").value.trim() || "";

      // Validation
      if (!ownerName || !email || !phone || !petName || !petType || !serviceType || !bookingDate || !bookingTime) {
        alert("Please fill out all required fields.");
        return;
      }

      try {
        // Check for existing booking
        const q = query(
          collection(db, "bookings"),
          where("ownerName", "==", ownerName),
          where("petName", "==", petName),
          where("bookingDate", "==", bookingDate),
          where("bookingTime", "==", bookingTime)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          alert("A booking with these details already exists. Please choose a different time or date.");
          return;
        }

        // Add to Firestore
        const docRef = await addDoc(collection(db, "bookings"), {
          ownerName,
          email,
          phone,
          petName,
          petType,
          petAge,
          serviceType,
          bookingDate,
          bookingTime,
          additionalNotes,
          status: "Pending",
          timestamp: new Date().toISOString()
        });
        alert("Booking successfully submitted!");
        form.querySelectorAll("input, select, textarea").forEach(input => input.value = "");
        console.log("Document written with ID: ", docRef.id);
        window.location.href = '../payment.html';
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    });
  }
});