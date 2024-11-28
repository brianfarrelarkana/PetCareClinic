import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, doc, addDoc, updateDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
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

onAuthStateChanged(auth, (admin) => {
  if (!admin) {
    // No admin is signed in, redirect to admin-login
    window.location.href = 'admin-login.html';
  }
});


/*ADMIN-VIEW*/
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
      <a href="edit-clinic.html?clinicId=$(docId)" class="edit-clinic-link">Edit Clinic</a>
      </div>
  `;

  return clinicCard;
}

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

/*ADMIN-ADD*/
async function addClinic(clinic_name, location, description, photoFile) {
  try {
    // Upload photo to Firebase Storage
    const storageRef = ref(storage, `clinic_photos/${Date.now()}_${photoFile.name}`);
    await uploadBytes(storageRef, photoFile);
    const photoURL = await getDownloadURL(storageRef);

    // Add clinic data to Firestore
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
    await fetchAndDisplayClinics();

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

  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.addEventListener('click', (e) => {
      if (e.target.textContent.trim() === 'Add Clinic') {
        window.location.href = 'admin-add.html';
      } else if (e.target.textContent.trim() === 'Edit Clinic') {
        window.location.href = 'admin-edit.html';
      } else if (e.target.textContent.trim() === 'View Clinic') {
        window.location.href = 'admin-view.html';
      }
    });
  }

  if (document.getElementById("clinicContainer")) {
    fetchAndDisplayClinics();
  }
});

/*ADMIN-EDIT*/
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const clinic_name = urlParams.get('clinic_name');
  const clinicDocRef = clinic_name ? doc(db, "clinics", clinic_name) : null;

  // Handle preview image
  const photoInput = document.getElementById('photo');
  const previewImage = document.getElementById('preview-image');
  photoInput.addEventListener('change', () => {
    const file = photoInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => (previewImage.src = e.target.result);
      reader.readAsDataURL(file);
    } else {
      previewImage.src = '#';
    }
  });

  // Fetch clinic details
  if (clinicDocRef) {
    const docSnap = await getDoc(clinicDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById('clinic-name').value = data.clinic_name;
      document.getElementById('location').value = data.location;
      document.getElementById('description').value = data.description;
      if (data.photoURL) previewImage.src = data.photoURL;
    }
  }

  // Handle form submission
  document.getElementById('editClinicForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const clinicName = document.getElementById('clinic-name').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const photoFile = document.getElementById('photo').files[0];

    try {
      let photoURL = clinicDocRef ? (await getDoc(clinicDocRef)).data().photoURL : null;
      if (photoFile) {
        const storageRef = ref(storage, `clinic_photos/${Date.now()}_${photoFile.name}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }

      if (clinicDocRef) {
        await updateDoc(clinicDocRef, { clinic_name: clinicName, location, description, photoURL });
        alert('Clinic updated successfully!');
      } else {
        console.error("Clinic ID not found.");
      }
    } catch (error) {
      console.error("Error saving clinic:", error);
    }
  });

  // Handle delete
  document.getElementById('deleteClinic').addEventListener('click', async () => {
    if (clinicDocRef && confirm('Are you sure you want to delete this clinic?')) {
      try {
        await deleteDoc(clinicDocRef);
        alert('Clinic deleted successfully!');
        window.location.href = 'admin-view.html';
      } catch (error) {
        console.error("Error deleting clinic:", error);
        alert('Failed to delete clinic.');
      }
    }
  });
});

/*ADMIN-SEARCH*/
function searchClinics(searchTerm) {
  const clinicCards = document.querySelectorAll('.clinic-card');
  searchTerm = searchTerm.toLowerCase();

  let hasResults = false;
  clinicCards.forEach(card => {
    const clinicName = card.querySelector('.clinic-name').textContent.toLowerCase();
    const clinicLocation = card.querySelector('.clinic-location').textContent.toLowerCase();
    const clinicDescription = card.querySelector('.clinic-description').textContent.toLowerCase();

    if (clinicName.includes(searchTerm) ||
      clinicLocation.includes(searchTerm) ||
      clinicDescription.includes(searchTerm)) {
      card.style.display = '';
      hasResults = true;
    } else {
      card.style.display = 'none';
    }
  });

  const noResults = document.querySelector('.no-results');
  if (!hasResults) {
    if (!noResults) {
      const message = document.createElement('p');
      message.className = 'no-results';
      message.textContent = 'No clinics found matching your search.';
      document.getElementById('clinicContainer')?.appendChild(message);
    }
  } else if (noResults) {
    noResults.remove();
  }
}




document.addEventListener('DOMContentLoaded', () => {
  const clinicForm = document.getElementById("clinicForm");
  if (clinicForm) {
    clinicForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const clinic_name = document.getElementById("clinic_name").value;
      const location = document.getElementById("location").value;
      const description = document.getElementById("description").value;

      addClinic(clinic_name, location, description);
    });
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchClinics(e.target.value);
    });
  }

  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.addEventListener('click', (e) => {
      if (e.target.textContent.trim() === 'Add Clinic') {
        window.location.href = 'admin-add.html';
      } else if (e.target.textContent.trim() === 'View Clinic') {
        window.location.href = 'admin-view.html';
      } else if (e.target.textContent.trim() === 'Dashboard') {
        window.location.href = 'admin-dashboard.html';
      }
    });
  }

  if (document.getElementById("clinicContainer")) {
    fetchAndDisplayClinics();
  }
});



/*ADMIN DASHBOARD*/
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
        <h3>${booking.ownerName}</h3>
        <p>Pet: ${booking.petName} (${booking.petType}) | ${booking.serviceType}</p>
        <p>Date: ${booking.bookingDate} | Time: ${booking.bookingTime}</p>
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

    querySnapshot.forEach((docSnapshot) => {
      const booking = docSnapshot.data();
      const bookingCard = createBookingCard(booking, docSnapshot.id);
      bookingContainer.appendChild(bookingCard);

      totalBookings++;
      if (booking.status === 'Pending') pendingBookings++;
      if (booking.status === 'Completed') completedBookings++;
    });

    updateBookingStats(totalBookings, pendingBookings, completedBookings);
    addBookingActionListeners();
  } catch (error) {
    console.error("Error fetching bookings: ", error);
    bookingContainer.innerHTML = '<p class="error">Error loading bookings. Please try again later.</p>';
  }
}

async function updateBookingStatus(docId, status) {
  try {
    // First, verify the document exists
    const bookingRef = doc(db, "bookings", docId);

    await updateDoc(bookingRef, {
      status: status,
      updatedAt: new Date().toISOString()
    });

    // Show success message
    alert(`Booking successfully ${status.toLowerCase()}!`);

    // Refresh bookings
    fetchBookings();
  } catch (error) {
    console.error("Detailed error updating booking status:", error);

    // More specific error handling
    if (error.code === 'permission-denied') {
      alert("You do not have permission to update this booking.");
    } else if (error.code === 'not-found') {
      alert("Booking not found. It may have been deleted.");
    } else {
      alert(`Error updating booking status: ${error.message}`);
    }
  }
}

function updateBookingStats(total, pending, completed) {
  const totalStat = document.querySelector('.dashboard-stats .stat-card:nth-child(1) .stat-number');
  const pendingStat = document.querySelector('.dashboard-stats .stat-card:nth-child(2) .stat-number');
  const completedStat = document.querySelector('.dashboard-stats .stat-card:nth-child(3) .stat-number');

  if (totalStat) totalStat.textContent = total;
  if (pendingStat) pendingStat.textContent = pending;
  if (completedStat) completedStat.textContent = completed;
}

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

document.addEventListener('DOMContentLoaded', () => {
  fetchBookings();
});


/*ADMIN-LOGIN*/
const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.querySelector('#password');

if (togglePassword && passwordInput) {
  console.log('Toggle password initialized'); // Log untuk debugging
  togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    togglePassword.src = type === 'password' ? 'img/eye-line.svg' : 'img/eye-off-line.svg';
    console.log(`Password field is now: ${type}`); // Debug log untuk tipe password
  });
} else {
  console.error('Toggle password or input field not found'); // Debug log jika elemen tidak ditemukan
}