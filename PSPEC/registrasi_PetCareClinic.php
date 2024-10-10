<? 
do {
echo "=======Registrasi Pet Care Klinik=======";
$email = (String)readline ("Masukkan email anda : ");
$username = (String)readline ("Masukkan username anda : ");
$password = (String)readline ("Masukkan password anda : ");
$confirm_password = (String)readline ("Masukkan kembali password anda : ");

if ($password == $confirm_password) {
    echo "\nAkun berhasil dibuat";
    $pw_confirm = true;
    } else {
        echo "\nPassword tidak sama";
        $pw_confirm = false;
    }
} while   ($pw_confirm != true);
