# wbd-2-rest
> WBD-2-REST merupakan repository Web Service berbasis protokol REST yang menyediakan layanan untuk memakai Web Method yang dimiliki oleh WEBWBD pada Tugas Besar 2 IF3110-Pengembangan Aplikasi Berbasis Web. Web Service ini dibangun dengan menggunakan ExpressTS dan di deploy dengan menggunakan Node.JS.

## Skema Basis Data
![image](https://github.com/Marthenn/wbd-2-rest/assets/89301265/a321ebb8-425a-4f8d-b0fd-6f4c80be45ca)

## Endpoint API
1. `/api/account` untuk segala hal yang berkaitan dengan akun seperti `/api/account/details/:uid` untuk mendapatkan detail dari suatu akun
2. `/api/book` untuk segala hal yang berkaitan dengan buku seperti `/api/book/details/:book_id/count` untuk mendapatkan jumlah halaman buku
3. `/api/favoritebook` untuk segala hal yang berkaitan dengan favoritebooks seperti `/favoritebook/:uid/:book_id` untuk menambahkan dan menghapus favorite book dari suatu akun
4. `/api/membership` untuk segala hal yang berkaitan dengan status membership seperti `/api/membership/request` untuk mendapatkan status request dan membuat request

## Security
### SQL-Injection
Serangan SQL-Injection adalah serangan memasukkan query SQL yang seharusnya tidak dijalankan. Serangan ini seringkali masuk melalui payload-payload yang berisikan parameter pada SQL.
Salah satu contoh serangan SQL adalah ketika pada server terdapat query `SELECT * FROM account where username = ...` yang mana where tersebut berisikan parameter yang diisi oleh payload sehingga ketika terdapat payload berisikan `1; SELECT * FROM payment` maka data pada tabel payment akan terkirim juga. Salah satu cara mencegahnya adalah dengan menggunakan SQL Query Builder seperti pada TypeORM karena Query Builder membangun query SQL satu persatu-satu tidak menjadi satu klausa yang panjang. Selain itu, binding pada parameter juga dilakukan belakangan guna menghindari parameter yang tidak baik.
![image](https://github.com/Marthenn/wbd-2-rest/assets/89301265/b62294e1-89be-4f9e-947f-eb817ca87ab0)
Pada tangkapan layar di atas, seharusnya terlihat juga seluruh data akun termasuk password tetapi tidak karena menggunakan SQL Query Builder dari TypeORM.

### HTML dan CSS Injection
Sesuai namanya, HTML dan CSS injection berarti terdapat potongan HTML dan/atau CSS yang diinjeksi ke web. Secara umum, injeksi HTML dan CSS tidak terlalu berbahaya pada zaman modern karena HTML dan CSS notabene hanyalah visual. Salah satu metode pencegahannya adalah dengan menggunakan CSP Header (Content-Security-Policy Header) yang mendefinisikan dari domain mana sajakah HTML, CSS, dan JS dapat dijalakan.

### JWT-Attack
Serangan JWT-Attack terjadi ketika adanya JWT yang terkirim ke server tetapi JWT tersebut telah dimodifikasi. Umumnya serangan ini digunakan untuk membypas autentikasi guna mendapatkan akses kontrol melalui impersonifikasi pengguna yang telah terautentikasi. Salah satu metode penanganan yang paling mudah adalah dengan melakukan verify pada JWT signature. Berikut contoh serangan dengan JWT signature yang salah dari server.
![image](https://github.com/Marthenn/wbd-2-rest/assets/89301265/61fc45ed-89c6-48e5-8721-bec296a90388)


### File Upload Vulnerabilities
File upload vulnerabilities merupakan jenis serangan yang terjadi ketika server tidak melakukan verifikasi yang baik terhadap file yang diupload. Verifikasi tersebut antara lain mengcakupi: nama, tipe, konten, dan ukuran. Ketika gagal diverifikasi, file tersebut dapat menyebabkan beberapa bahaya seperti gagalnya server karena file yang terlalu besar dan/atau dijalankannya skrip yang tidak seharusnya. Sesuai titik lemahnya, serangan ini dicegah dengan melakukan verifikasi ke file yang diupload ke server.

## Pembagian Tugas
1. Backend JWT: 13521144
2. Backend Books: 13521088, 13521144, 13521157
3. Backend Account: 13521144, 13521157
4. Backend SOAP: 13521144, 13521157
5. Database: 13521144, 13521157
6. ORM: 13521144, 13521157
7. Docker: 13521144, 13521157
