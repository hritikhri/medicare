import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments } from "../../redux/slices/appointmentSlice";
import api from "../../utils/api";
// import toast from "react-hot-toast";
import {
  User, CalendarDays, Clock3, Edit3, CheckCircle2, XCircle,
  Search, Filter, FileText, Stethoscope, AlertCircle, Loader2,
} from "lucide-react";

// ─── status color map ────────────────────────────────────────────────────────
const statusColors = {
  Upcoming:  "bg-blue-100 text-blue-700 border border-blue-200",
  Completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Cancelled: "bg-red-100 text-red-700 border border-red-200",
  Pending:   "bg-amber-100 text-amber-700 border border-amber-200",
};

// ─── main component ──────────────────────────────────────────────────────────
export default function DoctorAppointments() {
  const dispatch = useDispatch();
  const { appointments = [], loading, error } = useSelector((s) => s.appointments);

  const [filter, setFilter]           = useState("all");
  const [search, setSearch]           = useState("");
  const [loadingAction, setLoadingAction] = useState(null); // track which appt is loading
  const [editingNotes, setEditingNotes]   = useState(null);
  const [newNote, setNewNote]         = useState("");
  const [savingNote, setSavingNote]   = useState(false);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  // ── helpers ──────────────────────────────────────────────────────────────────

  const getDisplayStatus = (status) => {
    const map = {
      pending: "Pending",
      confirmed: "Upcoming",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return map[status?.toLowerCase()] || "Upcoming";
  };

  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  const filteredAppointments = safeAppointments
    .map((appt) => ({
      ...appt,
      displayStatus: getDisplayStatus(appt.status),
    }))
    .filter((appt) => {
      const matchesFilter =
        filter === "all" ||
        appt.displayStatus.toLowerCase() === filter.toLowerCase();

      const patientName =
        appt.patientId?.name ||
        appt.patientId?.userId?.name ||
        "";

      const matchesSearch = patientName
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

  // ── complete appointment ──────────────────────────────────────────────────────
  const handleCompleteAppointment = async (appointmentId) => {
    try {
      // console.log(appointmentId)
      setLoadingAction(appointmentId);
      const res = await api.put(`/appointments/${appointmentId}/complete`);
      
      if (res.data?.success) {
        toast.success("Appointment marked as completed");
        // Refresh appointments
        dispatch(fetchAppointments());
      }
    } catch (err) {
      // toast.error(err.response?.data?.message || "Failed to complete appointment");
    } finally {
      setLoadingAction(null);
    }
  };

  // ── cancel appointment ────────────────────────────────────────────────────────
  const handleCancelAppointment = async (appointmentId) => {
    try {
      setLoadingAction(appointmentId);
      const res = await api.put(`/appointments/${appointmentId}/cancel`);
      
      if (res.data?.success) {
        // toast.success("Appointment cancelled successfully");
        // Refresh appointments
        dispatch(fetchAppointments());
      }
    } catch (err) {
      // toast.error(err.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setLoadingAction(null);
    }
  };

  // ── save notes ────────────────────────────────────────────────────────────────
  const handleSaveNotes = async (appointmentId) => {
    if (!newNote.trim()) {
      toast.error("Please enter a note");
      return;
    }

    try {
      setSavingNote(true);
      const res = await api.put(`/appointments/${appointmentId}/notes`, {
        notes: newNote.trim(),
      });

      if (res.data?.success) {
        toast.success("Notes saved successfully");
        setEditingNotes(null);
        setNewNote("");
        // Refresh appointments
        dispatch(fetchAppointments());
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save notes");
    } finally {
      setSavingNote(false);
    }
  };

  // ── loading skeleton ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading appointments...</p>
        </div>
      </div>
    );
  }

  // ── error state ───────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-3xl flex items-start gap-3">
        <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold">Error loading appointments</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // ─────────────────────── RENDER ───────────────────────────────────────────────
  return (
    <div className="h-screen min-h-fit overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-[1700px] mx-auto h-full flex flex-col">

        {/* ════════════ STICKY TOP ════════════ */}
        <div className="sticky top-0 z-50">
          <div className="bg-white/80 rounded-b-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

            {/* ─── HEADER ─── */}
            <div className="pt-5 pb-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 px-6">

                {/* left */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full" />
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-200">
                      <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div>
                    <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
                      Doctor Appointments
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                      Manage patient schedules, notes and appointment workflow
                    </p>
                  </div>
                </div>

                {/* stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Total",
                      value: safeAppointments.length,
                      bg: "from-blue-50 to-blue-100/70",
                      text: "text-blue-700",
                    },
                    {
                      label: "Completed",
                      value: safeAppointments.filter((a) => getDisplayStatus(a.status) === "Completed").length,
                      bg: "from-emerald-50 to-emerald-100/70",
                      text: "text-emerald-700",
                    },
                    {
                      label: "Pending",
                      value: safeAppointments.filter((a) => getDisplayStatus(a.status) === "Pending").length,
                      bg: "from-amber-50 to-amber-100/70",
                      text: "text-amber-700",
                    },
                    {
                      label: "Cancelled",
                      value: safeAppointments.filter((a) => getDisplayStatus(a.status) === "Cancelled").length,
                      bg: "from-red-50 to-red-100/70",
                      text: "text-red-700",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`bg-gradient-to-br ${item.bg} border border-white rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all`}
                    >
                      <p className="text-xs font-medium text-slate-500">{item.label}</p>
                      <h2 className={`text-2xl font-bold mt-1 ${item.text}`}>{item.value}</h2>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── FILTER BAR ─── */}
            <div className="px-6 py-2 bg-slate-50/60 border-b border-slate-100">
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

                {/* search */}
                <div className="relative w-full lg:max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search patient..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                {/* filters */}
                <div className="flex flex-wrap gap-2">
                  {["all", "upcoming", "pending", "completed", "cancelled"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setFilter(item)}
                      className={`px-4 h-11 rounded-2xl text-xs font-semibold capitalize transition-all ${
                        filter === item
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── TABLE HEADER ─── */}
            <div className="bg-white border-b border-slate-100">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Patient</th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Appointment</th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Notes</th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>

        {/* ════════════ SCROLLABLE BODY ════════════ */}
        <div className="flex-1 overflow-y-auto rounded-b-[30px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <div className="bg-white/80 backdrop-blur-2xl border-l border-b border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

            {filteredAppointments.length > 0 ? (
              <table className="w-full table-fixed">
                <colgroup>
                  <col className="w-[28%]" />
                  <col className="w-[18%]" />
                  <col className="w-[12%]" />
                  <col className="w-[22%]" />
                  <col className="w-[20%]" />
                </colgroup>

                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map((appt) => (
                    <tr
                      key={appt._id}
                      className="hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-indigo-50/40 transition-all"
                    >
                      {/* ─ patient ─ */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-sm flex-shrink-0">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate text-[15px]">
                              {appt.patientId?.name || appt.patientId?.userId?.name || "Unknown"}
                            </h3>
                            <p className="text-sm text-slate-500 truncate mt-0.5">
                              {appt.patientId?.email || appt.patientId?.userId?.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ─ appointment ─ */}
                      <td className="px-5 py-5">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <CalendarDays className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="truncate">
                              {appt.appointmentDate
                                ? new Date(appt.appointmentDate).toLocaleDateString("en-IN", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                  })
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock3 className="w-4 h-4 text-pink-500 flex-shrink-0" />
                            <span>{appt.time || "N/A"}</span>
                          </div>
                        </div>
                      </td>

                      {/* ─ status ─ */}
                      <td className="px-5 py-5">
                        <div
                          className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold shadow-sm whitespace-nowrap ${
                            statusColors[appt.displayStatus] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {appt.displayStatus}
                        </div>
                      </td>

                      {/* ─ notes ─ */}
                      <td className="px-5 py-5">
                        {editingNotes === appt._id ? (
                          <div className="space-y-2">
                            <textarea
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              placeholder="Add clinical notes..."
                              rows={2}
                              className="w-full p-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveNotes(appt._id)}
                                disabled={savingNote}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
                              >
                                {savingNote ? <Loader2 size={12} className="animate-spin" /> : "Save"}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingNotes(null);
                                  setNewNote("");
                                }}
                                className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm text-slate-600 leading-relaxed shadow-sm line-clamp-3 break-words cursor-pointer hover:bg-slate-100"
                            onClick={() => {
                              setEditingNotes(appt._id);
                              setNewNote(appt.notes || "");
                            }}
                          >
                            {appt.notes || "Click to add notes..."}
                          </div>
                        )}
                      </td>

                      {/* ─ actions ─ */}
                      <td className="px-5 py-5">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {["Upcoming", "Pending"].includes(appt.displayStatus) && (
                            <>
                              <button
                                onClick={() => handleCompleteAppointment(appt._id)}
                                disabled={loadingAction === appt._id}
                                className="flex items-center gap-2 px-3 h-9 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg text-xs font-semibold transition-all shadow-sm whitespace-nowrap"
                              >
                                {loadingAction === appt._id ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4" />
                                )}
                                {loadingAction === appt._id ? "..." : "Complete"}
                              </button>

                              <button
                                onClick={() => handleCancelAppointment(appt._id)}
                                disabled={loadingAction === appt._id}
                                className="flex items-center gap-2 px-3 h-9 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg text-xs font-semibold transition-all shadow-sm whitespace-nowrap"
                              >
                                {loadingAction === appt._id ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                                {loadingAction === appt._id ? "..." : "Cancel"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-5">
                  <CalendarDays className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">No Appointments Found</h2>
                <p className="text-slate-500 mt-2">Try changing filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}