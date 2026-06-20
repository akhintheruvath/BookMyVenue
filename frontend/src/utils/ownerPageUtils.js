export const SCHEDULE_START = 6;
export const SCHEDULE_END = 23;
export const HOUR_WIDTH = 64;

export function fmtKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function statusStyle(status) {
  const map = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-600",
    completed: "bg-blue-100 text-blue-700",
  };
  return map[status] ?? "bg-gray-100 text-gray-600";
}

export function timeToFraction(time) {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}