---

# 📘 MANUAL BOOK
## SKORGE
### Platform Pembelajaran Karir Berbasis AI

---

|  |  |
|---|---|
| **Nama Aplikasi** | SKORGE — Skill & Knowledge Organizer for Growth & Excellence |
| **Versi** | 1.0 |
| **Tanggal Rilis** | Mei 2026 |
| **Platform** | Web Application (Laravel + React) |

---

## 👤 Tim Pencipta

| Nama | Peran | Kontak |
|---|---|---|
| **Paul Fajar Sabatino** | Founder & CEO | paul.fajar.2405336@students.um.ac.id |
| **Muhammad Zhafier Ardine Yudhistira** | CTO & Head of AI | muhammad.zhafier.2405336@students.um.ac.id |
| **Zacky Candra Firmansyah** | VP of Learning Experience | zacky.candra.2405336@students.um.ac.id | |

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Instalasi & Konfigurasi](#2-instalasi--konfigurasi)
3. [Memulai Aplikasi](#3-memulai-aplikasi)
4. [Panduan Pengguna (User)](#4-panduan-pengguna-user)
   - 4.1 Registrasi & Login
   - 4.2 AI Onboarding
   - 4.3 Dashboard
   - 4.4 Kursus
   - 4.5 Quiz
   - 4.6 Job Roles & Career Path
   - 4.7 Sertifikat
   - 4.8 CV Builder
   - 4.9 Profil
5. [Sistem Gamifikasi](#5-sistem-gamifikasi)
6. [Panduan Admin](#6-panduan-admin)
7. [Troubleshooting](#7-troubleshooting)
8. [Teknologi yang Digunakan](#8-teknologi-yang-digunakan)

---

## 1. Pendahuluan

### 1.1 Tentang SKORGE

SKORGE adalah platform pembelajaran berbasis web yang dirancang untuk membantu pengguna menemukan jalur karir yang tepat dan menguasai skill yang dibutuhkan industri. Platform ini menggabungkan sistem e-learning modern dengan kecerdasan buatan (AI) untuk memberikan rekomendasi karir yang personal.

### 1.2 Tujuan Aplikasi

- Membantu pengguna menemukan jalur karir (career path) yang sesuai dengan minat dan kemampuan
- Menyediakan kursus dan materi pembelajaran yang terstruktur
- Mengukur perkembangan belajar melalui quiz dan sertifikasi
- Memotivasi pengguna melalui sistem gamifikasi (XP, Level, Streak)
- Menghasilkan CV profesional berdasarkan pencapaian belajar

### 1.3 Target Pengguna

| Tipe Pengguna | Deskripsi |
|---|---|
| **User / Peserta** | Pelajar atau profesional yang ingin mengembangkan skill |
| **Admin** | Pengelola konten kursus, job roles, dan manajemen pengguna |

### 1.4 Fitur Utama

- ✅ AI Career Navigator (Rekomendasi karir berbasis AI)
- ✅ Learning Management System (Kursus video terstruktur)
- ✅ Quiz & Penilaian Otomatis
- ✅ Sertifikat Digital
- ✅ CV Builder Otomatis
- ✅ Sistem Gamifikasi (XP, Level, Streak, Leaderboard)
- ✅ SkillPet (Virtual pet sebagai teman belajar)
- ✅ Bookmark Kursus
- ✅ Dark Mode / Light Mode

---

## 2. Instalasi & Konfigurasi

### 2.1 Persyaratan Sistem

| Komponen | Minimum |
|---|---|
| PHP | 8.4 atau lebih baru |
| Composer | 2.x |
| Node.js | 18.x atau lebih baru |
| MySQL | 8.0 atau lebih baru |
| NPM | 9.x atau lebih baru |

### 2.2 Langkah Instalasi

**1. Clone Repository**
```bash
git clone <url-repository> SKORGE
cd SKORGE
```

**2. Install Dependensi PHP**
```bash
composer install
```

**3. Install Dependensi Node.js**
```bash
npm install
```

**4. Konfigurasi Environment**
```bash
cp .env.example .env
php artisan key:generate
```

**5. Edit file `.env`** — sesuaikan konfigurasi database:
```env
APP_NAME=SKORGE
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=skorge
DB_USERNAME=root
DB_PASSWORD=your_password
```

**6. Migrasi & Seeding Database**
```bash
php artisan migrate --seed
```

**7. Link Storage**
```bash
php artisan storage:link
```

### 2.3 Menjalankan Aplikasi

```bash
composer run dev
```

Atau jalankan secara terpisah:
```bash
# Terminal 1 — Backend
php artisan serve

# Terminal 2 — Frontend
npm run dev
```

Aplikasi bisa diakses di: `http://localhost:8000`

---

## 3. Memulai Aplikasi

### 3.1 Halaman Beranda (Welcome)

Halaman utama SKORGE menampilkan:
- **Hero Section** — Tagline dan tombol CTA utama
- **Statistik Platform** — Jumlah career path, kursus, dan tingkat keberhasilan
- **Top Courses** — 3 kursus terpopuler
- **Featured Career Paths** — Career path yang direkomendasikan

Dari halaman beranda, pengguna dapat:
- Klik **"Explore Career Paths"** untuk melihat semua job role
- Klik **"Browse Courses"** untuk masuk ke katalog kursus
- Klik **"Login"** atau **"Register"** untuk masuk ke platform

> ### 📸 Screenshot 1 — Halaman Landing Page
> **URL:** `http://localhost:8000/`
>
> *(Sisipkan screenshot halaman beranda / welcome page SKORGE di sini)*
>
> **Cara insert di PDF:** Tambahkan gambar `ss_landing_page.png` di bawah paragraf ini.
>
> ```
> [GAMBAR: Tampilan Landing Page SKORGE]
> ```

---

## 4. Panduan Pengguna (User)

### 4.1 Registrasi & Login

#### Registrasi Akun Baru

1. Klik tombol **"Register"** di navbar
2. Isi formulir pendaftaran:
   - **Nama Lengkap**
   - **Email** (harus valid dan belum terdaftar)
   - **Password** (minimal 8 karakter)
   - **Konfirmasi Password**
3. Klik **"Create Account"**
4. Setelah berhasil, sistem akan mengarahkan ke halaman **AI Onboarding**

#### Login

1. Klik tombol **"Login"** di navbar
2. Masukkan **Email** dan **Password**
3. Klik **"Sign In"**
4. Jika berhasil, pengguna akan diarahkan ke **Dashboard**

> **Catatan:** Jika lupa password, klik link "Forgot Password" di halaman login.

---

### 4.2 AI Onboarding

Setelah registrasi pertama kali, pengguna akan melalui proses onboarding AI selama 3 langkah:

#### Langkah 1 — Minat
Pilih salah satu yang paling menarik:
- 🧩 Memecahkan logika kompleks → *Developer*
- ✨ Membuat sesuatu yang indah & intuitif → *UI/UX Designer*
- 📈 Menemukan pola tersembunyi dalam angka → *Data Analyst*
- 🎯 Merencanakan pertumbuhan dan strategi → *Product/Strategy*

#### Langkah 2 — Level Pengalaman
- **Complete Beginner** — Belum pernah coding atau desain
- **Intermediate** — Tahu dasar-dasarnya, butuh struktur
- **Advanced** — Butuh polish untuk siap kerja

#### Langkah 3 — Tujuan 6 Bulan
- Mendapatkan pekerjaan full-time baru
- Memulai freelance
- Upskill untuk pekerjaan saat ini

Setelah menjawab ketiga pertanyaan, sistem AI akan **menganalisis jawaban** dan memberikan rekomendasi career path yang paling cocok. Hasilnya akan muncul sebagai banner di Dashboard.

---

### 4.3 Dashboard

Dashboard adalah pusat kendali belajar pengguna. Halaman ini menampilkan:

#### Statistik Utama (Top Stats)
| Statistik | Keterangan |
|---|---|
| **Total XP** | Total poin pengalaman yang dikumpulkan |
| **Courses Done** | Jumlah kursus yang diselesaikan |
| **Quizzes Passed** | Jumlah quiz yang berhasil dilalui |
| **Day Streak** | Berapa hari berturut-turut aktif belajar |

#### AI Career Match Banner
Jika pengguna baru selesai onboarding, akan muncul banner rekomendasi AI berisi career path yang direkomendasikan. Klik **"Start This Path"** untuk langsung memulai learning path tersebut.

#### Current Career Objective
Menampilkan career path yang sedang aktif dijalani beserta:
- Nama Job Role & kategori
- Persentase progres penyelesaian
- Kursus berikutnya yang harus ditonton
- Tombol **"Continue Learning"**

Jika belum memilih career path, akan muncul tombol **"Explore All Career Paths"**.

#### Resume Learning
Menampilkan daftar kursus yang sedang dalam proses (ongoing). Klik kartu kursus untuk melanjutkan menonton.

#### Current Standing
Menampilkan peringkat global pengguna berdasarkan total XP. Klik untuk melihat detail statistik lengkap.

#### SkillPet
Virtual pet yang menemani perjalanan belajar. SkillPet berevolusi seiring bertambahnya XP dan level pengguna.

> ### 📸 Screenshot 2 — Halaman Dashboard
> **URL:** `http://localhost:8000/dashboard`
>
> *(Sisipkan screenshot tampilan Dashboard dengan stat cards, career objective, dan SkillPet di sini)*
>
> **Cara insert di PDF:** Tambahkan gambar `ss_dashboard.png` di bawah paragraf ini.
>
> ```
> [GAMBAR: Tampilan Dashboard Pengguna SKORGE]
> ```

---

### 4.4 Kursus

#### Melihat Daftar Kursus

1. Klik menu **"Courses"** di sidebar atau navbar
2. Halaman katalog menampilkan semua kursus yang tersedia
3. Gunakan **filter** untuk menyaring berdasarkan:
   - Kategori / Field
   - Level (Beginner, Intermediate, Advanced)
4. Klik kartu kursus untuk melihat detail

#### Halaman Detail Kursus

Halaman kursus menampilkan:
- Deskripsi kursus
- Daftar video/materi yang tersedia
- Status progres (% completion)
- Tombol untuk mulai/lanjutkan menonton

#### Menonton Video

1. Klik video yang ingin ditonton dari daftar materi
2. Video player akan tampil di halaman
3. Sistem otomatis **mencatat progres** setiap video yang ditonton
4. Setelah video selesai, status video berubah menjadi ✅ selesai
5. Selesaikan semua video untuk membuka **Quiz** di akhir kursus

#### Bookmark Kursus

- Klik ikon **bookmark** 🔖 di kartu kursus untuk menyimpan ke daftar favorit
- Akses kursus yang di-bookmark melalui menu **"My Courses"** di profil

> ### 📸 Screenshot 3 — Grid Halaman Semua Kursus
> **URL:** `http://localhost:8000/courses`
>
> *(Sisipkan screenshot tampilan grid catalog kursus — semua course cards — di sini)*
>
> **Cara insert di PDF:** Tambahkan gambar `ss_all_courses.png` di bawah paragraf ini.
>
> ```
> [GAMBAR: Grid View Semua Kursus SKORGE]
> ```

---

### 4.5 Quiz

#### Mengerjakan Quiz

1. Selesaikan semua video dalam sebuah kursus
2. Tombol **"Take Quiz"** akan aktif
3. Klik tombol tersebut untuk memulai quiz
4. Jawab semua pertanyaan pilihan ganda yang tersedia
5. Klik **"Submit"** setelah semua soal terjawab

#### Hasil Quiz

Setelah submit, sistem akan menampilkan:
- **Skor** yang diperoleh (dalam persentase)
- Jawaban benar dan salah
- **XP** yang didapatkan dari quiz tersebut
- Tombol untuk mengulang quiz (jika nilai tidak memenuhi batas minimum)

> **Catatan:** Sertifikat hanya akan diterbitkan jika pengguna lulus quiz dengan nilai minimum yang ditentukan.

---

### 4.6 Job Roles & Career Path

#### Menjelajahi Job Roles

1. Klik menu **"Job Roles"** di sidebar
2. Halaman menampilkan semua career path yang tersedia
3. Setiap card job role menampilkan:
   - Nama posisi (misal: Frontend Developer, Data Analyst)
   - Kategori bidang
   - Skill yang dibutuhkan
   - Tingkat kesulitan

#### Memilih Career Path

1. Klik kartu job role yang diinginkan
2. Halaman detail menampilkan:
   - Deskripsi lengkap job role
   - Daftar kursus yang perlu diselesaikan
   - Estimasi waktu belajar
3. Klik **"Start This Path"** untuk mulai menjalani career path tersebut
4. Career path yang dipilih akan muncul di Dashboard sebagai **"Current Career Objective"**

> ### 📸 Screenshot 4 — Dial View Halaman Discover Path
> **URL:** `http://localhost:8000/job-roles`
>
> *(Sisipkan screenshot tampilan halaman Job Roles / Discover Career Path dengan dial view di sini)*
>
> **Cara insert di PDF:** Tambahkan gambar `ss_job_roles.png` di bawah paragraf ini.
>
> ```
> [GAMBAR: Dial View Discover Career Path SKORGE]
> ```

---

### 4.7 Sertifikat

#### Mendapatkan Sertifikat

Sertifikat diterbitkan secara otomatis setelah pengguna:
1. Menyelesaikan semua video dalam sebuah kursus
2. Lulus quiz dengan nilai minimum

#### Mengakses Sertifikat

1. Klik foto profil di navbar → pilih **"My Certificates"**
2. Daftar semua sertifikat yang dimiliki akan tampil
3. Klik sertifikat untuk melihat detail
4. Klik tombol **"Download"** untuk mengunduh sertifikat dalam format PDF/gambar

Setiap sertifikat berisi:
- Nama lengkap pengguna
- Nama kursus yang diselesaikan
- Tanggal penerbitan
- ID sertifikat unik untuk verifikasi

---

### 4.8 CV Builder

SKORGE menyediakan fitur **CV Builder otomatis** yang mengambil data dari pencapaian belajar pengguna.

#### Membuat CV

1. Akses menu **"CV Builder"** dari halaman profil
2. Sistem akan otomatis mengisi:
   - Data pribadi (nama, email)
   - Kursus yang telah diselesaikan
   - Sertifikat yang dimiliki
   - Skill yang dikuasai berdasarkan career path
3. Edit atau tambah informasi jika diperlukan
4. Klik **"Generate CV"** untuk membuat CV
5. Download CV dalam format PDF

---

### 4.9 Profil

#### Mengakses Halaman Profil

Klik foto profil di navbar → pilih **"Profile"**

#### Informasi yang Dapat Diedit

| Field | Keterangan |
|---|---|
| Nama | Nama lengkap pengguna |
| Email | Alamat email (untuk login) |
| Avatar | Foto profil (upload gambar) |
| Password | Ubah password akun |
| Pet Name | Nama untuk SkillPet |
| Pet Accessories | Kostum untuk SkillPet |

#### Halaman Profil Menampilkan

- Total XP & Level saat ini
- Jumlah kursus selesai
- Jumlah sertifikat
- Streak harian
- SkillPet dengan nama & aksesori yang dipilih

---

## 5. Sistem Gamifikasi

SKORGE menggunakan sistem gamifikasi untuk memotivasi pengguna agar konsisten belajar.

### 5.1 XP Points (Experience Points)

XP diperoleh dari setiap aktivitas belajar:

| Aktivitas | XP Didapat |
|---|---|
| Menonton video kursus | XP per video selesai |
| Lulus quiz | XP berdasarkan skor |
| Menyelesaikan kursus | Bonus XP |
| Menyelesaikan career path | Bonus XP besar |
| Login harian (streak) | XP harian |

### 5.2 Level

Level naik secara otomatis seiring bertambahnya XP. Semakin tinggi level, semakin banyak fitur dan aksesori SkillPet yang terbuka.

### 5.3 Streak (Rentetan Hari Aktif)

- Streak bertambah setiap hari pengguna aktif belajar
- Jika tidak aktif sehari penuh, streak akan **reset ke 0**
- Streak yang panjang memberikan bonus XP harian

### 5.4 Global Rank

Pengguna mendapatkan peringkat global berdasarkan total XP dibandingkan semua pengguna lain. Peringkat ditampilkan di halaman **Stats** dan **Dashboard**.

> ### 📸 Screenshot 5 — Halaman Stats & Legends
> **URL:** `http://localhost:8000/stats`
>
> *(Sisipkan screenshot tampilan halaman statistik pengguna — XP, level, leaderboard, dan legends — di sini)*
>
> **Cara insert di PDF:** Tambahkan gambar `ss_stats.png` di bawah paragraf ini.
>
> ```
> [GAMBAR: Halaman Stats & Legends SKORGE]
> ```

### 5.5 SkillPet

SkillPet adalah virtual pet yang:
- Berevolusi tampilan seiring naiknya level pengguna
- Dapat diberi nama melalui halaman Profil
- Dapat dipakaikan aksesori yang dibuka berdasarkan pencapaian
- Berinteraksi dan memberikan semangat kepada pengguna

---

## 6. Panduan Admin

Admin memiliki akses ke panel khusus untuk mengelola konten dan pengguna platform.

> **Cara masuk sebagai Admin:** Login dengan akun yang memiliki role `admin`.

Akses panel admin melalui: `http://localhost:8000/admin`

### 6.1 Dashboard Admin

Menampilkan ringkasan statistik platform:
- Total pengguna terdaftar
- Total kursus aktif
- Total career path
- Pengguna aktif harian/mingguan

### 6.2 Manajemen Kursus

**Melihat Daftar Kursus**
- Semua kursus yang ada ditampilkan dalam bentuk tabel
- Informasi: Judul, Kategori, Level, Jumlah Video, Status

**Menambah Kursus Baru**
1. Klik tombol **"+ Add Course"**
2. Isi formulir:
   - Judul Kursus
   - Deskripsi
   - Kategori / Field
   - Level (Beginner / Intermediate / Advanced)
   - Thumbnail (upload gambar)
3. Klik **"Save"**
4. Tambahkan video ke kursus dari halaman detail kursus

**Menambah Video ke Kursus**
1. Masuk ke detail kursus
2. Klik **"+ Add Video"**
3. Isi:
   - Judul Video
   - URL Video (YouTube atau sumber lain)
   - Urutan video
   - Durasi
4. Klik **"Save"**

**Mengedit / Menghapus Kursus**
- Klik ikon ✏️ untuk edit
- Klik ikon 🗑️ untuk hapus (konfirmasi diperlukan)

### 6.3 Manajemen Job Roles

**Menambah Job Role Baru**
1. Klik **"+ Add Job Role"**
2. Isi formulir:
   - Nama Posisi
   - Kategori
   - Deskripsi lengkap
   - Skill yang dibutuhkan
   - Tingkat kesulitan
3. Hubungkan dengan kursus-kursus yang relevan
4. Klik **"Save"**

**Mengelola Career Path**
- Atur urutan kursus dalam setiap career path
- Tentukan kursus wajib dan kursus pilihan

### 6.4 Manajemen Pengguna

Halaman ini menampilkan semua pengguna yang terdaftar beserta:
- Nama & Email
- Role (user / admin)
- XP & Level
- Tanggal bergabung
- Status aktif

**Fitur yang tersedia:**
- Lihat detail profil pengguna
- Edit role pengguna (jadikan admin atau turunkan ke user)
- Reset data belajar pengguna (jika diperlukan)

### 6.5 Pengaturan Sistem

Halaman **System** berisi pengaturan umum platform:
- Konfigurasi nama aplikasi
- Pengaturan XP reward per aktivitas
- Pengaturan minimum nilai lulus quiz

---

## 7. Troubleshooting

### 7.1 Masalah Umum & Solusinya

| Masalah | Penyebab | Solusi |
|---|---|---|
| Halaman tidak muncul / blank | Frontend belum di-build | Jalankan `npm run dev` atau `npm run build` |
| Error "Class not found" | Vendor belum terinstall | Jalankan `composer install` |
| Error koneksi database | Konfigurasi DB salah | Cek file `.env`, pastikan kredensial DB benar |
| Error CORS | Konfigurasi CORS belum benar | Cek `config/cors.php`, pastikan `APP_URL` di `.env` benar |
| Sertifikat tidak muncul | Quiz belum lulus | Pastikan semua video selesai dan nilai quiz memenuhi minimum |
| Streak reset padahal sudah login | Login tidak tercatat sebagai aktivitas | Pastikan minimal menonton satu video per hari |
| Upload gambar gagal | Symlink storage belum dibuat | Jalankan `php artisan storage:link` |

### 7.2 Perintah Artisan Berguna

```bash
# Reset dan jalankan ulang migrasi + seeder
php artisan migrate:fresh --seed

# Clear semua cache
php artisan optimize:clear

# Lihat semua route yang tersedia
php artisan route:list

# Jalankan queue worker
php artisan queue:work

# Lihat log terbaru
php artisan pail
```

### 7.3 Reset Data Pengguna (Development)

Untuk keperluan testing, jalankan:
```bash
php artisan migrate:fresh --seed
```

> ⚠️ **Peringatan:** Perintah ini akan **menghapus semua data** dan mengisi ulang dari seeder. Jangan dijalankan di production.

---

## 8. Teknologi yang Digunakan

| Teknologi | Versi | Fungsi |
|---|---|---|
| **PHP** | 8.4 | Bahasa pemrograman backend |
| **Laravel** | 13 | Framework backend utama |
| **React** | 19 | Library frontend UI |
| **Inertia.js** | v2 | Jembatan Laravel ↔ React (SPA) |
| **TypeScript** | - | Type-safe JavaScript untuk frontend |
| **Tailwind CSS** | v4 | Framework CSS untuk styling |
| **Vite** | - | Build tool frontend |
| **MySQL** | 8.0 | Database utama |
| **Laravel Sanctum** | v4 | Autentikasi API |
| **Laravel Fortify** | v1 | Backend autentikasi |
| **Laravel Wayfinder** | v0 | Type-safe routing frontend |
| **Pest PHP** | v4 | Framework testing |
| **Framer Motion** | - | Animasi React |

---

## 9.1 Source Code

Source code aplikasi SKORGE tersedia di repository berikut:

| Komponen | Keterangan |
|---|---|
| **Repository** | *(Isi link GitHub/GitLab repository)* |
| **Branch Utama** | `main` |
| **Frontend** | `resources/js/` — React + TypeScript + Tailwind CSS |
| **Backend** | `app/` — Laravel PHP |
| **Database** | `database/migrations/` — Laravel Migrations |
| **Tests** | `tests/` — Pest PHP |

### Struktur Direktori Utama

```
SKORGE/
├── app/
│   ├── Http/
│   │   ├── Controllers/       ← Controller Laravel
│   │   │   └── Api/           ← API Controllers
│   │   └── Requests/          ← Form Request Validation
│   └── Models/                ← Eloquent Models
├── database/
│   ├── migrations/            ← Schema database
│   └── seeders/               ← Data awal (seed)
├── resources/
│   └── js/
│       ├── pages/             ← Halaman React (Inertia)
│       │   ├── welcome.tsx    ← Landing Page
│       │   ├── dashboard.tsx  ← Dashboard
│       │   ├── courses/       ← Halaman kursus
│       │   ├── job-roles/     ← Halaman job roles
│       │   └── stats/         ← Halaman statistik
│       └── components/        ← Komponen UI reusable
├── routes/
│   ├── web.php                ← Route web utama
│   └── api.php                ← Route API
├── tests/
│   └── Feature/               ← Feature tests (Pest)
├── .env                       ← Konfigurasi environment
├── composer.json              ← Dependensi PHP
└── package.json               ← Dependensi Node.js
```

### Contoh Source Code Utama

**Route Web (`routes/web.php`)**
```php
Route::get('/', [WelcomeController::class, 'index'])->name('welcome');
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
Route::get('/job-roles', [JobRoleController::class, 'index'])->name('job-roles.index');
Route::get('/stats', [StatsController::class, 'index'])->name('stats.index');
```

**Contoh Inertia Response (Controller)**
```php
public function index(): Response
{
    return Inertia::render('dashboard', [
        'stats'       => $this->getUserStats(auth()->user()),
        'currentPath' => $user->activeLearningPath,
        'ongoing'     => $user->ongoingCourses()->with('course')->get(),
    ]);
}
```

**Contoh React Page (`resources/js/pages/dashboard.tsx`)**
```tsx
export default function Dashboard({ stats, currentPath }: Props) {
    return (
        <AppLayout>
            <StatsCards stats={stats} />
            <CareerObjective path={currentPath} />
            <Resumelearning courses={ongoing} />
        </AppLayout>
    );
}
```

---

## Lampiran

### A. Struktur Halaman Aplikasi

```
/ (Beranda / Welcome)
├── /login
├── /register
├── /onboarding         ← AI Career Navigator
├── /dashboard          ← Halaman utama user
├── /courses            ← Katalog kursus
│   └── /courses/:id    ← Detail & player kursus
├── /job-roles          ← Daftar career path
│   └── /job-roles/:id  ← Detail career path
├── /quiz/:id           ← Halaman quiz
├── /stats              ← Statistik & leaderboard
├── /user
│   ├── /profile        ← Edit profil
│   ├── /certificates   ← Daftar sertifikat
│   ├── /my-courses     ← Kursus yang diikuti
│   └── /cv-builder     ← Pembuatan CV
└── /admin              ← Panel admin
    ├── /admin/courses
    ├── /admin/job-roles
    ├── /admin/users
    └── /admin/system
```

### B. Alur Belajar Pengguna

```
Registrasi
    ↓
AI Onboarding (3 pertanyaan)
    ↓
Rekomendasi Career Path AI
    ↓
Dashboard (lihat career objective)
    ↓
Pilih Career Path → Mulai Kursus
    ↓
Tonton Video (progres terekam)
    ↓
Kerjakan Quiz
    ↓
Lulus Quiz → Dapat XP + Sertifikat
    ↓
Ulangi untuk kursus berikutnya
    ↓
Selesaikan semua kursus di career path
    ↓
Career Path Selesai → Bonus XP besar
    ↓
Download Sertifikat & Generate CV
```

---

## 10. Tim Developer

Berikut adalah tim yang bertanggung jawab dalam pengembangan platform SKORGE:

| Nama | Role | Tanggung Jawab |
|---|---|---|
| **Paul Fajar Sabatino** | Founder & CEO | Arsitektur sistem, backend Laravel, integrasi API, product vision |
| **Muhammad Zhafier Ardine Yudhistira** | CTO & Head of AI | AI recommendation engine, sistem onboarding, infra & deployment |
| **Zacky Candra Firmansyah** | VP of Learning Experience | Kurikulum kursus, UI/UX, video learning interface, gamifikasi |

---

*Dokumen ini dibuat untuk keperluan panduan penggunaan aplikasi SKORGE.*  
*Untuk pertanyaan teknis lebih lanjut, hubungi tim pengembang.*
