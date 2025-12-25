import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';

const ONBOARDING_SEEN_KEY = 'onboarding-tutorial-seen';

export function OnboardingTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem(ONBOARDING_SEEN_KEY);
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const tutorialSteps = [
    {
      title: "Xush Kelibsiz! 👋",
      description: "Homework Control platformasiga xush kelibsiz. Ushbu o'quv vositasi sizning o'quvchilarni boshqarish va darslarni oʻz vaqtida topshirishni oʻzlashtirish uchun mo'ljallangan.",
      icon: "👋"
    },
    {
      title: "Vazifalarni Topshiring 📝",
      description: "GitHub, Vercel yoki Netlify dan loyihangiz havolasini topshiring. Faqat ushbu platformalardan linklar qabul qilinadi. O'qituvchi tez orada tekshiraydi va ballingizni beraydi.",
      icon: "📝"
    },
    {
      title: "Coinlarni Yig'ing 🪙",
      description: "Vazifalarni bajarilgan va imtihonlardan coin yig'ing. Shoping-da ushbu coinlarni ishlatib turing va maxsus sovg'alar sotib olin.",
      icon: "🪙"
    },
    {
      title: "Reyting va Daraja 🏆",
      description: "Siz boshqa o'quvchilar bilan ratingda o'zaro solishtirilyapsiz. O'zingizni daraja oshirib, o'quvchi jamoasining eng yaxshi buluvchilari qatoriga kirib oling.",
      icon: "🏆"
    },
    {
      title: "Profilingizni Yangilang 👤",
      description: "Profilingizda avatar ornatib, parolni o'zgartiring va shaxsiy ma'lumotlaringizni yangilang. Qo'shimcha sozlamalarni sozlash uchun 'Mening Profilim' bo'limiga o'ting.",
      icon: "👤"
    },
    {
      title: "Ota-Onalar Kuzatadiladi 👨‍👩‍👧",
      description: "Ota-onalarngiz sizning taraqqiyotingizni kuzata oladilari. Bajarilgan vazifalar, coinlar va reytingingiz hamma uchun oʻzgacha ko'rsatiladi.",
      icon: "👨‍👩‍👧"
    },
    {
      title: "Tayyor! 🚀",
      description: "Endi platforma bilan ishlashni boshlashingiz mumkin. Xohlasangiz, qo'llanma bilan keyinroq tanishib olishingiz mumkin.",
      icon: "🚀"
    }
  ];

  const handleClose = () => {
    setShowTutorial(false);
    localStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {showTutorial && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative w-full max-w-2xl"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute -top-12 right-0 text-white hover:text-slate-300 transition"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Main card */}
            <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-700/50">
              {/* Header with icon and title */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-6"
                >
                  {tutorialSteps[currentStep].icon}
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {tutorialSteps[currentStep].title}
                </h2>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-center text-lg mb-8 leading-relaxed">
                {tutorialSteps[currentStep].description}
              </p>

              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex gap-2 justify-center mb-3">
                  {tutorialSteps.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index <= currentStep
                          ? 'bg-blue-500 w-6'
                          : 'bg-slate-700 w-4'
                      }`}
                      animate={{ width: index === currentStep ? 24 : 16 }}
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-slate-400">
                  {currentStep + 1} / {tutorialSteps.length}
                </p>
              </div>

              {/* Button section */}
              <div className="flex gap-4 justify-center flex-wrap">
                {currentStep > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition"
                  >
                    Orqaga
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold flex items-center gap-2 transition"
                >
                  {currentStep === tutorialSteps.length - 1 ? (
                    'Boshlash'
                  ) : (
                    <>
                      Davom Etish <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition"
                >
                  Yana bu yerga o'tmasin
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
