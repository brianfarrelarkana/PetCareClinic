import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
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
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // No user is signed in, redirect to index
    window.location.href = 'index.html';
  }
});

/*ADD PHOTO*/
async function addProof(photoProof) {
  try {
    // Upload photo to Firebase Storage
    const storageRef = ref(storage, `photo_Proof/${Date.now()}_${photoProof.name}`);
    await uploadBytes(storageRef, photoProof);
    const photoURL = await getDownloadURL(storageRef);

    // Add clinic data to Firestore
    const docRef = await addDoc(collection(db, "payment"), {
      photoURL: photoURL
    });

    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = "Photo added successfully!";
    successMessage.style.display = "block";

    setTimeout(() => {
      successMessage.style.display = "none";
    }, 3000);
  } catch (error) {
    console.error("Error adding photo: ", error);
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = "Error adding photo. Please try again.";
    errorMessage.style.display = "block";

    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const photoProof = document.getElementById("photoProof");
  if (photoProof) {
    photoProof.addEventListener("submit", (event) => {
      event.preventDefault();

      const photoProof = document.getElementById("photoProof").files[0];

      if (photoProof) {
        addClinic(clinic_name, location, description, photoProof);
      } else {
        alert("Please upload a photo.");
      }
    });
  }
});