import {
  CalendarDays,
  Clock3,
  FileText,
  User2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Trash2,
  Filter,
} from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import api from "../../utils/api";
import { useMemo, useState } from "react";

export default function AppointmentHistory({ appointments = [] }) {
  const [initialAppt, setUpdated] = useState(appointments);
  const [filter, setFilter] = useState("all");

  const cancelMutation = useMutation({
    mutationFn: (appointmentId) =>
      api.delete(`/appointments/${appointmentId}/cancel`),

    onSuccess: async () => {
      const res = await api.get("/appointments");
      setUpdated(res.data.appointments);
    },
  });

  const canCancel = (appt) => {
    return appt.status === "pending" || appt.status === "confirmed";
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "confirmed":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: <CheckCircle2 className="w-4 h-4" />,
        };

      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          icon: <AlertCircle className="w-4 h-4" />,
        };

      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          icon: <XCircle className="w-4 h-4" />,
        };

      case "completed":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          icon: <CheckCircle2 className="w-4 h-4" />,
        };

      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: <AlertCircle className="w-4 h-4" />,
        };
    }
  };

  // FILTERED DATA
  const filteredAppointments = useMemo(() => {
    if (filter === "all") return initialAppt;

    return initialAppt.filter(
      (appt) => appt.status?.toLowerCase() === filter
    );
  }, [filter, initialAppt]);

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-5">
          <CalendarDays className="w-10 h-10 text-blue-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          No Appointments Yet
        </h2>

        <p className="text-gray-500 mt-2">
          Your appointment history will appear here.
        </p>
      </div>
    );
  }

return (
  <div className="h-screen overflow-hidden rounded-[8px] border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.06)] flex flex-col">
    
    {/* TOP BAR */}
    <div className="shrink-0 px-4 py-3 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
      
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        
        {/* TITLE */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <CalendarDays className="w-4 h-4" />
            </div>

            Appointment History
          </h2>

          <p className="text-[11px] text-slate-500 mt-1 ml-10">
            Manage and track your bookings
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-1.5">
          
          {["all", "pending", "confirmed", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold capitalize transition-all duration-200 border backdrop-blur-md
                ${
                  filter === status
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-100 scale-[1.03]"
                    : "bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>
    </div>

    {/* SCROLLABLE LIST */}
    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-gradient-to-b from-slate-50/40 to-white">
      
      {filteredAppointments.length > 0 ? (
        filteredAppointments.map((appt) => {
          const statusStyle = getStatusStyles(appt.status);
          const isCancellable = canCancel(appt);

          return (
            <div
              key={appt._id}
              className="group relative overflow-hidden rounded-2xl border border-white/50 bg-white/80 backdrop-blur-xl p-3.5 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              
              {/* HOVER GLOW */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-blue-50/50 via-indigo-50/20 to-pink-50/40 pointer-events-none" />

              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                
                {/* LEFT */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  
                  {/* IMAGE */}
                  <div className="relative flex-shrink-0">
                    
                    <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white shadow-md bg-slate-100">
                      <img
                        src={
                          appt.doctorId?.profilePic ||
                          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt="doctor"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                  </div>

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {appt.doctorId?.name ||
                          appt.doctorId?.userId?.name ||
                          "Unknown Doctor"}
                      </h3>

                      <div
                        className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {statusStyle.icon}
                        {appt.status}
                      </div>
                    </div>

                    {/* META */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-[11px] font-medium">
                        <CalendarDays className="w-3 h-3" />

                        {new Date(
                          appt.appointmentDate
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-pink-50 text-pink-700 text-[11px] font-medium">
                        <Clock3 className="w-3 h-3" />
                        {appt.time}
                      </div>
                    </div>

                    {/* EMAIL */}
                    {(appt.doctorId?.userId?.email ||
                      appt.patientId?.userId?.email) && (
                      <p className="text-[11px] text-slate-500 truncate mt-2">
                        {appt.doctorId?.userId?.email ||
                          appt.patientId?.userId?.email}
                      </p>
                    )}

                    {/* NOTES */}
                    {appt.notes && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-100 p-2.5">
                        
                        <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />

                        <p className="text-[11px] leading-relaxed text-slate-600 line-clamp-2">
                          {appt.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center justify-between lg:flex-col lg:items-end gap-2">
                  
                  {/* MOBILE STATUS */}
                  <div
                    className={`sm:hidden flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {statusStyle.icon}
                    {appt.status}
                  </div>

                  {/* ACTION */}
                  {isCancellable && (
                    <button
                      onClick={() => cancelMutation.mutate(appt._id)}
                      disabled={cancelMutation.isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 text-[11px] font-semibold transition-all duration-200 disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center py-16">
          
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl shadow-inner mb-5">
            📅
          </div>

          <h3 className="text-lg font-bold text-slate-800">
            No {filter} appointments
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Try changing your filter settings
          </p>
        </div>
      )}
    </div>
  </div>
);
}