import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Clock3,
  Check,
  FileText,
} from "lucide-react";

import api from "../../utils/api.js";

export default function BookAppointment({ doctorId }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isBooked, setIsBooked] = useState(false);

  const queryClient = useQueryClient();

  const availableTimes = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];

  const mutation = useMutation({
    mutationFn: (data) => api.post("/appointments", data),

    onSuccess: () => {
      queryClient.invalidateQueries(["doctor", doctorId]);

      setIsBooked(true);

      setTimeout(() => {
        setSelectedDate("");
        setSelectedTime("");
        setNotes("");
      }, 300);
    },

    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
          "Failed to book appointment"
      );
    },
  });

  const handleBook = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Select date & time");
      return;
    }

    const appointmentDate = new Date(
      `${selectedDate}T${selectedTime}`
    );

    mutation.mutate({
      doctorId,
      appointmentDate,
      time: selectedTime,
      notes: notes.trim(),
    });
  };

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/50 bg-white/70 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      
      {/* SUCCESS STATE */}
      {isBooked ? (
        <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
          
          <div className="relative">
            
            <div className="absolute inset-0 rounded-full bg-emerald-500 blur-2xl opacity-20" />

            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-xl shadow-emerald-100">
              <Check className="w-10 h-10 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-6">
            Appointment Booked 🎉
          </h2>

          <p className="text-sm text-slate-500 mt-2 max-w-sm">
            Your appointment has been successfully scheduled.
          </p>

          <button
            onClick={() => setIsBooked(false)}
            className="mt-6 h-11 px-5 rounded-2xl bg-slate-900 hover:bg-black text-white text-sm font-semibold transition"
          >
            Book Another
          </button>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="px-5 py-4 border-b border-slate-100">
            
            <div className="flex items-center gap-3">
              
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
                <CalendarDays className="w-5 h-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Book Appointment
                </h2>

                <p className="text-xs text-slate-500 mt-0.5">
                  Quick healthcare booking
                </p>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="p-5 space-y-5">
            
            {/* DATE */}
            <div>
              
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
                <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                Select Date
              </label>

              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
                className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* TIME */}
            <div>
              
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
                <Clock3 className="w-3.5 h-3.5 text-indigo-500" />
                Select Time
              </label>

              <div className="grid grid-cols-3 gap-2">
                
                {availableTimes.map((time) => {
                  const active = selectedTime === time;

                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() =>
                        setSelectedTime(time)
                      }
                      className={`h-10 rounded-xl text-xs font-semibold border transition-all duration-200
                      ${
                        active
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md shadow-blue-100"
                          : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* NOTES */}
            <div>
              
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
                <FileText className="w-3.5 h-3.5 text-pink-500" />
                Notes
                <span className="text-slate-400 font-medium">
                  (Optional)
                </span>
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Symptoms or concerns..."
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
              />
            </div>

            {/* BOOK BUTTON */}
            <button
              onClick={handleBook}
              disabled={
                mutation.isPending ||
                !selectedDate ||
                !selectedTime
              }
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2">
                
                {mutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CalendarDays className="w-4 h-4" />
                    Confirm Appointment
                  </>
                )}
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}