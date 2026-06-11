import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Search, Edit3, Users,CalendarDays , FilePenLine  } from 'lucide-react';

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCondition, setFilterCondition] = useState("all");

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      // fetchPatients — unwrap .patients from response
const response = await api.get("/doctors/get/patient");
setPatients(Array.isArray(response.data.patients) ? response.data.patients : []);

// getLatestNote — schema uses { note, date } not { text, addedAt }
const getLatestNote = (personalNotes) => {
  if (!personalNotes || personalNotes.length === 0) return "No notes yet";
  const latest = personalNotes[personalNotes.length - 1]; // last added
  return typeof latest === 'object' && latest.note ? latest.note : String(latest);
};
    } catch (err) {
      setError("Failed to load patients.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const nameMatch = patient.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const conditionMatch = filterCondition === "all" || 
                          (patient.condition || "").toLowerCase() === filterCondition;
    return nameMatch && conditionMatch;
  });

  const getLatestNote = (personalNotes) => {
    if (!personalNotes || personalNotes.length === 0) return "No notes yet";
    const latest = personalNotes[0];
    return typeof latest === 'object' && latest.text ? latest.text : String(latest);
  };

  const handleAddNotes = async (patient) => {
    if (!newNote.trim()) return;
    try {
      const response = await api.put(`appointments/patient/${patient._id}/notes`, { 
        notes: newNote.trim() 
      });
      
      setPatients(prev =>
        prev.map(p =>
          p._id === patient._id 
            ? { ...p, personalNotes: response.data.patient?.personalNotes || p.personalNotes } 
            : p
        )
      );

      setNewNote("");
      setShowNotesModal(false);
      alert("Notes saved successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save notes.");
    }
  };

  const openNotesModal = (patient) => {
    setSelectedPatient(patient);
    setNewNote("");
    setShowNotesModal(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 animate-pulse">
          <div className="h-10 bg-slate-200 rounded-2xl w-64 mb-10"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-slate-100 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-10 bg-red-50 text-red-700 rounded-3xl">
        {error}
      </div>
    );
  }

return (
  <div className="min-h-fit max-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
    
    {/* MAIN WRAPPER */}
    <div className="h-full w-full flex flex-col">

      {/* ===================== STICKY HEADER ===================== */}
      <div className="sticky top-0 z-50">
        
        <div className="bg-white/85 backdrop-blur-2xl border-slate-200 rounded-[20px] rounded-b-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

          {/* HEADER */}
          <div className="px-6 pt-5 pb-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50">

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              {/* LEFT */}
              <div className="flex items-center gap-4">
                
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full" />

                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-200">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div>
                  <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
                    My Patients
                  </h1>

                  <p className="text-sm text-slate-500 mt-1">
                    Manage patient records and clinical notes
                  </p>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    label: "Total Patients",
                    value: filteredPatients.length,
                    bg: "from-blue-50 to-blue-100/70",
                    text: "text-blue-700",
                  },
                  {
                    label: "Active",
                    value: filteredPatients.filter(
                      (p) => p.totalVisits > 0
                    ).length,
                    bg: "from-emerald-50 to-emerald-100/70",
                    text: "text-emerald-700",
                  },
                  {
                    label: "New",
                    value: filteredPatients.filter(
                      (p) => p.totalVisits <= 1
                    ).length,
                    bg: "from-amber-50 to-amber-100/70",
                    text: "text-amber-700",
                  },
                  {
                    label: "Notes",
                    value: filteredPatients.filter(
                      (p) => p.personalNotes?.length > 0
                    ).length,
                    bg: "from-violet-50 to-violet-100/70",
                    text: "text-violet-700",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`bg-gradient-to-br ${item.bg} border border-white rounded-2xl px-4 py-3 shadow-sm`}
                  >
                    <p className="text-xs font-medium text-slate-500">
                      {item.label}
                    </p>

                    <h2
                      className={`text-2xl font-bold mt-1 ${item.text}`}
                    >
                      {item.value}
                    </h2>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===================== FILTER BAR ===================== */}
          <div className="px-6 py-4 bg-slate-50/60 border-b border-slate-100">

            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

              {/* SEARCH */}
              <div className="relative w-full lg:max-w-md">
                
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search patient..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              {/* FILTERS */}
              <div className="flex flex-wrap gap-3">

                <select
                  value={filterCondition}
                  onChange={(e) =>
                    setFilterCondition(
                      e.target.value
                    )
                  }
                  className="h-12 px-4 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <option value="all">
                    All Conditions
                  </option>

                  <option value="hypertension">
                    Hypertension
                  </option>

                  <option value="diabetes">
                    Diabetes
                  </option>

                  <option value="asthma">
                    Asthma
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* ===================== TABLE HEADER ===================== */}
          <div className="bg-white border-b border-slate-100">
            
            <table className="w-full table-fixed">

              <colgroup>
                <col className="w-[24%]" />
                <col className="w-[18%]" />
                <col className="w-[12%]" />
                <col className="w-[14%]" />
                <col className="w-[8%]" />
                <col className="w-[16%]" />
                <col className="w-[8%]" />
              </colgroup>

              <thead>
                <tr>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Patient
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Age
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Last Visit
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Visits
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Latest Note
                  </th>

                  {/* <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Action
                  </th> */}

                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>

      {/* ===================== SCROLLABLE TABLE ===================== */}
      <div className="flex-1 overflow-y-auto rounded-b-[30px]">

        <div className="bg-white/85 backdrop-blur-2xl border-x border-b border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

          {filteredPatients.length > 0 ? (
            
            <table className="w-full table-fixed">

              <colgroup>
                <col className="w-[24%]" />
                <col className="w-[18%]" />
                <col className="w-[12%]" />
                <col className="w-[14%]" />
                <col className="w-[8%]" />
                <col className="w-[16%]" />
                <col className="w-[8%]" />
              </colgroup>

              <tbody className="divide-y divide-slate-100">

                {filteredPatients.map((patient) => (

                  <tr
                    key={patient._id}
                    className="hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-indigo-50/40 transition-all duration-300"
                  >

                    {/* PATIENT */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4 min-w-0">

                        <img
                          src={
                            patient.profilePic ||
                            "https://res.cloudinary.com/dxp5vte7o/image/upload/v1767437280/samples/people/boy-snow-hoodie.jpg"
                          }
                          alt={patient.name}
                          className="w-12 h-12 rounded-2xl object-cover shadow-sm flex-shrink-0"
                        />

                        <div className="min-w-0">
                          
                          <h3 className="font-semibold text-slate-900 truncate">
                            {patient.name}
                          </h3>

                          <p className="text-xs text-slate-400 mt-1">
                            ID: {patient._id?.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CONTACT */}
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-sm text-slate-700 truncate">
                          {patient.mobile ||
                            "No Mobile"}
                        </p>

                        <p className="text-xs text-slate-500 truncate">
                          {patient.email ||
                            "No Email"}
                        </p>
                      </div>
                    </td>

                    {/* AGE */}
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center px-3 py-2 rounded-xl bg-slate-100 text-sm font-medium text-slate-700">
                        {patient.age || "N/A"} /{" "}
                        {patient.gender || "N/A"}
                      </div>
                    </td>

                    {/* LAST VISIT */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays className="w-4 h-4 text-blue-500" />

                        {patient.lastVisit
                          ? new Date(
                              patient.lastVisit
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "No visits"}
                      </div>
                    </td>

                    {/* VISITS */}
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-sm">
                        {patient.totalVisits || 0}
                      </div>
                    </td>

                    {/* NOTES */}
                    <td className="px-6 py-5">

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm text-slate-600 leading-relaxed shadow-sm line-clamp-2">
                        {getLatestNote(
                          patient.personalNotes
                        ) || "No notes added"}
                      </div>
                    </td>

                    {/* ACTION */}
                    {/* <td className="px-6 py-5 text-right">

                      <button
                        onClick={() =>
                          openNotesModal(patient)
                        }
                        className="inline-flex items-center gap-2 px-4 h-10 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs font-semibold shadow-md shadow-emerald-100 transition-all"
                      >
                        <FilePenLine className="w-4 h-4" />
                        Notes
                      </button>
                    </td> */}
                  </tr>
                ))}

              </tbody>
            </table>

          ) : (
            <div className="flex flex-col items-center justify-center py-24">

              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-5">
                <Users className="w-10 h-10 text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-800">
                No Patients Found
              </h2>

              <p className="text-slate-500 mt-2">
                Try changing filters or search term
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===================== NOTES MODAL ===================== */}
      {showNotesModal && selectedPatient && (
        
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4">

          <div className="w-full max-w-3xl bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* TOP */}
            <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Clinical Notes
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {selectedPatient.name}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowNotesModal(false)
                  }
                  className="w-11 h-11 rounded-2xl hover:bg-slate-100 flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* NOTES */}
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">

              <div>
                <p className="text-sm font-semibold text-slate-700 mb-4">
                  Previous Notes
                </p>

                <div className="space-y-4">

                  {selectedPatient.personalNotes?.length >
                  0 ? (
                    selectedPatient.personalNotes.map(
                      (note, i) => (
                        <div
                          key={i}
                          className="bg-slate-50 border border-slate-100 rounded-2xl p-5"
                        >
                          <p className="text-slate-700 leading-relaxed">
                            {note.text || note}
                          </p>

                          {note.addedAt && (
                            <p className="text-xs text-slate-400 mt-3">
                              {new Date(
                                note.addedAt
                              ).toLocaleDateString(
                                "en-IN"
                              )}
                            </p>
                          )}
                        </div>
                      )
                    )
                  ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl py-10 text-center text-slate-400 text-sm">
                      No previous notes available
                    </div>
                  )}
                </div>
              </div>

              {/* TEXTAREA */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  Add New Note
                </p>

                <textarea
                  value={newNote}
                  onChange={(e) =>
                    setNewNote(e.target.value)
                  }
                  placeholder="Write clinical notes..."
                  className="w-full h-40 p-5 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 resize-none text-sm"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex items-center justify-end gap-3">

                <button
                  onClick={() =>
                    setShowNotesModal(false)
                  }
                  className="px-6 h-12 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition-all"
                >
                  Cancel
                </button>

                <button
                  onClick={() =>
                    handleAddNotes(
                      selectedPatient
                    )
                  }
                  className="px-6 h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-lg shadow-emerald-100 transition-all"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}