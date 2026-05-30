// TODO: replace these with <Link to="..."> once react-router-dom is installed
// npm install react-router-dom
import { useState, useEffect, useRef } from "react";
import { Search, MapPin, ChevronDown, X, Building2, SearchX } from "lucide-react";


const KERALA_DISTRICTS = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha",
  "Kottayam", "Idukki", "Ernakulam", "Thrissur",
  "Palakkad", "Malappuram", "Kozhikode", "Wayanad",
  "Kannur", "Kasaragod",
];

const MOCK_VENUES = [
  { id: 1, name: "Grand Hall Kochi", type: "Banquet Hall", district: "Ernakulam", capacity: 500, price: "₹25,000/day", amenities: ["AC", "Parking", "Catering"] },
  { id: 2, name: "Café Mornings", type: "Café", district: "Thrissur", capacity: 40, price: "₹3,500/slot", amenities: ["WiFi", "AC"] },
  { id: 3, name: "TVM Auditorium", type: "Auditorium", district: "Thiruvananthapuram", capacity: 800, price: "₹40,000/day", amenities: ["AV", "Stage", "Parking"] },
  { id: 4, name: "Green Meadows Resort", type: "Resort", district: "Wayanad", capacity: 200, price: "₹18,000/day", amenities: ["Parking", "Catering", "Outdoor"] },
  { id: 5, name: "Studio Space Kozhikode", type: "Studio", district: "Kozhikode", capacity: 20, price: "₹1,200/hr", amenities: ["WiFi", "AC"] },
];

function LocationDropdown({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-red-500 hover:text-red-600"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <MapPin size={14} />
        <span>{selected}</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-[calc(100%+6px)] z-50 max-h-72 w-52 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          {KERALA_DISTRICTS.map((district) => (
            <li key={district}>
              <button
                role="option"
                aria-selected={district === selected}
                onClick={() => { onSelect(district); setOpen(false); }}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 ${
                  district === selected ? "font-medium text-red-600" : "text-gray-700"
                }`}
              >
                <MapPin size={13} className="shrink-0 text-gray-400" />
                {district}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


function VenueResultCard({ venue }) {
  return (
    <div className="flex items-start gap-3 border-b border-gray-100 px-4 py-3 last:border-none hover:bg-gray-50">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-400">
        <Building2 size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{venue.name}</p>
        <p className="truncate text-xs text-gray-500">
          {venue.type} · {venue.district} · Up to {venue.capacity} guests · {venue.price}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {venue.amenities.map((a) => (
            <span
              key={a}
              className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-500"
            >
              {a}
            </span>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-end self-stretch pb-0.5">
        <button
          onClick={() => alert(`TODO: book venue ${venue.id}`)}
          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
        >
          Book
        </button>
      </div>
    </div>
  );
}

function SearchModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleInput(e) {
    const q = e.target.value;
    setQuery(q);

    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    const lower = q.toLowerCase();
    const filtered = MOCK_VENUES.filter(
      (v) =>
        v.name.toLowerCase().includes(lower) ||
        v.type.toLowerCase().includes(lower) ||
        v.district.toLowerCase().includes(lower)
    );
    setResults(filtered);
    setSearched(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center bg-black/30 pt-16 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Venue search"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* Search input row */}
        <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
          <Search size={16} className="shrink-0 text-gray-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInput}
            placeholder="Search venues, cafes, auditoriums..."
            className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-96 overflow-y-auto">
          {!searched && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 size={32} className="mb-3 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">Search for a venue</p>
              <p className="mt-1 text-xs text-gray-400">
                Type to find venues, cafes, auditoriums and more
              </p>
            </div>
          )}

          {searched && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <SearchX size={32} className="mb-3 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">No venues found</p>
              <p className="mt-1 text-xs text-gray-400">
                Try a different name, type, or district
              </p>
            </div>
          )}

          {results.map((venue) => (
            <VenueResultCard key={venue.id} venue={venue} />
          ))}
        </div>

        {searched && results.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-400">
            {results.length} result{results.length > 1 ? "s" : ""}
            {" · "}
            Using mock data — connect to{" "}
            <code className="font-mono">/search/venues</code> when backend is ready
          </div>
        )}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [district, setDistrict] = useState("Ernakulam");
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-6">

          <a
            href="/"
            className="flex shrink-0 items-center gap-2 no-underline"
            aria-label="BookMyVenue home"
          >
            <img src="/favicon.png" alt="" className="h-9 w-9" aria-hidden="true" />
            <span className="text-lg font-semibold text-gray-900">BookMyVenue</span>
          </a>

          <div className="hidden flex-1 md:block">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex w-full max-w-md items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-400 hover:border-gray-300"
            >
              <Search size={16} aria-hidden="true" />
              Search venues, cafes, auditoriums...
            </button>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <LocationDropdown selected={district} onSelect={setDistrict} />

           
            <button className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              Venues
            </button>

         
            <button className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              Categories
            </button>

        
            <button className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              Host
            </button>

            <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
              Sign in
            </button>
          </div>

          <button
            className="ml-auto md:hidden"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <Search size={22} className="text-gray-600" />
          </button>
        </div>
      </nav>

      {searchOpen && (
        <SearchModal district={district} onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}