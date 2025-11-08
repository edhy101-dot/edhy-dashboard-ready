import React, { useEffect, useMemo, useState } from "react";

// ROADMAP data
const ROADMAP = [
  { week: 1, title: "HTML Fundamental", tasks: ["Apa itu web - browser & server","Struktur HTML (html, head, body)","Tag dasar: heading, paragraf, list, link, gambar","Form & input","Buat halaman Profil Pribadi (latihan)"] },
  { week: 2, title: "CSS Styling", tasks: ["Selector, class, id","Box model, warna, font, spacing","Flexbox & Grid","Responsive (media queries)","Latihan: layout profil responsif"] },
  { week: 3, title: "JavaScript Dasar", tasks: ["Variabel & tipe data","Kondisi & loop","Fungsi & event","DOM manipulation","Latihan: kalkulator atau form interaktif"] },
  { week: 4, title: "React Dasar", tasks: ["Konsep SPA & JSX","Komponen, Props & State","useState & event","useEffect & fetch API","Latihan: To-Do List React"] },
  { week: 5, title: "Styling: Tailwind CSS", tasks: ["Instalasi & setup Tailwind","Utility classes & responsive","Component reuse","Dark mode & animasi dasar","Latihan: To-Do List dengan UI modern"] },
  { week: 6, title: "Routing & API Integration", tasks: ["React Router dasar","Fetch data dari API publik","Error handling & loading state","Form input & POST ke API","Latihan: Crypto Info App (public API)"] },
  { week: 7, title: "Node & Express Dasar", tasks: ["Konsep server & REST API","Buat server Express","Routing GET/POST/PUT/DELETE","Middleware & JSON","Latihan: User Management API"] },
  { week: 8, title: "Database: MongoDB", tasks: ["Konsep DB & CRUD","MongoDB + Mongoose setup","Create & Read","Update & Delete","Latihan: Todo API with DB"] },
  { week: 9, title: "Integrasi Frontend & Backend", tasks: ["Hubungkan React ke Express","Fetch dari backend","Kirim form dari React ke backend","CORS & .env","Latihan: MERN To-Do App"] },
  { week: 10, title: "Git & GitHub", tasks: ["Konsep Git & version control","Init, commit, branch","Push ke GitHub","Pull requests dasar","Latihan: upload proyek ke GitHub"] },
  { week: 11, title: "Deploy ke Internet", tasks: ["Deploy frontend ke Vercel","Deploy backend ke Render","Koneksi backend-frontend online","Gunakan MongoDB Atlas","Tes live deployment"] },
  { week: 12, title: "Portofolio & Next Steps", tasks: ["Buat landing page portofolio","Gabungkan proyek & dokumentasi","Tambahkan autentikasi JWT (bonus)","Upload ke GitHub & Vercel","Siapkan CV & deploy portfolio"] }
];

const STORAGE_KEY = "edhy_learning_dashboard_v1";

function calcWeekProgress(weekData, state) {
  const key = `week-${weekData.week}`;
  const done = (state.weeks[key] || []).filter(Boolean).length;
  const total = weekData.tasks.length;
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function defaultStateFromRoadmap() {
  const weeks = {};
  ROADMAP.forEach(w => {
    weeks[`week-${w.week}`] = Array(w.tasks.length).fill(false);
  });
  return {
    name: "Edhy",
    startDate: new Date().toISOString(),
    weeks,
    theme: "futuristic",
    notes: "",
  };
}

export default function App() {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("corrupt localStorage, resetting");
    }
    return defaultStateFromRoadmap();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  }, [state]);

  const weeklyProgress = useMemo(() => {
    return ROADMAP.map(w => ({ week: w.week, title: w.title, progress: calcWeekProgress(w, state) }));
  }, [state]);

  const overall = useMemo(() => {
    const sum = weeklyProgress.reduce((s, w) => s + w.progress, 0);
    return Math.round(sum / weeklyProgress.length);
  }, [weeklyProgress]);

  function toggleTask(weekIndex, taskIndex) {
    const key = `week-${weekIndex}`;
    setState(prev => {
      const weeks = { ...prev.weeks };
      const arr = [...(weeks[key] || [])];
      arr[taskIndex] = !arr[taskIndex];
      weeks[key] = arr;
      return { ...prev, weeks };
    });
  }

  function resetProgress() {
    if (!confirm("Reset semua progres?")) return;
    setState(prev => ({ ...prev, weeks: defaultStateFromRoadmap().weeks }));
  }

  function exportProgress() {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `edhy-progress-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importProgress(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed && parsed.weeks) setState(parsed);
        else alert("File tidak valid");
      } catch (err) {
        alert("Gagal membaca file: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  function updateName(name) {
    setState(prev => ({ ...prev, name }));
  }

  function generateSchedule() {
    const schedule = [];
    const start = new Date(state.startDate || new Date().toISOString());
    for (let w = 0; w < ROADMAP.length; w++) {
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + w * 7);
      schedule.push({
        week: ROADMAP[w].week,
        title: ROADMAP[w].title,
        start: weekStart.toDateString(),
      });
    }
    return schedule;
  }

  const schedule = useMemo(() => generateSchedule(), [state.startDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-lg" />
              Edhy’s Learning Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Roadmap: Full Stack Developer — 12 Minggu • Gaya Futuristik</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-slate-400">User</div>
              <input
                value={state.name}
                onChange={e => updateName(e.target.value)}
                className="bg-transparent border border-slate-700 px-3 py-1 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Overall Progress</div>
              <div className="w-40 bg-slate-800 rounded-full h-3 overflow-hidden mt-1">
                <div style={{ width: `${overall}%` }} className="h-3 bg-gradient-to-r from-cyan-400 to-purple-500" />
              </div>
              <div className="text-xs mt-1 text-slate-300">{overall}%</div>
            </div>
            <button
              onClick={exportProgress}
              className="px-3 py-2 rounded-md border border-slate-700 text-sm hover:bg-slate-800"
            >
              Export
            </button>
            <label className="px-3 py-2 rounded-md border border-slate-700 text-sm hover:bg-slate-800 cursor-pointer">
              Import
              <input
                type="file"
                accept="application/json"
                onChange={e => importProgress(e.target.files[0])}
                className="hidden"
              />
            </label>
            <button onClick={resetProgress} className="px-3 py-2 rounded-md border border-rose-700 text-sm hover:bg-rose-900">
              Reset
            </button>
          </div>
        </header>

        <main className="grid grid-cols-12 gap-6">
          <section className="col-span-8">
            <div className="grid grid-cols-1 gap-4">
              {ROADMAP.map((w, idx) => {
                const wp = calcWeekProgress(w, state);
                const weekKey = `week-${w.week}`;
                const checkedArr = state.weeks[weekKey] || Array(w.tasks.length).fill(false);
                return (
                  <div key={w.week} className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/60 to-black/40 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">Minggu {w.week}: {w.title}</h3>
                        <p className="text-sm text-slate-400">Progress: {wp}%</p>
                        <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
                          <div style={{ width: `${wp}%` }} className="h-2 bg-gradient-to-r from-cyan-400 to-purple-500" />
                        </div>
                      </div>
                      <div className="text-sm text-slate-400">Tasks: {w.tasks.length}</div>
                    </div>

                    <ul className="mt-4 space-y-2">
                      {w.tasks.map((t, ti) => (
                        <li key={ti} className="flex items-center gap-3">
                          <button onClick={() => toggleTask(w.week, ti)} className={`w-6 h-6 rounded-md flex items-center justify-center ${checkedArr[ti] ? 'bg-cyan-400 text-black' : 'bg-transparent border border-slate-700'}`}>
                            {checkedArr[ti] ? '✓' : ''}
                          </button>
                          <div className={`flex-1 ${checkedArr[ti] ? 'line-through text-slate-400' : ''}`}>{t}</div>
                          <div className="text-xs text-slate-500">{checkedArr[ti] ? 'Done' : 'Pending'}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="col-span-4">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-black/40 border border-slate-800">
                <h4 className="text-lg font-semibold">Weekly Schedule</h4>
                <p className="text-sm text-slate-400 mt-1">Mulai: {new Date(state.startDate).toDateString()} • Durasi: 12 minggu</p>
                <div className="mt-3 space-y-2">
                  {schedule.map(s => (
                    <div key={s.week} className="flex items-center justify-between text-sm">
                      <div>
                        <div className="text-slate-200">Minggu {s.week}</div>
                        <div className="text-slate-400 text-xs">{s.title}</div>
                      </div>
                      <div className="text-xs text-slate-500">{s.start}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-slate-800">
                <h4 className="text-lg font-semibold">Checklist Harian</h4>
                <p className="text-sm text-slate-400">Centang tugas kecil setiap hari untuk menjaga konsistensi.</p>
                <div className="mt-3 grid gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="w-4 h-4" /> Study 2 hours
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="w-4 h-4" /> Code practice 1 hour
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="w-4 h-4" /> Read docs / article
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-slate-800">
                <h4 className="text-lg font-semibold">Quick Links</h4>
                <ul className="mt-2 text-sm space-y-2">
                  <li><a className="underline text-cyan-300" href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noreferrer">HTML Guide</a></li>
                  <li><a className="underline text-cyan-300" href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank" rel="noreferrer">CSS Flexbox Cheatsheet</a></li>
                  <li><a className="underline text-cyan-300" href="https://reactjs.org/docs/getting-started.html" target="_blank" rel="noreferrer">React Docs</a></li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-slate-800">
                <h4 className="text-lg font-semibold">Notes</h4>
                <textarea
                  value={state.notes}
                  onChange={e => setState(prev => ({ ...prev, notes: e.target.value }))}
                  className="mt-2 w-full min-h-[120px] bg-transparent border border-slate-700 p-2 rounded-md text-sm"
                />
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/60 to-black/40 border border-slate-800 text-center">
                <h4 className="text-lg font-semibold">Motivation</h4>
                <p className="mt-2 text-slate-400 text-sm">"Consistency beats intensity. 2 hours/day &gt; 1 weekend binge."</p>
                <div className="mt-3">
                  <button onClick={() => alert('Keep going, Edhy! 🚀')} className="px-3 py-2 rounded-md bg-cyan-500 text-black font-semibold">Boost</button>
                </div>
              </div>

            </div>
          </aside>
        </main>

        <footer className="mt-8 text-center text-slate-500 text-sm">
          Built for Edhy • Roadmap: 12 weeks • Start date: {new Date(state.startDate).toLocaleString()}
        </footer>
      </div>
    </div>
  );
}
