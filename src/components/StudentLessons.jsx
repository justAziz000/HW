import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, FileText, ChevronRight, ArrowLeft, CheckCircle, Lock } from 'lucide-react';

const lessonsData = [
    {
        id: 1,
        title: 'JavaScript Asoslari va O\'zgaruvchilar',
        duration: '1:15:00',
        videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
        content: `
      # JavaScript Kirish
      
      JavaScript - bu veb-sahifalarni interaktiv qilish uchun ishlatiladigan dasturlash tili.
      
      ## O'zgaruvchilar
      JavaScriptda o'zgaruvchilarni e'lon qilish uchun 3 ta kalit so'z mavjud:
      1. **var** - eski usul (ishlatish tavsiya etilmaydi)
      2. **let** - o'zgaruvchan qiymatlar uchun
      3. **const** - o'zgarmas qiymatlar uchun
      `,
        isCompleted: true,
    },
    {
        id: 2,
        title: 'Ma\'lumot turlari va Operatorlar',
        duration: '1:30:00',
        videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
        content: `Bu darsda biz JavaScriptdagi primitive va reference ma'lumot turlarini ko'rib chiqamiz.`,
        isCompleted: false,
    },
    {
        id: 3,
        title: 'Funksiyalar va Scope',
        duration: '1:45:00',
        videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
        content: `Function Declaration, Expression va Arrow Function farqlari.`,
        isCompleted: false,
        isLocked: true,
    },
    {
        id: 4,
        title: 'DOM bilan ishlash',
        duration: '2:00:00',
        videoUrl: '',
        content: `Document Object Model haqida.`,
        isLocked: true,
    }
];

export function StudentLessons({ user }) {
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = 'https://69393fa6c8d59937aa0706bf.mockapi.io/submissions';

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await fetch(API_URL);
                const data = await res.json();

                const mySubs = data.filter(
                    s => String(s.studentId) === String(user?.id || '1')
                );

                setSubmissions(mySubs);
            } catch (e) {
                console.error("Failed to fetch submissions", e);
                const saved = localStorage.getItem('submissions');
                if (saved) setSubmissions(JSON.parse(saved));
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, [user]);

    const isLessonUnlocked = (index) => {
        if (index === 0) return true;

        const prevLesson = lessonsData[index - 1];

        const submission = submissions.find(s =>
            s.homeworkTitle &&
            prevLesson.title &&
            s.homeworkTitle.toLowerCase().includes(prevLesson.title.toLowerCase().split(' ')[0])
        );

        return submission && submission.score >= 60;
    };

    const isLessonCompleted = (lesson) => {
        const submission = submissions.find(s =>
            s.homeworkTitle &&
            lesson.title &&
            s.homeworkTitle.toLowerCase().includes(lesson.title.toLowerCase().split(' ')[0])
        );

        return submission && submission.score >= 60;
    };

    if (selectedLesson) {
        return (
            <div className="max-w-5xl mx-auto text-slate-900 dark:text-white">
                <button
                    onClick={() => setSelectedLesson(null)}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-500 mb-6 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Darslarga qaytish
                </button>

                <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                    <div className="relative aspect-video bg-black">
                        <iframe
                            width="100%"
                            height="100%"
                            src={selectedLesson.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                            title={selectedLesson.title}
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                    </div>

                    <div className="p-8">
                        <h1 className="text-3xl font-bold mb-6">{selectedLesson.title}</h1>

                        <div className="prose dark:prose-invert max-w-none">
                            {selectedLesson.content.split('\n').map((line, i) => {
                                if (line.trim().startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.replace('# ', '')}</h1>;
                                if (line.trim().startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.replace('## ', '')}</h2>;
                                return <p key={i} className="mb-2 text-slate-600 dark:text-slate-300">{line}</p>;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Mening Darslarim</h2>
                    <p className="text-slate-500 dark:text-slate-400">JavaScript • 3-oy</p>
                </div>

                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-xl font-bold">
                    {Math.round((lessonsData.filter(l => isLessonCompleted(l)).length / lessonsData.length) * 100)}% Tugatildi
                </div>
            </div>

            <div className="space-y-4">
                {lessonsData.map((lesson, index) => {
                    const unlocked = isLessonUnlocked(index);
                    const completed = isLessonCompleted(lesson);

                    return (
                        <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => unlocked && setSelectedLesson(lesson)}
                            className={`group relative bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all ${!unlocked ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg ${
                                    completed
                                        ? 'bg-green-500 text-white'
                                        : !unlocked
                                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                                        : 'bg-blue-600 text-white'
                                }`}>
                                    {completed ? <CheckCircle className="w-8 h-8" /> : !unlocked ? <Lock className="w-6 h-6" /> : index + 1}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                            {lesson.title}
                                        </h3>
                                        {!unlocked && <Lock className="w-4 h-4 text-slate-400" />}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1"><Play className="w-4 h-4" /> {lesson.duration}</span>
                                        <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> Video + Matn</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <ChevronRight className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
