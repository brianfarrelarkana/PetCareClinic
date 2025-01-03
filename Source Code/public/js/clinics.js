// Import module firebase yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Autentikasi untuk memastikan hanya user login yang bisa melihat tombol pemesanan
let userLoggedIn = false;

onAuthStateChanged(auth, (user) => {
    userLoggedIn = !!user;
});

// Fungsi untuk membuat kartu data klinik
function createClinicCard(data) {
    const card = document.createElement('div');
    card.className = 'clinic-card';

    card.innerHTML = `
        <div class="clinic-card-image">
            <img src="${data.photoURL || 'default-image.png'}" alt="${data.clinic_name}" class="clinic-photo">
        </div>
        <div class="clinic-card-content">
            <h3 class="name-clinic">${data.clinic_name}</h3>
            <div class="clinic-info">
                <div class="clinic-location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                        <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                    <span>${data.location}</span>
                </div>
                <p class="clinic-description">${data.description}</p>
            </div>
            ${userLoggedIn ? `<button class="booking-button" data-clinic="${data.clinic_name}">Pesan Antrian</button>` : ''}
        </div>
    `;

    const bookingButton = card.querySelector('.booking-button');
    if (bookingButton) {
        bookingButton.addEventListener('click', () => {
            const clinicName = bookingButton.dataset.clinic;
            window.location.href = `booking.html?clinic=${encodeURIComponent(clinicName)}`;
        });
    }

    return card;
}

// Fungsi untuk mengambil data klinik dari firestore
async function fetchClinics() {
    const loadingState = document.getElementById('loadingState');
    const clinicContainer = document.getElementById('clinicContainer');
    const preFooter = document.querySelector('.pre-footer');
    const footer = document.querySelector('.footer');

    preFooter.classList.remove('show');
    footer.classList.remove('show');

    try {
        const q = query(collection(db, "clinics"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        loadingState.style.display = 'none';

        if (querySnapshot.empty) {
            clinicContainer.innerHTML = `
                <div class="no-results">
                    Yah... belum ada klinik yang tersedia ni :(
                </div>
            `;
        } else {
            clinicContainer.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const clinicCard = createClinicCard(doc.data());
                clinicContainer.appendChild(clinicCard);
            });
        }

        preFooter.classList.add('show');
        footer.classList.add('show');

    } catch (error) {
        loadingState.style.display = 'none';
        clinicContainer.innerHTML = `
            <div class="error-message">
                Gagal memuat klinik. Silakan coba lagi nanti.
            </div>
        `;

        preFooter.classList.add('show');
        footer.classList.add('show');
    }
}

fetchClinics();