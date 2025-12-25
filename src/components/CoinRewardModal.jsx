import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export function CoinRewardModal({ coins, totalCoins, isOpen, onClose }) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);
    if (isOpen && coins > 0) {
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, coins]);

  const handleClose = () => {
    setShow(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="relative"
          >
            {/* Animated coin bouncing */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-6xl"
            >
              🪙
            </motion.div>

            <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black border-2 border-yellow-500/50 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-3xl" />
              
              <div className="relative z-10 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  Tabriklaymiz! 🎉
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-slate-300 mb-6"
                >
                  Siz coin oldingiz
                </motion.p>

                {/* Coin amount display */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="mb-8"
                >
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 shadow-lg shadow-yellow-500/50">
                    <p className="text-sm text-slate-900 font-semibold mb-1">Olgan Coinlar</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-5xl font-bold text-slate-900">+{coins}</span>
                      <span className="text-4xl">🪙</span>
                    </div>
                  </div>
                </motion.div>

                {/* Total coins */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-slate-700/50 rounded-lg p-4 mb-6"
                >
                  <p className="text-slate-400 text-sm mb-1">Jami Coinlar</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold text-white">{totalCoins}</span>
                    <span className="text-2xl">🪙</span>
                  </div>
                </motion.div>

                {/* Info message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xs text-slate-400 mb-6"
                >
                  Coinlarni shop'da ishlatib turingi yoki reyting uchun o'ynab toping!
                </motion.p>

                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  onClick={handleClose}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition duration-200 shadow-lg hover:shadow-xl"
                >
                  Davom Etish
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
