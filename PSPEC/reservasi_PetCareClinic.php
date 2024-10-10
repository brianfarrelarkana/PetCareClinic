<?php
echo "=== SISTEM RESERVASI PET SHOP ===\n";

$nama_pemilik = readline("Masukkan nama pemilik: ");
$nomor_telepon = readline("Masukkan nomor telepon: ");
$nama_hewan = readline("Masukkan nama hewan: ");

echo "\nPilih jenis hewan:";
echo "\n1. Kucing";
echo "\n2. Anjing";
echo "\n3. Ular";
echo "\n4. Kelinci";
echo "\n5. Burung";
echo "\n6. Ikan\n";

$hewan = (int)readline("Pilih: ");
switch ($hewan) {
  case 1:
    $jenis_hewan = "Kucing";
  break;
  case 2:
    $jenis_hewan = "Anjing";
    break;
  case 3:
    $jenis_hewan = "Ular";
    break;
  case 4:
    $jenis_hewan = "Kelinci";
    break;
  case 5:
    $jenis_hewan = "Moo Deng";
    break;
}
$umur_hewan = readline("Masukkan umur hewan (tahun): ");
$tempat_klinik = readline("Masukkan tempat klinik: ");


$tanggal_reservasi = readline("Masukkan tanggal reservasi (DD/MM/YYYY): ");

echo "\nPilihan Layanan:";
echo "\n1. Grooming";
echo "\n2. Penitipan";
echo "\n3. Pemeriksaan Kesehatan\n";

$layanan = (int)readline("Pilih layanan (1/2/3): ");

switch ($layanan) {
    case 1:
        $harga_dasar = 100000;
        $nama_layanan = "Grooming";
        break;
    case 2:
        $harga_dasar = 50000;
        $nama_layanan = "Penitipan";
        break;
    case 3:
        $harga_dasar = 150000;
        $nama_layanan = "Pemeriksaan Kesehatan";
        break;
    default:
        $harga_dasar = 0;
        $nama_layanan = "Tidak Valid";
}

$biaya_reservasi = 5000;

echo "\n=== RINGKASAN RESERVASI PET SHOP ===\n";
echo "Data Pemilik:\n";
echo "Nama: " . $nama_pemilik . "\n";
echo "Nomor Telepon: " . $nomor_telepon . "\n";

echo "\nData Hewan:\n";
echo "Nama Hewan: " . $nama_hewan . "\n";
echo "Jenis Hewan: " . $jenis_hewan . "\n";
echo "Umur Hewan: " . $umur_hewan . " tahun\n";
echo "Tempat Klinik: " . $tempat_klinik . "\n";

echo "\nDetail Reservasi:\n";
echo "Tanggal Reservasi: " . $tanggal_reservasi . "\n";
echo "Layanan: " . $nama_layanan . "\n";
echo "Harga yang perlu di Bayar di Klinik: Rp " . number_format($harga_dasar, 0, ',', '.') . "\n";
echo "Biaya Reservasi yang perlu di Bayar: Rp " . number_format($biaya_reservasi, 0, ',', '.') . "\n";
?>