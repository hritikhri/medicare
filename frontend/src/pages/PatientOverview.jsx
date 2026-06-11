import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CalendarDays, Clock3, User2, PlusCircle, Heart,
  ShieldCheck, ChevronRight, Stethoscope, FileText,
  AlertCircle, CheckCircle, XCircle,
  RefreshCw, TrendingUp,
} from "lucide-react";
import api from "../utils/api";

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const statusMeta = {
  completed: { label: "Completed", color: "#059669", bg: "#d1fae5", icon: CheckCircle },
  confirmed: { label: "Confirmed", color: "#2563eb", bg: "#dbeafe", icon: CalendarDays },
  pending:   { label: "Pending",   color: "#d97706", bg: "#fef3c7", icon: Clock3       },
  cancelled: { label: "Cancelled", color: "#dc2626", bg: "#fee2e2", icon: XCircle      },
};

const isUpcoming = (a) =>
  (a.status === "confirmed" || a.status === "pending") &&
  new Date(a.appointmentDate) >= new Date();

const isThisMonth = (a) => {
  const d = new Date(a.appointmentDate);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

// ─── shimmer skeleton ─────────────────────────────────────────────────────────
const Pulse = ({ w = "100%", h = 16, r = 8, mb = 0 }) => (
  <div style={{
    width: w, height: h, borderRadius: r, marginBottom: mb,
    background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
  }} />
);

// ─── single appointment card ──────────────────────────────────────────────────
const ApptCard = ({ appt }) => {
  const [hovered, setHovered] = useState(false);
  const m = statusMeta[appt.status] || statusMeta.pending;
  const Icon = m.icon;
  const doctor  = appt.doctorId;
  const docName = doctor?.userId?.name || "Doctor";
  const docPic  = doctor?.profilePic;
  const spec    = doctor?.specializations?.[0] || "Specialist";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: "1.5px solid #e2e8f0",
        borderRadius: 20,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        transition: "box-shadow 0.2s, transform 0.2s",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {docPic
        ? <img src={docPic} alt={docName} style={{ width: 46, height: 46, borderRadius: 14, objectFit: "cover", border: "2px solid #e0e7ff", flexShrink: 0 }} />
        : <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Stethoscope size={18} color="#fff" />
          </div>
      }
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a", fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {docName}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b", fontFamily: "'Outfit',sans-serif" }}>{spec}</p>
        <p style={{ margin: "5px 0 0", fontSize: 12, color: "#94a3b8", fontFamily: "'Outfit',sans-serif" }}>
          {fmt(appt.appointmentDate)}{appt.time ? ` · ${appt.time}` : ""}
        </p>
      </div>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "4px 11px", borderRadius: 99,
        background: m.bg, color: m.color,
        fontSize: 11, fontWeight: 700,
        fontFamily: "'Outfit',sans-serif",
        whiteSpace: "nowrap", flexShrink: 0,
      }}>
        <Icon size={10} /> {m.label}
      </span>
    </div>
  );
};

// ─── main component ───────────────────────────────────────────────────────────
export default function PatientOverview() {
  const { user } = useSelector((s) => s.auth);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [activeTab, setActiveTab]       = useState("upcoming");
  const [spinning, setSpinning]         = useState(false);

  const load = async (silent = false) => {
    try {
      silent ? setSpinning(true) : setLoading(true);
      setError(null);
      const res  = await api.get("/appointments");
      const list = res.data?.appointments ?? res.data ?? [];
      setAppointments(Array.isArray(list) ? list : []);
    } catch {
      setError("Could not load appointments. Please try again.");
    } finally {
      setLoading(false);
      setSpinning(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── derived ──────────────────────────────────────────────────────────────────
  const upcomingList  = appointments
    .filter(isUpcoming)
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const historyList   = appointments
    .filter((a) => !isUpcoming(a))
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

  const completedCount = appointments.filter((a) => a.status === "completed").length;
  const thisMonthCount = appointments.filter(isThisMonth).length;
  const uniqueDoctors  = new Set(
    appointments.map((a) => a.doctorId?._id ?? a.doctorId).filter(Boolean)
  ).size;
  const nextAppt = upcomingList[0];

  const stats = [
    { title: "Upcoming",   value: upcomingList.length,  icon: CalendarDays, bg: "#eef2ff", accent: "#4f46e5" },
    { title: "Total",      value: appointments.length,  icon: Heart,        bg: "#fdf4ff", accent: "#9333ea" },
    { title: "This Month", value: thisMonthCount,       icon: TrendingUp,   bg: "#fff7ed", accent: "#ea580c" },
    { title: "Doctors",    value: uniqueDoctors,        icon: User2,        bg: "#f0fdf4", accent: "#16a34a" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] || "there";

  // ── loading skeleton ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", padding: 32, fontFamily: "'Outfit',sans-serif" }}>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <Pulse w={52} h={52} r={16} />
            <div style={{ flex: 1 }}>
              <Pulse w="35%" h={20} r={6} mb={10} />
              <Pulse w="55%" h={13} r={4} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
            {[1,2,3,4].map(i => <Pulse key={i} h={88} r={20} />)}
          </div>
          <Pulse h={120} r={24} mb={16} />
          {[1,2,3].map(i => <Pulse key={i} h={76} r={18} mb={12} />)}
        </div>
      </div>
    );
  }

  // ── render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Outfit',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.35}}
        .fade-0{animation:fadeUp 0.4s ease both}
        .fade-1{animation:fadeUp 0.4s 0.07s ease both}
        .fade-2{animation:fadeUp 0.4s 0.14s ease both}
        .fade-3{animation:fadeUp 0.4s 0.21s ease both}
        .fade-4{animation:fadeUp 0.4s 0.28s ease both}
        .tab-btn:hover{background:#f1f5f9 !important}
        .stat-card:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(0,0,0,0.08) !important}
        .report-chip:hover{box-shadow:0 4px 14px rgba(0,0,0,0.07)}
        .refresh:hover{background:#f1f5f9 !important}
        .book-cta:hover{filter:brightness(1.09)}
      `}</style>

      {/* ════ sticky header ════ */}
      <div style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(226,232,240,0.9)",
        padding: "0 32px",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 66, gap: 16 }}>

          {/* avatar + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              {user?.profilePic
                ? <img src={user.profilePic} alt="me" style={{ width: 42, height: 42, borderRadius: 13, objectFit: "cover", border: "2.5px solid #e0e7ff" }} />
                : <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,#6366f1,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 17, color: "#fff" }}>
                    {user?.name?.charAt(0) || "P"}
                  </div>
              }
              <div style={{ position: "absolute", bottom: -2, right: -2, width: 12, height: 12, borderRadius: "50%", background: "#10b981", border: "2.5px solid #fff", animation: "blink 2.2s infinite" }} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" }}>
                {greeting}, {firstName} 👋
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{user?.email}</p>
            </div>
          </div>

          {/* actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="refresh" onClick={() => load(true)} style={{
              width: 37, height: 37, borderRadius: 11, border: "1.5px solid #e2e8f0",
              background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "background 0.15s",
            }}>
              <RefreshCw size={14} color="#64748b" style={{ animation: spinning ? "spin 0.7s linear infinite" : "none" }} />
            </button>

          </div>
        </div>
      </div>

      {/* ════ body ════ */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 32px" }}>

        {/* error */}
        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#fff1f2", border: "1.5px solid #fecdd3",
            borderRadius: 14, padding: "13px 18px", marginBottom: 22,
            color: "#be123c", fontSize: 13,
          }}>
            <AlertCircle size={15} />
            <span style={{ flex: 1 }}>{error}</span>
            <button onClick={() => load()} style={{ fontSize: 12, color: "#be123c", background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", textDecoration: "underline" }}>Retry</button>
          </div>
        )}

        {/* ── stat cards ── */}
        <div className="fade-0" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="stat-card" style={{
                background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 20,
                padding: "18px 20px", display: "flex", alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>{s.title}</p>
                  <p style={{ margin: "6px 0 0", fontSize: 34, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</p>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} color={s.accent} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── health banner ── */}
        <div className="fade-1" style={{
          borderRadius: 24, padding: "24px 28px", marginBottom: 24,
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #6d28d9 100%)",
          color: "#fff", boxShadow: "0 8px 32px rgba(99,102,241,0.22)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -24, right: 90, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 18, position: "relative" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                <ShieldCheck size={15} color="rgba(255,255,255,0.8)" />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>Health Status</span>
              </div>
              <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, letterSpacing: "-0.01em" }}>
                {completedCount > 0 ? "You're staying on track 💙" : "Start your health journey 🌟"}
              </h2>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.65, maxWidth: 460 }}>
                {completedCount > 0
                  ? `${completedCount} appointment${completedCount > 1 ? "s" : ""} completed. Keep up your routine checkups for the best outcomes.`
                  : "Book your first appointment to begin your healthcare journey."
                }
              </p>
            </div>

            {nextAppt && (
              <div style={{
                background: "rgba(255,255,255,0.13)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 16, padding: "14px 18px", minWidth: 196,
              }}>
                <p style={{ margin: "0 0 5px", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>Next appointment</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{nextAppt.doctorId?.userId?.name || "—"}</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.72)" }}>
                  {fmt(nextAppt.appointmentDate)}{nextAppt.time ? ` · ${nextAppt.time}` : ""}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── appointments ── */}
        <div className="fade-2">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            {/* tabs */}
            <div style={{ display: "flex", gap: 4, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 13, padding: 4 }}>
              {[
                { key: "upcoming", label: `Upcoming · ${upcomingList.length}` },
                { key: "history",  label: `History · ${historyList.length}`   },
              ].map(t => (
                <button key={t.key} className="tab-btn" onClick={() => setActiveTab(t.key)} style={{
                  padding: "7px 16px", borderRadius: 9, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: activeTab === t.key ? 700 : 500,
                  background: activeTab === t.key ? "#6366f1" : "transparent",
                  color: activeTab === t.key ? "#fff" : "#64748b",
                  fontFamily: "'Outfit',sans-serif", transition: "all 0.15s", whiteSpace: "nowrap",
                }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* <Link to="/appointments" style={{ fontSize: 12, color: "#6366f1", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 2 }}>
              View all <ChevronRight size={13} />
            </Link> */}
          </div>

          {/* list */}
          {(activeTab === "upcoming" ? upcomingList : historyList).length === 0 ? (
            <div style={{
              background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 20,
              padding: "44px 24px", textAlign: "center",
            }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <CalendarDays size={22} color="#6366f1" />
              </div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                {activeTab === "upcoming" ? "No upcoming appointments" : "No appointment history yet"}
              </p>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>
                {activeTab === "upcoming" ? "Book one to get started." : "Your past appointments will appear here."}
              </p>
              {activeTab === "upcoming" && (
                <Link to="/book-appointment" style={{
                  display: "inline-flex", alignItems: "center", gap: 6, marginTop: 18,
                  padding: "9px 22px", borderRadius: 12,
                  background: "#6366f1", color: "#fff", textDecoration: "none",
                  fontSize: 13, fontWeight: 600,
                }}>
                  <PlusCircle size={14} /> Book Appointment
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(activeTab === "upcoming" ? upcomingList : historyList).slice(0, 6).map((a, i) => (
                <div key={a._id} style={{ animation: `fadeUp 0.3s ${i * 0.06}s ease both` }}>
                  <ApptCard appt={a} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── medical reports strip ── */}
        {(user?.medicalReports?.length ?? 0) > 0 && (
          <div className="fade-3" style={{ marginTop: 26 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Medical Reports</p>
              <Link to="/profile" style={{ fontSize: 12, color: "#6366f1", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 2 }}>
                View all <ChevronRight size={13} />
              </Link>
            </div>
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 6 }}>
              {user.medicalReports.slice(0, 6).map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noreferrer" className="report-chip" style={{
                  flexShrink: 0, background: "#fff", border: "1.5px solid #e2e8f0",
                  borderRadius: 16, padding: "13px 16px", textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 10, minWidth: 190,
                  transition: "box-shadow 0.2s",
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={15} color="#16a34a" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 120 }}>{r.name}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 10, color: "#94a3b8" }}>{fmt(r.uploadDate)}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}