// Import module firebase yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
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
            const userDocRef = ref(database, 'users/' + user.uid);
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

// Ambil clinicId dari parameter URL
const urlParams = new URLSearchParams(window.location.search);
const clinicId = urlParams.get('clinicId');

// Fungsi untuk mengambil dan menampilkan data klinik untuk diedit
async function fetchClinicData(clinicId) {
    try {
        const clinicDocRef = doc(db, "clinics", clinicId);
        const clinicDocSnap = await getDoc(clinicDocRef);

        if (!clinicDocSnap.exists()) {
            alert("Klinik tidak ditemukan.");
            window.location.href = "admin-view.html"; n
            return;
        }

        const clinicData = clinicDocSnap.data();

        document.getElementById("clinic-name").value = clinicData.clinic_name || '';
        document.getElementById("location").value = clinicData.location || '';
        document.getElementById("description").value = clinicData.description || '';
        document.getElementById("preview-image").src = clinicData.photoURL || 'default-image.png';

    } catch (error) {
        console.error("Error fetching clinic data:", error);
        alert("Terjadi kesalahan saat mengambil data klinik.");
    }
}

// Fungsi untuk mengirim data klinik yang diperbarui
async function submitUpdatedClinicData(event) {
    event.preventDefault();

    const clinicName = document.getElementById("clinic-name").value.trim();
    const location = document.getElementById("location").value.trim();
    const description = document.getElementById("description").value.trim();
    const photoInput = document.getElementById("photoURL");
    let photoURL = null;

    if (!clinicName || !location || !description) {
        alert("Harap lengkapi semua kolom.");
        return;
    }

    try {
        if (photoInput.files && photoInput.files[0]) {
            const photoFile = photoInput.files[0];
            const clinicDocRef = doc(db, "clinics", clinicId);
            const clinicDocSnap = await getDoc(clinicDocRef);

            if (clinicDocSnap.exists()) {
                const existingData = clinicDocSnap.data();
                if (existingData.photoURL) {
                    const oldImageRef = storageRef(storage, existingData.photoURL);

                    try {
                        await deleteObject(oldImageRef);
                        console.log("Gambar lama berhasil dihapus.");
                    } catch (error) {
                        console.error("Gagal menghapus gambar lama:", error);
                    }
                }
            }

            const timestamp = new Date().getTime();
            const imageRef = storageRef(storage, `clinic_photos/${timestamp}_${photoFile.name}`);
            const snapshot = await uploadBytes(imageRef, photoFile);
            photoURL = await getDownloadURL(snapshot.ref);
        }

        const clinicDocRef = doc(db, "clinics", clinicId);
        await updateDoc(clinicDocRef, {
            clinic_name: clinicName,
            location: location,
            description: description,
            photoURL: photoURL || null,
            updatedAt: new Date()
        });

        alert("Klinik berhasil diperbarui!");
        window.location.href = "admin-view.html";

    } catch (error) {
        console.error("Error updating clinic data:", error);
        alert("Terjadi kesalahan saat memperbarui data klinik.");
    }
}

// Fungsi untuk menghapus klinik dari firestore
async function deleteClinic() {
    if (!clinicId) {
        alert("Klinik tidak ditemukan.");
        return;
    }

    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus klinik ini? Tindakan ini tidak dapat dibatalkan.");
    if (!confirmDelete) {
        return;
    }

    try {
        const clinicDocRef = doc(db, "clinics", clinicId);

        const clinicDocSnap = await getDoc(clinicDocRef);
        if (!clinicDocSnap.exists()) {
            alert("Klinik tidak ditemukan di database.");
            return;
        }

        await deleteDoc(clinicDocRef);
        alert("Klinik berhasil dihapus!");
        window.location.href = "admin-view.html";
    } catch (error) {
        console.error("Gagal menghapus klinik:", error);
        alert("Terjadi kesalahan saat menghapus klinik. Silakan coba lagi.");
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

    if (clinicId) {
        fetchClinicData(clinicId);
    }

    const editClinicForm = document.getElementById("editClinicForm");
    if (editClinicForm) {
        editClinicForm.addEventListener("submit", submitUpdatedClinicData);
    }

    const deleteClinicBtn = document.getElementById("deleteClinic");
    if (deleteClinicBtn) {
        deleteClinicBtn.addEventListener("click", deleteClinic);
    }
});