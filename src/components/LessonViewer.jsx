import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, ChevronUp, BookOpen, Clock, Coins } from 'lucide-react';
import { lessons } from '../data/mockData';

export function LessonViewer({ groupId }) {
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  const groupLessons = lessons.filter(l => l.groupId === groupId);

  const handleCompleteLesson = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const isLessonCompleted = (lessonId) => completedLessons.includes(lessonId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Darslar</h2>
      </div>

      {groupLessons.length === 0 ? (
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 text-center text-slate-600 dark:text-slate-400">
          Bu guruh uchun darslar hali qo'shilmagan
        </div>
      ) : (
        <div className="space-y-3">
          {groupLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition"
            >
              {/* Lesson Header */}
              <button
                onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
              >
                <div className="flex items-center gap-4 flex-1 text-left">
                  {/* Lesson Number Badge */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${
                    isLessonCompleted(lesson.id)
                      ? 'bg-green-500'
                      : 'bg-blue-600'
                  }`}>
                    {lesson.number}
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">{lesson.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {lesson.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        {lesson.coinsPerCompletion} coin
                      </span>
                    </p>
                  </div>

                  {/* Completion Indicator */}
                  {isLessonCompleted(lesson.id) && (
                    <span className="text-green-500 font-bold text-sm">✓ Bajarildi</span>
                  )}
                </div>

                {/* Expand Icon */}
                <div className="ml-4">
                  {expandedLesson === lesson.id ? (
                    <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedLesson === lesson.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="px-6 py-4 space-y-4">
                      {/* Explanation */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {lesson.explanation}
                        </p>
                      </div>

                      {/* Videos */}
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          Videolar ({lesson.videos.length})
                        </h4>
                        <div className="space-y-2">
                          {lesson.videos.map((video, vidIndex) => (
                            <motion.button
                              key={video.id}
                              whileHover={{ scale: 1.01 }}
                              onClick={() => setSelectedVideo(video)}
                              className="w-full p-3 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition text-left flex items-center gap-3 group"
                            >
                              <div className="text-2xl">{video.thumbnail}</div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-900 dark:text-white">
                                  {vidIndex + 1}. {video.title}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                  {video.duration}
                                </p>
                              </div>
                              <Play className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition" />
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Complete Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCompleteLesson(lesson.id)}
                        disabled={isLessonCompleted(lesson.id)}
                        className={`w-full py-3 rounded-lg font-semibold transition ${
                          isLessonCompleted(lesson.id)
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isLessonCompleted(lesson.id) ? '✓ Bajarildi' : `Darsi Bajargan Sifatida Belgilash (+${lesson.coinsPerCompletion} coin)`}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl"
            >
              <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
                {/* Video Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <p className="text-white text-lg font-semibold">{selectedVideo.title}</p>
                    <p className="text-slate-400 mt-2">Video: {selectedVideo.url}</p>
                    <p className="text-slate-500 text-sm mt-2">{selectedVideo.duration}</p>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4 bg-slate-900 text-white">
                  <h3 className="font-bold mb-2">{selectedVideo.title}</h3>
                  <a
                    href={selectedVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline text-sm"
                  >
                    Videoni YouTube-da ochish
                  </a>
                  <p className="text-slate-400 text-sm mt-2">
                    Videoninguch havolasiga bosib, taʻlim materialini toʻliq kuzatishingiz mumkin.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedVideo(null)}
                className="mt-4 w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-semibold"
              >
                Yopish
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
