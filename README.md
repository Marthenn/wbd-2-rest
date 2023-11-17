# wbd-2-rest
> WBD-2-REST merupakan repository Web Service berbasis protokol REST yang menyediakan layanan untuk memakai Web Method yang dimiliki oleh WEBWBD pada Tugas Besar 2 IF3110-Pengembangan Aplikasi Berbasis Web. Web Service ini dibangun dengan menggunakan ExpressTS dan di deploy dengan menggunakan Node.JS.

## Skema Basis Data
![image](https://github.com/Marthenn/wbd-2-rest/assets/89301265/a321ebb8-425a-4f8d-b0fd-6f4c80be45ca)

## Endpoint API

## Security
### SQL-Injection
Serangan SQL-Injection adalah serangan memasukkan query SQL yang seharusnya tidak dijalankan. Serangan ini seringkali masuk melalui payload-payload yang berisikan parameter pada SQL.
Salah satu contoh serangan SQL adalah ketika pada server terdapat query `SELECT * FROM account where username = ...` yang mana where tersebut berisikan parameter yang diisi oleh payload sehingga ketika terdapat payload berisikan `1; SELECT * FROM payment` maka data pada tabel payment akan terkirim juga. Salah satu cara mencegahnya adalah dengan menggunakan SQL Query Builder seperti pada TypeORM karena Query Builder membangun query SQL satu persatu-satu tidak menjadi satu klausa yang panjang. Selain itu, binding pada parameter juga dilakukan belakangan guna menghindari parameter yang tidak baik.
![image](https://github.com/Marthenn/wbd-2-rest/assets/89301265/b62294e1-89be-4f9e-947f-eb817ca87ab0)
Pada tangkapan layar di atas, seharusnya terlihat juga seluruh data akun termasuk password tetapi tidak karena menggunakan SQL Query Builder dari TypeORM.

### HTML dan CSS Injection
Sesuai namanya, HTML dan CSS injection berarti terdapat potongan HTML dan/atau CSS yang diinjeksi ke web untuk menjalankah hal-hal yang seharusnya tidak diperbolehkan.

### JWT-Attack
Serangan JWT-Attack terjadi ketika adanya JWT yang terkirim ke server tetapi JWT tersebut telah dimodifikasi. Umumnya serangan ini digunakan untuk membypas autentikasi guna mendapatkan akses kontrol melalui impersonifikasi pengguna yang telah terautentikasi. Salah satu metode penanganan yang paling mudah adalah dengan melakukan verify pada JWT signature.

### File Upload Vulnerabilities
File upload vulnerabilities merupakan jenis serangan yang terjadi ketika server tidak melakukan verifikasi yang baik terhadap file yang diupload. Verifikasi tersebut antara lain mengcakupi: nama, tipe, konten, dan ukuran. Ketika gagal diverifikasi, file tersebut dapat menyebabkan beberapa bahaya seperti gagalnya server karena file yang terlalu besar dan/atau dijalankannya skrip yang tidak seharusnya. Sesuai titik lemahnya, serangan ini dicegah dengan melakukan verifikasi ke file yang diupload ke server.

## Pembagian Tugas
1. Backend x
2. Backend y
