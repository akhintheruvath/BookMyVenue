import { useMemo, useState } from "react";
import {
  CalendarCheck,
  Clock3,
  Wallet,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const TODAY = new Date();
const Y = TODAY.getFullYear();
const M = TODAY.getMonth();

const BOOKINGS = {
  [fmtKey(Y, M, 3)]: [
    { id: "b1", venue: "Royal Grand Hall", customer: "Rahul Menon", start: "10:00", end: "14:00", guests: 220, amount: 65000, status: "confirmed" },
  ],
  [fmtKey(Y, M, 8)]: [
    { id: "b2", venue: "Backwater Resort", customer: "Anjali Nair", start: "09:00", end: "23:00", guests: 180, amount: 120000, status: "confirmed" },
    { id: "b3", venue: "The Garden Café", customer: "Team Innovate", start: "15:00", end: "18:00", guests: 40, amount: 18000, status: "pending" },
  ],
  [fmtKey(Y, M, 12)]: [
    { id: "b4", venue: "Royal Grand Hall", customer: "Sunitha Joseph", start: "11:00", end: "16:00", guests: 300, amount: 85000, status: "confirmed" },
  ],
  [fmtKey(Y, M, 17)]: [
    { id: "b5", venue: "Skyline Auditorium", customer: "TechFest Committee", start: "08:00", end: "20:00", guests: 500, amount: 150000, status: "confirmed" },
  ],
  [fmtKey(Y, M, 21)]: [
    { id: "b6", venue: "The Garden Café", customer: "Priya Varma", start: "17:00", end: "21:00", guests: 60, amount: 22000, status: "confirmed" },
    { id: "b7", venue: "Backwater Resort", customer: "Vishnu & Family", start: "12:00", end: "22:00", guests: 90, amount: 70000, status: "pending" },
  ],
  [fmtKey(Y, M, 25)]: [
    { id: "b8", venue: "Royal Grand Hall", customer: "Meera Pillai", start: "10:00", end: "15:00", guests: 250, amount: 78000, status: "cancelled" },
  ],
};

const RECENT_HISTORY = [
  { id: "h1", venue: "Royal Grand Hall", customer: "Arun Das", date: "Jun 14, 2026", amount: 92000, status: "completed" },
  { id: "h2", venue: "Backwater Resort", customer: "Lakshmi Krishnan", date: "Jun 11, 2026", amount: 135000, status: "completed" },
  { id: "h3", venue: "The Garden Café", customer: "Sneha Thomas", date: "Jun 9, 2026", amount: 16000, status: "completed" },
  { id: "h4", venue: "Skyline Auditorium", customer: "Kerala Startup Mission", date: "Jun 5, 2026", amount: 145000, status: "completed" },
  { id: "h5", venue: "Royal Grand Hall", customer: "Devika Suresh", date: "May 30, 2026", amount: 60000, status: "completed" },
];

function fmtKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function statusStyle(status) {
  const map = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-600",
    completed: "bg-blue-100 text-blue-700",
  };
  return map[status] ?? "bg-gray-100 text-gray-600";
}


function StatCard({ icon: Icon, title, value, sub, iconBg, iconColor }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className={`rounded-lg p-2 ${iconBg} ${iconColor}`}>
          <Icon size={18} />
        </div>
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>
      <p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

function MiniCalendar({ year, month, onMonthChange, bookingsByDay, selectedDay, onSelectDay }) {
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = new Date(year, month, 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) =>
    d === TODAY.getDate() && month === TODAY.getMonth() && year === TODAY.getFullYear();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{monthLabel}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMonthChange(-1)}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => onMonthChange(1)}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-400">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const key = fmtKey(year, month, d);
          const dayBookings = bookingsByDay[key] || [];
          const isSelected = selectedDay === key;

          return (
            <button
              key={i}
              onClick={() => onSelectDay(key)}
              className={`relative flex h-12 flex-col items-center justify-center rounded-lg text-sm transition
                ${isSelected ? "bg-red-600 text-white" : "hover:bg-gray-100 text-gray-700"}
                ${isToday(d) && !isSelected ? "ring-2 ring-red-400" : ""}
              `}
            >
              <span>{d}</span>
              {dayBookings.length > 0 && (
                <span
                  className={`mt-0.5 h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-red-500"
                    }`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        <span>Has bookings</span>
      </div>
    </div>
  );
}

const SCHEDULE_START = 6;  
const SCHEDULE_END = 23;   
const HOUR_WIDTH = 64;     

function timeToFraction(time) {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

function DaySchedule({ dayKey, bookings, onClose }) {
  const hours = [];
  for (let h = SCHEDULE_START; h <= SCHEDULE_END; h++) hours.push(h);

  const dateLabel = dayKey
    ? new Date(dayKey + "T00:00:00").toLocaleDateString("default", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm min-w-0">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {dayKey ? dateLabel : "Select a date"}
        </h3>
        {dayKey && (
          <button onClick={onClose} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100">
            <X size={16} />
          </button>
        )}
      </div>

      {!dayKey && (
        <p className="py-10 text-center text-sm text-gray-400">
          Click a date on the calendar to see its booking timeline.
        </p>
      )}

      {dayKey && bookings.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-400">
          No bookings for this date.
        </p>
      )}

      {dayKey && bookings.length > 0 && (
        
        <div className="max-w-full overflow-x-auto">
          <div style={{ minWidth: 160 + hours.length * HOUR_WIDTH }}>
            {/* Hour ruler */}
            <div className="flex border-b border-gray-200 pb-2" style={{ marginLeft: 160 }}>
              {hours.map((h) => (
                <div
                  key={h}
                  style={{ width: HOUR_WIDTH }}
                  className="shrink-0 text-xs text-gray-400"
                >
                  {h % 24}:00
                </div>
              ))}
            </div>

           
            <div className="mt-3 space-y-3">
              {bookings.map((b) => {
                const startFrac = Math.max(timeToFraction(b.start), SCHEDULE_START);
                const endFrac = Math.min(timeToFraction(b.end), SCHEDULE_END + 1);
                const left = (startFrac - SCHEDULE_START) * HOUR_WIDTH;
                const width = Math.max((endFrac - startFrac) * HOUR_WIDTH, 24);

                return (
                  <div key={b.id} className="relative h-14 flex">
                    <div className="flex h-14 w-40 shrink-0 flex-col justify-center pr-3 text-xs">
                      <span className="font-medium text-gray-800 truncate">{b.venue}</span>
                      <span className="text-gray-400 truncate">{b.customer}</span>
                    </div>
                    <div className="relative h-14" style={{ width: hours.length * HOUR_WIDTH }}>
                      <div
                        style={{ left, width }}
                        className={`absolute top-2 flex h-10 items-center gap-2 rounded-lg px-3 text-xs font-medium shadow-sm
                          ${statusStyle(b.status)}
                        `}
                      >
                        <Clock3 size={12} />
                        <span className="whitespace-nowrap">
                          {b.start}–{b.end} · ₹{b.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {dayKey && bookings.length > 0 && (
        <div className="mt-6 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-lg border border-gray-100 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{b.venue}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle(b.status)}`}>
                  {b.status}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users size={12} /> {b.guests}</span>
                <span className="flex items-center gap-1"><Clock3 size={12} /> {b.start}–{b.end}</span>
                <span className="flex items-center gap-1"><Wallet size={12} /> ₹{b.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BookingHistory() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-900">Booking History</h3>
      </div>
      <div className="max-h-96 divide-y divide-gray-100 overflow-y-auto">
        {RECENT_HISTORY.map((h) => (
          <div key={h.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{h.venue}</p>
              <p className="text-xs text-gray-400">{h.customer} · {h.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle(h.status)}`}>
                {h.status}
              </span>
              <span className="w-20 text-right text-sm font-semibold text-gray-900">
                ₹{h.amount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VenueOwnerBookings() {
  const [viewYear, setViewYear] = useState(Y);
  const [viewMonth, setViewMonth] = useState(M);
  const [selectedDay, setSelectedDay] = useState(null);

  const monthBookings = useMemo(() => BOOKINGS, []); // hardcoded, all months map onto same object

  function changeMonth(delta) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
    setSelectedDay(null);
  }

  const totalThisMonth = Object.values(monthBookings).flat().length;
  const totalRevenueUpcoming = Object.values(monthBookings)
    .flat()
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.amount, 0);
  const pendingCount = Object.values(monthBookings).flat().filter((b) => b.status === "pending").length;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track upcoming bookings and review past activity across your venues.
        </p>
      </section>

     
      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={CalendarCheck}
            title="Bookings This Month"
            value={totalThisMonth}
            sub="Across all venues"
            iconBg="bg-red-50"
            iconColor="text-red-600"
          />
          <StatCard
            icon={Clock3}
            title="Pending Confirmation"
            value={pendingCount}
            sub="Needs your action"
            iconBg="bg-yellow-50"
            iconColor="text-yellow-600"
          />
          <StatCard
            icon={Wallet}
            title="Expected Revenue"
            value={`₹${(totalRevenueUpcoming / 1000).toFixed(0)}K`}
            sub="From confirmed + pending"
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            icon={Users}
            title="Guests Hosted (30d)"
            value="1,240"
            sub="Estimated, last 30 days"
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <MiniCalendar
          year={viewYear}
          month={viewMonth}
          onMonthChange={changeMonth}
          bookingsByDay={monthBookings}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />
        <DaySchedule
          dayKey={selectedDay}
          bookings={selectedDay ? (monthBookings[selectedDay] || []) : []}
          onClose={() => setSelectedDay(null)}
        />
      </section>

      <section>
        <BookingHistory />
      </section>
    </div>
  );
}