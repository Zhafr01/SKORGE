import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'id';

interface I18nContextType {
    lang: Language;
    toggleLanguage: () => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        'nav.dashboard': 'Dashboard',
        'nav.discover': 'Discover Paths',
        'nav.courses': 'All Courses',
        'nav.jobs': 'Job Board',
        'nav.about': 'About Us',
        'nav.stats': 'Stats & Legends',
        'nav.certificates': 'My Certificates',
        'nav.cv': 'Auto CV Builder',
        'nav.mycourses': 'My Courses',
        'nav.signout': 'Sign Out',
        'nav.login': 'Log In',
        'nav.register': 'Sign Up Free',

        // Dashboard
        'dashboard.title': 'Welcome back, {name}',
        'dashboard.subtitle': "Here's where you stand on your journey to mastery. Let's get to work.",
        'dashboard.aiMatch': 'AI Career Match',
        'dashboard.aiMatchDesc': 'Based on your answers, we recommend:',
        'dashboard.startPath': 'Start This Path',
        'dashboard.statXp': 'Total XP',
        'dashboard.statCourses': 'Courses Done',
        'dashboard.statHours': 'Learning Hours',
        'dashboard.statStreak': 'Current Streak',
        'dashboard.days': 'Days',
        'dashboard.careerObjective': 'Current Career Objective',
        'dashboard.pathCompletion': 'Path Completion',
        'dashboard.upNext': 'Up Next',
        'dashboard.continueLearningBtn': 'Continue Learning',
        'dashboard.noPathDesc': "You haven't selected a target career path yet.",
        'dashboard.noPathTitle': 'Unlock Your Potential',
        'dashboard.explorePathsBtn': 'Explore Career Paths',
        'dashboard.resumeLearning': 'Resume Learning',
        'dashboard.noCourses': 'You have not started any courses.',
        'dashboard.noCoursesTitle': 'Ready to Level Up?',
        'dashboard.findCourseBtn': 'Find a Course to Start',
        'dashboard.currentStanding': 'Current Standing',
        'dashboard.keepEarning': 'Keep earning XP to climb the ranks and reach the Top 10%.',
        'dashboard.recentActivity': 'Recent Activity',
        'dashboard.noActivity': 'No recent activity yet. Start exploring!',
        'dashboard.earnedXp': 'Earned XP',
        'dashboard.xpAccumulated': '+{xp} XP Accumulated',
        'dashboard.recently': 'Recently',
        
        // My Courses
        'mycourses.desc': 'Access the courses you are currently enrolled in.',
        'mycourses.emptyTitle': 'No courses yet',
        'mycourses.emptyDesc': 'You are not enrolled in any courses. Browse the catalog and start your learning journey!',
        'mycourses.browse': 'Browse Courses',
        
        // Course Player
        'course.level': 'Course Level',
        'course.modules': 'Total Modules',
        'course.progress': 'Your Progress',
        'course.mark Complete': 'Mark Complete',
        'course.completed': 'Completed',
        'course.enroll': 'Enroll in Course',
        'course.enrolled': 'Enrolled',
        'course.theater': 'Theater Mode',
        'course.exitTheater': 'Exit Theater',
        
        // Quiz Gatekeeper
        'quiz.conquer': 'Conquer The Quiz',
        'quiz.mastered': 'You have mastered the curriculum. Prove your worth and earn your XP.',
        'quiz.start': 'Start Final Assessment',
        'quiz.lockedTitle': 'Quiz Locked',
        'quiz.lockedDesc': 'Finish 100% of the videos to unlock the final assessment and earn your credentials.',
        'quiz.completeFirst': 'Complete Course First',

        // Quiz Show
        'quiz.generating': 'Generating Your AI Quiz',
        'quiz.analyzing': 'Analyzing topic: {topic}…',
        'quiz.errorTitle': "Couldn't Load Quiz",
        'quiz.errorDesc': 'There was a problem generating your quiz. Please try again.',
        'quiz.retry': 'Retry',
        'quiz.resultsTitle': 'Quiz Results',
        'quiz.passed': 'Module Passed! 🎉',
        'quiz.failed': 'Needs Improvement',
        'quiz.score': 'You scored {score} out of {total}.',
        'quiz.aiSummary': 'AI Performance Summary',
        'quiz.excellent': 'Excellent work! You demonstrated a solid understanding of {topic}. Review any missed questions below to perfect your knowledge.',
        'quiz.review': 'You might need to review the material on {topic} a bit more before feeling fully confident. Check the detailed explanations below to understand where you went wrong.',
        'quiz.yourAnswer': 'Your answer:',
        'quiz.correctAnswer': 'Correct answer:',
        'quiz.skipped': 'Skipped',
        'quiz.retryQuiz': 'Retry Quiz',
        'quiz.continue': 'Continue Journey',
        'quiz.questionProgress': 'Question {current} of {total}',
        'quiz.submit': 'Submit Final Answers',
        'quiz.next': 'Next Question',
        
        // Gamification
        'gamification.xpEarned': 'XP Earned',
        'gamification.levelUp': 'Level Up!',
        
        // General UI
        'general.explore': 'Explore',
        'general.myLearning': 'My Learning',
        'general.dominate': 'Dominate Your Career',
        'general.lightMode': 'Switch to Light Mode',
        'general.darkMode': 'Switch to Dark Mode',
        'general.switchLang': 'Switch Language',

        // Home Page
        'home.tagline': 'The Career-Oriented Learning System',
        'home.hero.title1': "Don't just learn.",
        'home.hero.title2': 'Dominate.',
        'home.hero.subtitle': 'Stop taking random courses. Choose your target career, follow our curated, step-by-step learning paths, and build the exact skills top employers demand.',
        'home.hero.btnPrimary': 'Explore Career Paths',
        'home.hero.btnSecondary': 'Browse All Courses',
        'home.stats.paths': 'Career Paths',
        'home.stats.courses': 'Mastery Courses',
        'home.stats.hireRate': 'Hire Rate',
        'home.stats.verified': 'Industry Verified',

        // Courses Page
        'courses.title': 'Course Catalog',
        'courses.subtitle': 'Browse all individual modules. For a guided experience, select a Career Path instead.',
        'courses.search': 'Search courses...',
        'courses.allFields': 'All Fields',
        'courses.allLevels': 'All Levels',
        'courses.showing': 'Showing {count} courses',
        'courses.start': 'Start Learning',
        'courses.level.beginner': 'Beginner',
        'courses.level.intermediate': 'Intermediate',
        'courses.level.advanced': 'Advanced',
        'course.defaultDesc': 'Master the foundations of this critical skill to advance your targeted career path.',
        'courses.field.it': 'IT & Software',
        'courses.field.design': 'Design',
        'courses.field.data': 'Data Analytics',
        'courses.field.marketing': 'Marketing',
        'home.essentialModules': 'Essential Modules',
        'home.essentialDesc': 'High-impact single courses to immediately level up specific skills.',

        // My Courses Page
        'myCourses.title': 'My Courses',
        'myCourses.subtitle': 'Pick up right where you left off.',
        'myCourses.empty': 'You are not enrolled in any courses',
        'myCourses.emptyDesc': 'Browse our catalog or take a career quiz to find the perfect course for you.',
        'myCourses.browse': 'Browse Catalog',
        'myCourses.unenroll': 'Unenroll',

        // Job Roles Page
        'roles.title': 'Discover Career Paths',
        'roles.subtitle': "Select your target destination. We'll map out the exact learning journey you need to get there.",
        'roles.ai.title': 'Not sure where to start?',
        'roles.ai.subtitle': "Take our AI-powered career quiz. We'll analyze your passions and your platform history to find the perfect job role for you.",
        'roles.ai.btn': 'Get Recommendation',
        'roles.modules': '{count} Modules',
        'roles.hours': '{count} Hours',
        'roles.highDemand': 'High Demand Path',

        // Dashboard
        'dashboard.roles.sectionTitle': 'Target Roles',
        'dashboard.roles.sectionSubtitle': 'Select a career destination to generate your optimal learning path.',
        'dashboard.roles.viewAll': 'View All Roles',

        // About Page
        'about.title': 'About SKORGE',
        'about.subtitle': 'We are building the definitive career acceleration platform for the modern internet.',
        'about.mission': 'Our Mission',
        'about.missionText1': 'Bridging the gap between',
        'about.missionText2': 'Learning',
        'about.missionText3': 'and',
        'about.missionText4': 'Earning',
        'about.missionDesc': 'Traditional education focuses on what to learn. We focus on who you want to become. SKORGE is designed to algorithmically guide you from absolute beginner to a hired professional in your dream role through structured paths, real-world simulations, and verified credentials.',
        'about.feat1': 'No generic tutorials',
        'about.feat2': 'Career-focused syllabus',
        'about.feat3': 'Direct hiring integrations',
        'about.stat.learners': 'Active Learners',
        'about.stat.roles': 'Job Roles',
        'about.stat.partners': 'Hiring Partners',
        'about.stat.success': 'Success Rate',

        // Stats Page
        'stats.title': 'Your Legends & Stats',
        'stats.subtitle': 'Track your XP, compete globally, and evolve your learning companion.',
        'stats.streak': 'Daily Streak',
        'stats.days': 'Days',
        'stats.streakSubtitle1': 'Keep it burning!',
        'stats.streakSubtitle2': 'Visit every day to rank up',
        'stats.time': 'Time Spent',
        'stats.hours': 'Hours',
        'stats.timeSubtitle1': 'Consistency is key',
        'stats.timeSubtitle2': 'Every minute counts',
        'stats.level': 'Level',
        'stats.earnMore': 'Earn {amount} more XP to reach Level {next}',
        'stats.petTitle': 'Your Learning Entity',
        'stats.petDesc': 'Your entity evolves as you level up and complete career milestones. Stay consistent to watch it grow from an egg into a mythic guardian.',
        'stats.currentStage': 'Current Stage:',
        'stats.leaderboard': 'Global Leaderboard',
        'stats.top10': 'Top 10',
        'stats.you': '(You)',
        'stats.milestones': 'Milestones & Prizes',
        'stats.unlocksAt': 'Unlocks at Level {level}',
        'stats.achieved': 'Achieved',

        // Jobs Page
        'jobs.title': 'Career Portal',
        'jobs.subtitle': 'Opportunities hand-picked for you based on your completed paths and acquired skills.',
        'jobs.searchPlaceholder': 'Search by job title, company, or keyword...',
        'jobs.noJobs': 'No jobs found',
        'jobs.noJobsDesc': 'Try adjusting your search terms.',
        'jobs.highMatch': 'High Match',
        'jobs.applied': 'Applied',
        'jobs.apply': 'Apply',
        'jobs.applyOnSite': 'Apply on Company Site',
        'jobs.saveForLater': 'Save for Later',
        'jobs.alreadySaved': '✓ Already saved',
        'jobs.profileTitle': 'Your Hiring Profile',
        'jobs.completeness': 'Profile Completeness',
        'jobs.increaseMatch': 'Increase your match rate',
        'jobs.goToCourse': 'Go to course',

        // Certificates Page
        'certs.title': 'My Certificates',
        'certs.subtitle': 'Industry-recognized credentials proving your readiness for the job.',
        'certs.filterPlaceholder': 'Filter by role, course, or ID...',
        'certs.empty': 'No certificates yet',
        'certs.emptyDesc': 'Complete a career path or course to earn your first certificate.',
        'certs.viewCourses': 'View Courses',
        'certs.typeTitle': 'Certificate of Completion',
        'certs.certifiesThat': 'This certifies that',
        'certs.completedPathFor': 'has successfully completed the career path for',
        'certs.completedCourse': 'has successfully completed the course',
        'certs.dateIssued': 'Date Issued',
        'certs.credentialId': 'Credential ID',
        'certs.verifiedSkills': 'Verified Skills',
        'certs.issuedOn': 'Issued on {date}',
        'certs.printPdf': 'Print PDF',
        'certs.shareLinkedIn': 'Share on LinkedIn',
        'certs.copyLink': 'Copy Link',
        'certs.copied': 'Copied!',
        'certs.all': 'All',
        'certs.jobRole': 'Job Role',
        'certs.course': 'Course',
        'certs.jobRoleCertificate': 'Job Role Certificate',
        'certs.courseCertificate': 'Course Certificate',
        'certs.partOf': 'Part of',
        'certs.path': 'path',

        // CV Builder
        'cv.title': 'Auto CV Builder',
        'cv.subtitle': 'Your automatic resumé, generated from your hard work.',
        'cv.targetRole': 'Target Role',
        'cv.selectRole': 'Select your desired role',
        'cv.generateSummary': 'Generate AI Summary',
        'cv.generating': 'Cranking the gears...',
        'cv.professionalSummary': 'Professional Summary',
        'cv.skills': 'Skills & Technologies',
        'cv.certifications': 'SKORGE Certifications',
        'cv.projects': 'Key Projects',
        'cv.printDoc': 'Print Document',
        'cv.shareLink': 'Share Link',

        // My Courses
        'mycourses.title': 'My Journey',
        'mycourses.subtitle': 'Your active and completed courses.',
        'mycourses.resume': 'Resume',
        'mycourses.explore': 'Explore Courses',
    },
    id: {
        'nav.dashboard': 'Dasbor',
        'nav.discover': 'Jelajahi Jalur',
        'nav.courses': 'Semua Kursus',
        'nav.jobs': 'Lowongan Kerja',
        'nav.about': 'Tentang Kami',
        'nav.stats': 'Statistik & Legenda',
        'nav.certificates': 'Sertifikat Saya',
        'nav.cv': 'Pembuat CV Otomatis',
        'nav.mycourses': 'Kursus Saya',
        'nav.signout': 'Keluar',
        'nav.login': 'Masuk',
        'nav.register': 'Daftar Gratis',

        // Dashboard
        'dashboard.title': 'Selamat kembali, {name}',
        'dashboard.subtitle': "Inilah posisimu dalam perjalanan menuju penguasaan. Mari kita mulai.",
        'dashboard.aiMatch': 'Kecocokan Karier AI',
        'dashboard.aiMatchDesc': 'Berdasarkan jawabanmu, kami merekomendasikan:',
        'dashboard.startPath': 'Mulai Jalur Ini',
        'dashboard.statXp': 'Total XP',
        'dashboard.statCourses': 'Kursus Selesai',
        'dashboard.statHours': 'Jam Belajar',
        'dashboard.statStreak': 'Beruntun Saat Ini',
        'dashboard.days': 'Hari',
        'dashboard.careerObjective': 'Tujuan Karier Saat Ini',
        'dashboard.pathCompletion': 'Penyelesaian Jalur',
        'dashboard.upNext': 'Selanjutnya',
        'dashboard.continueLearningBtn': 'Lanjutkan Pembelajaran',
        'dashboard.noPathDesc': "Kamu belum memilih target jalur karier.",
        'dashboard.noPathTitle': 'Buka Potensimu',
        'dashboard.explorePathsBtn': 'Jelajahi Jalur Karier',
        'dashboard.resumeLearning': 'Lanjutkan Belajar',
        'dashboard.noCourses': 'Kamu belum memulai kursus apa pun.',
        'dashboard.noCoursesTitle': 'Siap Naik Level?',
        'dashboard.findCourseBtn': 'Cari Kursus untuk Dimulai',
        'dashboard.currentStanding': 'Peringkat Saat Ini',
        'dashboard.keepEarning': 'Terus kumpulkan XP untuk naik peringkat dan mencapai Top 10%.',
        'dashboard.recentActivity': 'Aktivitas Terbaru',
        'dashboard.noActivity': 'Belum ada aktivitas. Mulai eksplorasi!',
        'dashboard.earnedXp': 'Mendapat XP',
        'dashboard.xpAccumulated': '+{xp} XP Terkumpul',
        'dashboard.recently': 'Baru Saja',
        
        // My Courses
        'mycourses.desc': 'Akses kursus yang saat ini Anda ikuti.',
        'mycourses.emptyTitle': 'Belum ada kursus',
        'mycourses.emptyDesc': 'Anda belum mendaftar di kursus mana pun. Jelajahi katalog dan mulai perjalanan belajar Anda!',
        'mycourses.browse': 'Jelajahi Kursus',
        
        // Course Player
        'course.level': 'Tingkat Kursus',
        'course.modules': 'Total Modul',
        'course.progress': 'Progres Anda',
        'course.mark Complete': 'Tandai Selesai',
        'course.completed': 'Selesai',
        'course.enroll': 'Daftar Kursus',
        'course.enrolled': 'Terdaftar',
        'course.theater': 'Mode Bioskop',
        'course.exitTheater': 'Tutup Bioskop',

        // Quiz Gatekeeper
        'quiz.conquer': 'Taklukkan Kuis',
        'quiz.mastered': 'Anda telah menguasai materi. Buktikan kemampuan Anda dan dapatkan XP.',
        'quiz.start': 'Mulai Penilaian Akhir',
        'quiz.lockedTitle': 'Kuis Terkunci',
        'quiz.lockedDesc': 'Selesaikan 100% video pembelajaran untuk membuka kuis akhir.',
        'quiz.completeFirst': 'Selesaikan Kelas Dulu',

        // Quiz Show
        'quiz.generating': 'Membuat Kuis AI Anda',
        'quiz.analyzing': 'Menganalisis topik: {topic}…',
        'quiz.errorTitle': "Gagal Memuat Kuis",
        'quiz.errorDesc': 'Terjadi masalah saat membuat kuis. Silakan coba lagi.',
        'quiz.retry': 'Coba Lagi',
        'quiz.resultsTitle': 'Hasil Kuis',
        'quiz.passed': 'Lulus Modul! 🎉',
        'quiz.failed': 'Perlu Peningkatan',
        'quiz.score': 'Skor Anda {score} dari {total}.',
        'quiz.aiSummary': 'Ringkasan Performa AI',
        'quiz.excellent': 'Kerja bagus! Anda menunjukkan pemahaman yang kuat tentang {topic}. Tinjau pertanyaan yang terlewat di bawah untuk menyempurnakannya.',
        'quiz.review': 'Anda mungkin perlu meninjau materi tentang {topic} sedikit lagi sebelum merasa benar-benar yakin. Periksa penjelasan di bawah untuk memahami kesalahan Anda.',
        'quiz.yourAnswer': 'Jawaban Anda:',
        'quiz.correctAnswer': 'Jawaban benar:',
        'quiz.skipped': 'Dilewati',
        'quiz.retryQuiz': 'Ulangi Kuis',
        'quiz.continue': 'Lanjutkan Perjalanan',
        'quiz.questionProgress': 'Pertanyaan {current} dari {total}',
        'quiz.submit': 'Kirim Jawaban Akhir',
        'quiz.next': 'Pertanyaan Selanjutnya',

        // Gamification
        'gamification.xpEarned': 'XP Diraih',
        'gamification.levelUp': 'Naik Level!',

        // General UI
        'general.explore': 'Jelajahi',
        'general.myLearning': 'Pembelajaran Saya',
        'general.dominate': 'Kuasai Karier Anda',
        'general.lightMode': 'Beralih ke Mode Terang',
        'general.darkMode': 'Beralih ke Mode Gelap',
        'general.switchLang': 'Ganti Bahasa',

        // Home Page
        'home.tagline': 'Sistem Pembelajaran Berorientasi Karier',
        'home.hero.title1': 'Jangan sekadar belajar.',
        'home.hero.title2': 'Kuasai semuanya.',
        'home.hero.subtitle': 'Berhenti mengambil kursus tanpa arah. Pilih target karier Anda, ikuti jalur pembelajaran terstruktur kami, dan bangun keterampilan akurat yang paling diincar oleh perusahaan.',
        'home.hero.btnPrimary': 'Jelajahi Jalur Karier',
        'home.hero.btnSecondary': 'Lihat Semua Kursus',
        'home.stats.paths': 'Jalur Karier',
        'home.stats.courses': 'Kursus Penguasaan',
        'home.stats.hireRate': 'Tingkat Pekerjaan',
        'home.stats.verified': 'Terverifikasi Industri',

        // Courses Page
        'courses.title': 'Katalog Kursus',
        'courses.subtitle': 'Telusuri semua modul satu per satu. Untuk pengalaman terarah, pilih Jalur Karier.',
        'courses.search': 'Cari kursus...',
        'courses.allFields': 'Semua Bidang',
        'courses.allLevels': 'Semua Tingkatan',
        'courses.showing': 'Menampilkan {count} kursus',
        'courses.start': 'Mulai Belajar',
        'courses.level.beginner': 'Pemula',
        'courses.level.intermediate': 'Menengah',
        'courses.level.advanced': 'Lanjutan',
        'course.defaultDesc': 'Kuasai dasar-dasar keterampilan penting ini untuk memajukan jalur karier target Anda.',
        'courses.field.it': 'IT & Perangkat Lunak',
        'courses.field.design': 'Desain',
        'courses.field.data': 'Analisis Data',
        'courses.field.marketing': 'Pemasaran',
        'home.essentialModules': 'Modul Esensial',
        'home.essentialDesc': 'Kursus tunggal berdampak tinggi untuk segera meningkatkan keterampilan khusus.',

        // Job Roles Page
        'roles.title': 'Temukan Jalur Karier',
        'roles.subtitle': 'Pilih tujuan Anda. Kami akan memetakan perjalanan belajar yang persis Anda butuhkan untuk mencapainya.',
        'roles.ai.title': 'Bingung mulai dari mana?',
        'roles.ai.subtitle': 'Ikuti kuis karier AI kami. Kami akan menganalisis minat dan riwayat Anda di platform untuk menemukan pekerjaan paling ideal.',
        'roles.ai.btn': 'Dapatkan Rekomendasi',
        'roles.modules': '{count} Modul',
        'roles.hours': '{count} Jam',
        'roles.highDemand': 'Jalur Paling Dicari',

        // Dashboard
        'dashboard.roles.sectionTitle': 'Peran Target',
        'dashboard.roles.sectionSubtitle': 'Pilih tujuan karier untuk menghasilkan jalur pembelajaran optimal Anda.',
        'dashboard.roles.viewAll': 'Lihat Semua',

        // About Page
        'about.title': 'Tentang SKORGE',
        'about.subtitle': 'Kami sedang membangun platform akselerasi karier definitif untuk internet modern.',
        'about.mission': 'Misi Kami',
        'about.missionText1': 'Menjembatani kesenjangan antara',
        'about.missionText2': 'Belajar',
        'about.missionText3': 'dan',
        'about.missionText4': 'Berpenghasilan',
        'about.missionDesc': 'Pendidikan tradisional fokus pada apa yang harus dipelajari. Kami fokus pada siapa Anda ingin menjadi. SKORGE secara algoritmik memandu Anda dari pemula hingga menjadi profesional di peran impian Anda melalui jalur terstruktur, simulasi dunia nyata, dan kredensial terverifikasi.',
        'about.feat1': 'Bukan tutorial generik',
        'about.feat2': 'Silabus fokus karier',
        'about.feat3': 'Integrasi perekrutan langsung',
        'about.stat.learners': 'Pelajar Aktif',
        'about.stat.roles': 'Peran Karier',
        'about.stat.partners': 'Mitra Perekrut',
        'about.stat.success': 'Tingkat Keberhasilan',

        // Stats Page
        'stats.title': 'Legenda & Statistik Anda',
        'stats.subtitle': 'Lacak XP Anda, bersaing secara global, dan kembangkan entitas belajar Anda.',
        'stats.streak': 'Rekor Harian',
        'stats.days': 'Hari',
        'stats.streakSubtitle1': 'Terus menyala!',
        'stats.streakSubtitle2': 'Kunjungi tiap hari untuk naik peringkat',
        'stats.time': 'Waktu Dihabiskan',
        'stats.hours': 'Jam',
        'stats.timeSubtitle1': 'Konsistensi adalah kunci',
        'stats.timeSubtitle2': 'Setiap menit berharga',
        'stats.level': 'Level',
        'stats.earnMore': 'Dapatkan {amount} XP lagi untuk mencapai Level {next}',
        'stats.petTitle': 'Entitas Belajar Anda',
        'stats.petDesc': 'Entitas Anda berevolusi seiring kenaikan level dan pencapaian karier. Tetap konsisten untuk melihatnya tumbuh dari telur menjadi penjaga mistik.',
        'stats.currentStage': 'Tahap Saat Ini:',
        'stats.leaderboard': 'Papan Peringkat Global',
        'stats.top10': '10 Teratas',
        'stats.you': '(Anda)',
        'stats.milestones': 'Pencapaian & Hadiah',
        'stats.unlocksAt': 'Terbuka di Level {level}',
        'stats.achieved': 'Tercapai',

        // Jobs Page
        'jobs.title': 'Portal Karier',
        'jobs.subtitle': 'Peluang yang dipilih khusus untuk Anda berdasarkan jalur dan keterampilan Anda.',
        'jobs.searchPlaceholder': 'Cari berdasarkan judul, nama perusahaan, atau kata kunci...',
        'jobs.noJobs': 'Tidak ada pekerjaan ditemukan',
        'jobs.noJobsDesc': 'Coba sesuaikan kata kunci pencarian Anda.',
        'jobs.highMatch': 'Kecocokan Tinggi',
        'jobs.applied': 'Dilamar',
        'jobs.apply': 'Lamar',
        'jobs.applyOnSite': 'Lamar di Situs Perusahaan',
        'jobs.saveForLater': 'Simpan Nanti',
        'jobs.alreadySaved': '✓ Sudah disimpan',
        'jobs.profileTitle': 'Profil Perekrutan Anda',
        'jobs.completeness': 'Kelengkapan Profil',
        'jobs.increaseMatch': 'Tingkatkan rasio kecocokan',
        'jobs.goToCourse': 'Ke kursus',

        // Certificates Page
        'certs.title': 'Sertifikat Saya',
        'certs.subtitle': 'Kredensial yang diakui industri membuktikan kesiapan kerja Anda.',
        'certs.filterPlaceholder': 'Saring berdasarkan peran, kursus, atau ID...',
        'certs.empty': 'Belum ada sertifikat',
        'certs.emptyDesc': 'Selesaikan jalur karier atau kursus untuk mendapatkan sertifikat pertama Anda.',
        'certs.viewCourses': 'Lihat Kursus',
        'certs.typeTitle': 'Sertifikat Penyelesaian',
        'certs.certifiesThat': 'Ini menyatakan bahwa',
        'certs.completedPathFor': 'telah berhasil menyelesaikan jalur karier untuk',
        'certs.completedCourse': 'telah berhasil menyelesaikan kursus',
        'certs.dateIssued': 'Tanggal Diterbitkan',
        'certs.credentialId': 'ID Kredensial',
        'certs.verifiedSkills': 'Keterampilan Terverifikasi',
        'certs.issuedOn': 'Diterbitkan pada {date}',
        'certs.printPdf': 'Cetak PDF',
        'certs.shareLinkedIn': 'Bagikan ke LinkedIn',
        'certs.copyLink': 'Salin Tautan',
        'certs.copied': 'Tersalin!',
        'certs.all': 'Semua',
        'certs.jobRole': 'Peran Karier',
        'certs.course': 'Kursus',
        'certs.jobRoleCertificate': 'Sertifikat Peran Karier',
        'certs.courseCertificate': 'Sertifikat Kursus',
        'certs.partOf': 'Bagian dari',
        'certs.path': 'jalur',


        // My Courses Page
        'myCourses.title': 'Kursus Saya',
        'myCourses.subtitle': 'Lanjutkan dari tempat Anda berhenti.',
        'myCourses.empty': 'Anda belum mendaftar di kursus apa pun',
        'myCourses.emptyDesc': 'Telusuri katalog kami atau ikuti kuis karier untuk menemukan kursus yang tepat untuk Anda.',
        'myCourses.browse': 'Telusuri Katalog',
        'myCourses.unenroll': 'Batal Daftar',

        // CV Builder
        'cv.title': 'Pembuat CV Otomatis',
        'cv.subtitle': 'Resume otomatis Anda, dihasilkan dari kerja keras Anda.',
        'cv.targetRole': 'Peran Target',
        'cv.selectRole': 'Pilih peran yang diinginkan',
        'cv.generateSummary': 'Buat Ringkasan AI',
        'cv.generating': 'Sedang memproses...',
        'cv.professionalSummary': 'Ringkasan Profesional',
        'cv.skills': 'Keahlian & Teknologi',
        'cv.certifications': 'Sertifikasi SKORGE',
        'cv.projects': 'Proyek Utama',
        'cv.printDoc': 'Cetak Dokumen',
        'cv.shareLink': 'Bagikan Tautan',

        // My Courses
        'mycourses.title': 'Perjalanan Saya',
        'mycourses.subtitle': 'Kursus aktif dan selesai milik Anda.',
        'mycourses.resume': 'Lanjutkan',
        'mycourses.explore': 'Eksplorasi Kursus',
    }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Language>(() => {
        const saved = localStorage.getItem('skorge_lang');

        return (saved as Language) || 'en';
    });

    const toggleLanguage = () => {
        const newLang = lang === 'en' ? 'id' : 'en';
        setLang(newLang);
        localStorage.setItem('skorge_lang', newLang);
    };

    const t = (key: string, params?: Record<string, string | number>) => {
        let text = translations[lang][key] || (params?.defaultValue as string) || key;

        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                text = text.replace(`{${k}}`, String(v));
            });
        }

        return text;
    };

    return <I18nContext.Provider value={{ lang, toggleLanguage, t }}>{children}</I18nContext.Provider>;
}

export const useTranslation = () => {
    const ctx = useContext(I18nContext);

    if (!ctx) {
throw new Error('useTranslation must be used within I18nProvider');
}

    return ctx;
};
