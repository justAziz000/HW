// src/mockdata.js

export const groups = [
  { id: 'nF-2941', name: 'nF-2941', schedule: '18:00 - 20:00', days: 'Dushanba, Chorshanba, Juma', course: 'JavaScript Asoslari' },
  { id: 'nF-2506', name: 'nF-2506', schedule: '14:00 - 16:00', days: 'Seshanba, Payshanba, Shanba', course: 'React Darslari' },
  { id: 'nF-2996', name: 'nF-2996', schedule: '16:00 - 18:00', days: 'Dushanba, Chorshanba, Juma', course: 'Web Dizayn' },
];

export const lessons = [
  {
    id: 'lesson1',
    groupId: 'nF-2941',
    number: 1,
    title: 'JavaScript Kirish',
    duration: '2 soat',
    videos: [
      {
        id: 'vid1',
        title: 'JavaScript nima?',
        url: 'https://youtu.be/dQw4w9WgXcQ',
        duration: '15 min',
        thumbnail: '📹'
      },
      {
        id: 'vid2',
        title: 'Birinchi dastur',
        url: 'https://youtu.be/dQw4w9WgXcQ',
        duration: '20 min',
        thumbnail: '📹'
      }
    ],
    explanation: 'JavaScript - bu veb-brauzerda ishlayotgan dasturlash tili. U veb-sahifalarni interaktiv qilib beradi. Ushbu darsda biz JavaScriptning asosiy tushunchalari va ilk programmani yozishni o\'rganamiz.',
    coinsPerCompletion: 50,
    maxDate: '2025-12-20'
  },
  {
    id: 'lesson2',
    groupId: 'nF-2941',
    number: 2,
    title: 'O\'zgaruvchilar va Turlar',
    duration: '2 soat',
    videos: [
      {
        id: 'vid3',
        title: 'var, let, const',
        url: 'https://youtu.be/dQw4w9WgXcQ',
        duration: '18 min',
        thumbnail: '📹'
      },
      {
        id: 'vid4',
        title: 'Ma\'lumot turlari',
        url: 'https://youtu.be/dQw4w9WgXcQ',
        duration: '22 min',
        thumbnail: '📹'
      }
    ],
    explanation: 'O\'zgaruvchilar - bu dasturda ma\'lumotlarni saqlash uchun ishlatiladigan kontejnerlar. JavaScript-da var, let va const deb uchta usul bor. Har birning o\'z xususiyatlari bor.',
    coinsPerCompletion: 50,
    maxDate: '2025-12-22'
  },
  {
    id: 'lesson3',
    groupId: 'nF-2941',
    number: 3,
    title: 'Shartli Operatorlar',
    duration: '2 soat',
    videos: [
      {
        id: 'vid5',
        title: 'if, else if, else',
        url: 'https://youtu.be/dQw4w9WgXcQ',
        duration: '20 min',
        thumbnail: '📹'
      },
      {
        id: 'vid6',
        title: 'switch operatori',
        url: 'https://youtu.be/dQw4w9WgXcQ',
        duration: '15 min',
        thumbnail: '📹'
      }
    ],
    explanation: 'Shartli operatorlar dasturga turli xil qarorlar qabul qilish imkoniyatini beradi. Agar shart haqiqatdan iborat bo\'lsa, biror kodni ishga tushirish, aks holda boshqasini ishga tushirish mumkin.',
    coinsPerCompletion: 50,
    maxDate: '2025-12-25'
  },
  {
    id: 'lesson4',
    groupId: 'nF-2506',
    number: 1,
    title: 'React Kirish',
    duration: '2 soat',
    videos: [
      {
        id: 'vid7',
        title: 'React nima?',
        url: 'https://youtu.be/dQw4w9WgXcQ',
        duration: '20 min',
        thumbnail: '📹'
      },
      {
        id: 'vid8',
        title: 'Create React App',
        url: 'https://youtu.be/dQw4w9WgXcQ',
        duration: '18 min',
        thumbnail: '📹'
      }
    ],
    explanation: 'React - bu Facebook tomonidan yaratilgan JavaScript kutubxonasi. U veb-ilovalarni qurishni oson qilib beradi. Komponentlarga asoslangan arxitekturasi bor.',
    coinsPerCompletion: 60,
    maxDate: '2025-12-28'
  }
];

export const students = [
  { id: '1', name: 'Aziz Karimov', groupId: 'nF-2941', email: 'student@mars.uz', coins: 450, totalScore: 2150, level: 8, avatar: 'boy1' },
  { id: '2', name: 'Malika Alieva', groupId: 'nF-2941', email: 'malika@example.com', coins: 580, totalScore: 2380, level: 10, avatar: 'girl1' },
  { id: '3', name: 'Bobur Tursunov', groupId: 'nF-2941', email: 'bobur@example.com', coins: 320, totalScore: 1820, level: 6, avatar: 'boy2' },
  { id: '4', name: 'Dilnoza Rahimova', groupId: 'nF-2506', email: 'dilnoza@example.com', coins: 620, totalScore: 2410, level: 11, avatar: 'girl2' },
  { id: '5', name: 'Jasur Mahmudov', groupId: 'nF-2506', email: 'jasur@example.com', coins: 490, totalScore: 2070, level: 9, avatar: 'boy3' },
  { id: '6', name: 'Zarina Yusupova', groupId: 'nF-2996', email: 'zarina@example.com', coins: 710, totalScore: 2520, level: 12, avatar: 'girl3' },
  { id: '7', name: 'Timur Ibragimov', groupId: 'nF-2996', email: 'timur@example.com', coins: 550, totalScore: 2210, level: 10, avatar: 'boy4' },
  { id: '8', name: 'Sevara Nurmatova', groupId: 'nF-2941', email: 'sevara@example.com', coins: 410, totalScore: 1960, level: 7, avatar: 'girl4' },
];

export const homeworks = [
  { id: 'hw1', lesson: 5, lessonNumber: 5, title: 'Flexbox va Grid', description: 'Flexbox va Grid yordamida murakkab layout yarating', deadline: '2025-12-10' },
  { id: 'hw2', lesson: 6, lessonNumber: 6, title: 'Responsive Navbar', description: 'Mobil va desktop uchun toʻliq responsive navbar', deadline: '2025-12-12' },
  { id: 'hw3', lesson: 7, lessonNumber: 7, title: 'Landing Page', description: 'Real loyihaga yaqin toʻliq landing page', deadline: '2025-12-15' },
  { id: 'hw4', lesson: 8, lessonNumber: 8, title: 'React Components + Props', description: 'Qayta ishlatiladigan komponentlar tizimi', deadline: '2025-12-17' },
  { id: 'hw5', lesson: 9, lessonNumber: 9, title: 'useState va useEffect', description: 'Holati boshqariladigan todo yoki counter ilova', deadline: '2025-12-20' },
];

export const submissions = [
  { id: 's1', studentId: '2', homeworkId: 'hw1', link: 'https://github.com/aziz/flexbox-grid', status: 'checked', score: 95, comment: 'Ajoyib, faqat mobileda kichik muammo bor', submittedAt: '2025-12-08' },
  { id: 's2', studentId: '1', homeworkId: 'hw1', link: 'https://codesandbox.io/s/malika-grid', status: 'checked', score: 100, comment: 'Mukammal ish!', submittedAt: '2025-12-07' },
  { id: 's3', studentId: '3', homeworkId: 'hw1', link: 'https://github.com/bobur/layout', status: 'redo', score: 60, comment: 'Grid notoʻgʻri ishlatilgan, qayta topshiring', submittedAt: '2025-12-09' },
  { id: 's4', studentId: '4', homeworkId: 'hw2', link: 'https://navbar-dilnoza.netlify.app', status: 'checking', score: 0, comment: '', submittedAt: '2025-12-11' },
  { id: 's5', studentId: '6', homeworkId: 'hw2', link: 'https://github.com/zarina/super-navbar', status: 'checked', score: 98, comment: 'Animatsiya va dizayn zoʻr!', submittedAt: '2025-12-10' },
];

export const shopItems = [
  { id: 'shop1', name: 'Mars IT School koʻylagi', points: 250, icon: 'tshirt', available: true },
  { id: 'shop2', name: 'Mars IT sumkasi', points: 200, icon: 'bag', available: true },
  { id: 'shop3', name: 'Qalam + brend daftar', points: 80, icon: 'notebook', available: true },
  { id: 'shop4', name: '+100 Mars Coin (bonus)', points: 120, icon: 'coin', available: true },
  { id: 'shop5', name: '1 oy Pro kursga 50% chegirma', points: 500, icon: 'discount', available: false },
  { id: 'shop6', name: 'Sticker pack (10 dona)', points: 50, icon: 'sticker', available: true },
  { id: 'shop7', name: 'Wireless sichqoncha', points: 320, icon: 'mouse', available: true },
  { id: 'shop8', name: 'Mechanical keyboard keycap', points: 180, icon: 'keyboard', available: true },
  { id: 'shop9', name: 'Hoodie limited edition', points: 420, icon: 'hoodie', available: true },
  { id: 'shop10', name: 'Coffee & snack voucher', points: 90, icon: 'snack', available: true },
  { id: 'shop11', name: '1 soat mentorlik sessiya', points: 350, icon: 'mentor', available: true },
  { id: 'shop12', name: 'ChatGPT 2.5 pro kirish (1 oy)', points: 4000, icon: 'mentor', available: true },
];