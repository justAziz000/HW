import { useMemo, useState } from 'react';
import { ShoppingCart, Gift, Award, Lock, MinusCircle, PlusCircle, Send, Sparkles, Coins, CheckCircle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { shopItems } from '../data/mockData';
import { createOrder, getOrdersForStudent } from './shopstore';

export function StudentShop({ user }) {
  const [cart, setCart] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Use coins from the user prop (synchronized by Dashboard)
  const userCoins = user?.coins || 0;
  const myOrders = getOrdersForStudent(user?.id);

  const items = useMemo(
    () => shopItems.map(item => ({ ...item, icon: item.icon || item.image })),
    []
  );

  const spent = cart.reduce((sum, item) => sum + item.points * item.qty, 0);
  const remaining = Math.max(userCoins - spent, 0);

  const handlePurchase = (item) => {
    if (!item.available) {
      toast.error('Bu mahsulot hozir yopiq');
      return;
    }

    if (remaining < item.points) {
      toast.error(`Coin yetarli emas. Kerak: ${item.points}, sizda: ${remaining}`);
      return;
    }

    setCart(prev => {
      const exists = prev.find(p => p.id === item.id);
      if (exists) {
        return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...item, qty: 1 }];
    });

    toast.success(`${item.name} korzinkaga qo'shildi`);
  };

  const decreaseItem = (itemId) => {
    setCart(prev => prev
      .map(p => p.id === itemId ? { ...p, qty: p.qty - 1 } : p)
      .filter(p => p.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      toast.warning('Korzinka bo\'sh');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create shop order (for admin to see items)
      createOrder({
        studentId: user?.id,
        studentName: user?.name || 'Noma\'lum',
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          points: item.points,
          qty: item.qty,
          icon: item.icon
        })),
        totalPoints: spent
      });

      // 2. Persistent Coin Deduction (MockAPI)
      const SUBMISSIONS_API = "https://69393fa6c8d59937aa0706bf.mockapi.io/submissions";
      await fetch(SUBMISSIONS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user?.id,
          studentName: user?.name,
          homeworkId: `purchase-${Date.now()}`,
          homeworkTitle: `Shop Purchase: ${cart.map(i => i.name).join(', ')}`,
          link: 'Shop Purchase',
          submittedAt: new Date().toISOString(),
          status: 'purchase',
          coins: -spent // Negative coins for deduction
        }),
      });

      setCart([]);
      setIsSubmitting(false);
      setShowSuccess(true);
      toast.success('Buyurtma muvaffaqiyatli amalga oshirildi!');
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      console.error('Purchase error:', err);
      toast.error('Xaridda xatolik yuz berdi. Qayta urinib ko\'ring.');
      setIsSubmitting(false);
    }
  };

  const getItemIcon = (image) => {
    const icons = {
      tshirt: '👕', notebook: '📓', coin: '🪙', bag: '🎒',
      discount: '🎫', sticker: '✨', mouse: '🖱️', keyboard: '⌨️',
      hoodie: '🧥', snack: '🍪', mentor: '🧠'
    };
    return icons[image] || '🎁';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getStatusText = (status) => {
    const texts = { pending: 'Kutilmoqda', approved: 'Tasdiqlangan', rejected: 'Rad etilgan' };
    return texts[status] || status;
  };

  return (
    <div className="relative">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 animate-pulse" />
              <h2 className="text-4xl font-black">Sovg'alar Do'koni</h2>
            </div>
            <p className="opacity-90 text-lg">Coinlaringizni sovg'alarga ayirboshlang!</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center min-w-[180px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="w-8 h-8 text-yellow-300" />
              <span className="text-5xl font-black">{userCoins}</span>
            </div>
            <p className="text-sm opacity-80">Mavjud coinlar</p>
            {cart.length > 0 && <p className="text-sm mt-2 bg-white/20 rounded-lg px-3 py-1">Qoladi: <span className="font-bold">{remaining}</span></p>}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="mb-6 p-6 bg-green-500/20 border border-green-500/30 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center"><CheckCircle className="w-8 h-8 text-white" /></div>
              <div><h3 className="text-xl font-bold text-green-400">Buyurtma yuborildi!</h3><p className="text-green-300/80">Admin tasdiqlashini kuting.</p></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {myOrders.length > 0 && (
        <div className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Xaridlar tarixi</h3>
            </div>
            <span className="text-sm text-gray-400">{myOrders.length} ta xarid</span>
          </div>
          <div className="divide-y divide-white/10 max-h-[400px] overflow-y-auto custom-scrollbar">
            {myOrders.slice(0, 10).map(order => (
              <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">
                    {getItemIcon(order.items[0]?.icon)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">
                      {order.items.map(i => `${i.name}`).join(', ')}
                    </p>
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                      {new Date(order.createdAt).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className="text-right">
                    <p className="text-purple-400 font-black text-xl">-{order.totalPoints} coin</p>
                    <p className="text-xs text-gray-500">Jami harajat</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {items.map((item, idx) => {
          const canAfford = remaining >= item.points;
          const inCart = cart.find(c => c.id === item.id);
          return (
            <motion.div key={item.id} whileHover={{ y: -8 }} className={`relative bg-white/5 rounded-3xl overflow-hidden border-2 ${!item.available ? 'opacity-50 border-gray-700' : inCart ? 'border-purple-500' : 'border-white/10 shadow-lg'}`}>
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-10 flex items-center justify-center"><span className="text-7xl">{getItemIcon(item.icon)}</span></div>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h4 className="text-lg font-bold">{item.name}</h4>
                  {!item.available && <Lock className="w-5 h-5 text-gray-500" />}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center"><Coins className="w-4 h-4 text-yellow-900" /></div><span className="text-xl font-bold text-yellow-400">{item.points}</span></div>
                  {item.available && <span className={`text-xs px-3 py-1 rounded-full font-bold ${canAfford ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{canAfford ? '✓ Yetarli' : '✗ Yetarli emas'}</span>}
                </div>
                <button onClick={() => handlePurchase(item)} disabled={!item.available} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${!item.available ? 'bg-gray-800' : canAfford ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-white/10 text-gray-400'}`}><ShoppingCart className="w-5 h-5" />{!item.available ? 'Mavjud emas' : 'Qo\'shish'}</button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} className="fixed bottom-6 right-6 w-96 bg-slate-900/95 border border-purple-500/30 rounded-3xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-between text-white"><div className="flex items-center gap-3"><ShoppingCart className="w-6 h-6" /><span className="font-bold">Korzinka</span></div><div className="text-right"><p className="text-2xl font-black">{spent}</p><p className="text-xs">coin</p></div></div>
            <div className="max-h-60 overflow-y-auto divide-y divide-white/10">{cart.map(item => (<div key={item.id} className="p-4 flex items-center justify-between"><div><p className="font-semibold text-sm">{item.name}</p><p className="text-xs text-gray-400">{item.points} × {item.qty}</p></div><div className="flex items-center gap-2"><button onClick={() => decreaseItem(item.id)} className="p-1 bg-red-500/20 text-red-400 rounded-lg"><MinusCircle className="w-5 h-5" /></button><span className="font-bold w-6 text-center">{item.qty}</span><button onClick={() => handlePurchase(item)} className="p-1 bg-green-500/20 text-green-400 rounded-lg"><PlusCircle className="w-5 h-5" /></button></div></div>))}</div>
            <div className="p-4 bg-white/5 flex gap-3"><button onClick={clearCart} className="flex-1 py-3 bg-white/10 text-gray-300 rounded-xl">Tozalash</button><button onClick={handleSubmitOrder} disabled={isSubmitting} className="flex-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">{isSubmitting ? 'Yuborilmoqda...' : <><Send className="w-5 h-5" /> Buyurtma</>}</button></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
