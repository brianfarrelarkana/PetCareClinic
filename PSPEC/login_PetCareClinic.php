<?php
do{
  echo "\n====== LOGIN ======\n";
  $email_usn = (string)readline('Masukkan email/username: ');
  $password = (string)readline('Masukkan password: ');
  $confirm_password = (string)readline('Konfirmasi password: ');

  if ($password == $confirm_password) {
    echo "\n berhasil masuk";
    $conpass = true;
  } else {
    echo "error. password salah";
    $conpass = false;
  }
} while ($conpass != true);