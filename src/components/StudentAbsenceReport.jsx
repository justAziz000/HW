import { useState, useEffect } from 'react';
import { Calendar, Send, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
    submitAbsenceReport,
    getStudentAbsenceReports
} from './absenceStore';

/**
 * StudentAbsenceReport Component
 * Allows students to report when they cannot attend class
 * and view their submitted absence reports
 */
export function StudentAbsenceReport({ user, groupId }) {
    const [showForm, setShowForm] = useState(false);
    const [reason, setReason] = useState('');
    const [date, setDate] = useState('');
    const [reports, setReports] = useState([]);

    useEffect(() => {
        loadReports();
    }, [user.id]);

    const loadReports = () => {
        const studentReports = getStudentAbsenceReports(user.id);
        setReports(studentReports);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!date) {
            toast.error('❌ Iltimos, sanani tanlang!');
            return;
        }

        if (!reason.trim()) {
            toast.error('❌ Iltimos, sababni kiriting!');
            return;
        }

        if (reason.trim().length < 10) {
            toast.warning('⚠️ Sabab kamida 10 ta belgidan iborat bo\'lishi kerak!');
            return;
        }

        // Submit the report
        submitAbsenceReport(user.id, user.name, groupId, reason, date);

        toast.success('✅ Xabaringiz o\'qituvchiga yuborildi!');

        // Reset form
        setReason('');
        setDate('');
        setShowForm(false);

        // Reload reports
        loadReports();
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending':
                return {
                    icon: <Clock className="w-5 h-5" />,
                    color: 'text-yellow-400',
                    bg: 'bg-yellow-500/20',
                    text: 'Kutilmoqda'
                };
            case 'approved':
                return {
                    icon: <CheckCircle className="w-5 h-5" />,
                    color: 'text-green-400',
                    bg: 'bg-green-500/20',
                    text: 'Tasdiqlandi'
                };
            case 'rejected':
                return {
                    icon: <XCircle className="w-5 h-5" />,
                    color: 'text-red-400',
                    bg: 'bg-red-500/20',
                    text: 'Rad etildi'
                };
            default:
                return {
                    icon: <AlertCircle className="w-5 h-5" />,
                    color: 'text-gray-400',
                    bg: 'bg-gray-500/20',
                    text: 'Noma\'lum'
                };
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Calendar className="w-7 h-7 text-purple-400" />
                    Darsga Kela Olmaslik
                </h2>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-shadow"
                >
                    {showForm ? '❌ Bekor qilish' : '➕ Xabar yuborish'}
                </motion.button>
            </div>

            {/* Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20"
                    >
                        <h3 className="text-xl font-bold mb-4">Darsga kela olmaslik xabari</h3>

                        {/* Date Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2 text-gray-300">
                                Qaysi sana?
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Reason Textarea */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2 text-gray-300">
                                Sabab (kamida 10 ta belgi)
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Misol: Bemor bo'lib qoldim, shifokor ko'rigiga borishim kerak..."
                                rows={4}
                                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                {reason.length} / 10 belgi
                            </p>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-shadow"
                        >
                            <Send className="w-5 h-5" />
                            Yuborish
                        </motion.button>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Reports List */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-300">
                    Yuborilgan xabarlar ({reports.length})
                </h3>

                {reports.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/10">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400">Hozircha xabar yubormadingiz</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {reports.map((report) => {
                            const statusInfo = getStatusInfo(report.status);
                            const reportDate = new Date(report.date);
                            const submittedDate = new Date(report.submittedAt);

                            return (
                                <motion.div
                                    key={report.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-purple-500/30 transition-colors"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-purple-400" />
                                            <div>
                                                <p className="font-bold">
                                                    {reportDate.toLocaleDateString('uz-UZ', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Yuborilgan: {submittedDate.toLocaleDateString('uz-UZ')} {submittedDate.toLocaleTimeString('uz-UZ')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                                            {statusInfo.icon}
                                            <span className="text-sm font-bold">{statusInfo.text}</span>
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    <div className="bg-white/5 rounded-xl p-4 mb-3">
                                        <p className="text-sm text-gray-300">{report.reason}</p>
                                    </div>

                                    {/* Teacher Response */}
                                    {report.teacherResponse && (
                                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                                            <p className="text-xs font-semibold text-purple-400 mb-1">
                                                O'qituvchi javobi:
                                            </p>
                                            <p className="text-sm text-gray-300">{report.teacherResponse}</p>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentAbsenceReport;
