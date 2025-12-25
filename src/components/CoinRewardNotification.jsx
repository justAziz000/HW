import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Gift, Sparkles, X, Star } from 'lucide-react';
import { getPendingReward, clearPendingReward } from './store1';

export function CoinRewardNotification({ userId, onClose }) {
  const [reward, setReward] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (userId) {
      // Small delay to ensure localStorage is updated
      const timer = setTimeout(() => {
        const pendingReward = getPendingReward(String(userId));
        console.log('Checking pending reward for:', userId, pendingReward);
        
        if (pendingReward && pendingReward.amount > 0) {
          setReward(pendingReward);
          setIsVisible(true);
          
          // Create celebration particles
          const newParticles = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 0.5,
            color: ['#fbbf24', '#f59e0b', '#eab308', '#facc15', '#fcd34d'][Math.floor(Math.random() * 5)]
          }));
          setParticles(newParticles);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [userId]);

  const handleClose = () => {
    setIsVisible(false);
    if (userId) {
      clearPendingReward(userId);
    }
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  if (!reward) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Floating Particles */}
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              initial={{ 
                opacity: 0, 
                y: '100vh',
                x: `${particle.x}vw`,
                scale: 0
              }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                y: '-20vh',
                scale: [0, 1, 1, 0.5],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 3,
                delay: particle.delay,
                ease: "easeOut"
              }}
              className="absolute w-4 h-4 pointer-events-none"
              style={{ backgroundColor: particle.color, borderRadius: '50%' }}
            />
          ))}

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.5, y: 50, rotateX: -30 }}
            animate={{ scale: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.5, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 max-w-md w-full border-2 border-yellow-500/50 shadow-2xl shadow-yellow-500/20"
            onClick={e => e.stopPropagation()}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 rounded-3xl blur-xl -z-10" />
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-500/50">
                  <Coins className="w-16 h-16 text-yellow-900" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2"
                >
                  {[0, 60, 120, 180, 240, 300].map(deg => (
                    <Star
                      key={deg}
                      className="absolute w-4 h-4 text-yellow-400"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${deg}deg) translateY(-50px) translateX(-50%)`
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-black text-yellow-400">Tabriklaymiz!</h2>
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
              
              <p className="text-gray-300 mb-4">Siz coin oldingiz!</p>

              {/* Amount */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-2xl px-8 py-4 mb-6"
              >
                <Coins className="w-10 h-10 text-yellow-400" />
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                  +{reward.amount}
                </span>
              </motion.div>

              {/* Reasons */}
              {reward.reasons && reward.reasons.length > 0 && (
                <div className="text-sm text-gray-400 mb-6">
                  {reward.reasons.map((reason, i) => (
                    <p key={i} className="flex items-center justify-center gap-2">
                      <Gift className="w-4 h-4 text-purple-400" />
                      {reason}
                    </p>
                  ))}
                </div>
              )}

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold rounded-2xl shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Ajoyib!
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
