-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 26, 2025 at 10:18 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `radarbanjarmasin`
--

-- --------------------------------------------------------

--
-- Table structure for table `advertisement`
--

CREATE TABLE `advertisement` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `size` varchar(50) NOT NULL,
  `price` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `advertisement`
--

INSERT INTO `advertisement` (`id`, `name`, `size`, `price`, `created_at`, `updated_at`) VALUES
(1, 'Iklan Baris', '2-5 baris', 10000, '2025-09-26 15:29:47', '2025-09-26 15:29:47'),
(2, 'Iklan Kolom', '1 kolom', 30000, '2025-09-26 15:29:47', '2025-09-26 15:29:47'),
(3, 'Iklan Display', '1/2 halaman', 80000, '2025-09-26 15:29:47', '2025-09-26 15:29:47');

-- --------------------------------------------------------

--
-- Table structure for table `advertisement_content`
--

CREATE TABLE `advertisement_content` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `advertisement_id` int(11) NOT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `advertisement_content`
--

INSERT INTO `advertisement_content` (`id`, `user_id`, `advertisement_id`, `transaction_id`, `content`, `photo`, `start_date`, `end_date`, `is_active`, `created_at`) VALUES
(1, 3, 2, 2, 'test aja', '1758873757109_ad_Untitled1.png', '2025-09-29 00:00:00', '2025-09-30 00:00:00', 1, '2025-09-26 08:02:37'),
(2, 4, 1, 4, 'test iklan2', '1758873845716_ad_Orchid-01.jpg', '2025-09-28 00:00:00', '2025-10-08 00:00:00', 0, '2025-09-26 08:04:05'),
(3, 4, 3, 5, 'iklan displat test', '1758873968321_ad_689f49dad9205774b1e23c5c478640d2.jpg', '2025-09-30 00:00:00', '2025-10-04 00:00:00', 1, '2025-09-26 08:06:08'),
(5, 5, 1, 8, 'iklan baris', '1758874259678_ad_yC2_LYgX_400x400.jpg', '2025-10-20 00:00:00', '2025-11-04 00:00:00', 0, '2025-09-26 08:10:59');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` enum('Keuangan','Bisnis','Politik','Gaya Hidup','Teknologi','Makanan','Hiburan','Olahraga') NOT NULL,
  `author` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `content` longtext NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `category`, `author`, `location`, `content`, `photo`, `created_at`, `updated_at`) VALUES
(1, 'Bocoran Potensi Investasi China ke RI usai Prabowo Temui Xi Jinping', 'Politik', 'Najwa Shihab', 'Beijing, China', '<p><strong>Beijing, Radar Banjarmasin --</strong> Presiden RI Prabowo Subianto menghadiri pertemuan bilateral dengan Presiden China Xi Jinping pada Rabu (3/9).</p>\r\n<p>Menteri Koordinator Bidang Perekonomian Airlangga Hartarto mengungkapkan hasil pertemuan Presiden Prabowo Subianto dengan Presiden China Xi Jinping di Beijing kemarin. Ada beberapa investasi China yang dibahas dalam pertemuan itu, salah satunya proyek petrokimia di Kalimantan Utara.</p>\r\n<p>\"Memang ada beberapa investasi China yang sekarang lagi menunggu persetujuan dari China-nya itu sendiri. Termasuk salah satunya adalah petrochemicals project di Kalimantan Utara,\" sebut Airlangga di Kompleks Istana Kepresidenan, Jakarta Pusat, Kamis (4/9/2025).</p>\r\n<p>Dia tak merinci soal potensi investasi petrokimia yang dimaksud. Ketika ditanya apakah akan melibatkan Pertamina, Airlangga bilang pemerintah masih mencari pihak dari dalam negeri yang bisa diajak bekerja sama untuk proyek tersebut.</p>\r\n<p>Dia juga sempat ditanya soal kabar kontrak pesawat jet J-10 pabrikan China, namun enggan mengkonfirmasi soal kabar tersebut. <em>\"Ya nanti kami lihat,\"</em> katanya singkat.</p>\r\n<p>Airlangga juga sempat ditanya soal proyek Giant Sea Wall l (GSW) di pantai utara Jawa yang dibicarakan oleh Prabowo dan Xi Jinping. Menurutnya, Indonesia terbuka dengan potensi yang masuk dari pihak China.</p>\r\n<p>\"Kan biasanya infrastruktur yang diminta termasuk pembiayaan,\" sebut Airlangga.</p>', 'news-1757080739840-187580805.jpeg', '2025-09-26 07:31:20', '2025-09-26 07:31:20'),
(2, 'Optimis Pangkas Suku Bunga, Wall Street Cetak Rekor Tertinggi', 'Keuangan', 'Ayu Rahmawati', 'New York, Amerika Serikat', '<p><strong>New York, Radar Banjarmasin --</strong> Pasar saham Amerika Serikat (AS) Wall Street kompak dibuka menguat. Bahkan S&amp;P 500 dan Nasdaq mencapai rekor tertinggi setelah data ketenagakerjaan AS melemah.</p>\r\n<p>Pada pembukaan perdagangan hari ini Jumat (5/9/2025), Dow Jones dibuka terapresiasi 0,08% di level 45.656,49. Begitu juga dengan S&amp;P 500 naik 0,36% di level 6.525,38, dan Nasdaq menguat 0,70% di level 21.860,44.</p>\r\n<p>Pertumbuhan lapangan kerja AS melemah tajam pada periode Agustus sementara tingkat pengangguran meningkat ke level tertinggi hampir empat tahun di angka 4,3%. Hal ini menegaskan bahwa kondisi pasar tenaga kerja sedang melemah dan memperkuat alasan penurunan suku bunga oleh The Federal Reserve( The Fed) bulan ini.</p>\r\n<p>Laporan ketenagakerjaan yang diawasi ketat dari Departemen Tenaga Kerja pada hari Jumat juga menunjukkan bahwa perekonomian kehilangan lapangan kerja pada bulan Juni untuk pertama kalinya dalam 4,5 tahun. Pertumbuhan lapangan kerja telah bergeser ke arah stagnan, dengan para ekonom menyalahkan tarif impor yang diberlakukan Presiden Donald Trump dan tindakan keras imigrasi yang telah mengurangi jumlah tenaga kerja. Pelemahan di pasar tenaga kerja sebagian besar berasal dari sisi perekrutan. Jumlah pengangguran lebih banyak daripada lowongan pekerjaan pada bulan Juli untuk pertama kalinya sejak pandemi COVID-19.</p>\r\n<p>Bea masuk Trump, yang telah mendorong tarif rata-rata nasional ke level tertinggi sejak 1934, memicu kekhawatiran inflasi yang lebih tinggi, yang mendorong bank sentral AS untuk menghentikan siklus pemotongan suku bunganya. Ketika ketidakpastian atas kebijakan perdagangan mulai mereda dengan diberlakukannya sebagian besar tarif, pengadilan banding AS memutuskan Jumat lalu bahwa banyak bea masuk tersebut ilegal, yang membuat bisnis terus bergejolak.</p>\r\n<p><em>\"Peringatan yang berdentang di pasar tenaga kerja sebulan lalu semakin keras,\" ujar Olu Sonola, kepala riset ekonomi AS di Fitch Ratings. \"The Fed kemungkinan akan memprioritaskan stabilitas pasar tenaga kerja daripada mandat inflasinya, meskipun inflasi semakin jauh dari target 2%. Sulit untuk membantah bahwa ketidakpastian tarif bukanlah pendorong utama pelemahan ini.\"</em></p>\r\n<p>Jumlah pekerja nonpertanian hanya meningkat 22.000 bulan lalu setelah naik 79.000 pada bulan Juli, menurut Biro Statistik Tenaga Kerja Departemen Tenaga Kerja. Ekonom yang disurvei oleh Reuters memperkirakan jumlah pekerja akan naik 75.000 posisi setelah sebelumnya dilaporkan naik 73.000 pada bulan Juli. Estimasinya berkisar dari tidak ada penambahan lapangan kerja hingga 144.000 lapangan kerja yang tercipta.</p>\r\n<p>Revisi juga menunjukkan jumlah lapangan kerja menurun 13.000 pada bulan Juni, penurunan pertama sejak Desember 2020, alih-alih meningkat 14.000, seperti yang dilaporkan bulan lalu.</p>', 'news-1757085183035-961679938.jpeg', '2025-09-26 07:32:19', '2025-09-26 07:32:19'),
(3, 'Patut Dicontoh! Ini Strategi Investasi ala Nabi Muhammad', 'Keuangan', 'Heranof Al Basyir', 'Martapura, Indonesia', '<p><strong>Martapura, Radar Banjarmasin --</strong> Bagi umat Islam, Nabi Muhammad SAW dikenal sebagai nabi dan rasul yang menjadi teladan utama dalam kehidupan spiritual. Berbagai peristiwa penting dalam hidup Sang Baginda Rasulullah, seperti turunnya Al-Qur\'an dan peristiwa Isra Mikraj, telah menjadi sumber inspirasi bagi muslim di seluruh dunia.</p>\r\n<p>Namun, tidak hanya dikenal sebagai sosok spiritual dan panutan dalam keimanan umat Islam, Nabi Muhammad juga merupakan figur sukses dalam dunia bisnis.</p>\r\n<p>Dalam riset The Rasulullah Way of Business (2021), Nabi Muhammad memiliki modal kepercayaan dan akhirnya bisa mendapatkan investor karena jujur dan amanah.</p>\r\n<p>Berikutnya setelah menjalankan usaha dari kumpulan uang para pemodal, Nabi Muhammad melakukan bagi hasil pada keuntungan usahanya. Kemudian berinvestasi dengan tujuan mendapatkan passive income.</p>\r\n<p>Salah satu yang dilakukan adalah beternak. Nabi Muhammad melanjutkan keahliannya sejak kecil itu hingga dewasa dengan memiliki puluhan ekor unta. Rasulullah diketahui juga memiliki beberapa hewan lain yakni kuda, keledai, sapi, dan domba.</p>\r\n<p>Selain beternak, Nabi Muhammad berinvestasi pula pada tanah dan properti. Laporan Musaffa menyebutkan sewa tanah dilakukan pada orang Yahudi dengan konsep bagi hasil.</p>\r\n<p>Nabi Muhammad juga menyewa kebun kurma dan tanah di Khaybar pada orang Yahudi. Mereka bisa tinggal di tanah tersebut serta mengelolanya dan membagi keuntungannya. Konsep bagi hasil disebut sebagai mudharabah.</p>\r\n<p>Satu hal yang perlu diingat dari investasi Nabi Muhammad adalah terkait bersedekah. Islam mengajarkan ada hak orang lain dalam harta kekayaan manusia dan dengan membantu orang lain maka mendapatkan keuntungan luar biasa.</p>\r\n<p>Nabi Muhammad tidak menyimpan harta kekayaannya. Rasulullah dikenal sebagai sosok yang sering bersedekah, dari uang, pakaian maupun makanan. Jadi jika ingin mengikuti Nabi Muhammad dalam berinvestasi pilihlah dengan properti, lahan, dan hewan ternak. Jangan lupa juga untuk bersedekah.</p>', 'news-1757085565524-741531988.jpg', '2025-09-26 07:33:25', '2025-09-26 07:33:25'),
(4, 'Pernah Makan Korban, Ini Arti Saham Gorengan dan Ciri-cirinya!', 'Keuangan', 'Ayu Rahmawati', 'Jakarta, Indonesia', '<p><strong>Jakarta, Radar Banjarmasin --</strong> Ketertarikan masyarakat tentang pasar saham semakin tinggi, mengingat potensi cuan yang cukup besar. Meski demikian, ketertarikan ini harus diimbangi dengan pengetahuan yang lebih mendalam agar tidak tertipu mentah-mentah.</p>\r\n<p>Hal ini mengingat fluktuasi karena kinerja perusahaan dan juga faktor eksternal, harga saham suatu emiten juga sering kali bergerak karena adanya manipulasi atau \"digoreng\". Aksi \"saham gorengan\" ini kerap menelan korban para investor ritel.</p>\r\n<p>Lantas, apa itu sebenarnya yang dimaksud dengan saham gorengan? Berikut ini adalah definisi dan ciri-cirinya, serta tips untuk tetap aman bertransaksi saham gorengan di bursa.</p>\r\n<p>Tidak sulit untuk melihat sebuah saham termasuk gorengan atau tidak. Saham gorengan itu sejatinya seperti makanan gorengan seperti pisang molen, pisang goreng, tahu goreng, bakwan, cireng, atau risol, yang akan semakin renyah dan garing jika digorengnya lama.</p>\r\n<p>Apalagi jika gorengannya digoreng menggunakan minyak bekas (jelantah) yang belum diganti oleh minyak baru, tentu kentalnya minyak akan pula menambah kenikmatan si gorengan. Namun, jangan lupa bahwa makanan yang digoreng tentu lebih tidak sehat bagi kesehatan dibanding makanan rebus, apalagi gorengan yang kaya atau bahkan berlebihan kolesterolnya.</p>\r\n<p>Oleh karena itu, saham gorengan dapat diartikan sebagai saham perusahaan yang kenaikannya di luar kebiasaan karena pergerakannya sedang direkayasa oleh pelaku pasar dengan tujuan kepentingan tertentu.</p>\r\n<p>Sama seperti makanan gorengan, larangan mengonsumsi gorengan sebetulnya lebih kepada menjaga kesehatan, sehingga sekali-sekali dapat dikonsumsi asalkan sudah paham dengan karakteristik dan risikonya.</p>\r\n<p>Selain jangan sering-sering dan jangan jadikan pengalaman membeli saham gorengan menjadi pengantar Anda memasuki pasar saham, investor juga haruslah aktif memantau pasar agar tidak ketinggalan dengan komando yang didapatkan oleh bandar melalui trader lain di pasar.&nbsp;Berdasarkan rangkuman CNBC Indonesia, berikut ciri-ciri saham gorengan:</p>\r\n<p><strong>Masuk daftar UMA</strong></p>\r\n<p>Salah satu ciri saham gorengan adalah masuk ke dalam daftar unusual market activity (UMA). Saham tersebut biasanya disemprit duluan oleh PT Bursa Efek Indonesia karena kenaikan yang terlalu ekstrem lebih dari 2 hari. Definisi ekstrem adalah naik hingga batas terbesar harian (auto reject atas, ARA), baik 20%, 25%, atau 35% per hari, tergantung dari harga sahamnya.</p>\r\n<p>Untuk kelas saham di atas Rp 5.000/saham, ARA-nya hanya 20%. Saham di antara Rp 200-Rp5.000/saham 25%. Dan saham dengan harga Rp 50-Rp 200/sahama adalah sebesar 35% per harinya.</p>\r\n<p>Karena sudah masuk radar bursa, maka UMA juga dapat menjadi alarm dan peringatan kepada investor dan trader di pasar bahwa penguatan harganya sudah di luar kebiasaan dan ada kemungkinan saham tersebut sedang dibandari predator pasar.</p>\r\n<p><strong>Volume dan nilai transaksi</strong></p>\r\n<p>Selain itu investor juga dapat melihat dari volume dan nilai transaksi harian saham tersebut. Lazimnya saham gorengan memiliki kapitalisasi pasar yang kecil dan masuk kategori lapis dua atau saham lapis tiga, tetapi volume dan nilai transaksi hariannya sangat tinggi dibandingkan dengan perusahaan sejenis, bahkan menyamai transaksi saham unggulan (blue chip).</p>\r\n<p>Sebagai informasi, kapitalisasi pasar adalah ukuran besarnya sebuah perusahaan, didapatkan dari jumlah saham beredar perseroan dikalikan harga pasarnya. Untuk membandingkan sebuah perusahaan dengan satu atau lebih perusahaan lain yang sejenis, sebaiknya memperhatikan juga kapitalisasi pasarnya karena selisih yang terlalu jauh akan menyebabkan perbandingan kedua saham kurang berimbang.</p>\r\n<p>Dengan kapitalisasi pasar yang kecil dan/atau kepemilikan investor ritel yang mini, maka bandar dapat lebih mudah dan lebih murah mengelola saham-saham gorengan yang menjadi komoditasnya di pasar modal.</p>\r\n<p><strong>Bid dan offer tidak wajar</strong></p>\r\n<p>Bid adalah antrian beli saham di harga rendah, sedangkan offer adalah antrian jual saham di harga tinggi. Saham gorengan biasanya ditransaksikan dalam jumlah besar, tetapi posisi bid dan offer-nya tipis-tipis.</p>\r\n<p>Artinya, hampir di setiap harga antrian, baik bid maupun offer, antreannya tidak merata bahkan sering hanya 1 lot per harga yang memudahkan bandar menaikkan harga sahamnya.</p>\r\n<p><strong>Kinerja keuangan dan informasi emiten tidak sejalan dengan kenaikan harga</strong></p>\r\n<p>Pergerakan harga yang ekstrem dan tidak karuan membuat harga saham gorengan tidak sejalan dengan kinerja keuangan, atau tidak disertai dengan pemberitaan dan informasi dari internal emiten.</p>\r\n<p>Kadang kinerja keuangannya tumbuh 50%, tetapi tidak jarang justru menciut atau kinerjanya turun lebih dari 50% ketika harganya naik kencang tak henti-hentinya, sehingga kenaikan harga saham seringkali tidak beriringan dengan kinerja dan aksi korporasi yang diumumkan emiten.</p>\r\n<p><strong>Tidak dapat dianalisis</strong></p>\r\n<p>Karena kinerja keuangan tidak setinggi kenaikan harga sahamnya di pasar, rasio keuangan dan valuasi saham gorengan biasanya terlalu tinggi dibandingkan pesaing terdekatnya, atau bahkan tidak masuk akal. Dengan kata lain, saham ini tidak dapat dianalisis secara fundamental.</p>\r\n<p>Valuasi yang biasa digunakan perusahaan adalah rasio harga saham per nilai buku (price to book value, P/BV) dan rasio harga saham per laba (earning per share, EPS). Jika valuasi perusahaan terlalu jauh di atas pesaingnya, misalnya ketika rerata PBV sebuah industri di angka 1,5 kali, maka jika ada emiten yang PBV-nya 20 kali atau bahkan 100 kali maka sebaiknya dihindari.</p>\r\n<p>Secara teknikal, pergerakan saham tersebut juga terlalu berfluktuasi atau justru jarang ditransaksikan sehingga tidak memunculkan indikator analisis teknikal sama sekali.</p>', 'news-1757086016937-579569921.jpeg', '2025-09-26 07:34:21', '2025-09-26 07:34:21'),
(5, 'Penyebab Warga RI Miskin Menurut Lo Kheng Hong, Catat!', 'Keuangan', 'Iqbal Kurniadi', 'Jakarta, Indonesia', '<p><strong>Jakarta, Radar Banjarmasin, --</strong> Investor kenamaan dari Indonesia, Lo Kheng Hong, menganggap buruk kebiasaan menabung masyarakat Indonesia.</p>\r\n<p>Alih-alih bisa membuat kaya dan makmur di hari tua, ia menganggap, kebiasaan menabung selama ini malah berpotensi menyebabkan sengsara di masa depan.</p>\r\n<p>Lo Kheng Hong menilai, menabung atau menyimpan uang di bank malah membuat investor perlahan jatuh miskin karena nilai uang selalu turun akibat tergerus inflasi.</p>\r\n<p><em>\"Menyimpan uang di bank sebetulnya membuat kita miskin secara pelan-pelan karena nilai uang kita semakin hari semakin turun,\"</em> kata Lo Kheng Hong saat menjadi pembicara di acara Capital Market Summit &amp; Expo (CMSE) beberapa waktu lalu, dikutip Jumat (5/9/2025).</p>\r\n<p>Selain mengkritisi kebiasaan menabung, Lo Kheng Hong menganggap, membeli obligasi atau surat utang juga bukan pilihannya dalam mengelola keuangan. Sebab, bunga dari hasil pembelian surat utang atau obligasi itu ia anggap kecil.</p>\r\n<p>Dia mengungkapkan alasan utama yang membuat dirinya berinvestasi saham, khususnya di Indonesia. \"Bursa saham Indonesia menawarkan imbal hasil tertinggi di antara bursa saham utama di dunia bagi investor jangka panjang. Sudah terbukti! Saya bersyukur saya ada di dalamnya,\" kata Lo Kheng Hong.</p>\r\n<p>Hingga saat ini, kata Lo Kheng Hong, hampir 99% masyarakat Indonesia tidak percaya kalau investasi saham adalah pilihan terbaik. Masyarakat lebih menempatkan uang di bank atau dibelikan properti, dibanding beli saham.</p>\r\n<p>Lo Kheng Hong merupakan orang yang sangat teliti dan bisa menghabiskan waktu lama membaca laporan keuangan. Usaha yang dilakukan Lo dalam meneliti laporan keuangan menunjukkan tidak sembarangan dalam memilih saham untuk investasi.</p>\r\n<p>Pada 1998, Lo Kheng Hong membeli saham PT United Tractors Tbk (UNTR). Saat itu laba bersih UNTR minus Rp 1 triliun. Akan tetapi pendapatan perusahaan sekitar Rp 2 triliun-Rp 4 triliun dengan laba operasional sekitar Rp 1 triliun. Lo menilai laba bersih tersebut minus karena kurs.</p>\r\n<p>Ini merupakan momentum awal dari kesuksesan Lo Kheng Hong sebagai investor saham. Cerita seperti ini diulang pada saham-saham yang lain.</p>', 'news-1757086267831-427952679.jpg', '2025-09-26 07:35:29', '2025-09-26 07:35:29'),
(6, 'Mantap! Telkomsel Hadirkan Program Spesial di Hari Pelanggan Nasional', 'Teknologi', 'Desi Anwar', 'Jakarta, Indonesia', '<p><strong>Jakarta, Radar Banjarmasin --</strong> Telkomsel menghadirkan berbagai program spesial di titik layanan pelanggan GraPARI di seluruh Indonesia pada momen Hari Pelanggan Nasional.</p>\r\n<p>Inisiatif ini menjadi apresiasi kepada pelanggan yang mendukung dan tumbuh bersama Telkomsel, sekaligus menegaskan komitmen Telkomsel untuk selalu menghadirkan pelayanan terbaik yang relevan dengan kebutuhan masyarakat.</p>\r\n<p>VP Customer Care Management Telkomsel, Filin Yulia, menyatakan mengusung tema \"Semangat Melayani Indonesia\", Telkomsel mengedepankan dedikasi dan energinya dalam melayani sepenuh hati, memberikan pelayanan terbaik dan inovatif bagi seluruh pelanggan.</p>\r\n<p><em>\"Hari Pelanggan Nasional adalah momen yang penting bagi kami untuk menunjukkan apresiasi kepada pelanggan setia. Dengan semangat melayani Indonesia, kami berkomitmen untuk terus berinovasi dan memberikan layanan terbaik yang berorientasi pada kebutuhan pelanggan,\"</em> kata dia dikutip Jumat (5/9/2025).</p>\r\n<p>Berbagai program yang dihadirkan di GraPARI, termasuk pengalaman 5G yang edukatif dan interaktif, voucher khusus untuk transaksi di MyGraPARI dan GraPARI Online, serta layanan instalasi IndiHome satu hari selesai bagi pelanggan baru.</p>\r\n<p>Kemudian bagi pelanggan baru Telkomsel Halo dan pelanggan yang membeli produk Orbit akan mendapatkan beragam e-voucher yang menarik.</p>\r\n<p>Tersedia pula tambahan kuota 4 GB bagi pelanggan yang membayar tagihan pada 4 September, penawaran diskon tagihan Halo, serta penawaran Device Bundling khusus melalui Device Corner TShop di sejumlah GraPARI.</p>\r\n<p><em>\"Melalui rangkaian program ini, kami ingin memastikan pelanggan dapat merasakan pengalaman yang lebih baik dan berkesan dari Telkomsel. Selamat Hari Pelanggan Nasional 2025!\"</em> tutup Filin.</p>', 'news-1757086540156-653612896.jpeg', '2025-09-26 07:36:18', '2025-09-26 07:36:18'),
(7, 'Iphone 17 Rilis Minggu Depan, Harganya Bakal Naik Gila-gilaan', 'Teknologi', 'Desi Anwar', 'Batam, Indonesia', '<p><strong>Batam, Radar Banjarmasin --</strong> Harga jual iPhone 17 atau seri terbaru berpotensi naik, meskipun CEO Apple Tim Cook berhasil menahan harga jual ponsel pintar bikinan Steve Jobs itu beberapa bulan terakhir dari dampak kebijakan tarif perdagangan Trump.</p>\r\n<p>Tim Cook sebenarnya sempat dipuji oleh Wall Street atas pekerjaannya dalam mengelola hubungan dengan Presiden AS Donald Trump, supaya tak terdampak tarif dagang resiprokal, berdasarkan laporan CNBC Internasional.</p>\r\n<p>Selain menawarkan ke Trump tambahan investasi di AS sebesar US$100 miliar, ia juga sempat menghadiahkan Presiden Donald Trump sebuah plakat yang terbuat dari emas 24 karat dengan ornamen kaca bundar berlogo Apple dan tanda tangannya di bagian bawah.</p>\r\n<p><em>\"Terima kasih semuanya, dan terima kasih Presiden Trump karena telah menempatkan inovasi dan lapangan kerja Amerika di posisi terdepan,\"</em> ujar Cook saat acara pemberian plakat pada awal Agustus 2025, dikutip Jumat (5/9/2025).</p>\r\n<p>Langkah Cook itu membuat total pengeluaran Apple yang direncanakan mencapai US$ 600 miliar di AS selama lima tahun ke depan. Trump, di acara tersebut, mengatakan bahwa Apple akan dibebaskan dari tarif yang akan datang untuk cip yang harganya bisa dua kali lipat.</p>\r\n<p>Namun saat Apple bersiap mengumumkan iPhone seri baru pada Selasa lalu, beberapa analis memperkirakan Apple akan tetap menaikkan harga perangkatnya bahkan setelah Cook berusaha semaksimal mungkin menghindari tarif terburuk.</p>\r\n<p><em>\"Banyak perbincangan tentang: Apakah harga iPhone akan naik?\"</em> kata direktur riset CounterPoint, Jeff Fieldhack.</p>\r\n<p>Meskipun ponsel pintar belum mengalami kenaikan harga yang signifikan, produk konsumen lainnya mengalami kenaikan harga yang didorong oleh biaya tarif, termasuk pakaian, alas kaki, dan kopi. Tarif ini juga telah memengaruhi beberapa produk elektronik, terutama video game - Sony, Microsoft, dan Nintendo telah menaikkan harga konsol tahun ini di AS.</p>\r\n<p>Beberapa analis Wall Street memperkirakan Apple akan menyusul. Analis Jeffries, Edison Lee, memasukkan kenaikan harga sebesar US$ 50 (Rp 823.000-an) ke dalam proyeksi harga jual rata-rata iPhone 17 dalam sebuah catatan di bulan Juli. Ia memberikan peringkat hold untuk saham Apple.</p>\r\n<p>Analis Goldman Sachs mengatakan bahwa potensi kenaikan harga dapat meningkatkan harga jual rata-rata perangkat Apple dari waktu ke waktu, dan campuran ponsel perusahaan tersebut telah condong ke harga yang lebih mahal.</p>\r\n<p>Tahun ini, banyak pengamat rantai pasokan memperkirakan Apple akan mengganti model Plus, yang tertinggal dari jajaran produk lainnya, dengan perangkat baru yang lebih ramping yang mengorbankan kamera dan fitur tambahan demi bodi yang lebih tipis dan ringan.</p>\r\n<p><em>\"Bentuk yang lebih tipis dan ringan mungkin akan mendorong minat permintaan,\"</em> tulis analis Goldman, tetapi kekurangan seperti masa pakai baterai mungkin akan menyulitkannya untuk bersaing dengan model entry-level Apple.</p>\r\n<p>Para analis memperkirakan perangkat ramping ini akan dibanderol sekitar US$ 899, serupa dengan harga iPhone 16 Plus, tetapi mereka tidak menutup kemungkinan akan ada kenaikan harga. Harga tersebut tetap lebih rendah dari Galaxy Edge tipis Samsung , yang memulai debutnya awal tahun ini dengan harga US$ 1.099.</p>\r\n<p>Apple tidak menanggapi permintaan komentar dari CNBC Internasional terkait prediksi kenaikan harga jual produknya dari para analis tersebut.</p>\r\n<p>Sebetulnya, Apple sejak Trump mengumumkan pengenaan tarif resiprokal pada Februari 2025 telah terancam terdampak karena memproduksi sebagian besar iPhone dan produk lainnya di Tiongkok. Trump bahkan juga mengenakan tarif yang tinggi ke negara lini produksi Apple lainnya, yakni Vietnam dan India.</p>\r\n<p>Namun, tujuh bulan kemudian, Apple berhasil mengatasi tarif lebih baik dari yang dibayangkan banyak orang.</p>\r\n<p>Pemerintah AS telah menghentikan sementara tarif paling ketat terhadap China beberapa kali, telepon pintar mendapat pengecualian tarif dan Cook pada Mei mengatakan kepada para investor bahwa perusahaannya mampu mengatur ulang rantai pasokannya untuk mengimpor iPhone ke AS dari India, yang tarifnya lebih rendah.</p>\r\n<p>Cook juga berhasil memanfaatkan hubungannya dengan Trump, mengunjunginya di Gedung Putih dan memihaknya pada Agustus, ketika Cook menyerahkan cinderamata berkilau itu kepada Trump. Komitmen tersebut memperkuat dorongan Trump untuk membawa lebih banyak manufaktur berteknologi tinggi ke AS. Sebagai imbalannya, Trump mengatakan ia juga akan membebaskan Apple dari tarif semikonduktor yang akan datang. Dan tarif IEEPA Trump dinyatakan ilegal pada akhir Agustus, meskipun masih berlaku.</p>\r\n<p>Apple tidak sepenuhnya berhasil terhindar dari konsekuensi tarif. Cook mengatakan perusahaan menghabiskan US$ 800 juta untuk biaya tarif hingga akhir Juni, terutama karena tarif berbasis IEEPA terhadap Tiongkok. Jumlah tersebut kurang dari 4% terhadap laba perusahaan, tetapi Apple memperingatkan bahwa mereka dapat menghabiskan US$ 1,1 miliar pada kuartal ini untuk biaya tarif.</p>\r\n<p>Setelah berbulan-bulan menanggung sendiri biaya tarif, Apple mungkin akhirnya membebankan biaya tersebut kepada konsumen melalui peluncuran model iPhone 17 bulan ini.</p>', 'news-1757086815930-561068567.jpeg', '2025-09-26 07:37:28', '2025-09-26 07:37:28'),
(8, 'Cari Kerja Makin Susah, Waspada Modus Penipuan Loker Kuras Rekening', 'Teknologi', 'Najwa Shihab', 'Banjarbaru, Indonesia', '<p><strong>Banjarbaru, Radar Banjarmasin --</strong> Penipuan lowongan pekerjaan tengah marak di level global, setelah para peretas dari Korea Utara membuat lowongan kerja palsu yang menargetkan industri kripto untuk menggesek uang korbannya.</p>\r\n<p>Berdasarkan laporan Reuters, peretas yang berpura-pura sebagai perekrut akan menghubungi targetnya melalui LinkedIn atau Telegram dengan penawaran lowongan kerja terkait blockchain.</p>\r\n<p><em>\"Saat ini kami sedang memperluas tim kami,\"</em> demikian bunyi pesan LinkedIn tertanggal 20 Januari yang dikirimkan dari seorang perekrut yang mengaku mewakili Bitwise Asset Management kepada targetnya, Victoria Perepel, sebagaimana dilansir Reuters, Jumat (5/9/2025).</p>\r\n<p><em>\"Kami secara khusus mencari individu yang memiliki minat yang besar terhadap pasar mata uang kripto,\"</em> tulis pesan tersebut.</p>\r\n<p>Setelah berbasa-basi singkat tentang pekerjaan dan kompensasi yang ditawarkan, perekrut akan mendorong calon pelamar untuk mengunjungi situs web yang kurang dikenal untuk mengikuti tes keterampilan dan merekam video. Pada titik ini, beberapa target mulai curiga. bersikeras agar Haglund mengunduh kode untuk merekam video. \"Kami mengikuti proses perekrutan yang terstruktur, dan penilaian video merupakan bagian penting dari evaluasi kami untuk memastikan konsistensi dan keadilan bagi semua kandidat,\" ujar Slizewski dalam pesan LinkedIn.</p>\r\n<p>Haglund akhirnya mengakhiri wawancara, tetapi yang lain tidak. Seorang manajer produk untuk sebuah perusahaan mata uang kripto AS, yang berbicara dengan syarat anonim karena tidak ingin dikenal sebagai pencari kerja, mengatakan ia merekam video tersebut dan mengirimkannya kepada seseorang yang mengaku sedang merekrut untuk perusahaan mata uang kripto Ripple Labs.</p>\r\n<p>Malam itu, ketika ia menyadari bahwa ether dan Solana senilai US$ 1.000 hilang dari dompet digital yang ia simpan di komputernya, ia baru menyadari bahwa ia telah ditipu. Ketika ia mencari profil LinkedIn perekrut Ripple tersebut, profil tersebut sudah hilang.</p>\r\n<p>Dalam kasus lain, konsultan Ben Humbert sedang berbicara melalui LinkedIn dengan Mirela Tafili, seorang perekrut yang mengaku bertindak atas nama bursa mata uang kripto Kraken, mengenai peluang baru untuknya sebagai manajemen proyek.</p>\r\n<p>Tafili meminta Humbert untuk menyelesaikan \"wawancara virtual singkat\" dan memberikan tautan yang menurut Tafili akan membantu mereka \"mempercepat proses\" dan membawanya ke tahap berikutnya. Humbert mengatakan ia merasa curiga dan mengakhiri percakapan tersebut.</p>\r\n<p>Ripple dan Bitwise tidak membalas pesan Reuters yang meminta komentar terkait masalah itu. Dalam sebuah pernyataan, Robinhood mengatakan bahwa mereka \"mengetahui adanya kampanye loker itu awal tahun ini yang mencoba menyamar sebagai beberapa perusahaan kripto, termasuk Robinhood\".</p>\r\n<p>Robinhood mengklaim telah mengambil tindakan untuk menonaktifkan domain web yang terkait dengan penipuan tersebut.</p>\r\n<p>Sementara itu, LinkedIn mengatakan dalam sebuah pernyataan bahwa akun-akun perekrut palsu yang diidentifikasi oleh Reuters telah ditindak lanjuti sebelumnya. Sedangkan Telegram mengatakan penipuan telah diberantas di mana pun saat ditemukan. Upaya Reuters untuk menghubungi para peretas tidak berhasil.</p>\r\n<p>SentinelOne dan Validin mengaitkan pencurian tersebut dengan operasi Korea Utara yang sebelumnya dijuluki \"Contagious Interview\", membuka tab baruoleh perusahaan keamanan siber Palo Alto Networks.</p>\r\n<p>Para peneliti yang melacak kampanye penipuan tersebut menyimpulkan bahwa Korea Utara berada di baliknya berdasarkan beberapa faktor, termasuk penggunaan alamat protokol internet dan email yang terkait dengan aktivitas peretasan Korea Utara sebelumnya.</p>\r\n<p>Sebagai bagian dari penyelidikan mereka, para peneliti mengungkap berkas log yang secara tidak sengaja terekspos oleh para peretas yang menampilkan email dan alamat IP lebih dari 230 orang - pembuat kode, pemberi pengaruh atau influencer, akuntan, konsultan, eksekutif, pemasar, dan banyak lagi - yang menjadi sasaran antara bulan Januari dan Maret.</p>\r\n<p>Reuters menghubungi semua target untuk memberi tahu mereka tentang aktivitas berbahaya tersebut. Kesembilan belas orang yang berbicara kepada kantor berita Reuters semuanya mengonfirmasi bahwa mereka menjadi target sekitar waktu tersebut.</p>\r\n<p>Salah satu perusahaan yang disamarkan oleh para peretas mengatakan bahwa hal ini merupakan hal yang umum terjadi di dunia kripto. <em>\"Setiap hari ada sesuatu yang terjadi,\"</em> kata Nick Percoco, kepala keamanan Kraken.</p>\r\n<p>Misi Korea Utara untuk Perserikatan Bangsa-Bangsa tidak membalas pesan yang meminta komentar atas temuan Reuters. Pyongyang secara rutin membantah melakukan pencurian mata uang kripto.</p>\r\n<p>Target yang diidentifikasi oleh Reuters hanyalah \"sebagian kecil\" dari calon korban Contagious Interview, yang pada gilirannya mewakili sebagian kecil dari keseluruhan upaya pencurian mata uang kripto oleh Korea Utara, kata Aleksandar Milenkoski, peneliti senior di SentinelOne yang merupakan salah satu penulis pendamping laporan tersebut.</p>\r\n<p><em>\"Mereka seperti kelompok penipu pada umumnya,\"</em> katanya. <em>\"Mereka mengincar jangkauan yang luas.\"</em></p>\r\n<p>Percoco, eksekutif Kraken, mengatakan perusahaan mulai melihat penipuan rekrutmen akhir tahun lalu, dengan laporan yang terus berlanjut hingga Maret, April, dan Mei. Perusahaan menggunakan alat untuk mencari akun palsu yang mengaku sebagai perekrut, tetapi juga menerima laporan dari pihak luar yang akan menghubungi dan mengatakan, <em>\"Hei, saya sedang wawancara kerja dengan kalian, lalu ternyata penipuan sungguhan,\"</em> kata Percoco.</p>\r\n<p>Ia mengatakan sulit bagi perusahaan untuk mengawasi peniruan tersebut. <em>\"Siapa pun di luar sana dapat mengatakan bahwa mereka adalah perekrut,\"</em> katanya.</p>\r\n<p>Tuduhan bahwa Pyongyang menargetkan dunia blockchain dengan penipuan canggih bukanlah hal baru. Akhir tahun lalu, Biro Investigasi Federal AS atau FBI mengeluarkan peringatan publik bahwa Korea Utara \"secara agresif\" menargetkan industri mata uang kripto dengan skema rekayasa sosial yang \"kompleks dan rumit\".</p>\r\n<p>Namun, laporan Reuters, yang diperkuat oleh tujuh target dengan tangkapan layar percakapan mereka dengan para peretas, memberikan detail yang sebelumnya tidak dilaporkan tentang bagaimana mereka mengelabui target, beserta rincian taktik mereka.</p>', 'news-1757087161114-767025819.jpeg', '2025-09-26 07:38:18', '2025-09-26 07:38:18'),
(9, 'Trump Mau Ganti \'Departemen Pertahanan\' Jadi \'Departemen Perang\'', 'Politik', 'Elvira Khairunnisa', 'New York, Amerika Serikat', '<p><strong>New York, Radar Banjarmasin --</strong> Presiden Amerika Serikat (AS), Donald Trump berencana untuk mengganti nama Departemen Pertahanan AS menjadi \'Departemen Perang\'.</p>\r\n<p>Melansir Reuters, berdasarkan informasi dari pejabat Gedung putih, perintah eksekutif tersebut berencana akan ditandatangani oleh Trump pada Jumat (5/9/2025) waktu setempat.</p>\r\n<p>Perintah tersebut akan mengizinkan Menteri Pertahanan Pete Hegseth, Departemen Pertahanan, dan pejabat di bawahnya untuk menggunakan gelar sekunder seperti \"Menteri Perang,\" \"Departemen Perang,\" dan \"Wakil Menteri Perang\" dalam korespondensi resmi dan komunikasi publik, menurut lembar fakta Gedung Putih.</p>\r\n<p>Langkah tersebut akan menginstruksikan Hegseth untuk merekomendasikan tindakan legislatif dan eksekutif yang diperlukan agar penggantian nama tersebut permanen.</p>\r\n<p>Sejak menjabat pada bulan Januari, Trump telah berupaya mengganti nama berbagai tempat dan lembaga, termasuk Teluk Meksiko, dan mengembalikan nama asli pangkalan militer yang diubah setelah protes keadilan rasial.</p>\r\n<p>Perubahan nama departemen jarang terjadi dan memerlukan persetujuan Kongres, tetapi rekan-rekan dari partai Republik Trump memegang mayoritas tipis di Senat dan Dewan Perwakilan Rakyat.</p>\r\n<p>Departemen Pertahanan AS sempat disebut Departemen Perang hingga tahun 1949, ketika Kongres menggabungkan Angkatan Darat, Angkatan Laut, dan Angkatan Udara setelah Perang Dunia Kedua. Nama tersebut dipilih sebagian untuk menandakan bahwa di era nuklir, AS berfokus pada pencegahan perang, menurut para sejarawan.</p>\r\n<p>Mengganti nama lagi departemen tersebut akan n membutuhkan biaya besar dan memerlukan pembaruan tanda dan kop surat yang tidak hanya digunakan oleh pejabat di Pentagon di Washington, D.C., tetapi juga instalasi militer di seluruh dunia.</p>\r\n<p>Upaya mantan Presiden Joe Biden untuk mengganti nama sembilan pangkalan yang menghormati para pemimpin Konfederasi dan Konfederasi direncanakan akan menelan biaya Angkatan Darat sebesar US$39 juta.</p>\r\n<p>Upaya tersebut dibatalkan oleh Hegseth awal tahun ini. Tim perampingan pemerintah pemerintahan Trump, yang dikenal sebagai Departemen Efisiensi Pemerintah, telah berupaya melakukan pemangkasan anggaran di Pentagon untuk menghemat anggaran.</p>\r\n<p><em>\"Mengapa tidak mengalokasikan dana ini untuk mendukung keluarga militer atau mempekerjakan diplomat yang membantu mencegah konflik sejak awal?\"</em> kata Senator Demokrat Tammy Duckworth, seorang veteran militer dan anggota Komite Angkatan Bersenjata Senat.</p>\r\n<p><em>\"Karena Trump lebih suka menggunakan militer kita untuk mencetak poin politik daripada memperkuat keamanan nasional kita dan mendukung prajurit kita yang berani beserta keluarga mereka - itulah alasannya,\"</em> katanya kepada Reuters dikutip Jumat (5/9/2025).</p>', 'news-1757087372724-210418045.jpeg', '2025-09-26 07:39:35', '2025-09-26 07:39:35'),
(10, 'Ini Sponge Ajaib dari Teh Hijau & Rumput Laut, Bisa Bantu Diet!', 'Makanan', 'Elvira Khairunnisa', 'Banjarmasin, Indonesia', '<p><strong>Banjarmasin, Radar Banjarmasin --</strong> Sebuah penelitian menemukan cara baru untuk diet. Para peneliti mengembangkan \'sponge\' ajaib untuk menyerap lemak dalam tubuh.</p>\r\n<p>\'Sponge\' itu adalah mikrobead yang terbuat dari polifenol teh hijau, vitamin E dan rumput laut, semuanya bisa dikonsumsi. Peneliti yang juga mahasiswa pascasarjana di Universitas Sichuan, Yue Wu mengatakan metode tersebut bekerja langsung di usus untuk menyerap lemak.</p>\r\n<p><em>\"Menurunkan berat badan membantu sebagian orang mencegah masalah kesehatan jangka panjang seperti diabetes dan penyakit jantung,\"</em> jelasnya, dikutip dari Scitech Daily, Jumat (5/9/2025).</p>\r\n<p><em>\"Mikrobead kami bekerja langsung di usus memblokir penyerapan lemak, dengan cara non-invasif dan lembut,\"</em> Yue Wu menambahkan.</p>\r\n<p>Para peneliti menciptakan manik-manik kecil berbahan dasar tumbuhan. Manik itu diciptakan dengan serangkaian ikatan kimia yakni polifenol teh hijau dan vitamin E.</p>\r\n<p>Cara yang dilakukan dapat membentuk ikan kimia untuk tetesan lemak. Fungsinya untuk inti pengikat lemak pada mikrobead. Manik tadi kemudian dilapisi dengan polimer alami dari rumput laut agar terlindung dari lingkungan asam lambung.</p>\r\n<p>Saat tertelan, lapisan polimer akan mengembang karena respon pada pH asam. Sementara teh hijau dan vitamin E akan mengikat serta menangkap lemak yang dicerna pada sebagian usus.</p>\r\n<p>Tim peneliti telah melakukan uji coba awal pada tikus. Mereka membagi dalam tiga kelompok dengan masing-masing delapan ekor, yakni diet tinggi lemak (60% lemak), dengan atau tanpa mikrobead, dan diet normal (10% lemak) selama 30 hari.</p>\r\n<p>Pada tikus yang diberi diet tinggi lemak dan mikrobead kehilangan 17% total berat tubuh mereka. Jaringan adiposa dan kerusakan hati lebih sedikit juga terjadi dibandingkan tikus dengan makanan tinggi lemak dan normal tanpa mikrobead.</p>\r\n<p>Selain itu tikus dengan mikrobead mengeluarkan lebih banyak lemak pada feses. Ini menujukkan tidak ada efek buruk pada kesehatan lemak.</p>\r\n<p>Para peneliti juga telah memulai uji klinis pada manusia yang merupakan hasil kerja sama dengan Rumah Sakit China Barat Universitas Sichuan. Terdapat 26 partisipan dalam uji coba dan data awal diperkirakan akan tersedia tahun depan.</p>\r\n\r\n<p><strong>Banjarbaru, Radar Banjarmasin --</strong> Sudah menjadi pengetahuan umum bahwa nasi memiliki kadar gula yang tinggi. Menurut studi yang dipublikasikan Diabetes Care pada 2020, tingkat konsumsi nasi putih yang tinggi berkaitan erat dengan peningkatan risiko diabetes.</p>\r\n<p>Untuk itu, penderita diabetes biasanya dianjurkan mengurangi konsumsi nasi. Namun, ternyata ada cara mudah mengakalinya.</p>\r\n<p>Jika Anda tak mau gula darah naik setelah makan nasi, jangan makan nasi dalam keadaan panas. Alih-alih mengonsumsi nasi yang baru matang, Anda hanya perlu mendinginkan nasi tersebut.</p>\r\n<p>Penelitian yang dipublikasikan Asia Pacific Journal of Clinical Nutrition menemukan bahwa mengonsumsi nasi yang telah didinginkan selama 24 jam dan dipanaskan kembali dapat memberikan respons gula darah yang jauh lebih rendah daripada nasi panas yang baru dimasak.</p>\r\n<p>Tidak hanya itu, kalori di dalam nasi dingin juga menurun 50 sampai 60 persen. Hal ini membuat nasi dingin lebih baik bagi orang yang ingin menurunkan berat badan.</p>\r\n<p>Dengan demikian, nasi dingin atau yang telah didiamkan di suhu ruang dinilai lebih aman dan sehat, terutama bagi penderita diabetes.&nbsp;</p>\r\n<p>Namun, perlu dicatat bahwa tingkat diabetes orang juga berbeda-beda. Konsultasikan ke dokter terlebih dahulu sebelum mengandalkan metode ini. Semoga informasi ini membantu!</p>', 'news-1757087698050-786135462.jpeg', '2025-09-26 07:40:36', '2025-09-26 07:44:49'),
(11, 'Cara Mudah Mengurangi Kadar Gula Dalam Nasi Buat Pengidap Diabetes', 'Gaya Hidup', 'Heranof Al Basyir', 'Banjarbaru, Indonesia', '<p><strong>Banjarbaru, Radar Banjarmasin --</strong> Sudah menjadi pengetahuan umum bahwa nasi memiliki kadar gula yang tinggi. Menurut studi yang dipublikasikan Diabetes Care pada 2020, tingkat konsumsi nasi putih yang tinggi berkaitan erat dengan peningkatan risiko diabetes.</p>\r\n<p>Untuk itu, penderita diabetes biasanya dianjurkan mengurangi konsumsi nasi. Namun, ternyata ada cara mudah mengakalinya.</p>\r\n<p>Jika Anda tak mau gula darah naik setelah makan nasi, jangan makan nasi dalam keadaan panas. Alih-alih mengonsumsi nasi yang baru matang, Anda hanya perlu mendinginkan nasi tersebut.</p>\r\n<p>Penelitian yang dipublikasikan Asia Pacific Journal of Clinical Nutrition menemukan bahwa mengonsumsi nasi yang telah didinginkan selama 24 jam dan dipanaskan kembali dapat memberikan respons gula darah yang jauh lebih rendah daripada nasi panas yang baru dimasak.</p>\r\n<p>Tidak hanya itu, kalori di dalam nasi dingin juga menurun 50 sampai 60 persen. Hal ini membuat nasi dingin lebih baik bagi orang yang ingin menurunkan berat badan.</p>\r\n<p>Dengan demikian, nasi dingin atau yang telah didiamkan di suhu ruang dinilai lebih aman dan sehat, terutama bagi penderita diabetes.&nbsp;</p>\r\n<p>Namun, perlu dicatat bahwa tingkat diabetes orang juga berbeda-beda. Konsultasikan ke dokter terlebih dahulu sebelum mengandalkan metode ini. Semoga informasi ini membantu!</p>', 'news-1757087936017-592641761.jpeg', '2025-09-26 07:41:32', '2025-09-26 07:41:32'),
(12, 'Serba-serbi Pernikahan Mewah Crazy Rich Becca Bloom di Lake Como', 'Gaya Hidup', 'Alfian Rahardjo', 'Como, Italia', '<p><strong>Como, Radar Banjarmasin --</strong> Influencer TikTok dan Instagram, Rebecca Ma atau yang dikenal dengan nama Becca Bloom, baru saja menggelar pesta pernikahan super mewah di Villa Balbiano, Lake Como, Italia. Momen tersebut mencuri perhatian karena menampilkan perpaduan kemewahan, kisah cinta bak dongeng, dan detail yang penuh simbol.</p>\r\n<p>Becca, yang memiliki lebih dari 6 juta pengikut di media sosial, menikah dengan David Pownall, seorang software engineer. Pertemuan pertama mereka terjadi pada 2019 di sebuah kafe di Palo Alto, California. Rencana kopi sore singkat berubah menjadi kencan selama 15 jam, yang kemudian berlanjut menjadi hubungan serius hingga David melamar Becca di Positano pada Juli 2023.</p>\r\n<p>Sebagai seorang ikon RichTok, Becca tentu tak main-main dalam urusan busana. Untuk prosesi pernikahan, ia mengenakan gaun Oscar de la Renta dengan bordir peony laser-cut, bunga kesayangannya yang juga simbol keluarga di Tiongkok. Ia juga mengenakan perhiasan kelas atas Van Cleef &amp; Arpels, Tiffany &amp; Co., hingga koleksi couture Chanel untuk rangkaian acara lain seperti rehearsal dinner.</p>\r\n<p>Sementara itu, David tampil elegan dengan setelan Thom Browne untuk hari H, serta Ralph Lauren Purple Label saat acara makan malam. Detail ini dipilih sebagai penghormatan atas perjalanan David menjadi warga negara Amerika Serikat.</p>\r\n<p>Untuk acara makan malam, sang pengantin wanita mengenakan gaun couture Chanel vintage dari koleksi kapal pesiar tahun 2003 karya Karl Lagerfeld, dengan motif es krim yang ceria.</p>\r\n<p>Meski dikenal dengan gaya hidup serba mewah, Becca dan David ingin pernikahan mereka tetap terasa intim. Hanya 60 tamu undangan yang hadir di Villa Balbiano, terdiri dari keluarga dan sahabat dekat. Namun, mereka juga merencanakan resepsi besar dengan nuansa tradisional Asia bersama orang tua mereka, sehingga total akan ada dua kali perayaan.</p>\r\n<p>Pada sajian makan malam, mereka menambahkan patung-patung Romawi sebagai bentuk kecintaan David pada sejarah, sementara Becca tetap mempertahankan menunya yang berbentuk seperti kipas-sebuah sanjungan kecil untuk warisan budaya Tionghoa.</p>\r\n<p><em>\"Kartu nama kami berbentuk burung-burung kecil, hewan favorit ibu saya, dan nama Tionghoa-nya berarti \"bangau\". Bagi kami, kartu-kartu itu juga membawa rasa keberuntungan dan kebebasan,\"</em> kata Becca dikutip Vogue, Kamis (4/9/2025).</p>\r\n<p>Pernikahan ini juga dihiasi momen dramatis. Awalnya prakiraan cuaca menyebut hujan badai sepanjang hari, dan benar saja hujan turun. Namun, ketika acara dimulai, langit tiba-tiba cerah seolah terbuka khusus untuk pasangan ini. Becca menyebut hujan sebagai berkah, bahkan gaun pengantinnya sempat basah saat menari di tengah kembang api dan hujan deras bersama David.</p>\r\n<p>Setelah upacara sakral dengan alunan musik klasik \"Can\'t Help Falling in Love,\" pesta berlanjut dengan resepsi mewah bertabur bunga mawar, pasta truffle, hingga kue khas Italia millefoglie yang dibuat langsung oleh kedua mempelai. Malam ditutup dengan adegan dramatis dengan hujan turun lagi, kembang api menyala, dan pasangan ini menari di tengah guyuran air, layaknya adegan film romantis Hollywood.</p>', 'news-1757088366133-636556504.jpeg', '2025-09-26 07:45:54', '2025-09-26 07:45:54');

-- --------------------------------------------------------

--
-- Table structure for table `subscription_plans`
--

CREATE TABLE `subscription_plans` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `duration` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subscription_plans`
--

INSERT INTO `subscription_plans` (`id`, `name`, `duration`, `price`, `description`, `created_at`) VALUES
(1, 'Paket Mingguan', 7, 14000, 'Paket langganan mingguan dengan harga terbaik', '2025-09-26 15:28:51'),
(2, 'Paket Bulanan', 30, 55000, 'Paket langganan bulanan dengan harga terbaik', '2025-09-26 15:28:51'),
(3, 'Paket Tahunan', 365, 700000, 'Paket langganan tahunan dengan harga terbaik', '2025-09-26 15:28:51');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `package_id` int(11) NOT NULL,
  `type` enum('subscription','advertisement') NOT NULL,
  `total_price` int(11) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `proof_payment` varchar(255) DEFAULT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `invoice_number`, `user_id`, `package_id`, `type`, `total_price`, `payment_method`, `proof_payment`, `status`, `created_at`, `updated_at`) VALUES
(1, 'INV2509261705', 3, 1, 'subscription', 14000, 'bca', '1758873644436_payment.png', 'accepted', '2025-09-26 08:00:44', '2025-09-26 08:01:15'),
(2, 'ADV2509262918', 3, 2, 'advertisement', 30000, 'gopay', '1758873757119_payment_Untitled1.png', 'accepted', '2025-09-26 08:02:37', '2025-09-26 08:09:23'),
(3, 'INV2509267418', 4, 3, 'subscription', 700000, 'gopay', '1758873792973_payment.png', 'accepted', '2025-09-26 08:03:12', '2025-09-26 08:09:21'),
(4, 'ADV2509266102', 4, 1, 'advertisement', 100000, 'bca', '1758873845750_payment_Orchid-01.jpg', 'pending', '2025-09-26 08:04:05', '2025-09-26 08:04:05'),
(5, 'ADV2509262150', 4, 3, 'advertisement', 320000, 'gopay', '1758873968322_payment_689f49dad9205774b1e23c5c478640d2.jpg', 'accepted', '2025-09-26 08:06:08', '2025-09-26 08:09:15'),
(6, 'INV2509262656', 12, 1, 'subscription', 14000, 'bca', '1758874023856_payment.jpg', 'accepted', '2025-09-26 08:07:03', '2025-09-26 08:09:14'),
(7, 'ADV2509260115', 12, 2, 'advertisement', 360000, 'gopay', '1758874080885_payment_JKT48_Youtube_Channel_logo.jpg', 'rejected', '2025-09-26 08:08:00', '2025-09-26 08:09:12'),
(8, 'ADV2509269651', 5, 1, 'advertisement', 150000, 'gopay', '1758874259678_payment_yC2_LYgX_400x400.jpg', 'pending', '2025-09-26 08:10:59', '2025-09-26 08:10:59');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT 'default.jpg',
  `role` enum('admin','customer') DEFAULT 'customer',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `profile_photo`, `role`, `created_at`, `updated_at`) VALUES
(1, 'kania', 'kania@gmail.com', '$2b$10$UtJ73kUhTEAJb65NjmTpTulI5PNZ65wMk1a.pLqT1dgsLlKw1S3r.', '081234567891', 'Banjarbaru', 'kania.jpg', 'admin', '2025-09-25 21:11:05', '2025-09-25 21:11:05'),
(2, 'kondro', 'kondro@gmail.com', '$2b$10$/kGhMQtn2A1r.nrmdI6ZjuSu.MZsDEjm8sFufzzaKU6mQ6jHkoAye', '081234567890', 'Banjarmasin', '1757139125689-profile_photo.jpg', 'admin', '2025-09-26 07:10:46', '2025-09-26 07:10:46'),
(3, 'user1', 'user1@gmail.com', '$2b$10$cqQprf6tf/8SnHjBOPprLOTpGcdUUfl9W.cL7BoEiTTMVkPxe.lbq', '081234567892', 'Banjarmasin', 'user1.jpg', 'customer', '2025-09-26 07:11:37', '2025-09-26 07:11:37'),
(4, 'user2', 'user2@gmail.com', '$2b$10$8oViNzlfKcLDGdRqMBT7h.DbpqjIqFNYjCKfcHm0UmADwEa9efGWa', '085988887777', 'Banjarbaru', 'user2.jpg', 'customer', '2025-09-26 07:12:28', '2025-09-26 07:12:28'),
(5, 'user3', 'user3@gmail.com', '$2b$10$2AKahX.c67zKobyFfNmNQO.9q2LC2Bj.cycYpfjHV1czfJ/.Wcu6m', '085312344321', 'Banjarmasin', 'user3.jpg', 'customer', '2025-09-26 07:13:18', '2025-09-26 07:13:18'),
(6, 'user4', 'user4@gmail.com', '$2b$10$.ahuiV75gFf5Zxe5kHPsqeOSsVb5TOJVCtqVJCY05U7XGt1YPRnCu', '081234567788', 'Banjarbaru', 'user4.jpg', 'customer', '2025-09-26 07:13:57', '2025-09-26 15:24:47'),
(7, 'Prabowo Subianto', 'prabowo@gmail.com', '$2b$10$s17b.boJN.LeJvAdLLB3CODxv5YUB3bPoR9c9BUMJrX9/hdaX7.i2', '081233445566', 'Jakarta', 'prabowo.jpg', 'customer', '2025-09-26 07:14:32', '2025-09-26 07:14:32'),
(8, 'hayley', 'hayley@gmail.com', '$2b$10$pLGSljxSpKp4txJPzrcOZ.KpFnR4UfCfxdnrkTPMdJirvLOIuA18C', '081222111122', 'Los Angeles', 'hayley.jpg', 'customer', '2025-09-26 07:15:14', '2025-09-26 07:15:14'),
(9, 'taylor', 'taylor@gmail.com', '$2b$10$mK1IaUfUshY4rsz.D3ugzO0zLAPAZfFIpHAvvwguM.Pq/vUEVNeZa', '085122122121', 'Nashville', 'taylor.jpg', 'customer', '2025-09-26 07:16:19', '2025-09-26 07:16:29'),
(10, 'avril', 'avril@gmail.com', '$2b$10$/dzDhP5IWmC88J2WNpXg1ePIMWjlhd34AvvXGdWJYySjdA32Sv89G', '085377889966', 'New York', 'avril.jpg', 'customer', '2025-09-26 07:17:17', '2025-09-26 07:17:17'),
(11, 'admin3', 'admin3@gmail.com', '$2b$10$uxV1CD9YnwD9ZdoeboYnzeVRQdLa5tZRP4WQfvuyCwP3XWkk1CiJK', '085345677654', 'Banjarbaru', 'default.jpg', 'admin', '2025-09-26 07:17:57', '2025-09-26 07:17:57'),
(12, 'user5', 'user5@gmail.com', '$2b$10$.eBuvFV33CVKQ0vmacLHwOTiJ.Ogp7SMNeapi1xREXOIHgZtBi3KO', '085234566543', 'Banjarmasin', 'default.jpg', 'customer', '2025-09-26 07:18:40', '2025-09-26 07:18:40'),
(13, 'user6', 'user6@gmail.com', '$2b$10$w9aU.gxIe/cWFTaUwwJHie6CZlRAXmq87obFSmSE41UZU.HMNBrSS', '085123321442', 'Martapura', 'default.jpg', 'customer', '2025-09-26 07:19:27', '2025-09-26 07:19:27'),
(14, 'admin4', 'admin4@gmail.com', '$2b$10$v6FXFL4YcKEFpWLdnHKO/Ok2R.FnhyLgzjutfCQ/7jUdiu84ZvnxK', '085677665696', 'Banjarmasin', 'default.jpg', 'admin', '2025-09-26 07:19:56', '2025-09-26 07:20:07'),
(15, 'user7', 'user7@gmail.com', '$2b$10$RU1JC9manGckJGX0cmpqTeh1Y2TTGWb77mWV/u8LRjUsigcIOAZSS', '087888986858', 'Martapura', 'default.jpg', 'customer', '2025-09-26 07:20:45', '2025-09-26 07:20:45'),
(16, 'user8', 'user8@gmail.com', '$2b$10$k8bFIDnvVAN1ucWb0bBg4u0o9YzNVNgvG23jmJnrDGP0h3gtD2hfy', '085544336688', 'Martapura', 'default.jpg', 'customer', '2025-09-26 07:21:20', '2025-09-26 07:21:20');

-- --------------------------------------------------------

--
-- Table structure for table `user_subscriptions`
--

CREATE TABLE `user_subscriptions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subscription_plan_id` int(11) NOT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_subscriptions`
--

INSERT INTO `user_subscriptions` (`id`, `user_id`, `subscription_plan_id`, `transaction_id`, `start_date`, `end_date`, `is_active`, `created_at`) VALUES
(1, 3, 1, 1, '2025-09-26 08:01:15', '2025-10-03 08:01:15', 1, '2025-09-26 08:01:15'),
(2, 12, 1, 6, '2025-09-26 08:09:14', '2025-10-03 08:09:14', 1, '2025-09-26 08:09:14'),
(3, 4, 3, 3, '2025-09-26 08:09:21', '2026-09-26 08:09:21', 1, '2025-09-26 08:09:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `advertisement`
--
ALTER TABLE `advertisement`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `advertisement_content`
--
ALTER TABLE `advertisement_content`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `advertisement`
--
ALTER TABLE `advertisement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `advertisement_content`
--
ALTER TABLE `advertisement_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
