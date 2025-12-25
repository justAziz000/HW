const ORDERS_KEY = "bem-shop-orders";
const EVENT_NAME = "shop-orders-updated";

const readOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("shop orders read error", e);
    return [];
  }
};

const writeOrders = (orders) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event(EVENT_NAME));
};

export const getAllOrders = () => readOrders();

export const getOrdersForStudent = (studentId) =>
  readOrders().filter((o) => String(o.studentId) === String(studentId));

export const createOrder = ({ studentId, studentName, items, totalPoints }) => {
  const orders = readOrders();
  const newOrder = {
    id: Date.now().toString(),
    studentId: String(studentId),
    studentName,
    items,
    totalPoints,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  writeOrders([newOrder, ...orders]);
  return newOrder;
};

export const updateOrderStatus = (id, status) => {
  const orders = readOrders();
  writeOrders(
    orders.map((o) => (o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o))
  );
};

export const subscribeOrders = (cb) => {
  window.addEventListener(EVENT_NAME, cb);
  return () => window.removeEventListener(EVENT_NAME, cb);
};
