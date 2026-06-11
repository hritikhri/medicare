import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api.js';
import { SPECIALIZATIONS } from '../../utils/constants.js';
import { Search, MapPin, Star, Clock, User } from 'lucide-react';

const AVATAR_PALETTES = [
  { bg: 'bg-blue-100', text: 'text-blue-700' },
  { bg: 'bg-violet-100', text: 'text-violet-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-pink-100', text: 'text-pink-700' },
  { bg: 'bg-teal-100', text: 'text-teal-700' },
];

function getInitials(name = '') {
  return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function StarRating({ rating }) {
  return (
    <span className="text-amber-500 text-lg tracking-tighter">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < Math.round(rating) ? '★' : '☆'}</span>
      ))}
    </span>
  );
}

function DoctorCard({ doctor, index }) {
  const navigate = useNavigate();
  const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length];

  const name = doctor.userId?.name || 'Unknown Doctor';
  const fee = doctor.consultationFee ?? '—';
  const rating = doctor.ratings?.average ?? 0;
  const reviewCount = doctor.ratings?.count ?? 0;
  const exp = doctor.experience ?? 0;
  const specs = Array.isArray(doctor.specializations) ? doctor.specializations : [];
  const city = doctor.userId?.location?.city || doctor.clinic?.city || '—';
  const available = doctor.isActive !== false;

return (
  <div
    className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-2xl"
  >
    
    {/* Top Glow */}
    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    {/* Content */}
    <div className="relative p-5">

      {/* TOP SECTION */}
      <div className="flex items-start gap-4">
        
        {/* Avatar */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-semibold flex-shrink-0 shadow-sm ${palette.bg} ${palette.text}`}
        >
          {getInitials(name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          
          <div className="flex items-start justify-between gap-3">
            
            <div className="min-w-0">
              <h3 className="text-[17px] font-semibold text-slate-900 truncate">
                {name}
              </h3>
              <p className="text-sm text-slate-500 mt-0.5 truncate">
                {specs[0] || "General Physician"}
              </p>
            </div>

            {/* Availability */}
            <div
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                available
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {available ? "● Available" : "● Offline"}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span className="text-xs font-medium text-slate-700">
                {rating || "4.5"}
              </span>
            </div>

            <span className="text-slate-300 text-xs">•</span>

            <span className="text-xs text-slate-500">
              {reviewCount} reviews
            </span>
          </div>
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
        
        {/* Location */}
        <div className="flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 text-slate-600 min-w-0">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            
            <span className="text-sm truncate">
              {city || "Unknown Location"}
            </span>
          </div>

          <div className="text-sm font-semibold text-slate-900 whitespace-nowrap">
            ₹{fee}
          </div>
        </div>

        {/* Experience */}
        <div className="flex items-center gap-2 text-slate-600">
          
          <Clock className="w-4 h-4 text-slate-400" />

          <span className="text-sm">
            {exp}+ years experience
          </span>
        </div>
      </div>

      {/* Specializations */}
      {specs.length > 1 && (
        <div className="flex flex-wrap gap-2 mt-5">
          {specs.slice(1, 4).map((spec, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium"
            >
              {spec}
            </span>
          ))}
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex gap-2 mt-6">
        {/* /book/${doctor._id} */}
        <button
          onClick={() => navigate(`/doctors/${doctor._id}`)}
          className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all shadow-sm hover:shadow-md"
        >
          Book Now
        </button>

        <button
          onClick={() => navigate(`/doctors/${doctor._id}`)}
          className="flex-1 h-11 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all"
        >
          View
        </button>
      </div>
    </div>
  </div>
);
}

/* ───────────────────── MAIN COMPONENT ───────────────────── */
const SPECS = ['All', ...SPECIALIZATIONS];

export default function DoctorList({ filters = {} }) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [specialization, setSpecialization] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: doctors = [], isLoading, isError } = useQuery({
    queryKey: ['doctors', { search: debouncedSearch, specialization, ...filters }],
    queryFn: () => 
      api.get('/doctors', { 
        params: { search: debouncedSearch, specialization } 
      }).then(res => res.data),
    keepPreviousData: true,
  });

return (
  <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
    
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      
      {/* FIXED TOP SECTION */}
      <div className="shrink-0  pb-2 bg-gradient-to-br from-slate-50 via-white to-blue-50 z-20">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          
          <div>
            {/* <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-medium">
              Healthcare Directory
            </p> */}
          </div>

          {!isLoading && !isError && (
            <div className="flex items-center gap-3">
              {/* Stats */}
            </div>
          )}
        </div>

        {/* FILTER SECTION */}
        <div className="bg-white border border-slate-200 rounded-[28px] p-5 shadow-sm">
          
          {/* Search */}
          <div className="relative mb-5">
            
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor by name..."
              className="w-full h-12 pl-11 pr-11 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-lg"
              >
                ×
              </button>
            )}
          </div>

          {/* Specialization Chips */}
          <div className="flex flex-wrap gap-2.5">
            {SPECS.map((spec) => {
              const isActive =
                spec === "All"
                  ? !specialization
                  : specialization === spec;

              return (
                <button
                  key={spec}
                  onClick={() =>
                    setSpecialization(spec === "All" ? "" : spec)
                  }
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border
                  ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {spec}
                </button>
              );
            })}
          </div>
        </div>

        {/* RESULTS */}
        {!isLoading && !isError && (
          <div className="flex items-center justify-between mt-5 px-1">
            
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {doctors.length}
              </span>{" "}
              doctor{doctors.length !== 1 ? "s" : ""}
            </p>

            {(search || specialization) && (
              <button
                onClick={() => {
                  setSearch("");
                  setSpecialization("");
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* SCROLLABLE DOCTORS SECTION */}
      <div className="flex-1 overflow-y-auto pb-10 pr-1 custom-scrollbar">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[320px] rounded-[28px] bg-white border border-slate-100 animate-pulse"
              />
            ))
          ) : isError ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
              
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-3xl mb-5">
                ⚠️
              </div>

              <h3 className="text-xl font-semibold text-slate-900">
                Failed to load doctors
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Please try again after some time.
              </p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
              
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-3xl mb-5">
                🔍
              </div>

              <h3 className="text-xl font-semibold text-slate-900">
                No doctors found
              </h3>

              <p className="text-sm text-slate-500 mt-2 max-w-md">
                Try adjusting your search keywords or specialization filters.
              </p>

              {(search || specialization) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSpecialization("");
                  }}
                  className="mt-6 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm hover:bg-black transition"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            doctors.map((doctor, index) => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  </div>
);
}