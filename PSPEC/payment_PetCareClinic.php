<?php
echo "\n----------Payment Pet Care Clinic----------\n";

$pembayaran = (int)('Jumlah uang yang harus dibayar: ' . 5000);

echo "\nMetode Pembayaran:";
echo "\n1. Transfer Bank";
echo "\n2. E-Wallet (Ovo, Dana, Go-Pay, LinkAja)\n";

$pilihan = (int)readline('Pilih Metode Pembayaran: ');

if ($pilihan == 1) {
    echo "\nSilahkan transfer ke nomor rekening berikut :";
    echo "\n23896523160 a.n Kubaik";
    echo "\n\nKirimkan Bukti Pembayaran melalui Whatsapp pada nomor tertera : 0832437865423";
    echo "\nTerima kasih telah menggunakan jasa reservasi kami\n\n";
} else if ($pilihan == 2) {
    echo "\nSilahkan transfer ke nomor e-wallet berikut :";
    echo "\n0832437865423 a.n Kubaik";
    echo "\n(Ovo, Dana, Go-Pay, LinkAja)";
    echo "\n\nKirimkan Bukti Pembayaran melalui Whatsapp pada nomor tertera : 0832437865423";
    echo "\nTerima kasih telah menggunakan jasa reservasi kami\n\n";
} else {
    echo "Pilihan Invalid";
}
