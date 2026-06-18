import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BarChart3, BriefcaseBusiness, CalendarDays, Download, GraduationCap, MapPin, Plus, RefreshCcw, Search, Users } from 'lucide-react';
import './styles.css';

const recruitingStages = ['Dossier', 'Interview', 'Probetag', 'Anstellung'];
const coachingStages = ['Startcoaching', 'C1', 'C2', 'C3', 'C4', 'C5'];
const trainingStages = ['Verkaufsschulung', 'Kundenbesuchschulung', 'Intensivtage', 'Admin-Schulung'];
const allTrainingStages = [...coachingStages, ...trainingStages];
const statusOptions = ['green', 'yellow', 'red'];

const branchNames = ['Bern', 'Zuerich', 'Basel', 'Luzern', 'St. Gallen', 'Winterthur', 'Thun', 'Biel', 'Aarau', 'Chur', 'Schaffhausen', 'Solothurn', 'Uster', 'Wetzikon', 'Rapperswil', 'Zug', 'Baden', 'Olten', 'Frauenfeld', 'Wil', 'Langenthal', 'Liestal', 'Sion', 'Lausanne', 'Genf', 'Neuchatel', 'Fribourg', 'Bellinzona'];
const initialBranches = branchNames.map((name, i) => ({ id: `branch-${i + 1}`, name, region: i < 7 ? 'Mitte/Ost' : i < 14 ? 'Nord/Ost' : i < 21 ? 'Mitte/Nord' : 'West/Sued' }));
const initialVacancies = [
  ['branch-1', 'Fachperson Betreuung', 'red', 24, 8, 5, 2, 1],
  ['branch-2', 'Teamleitung Ausbildung', 'yellow', 18, 6, 4, 2, 1],
  ['branch-3', 'Praktikum', 'green', 12, 4, 3, 1, 1],
  ['branch-4', 'Fachperson Betreuung', 'yellow', 16, 7, 2, 2, 0],
  ['branch-5', 'Ausbildnerin', 'green', 8, 3, 1, 1, 1],
  ['branch-25', 'Fachperson Betreuung', 'red', 21, 10, 4, 2, 1],
  ['branch-14', 'Praktikum', 'red', 10, 5, 1, 0, 0],
  ['branch-24', 'Fachperson Betreuung', 'yellow', 18, 6, 4, 1, 1],
].map((v, i) => ({ id: `vac-${i + 1}`, branchId: v[0], title: v[1], status: v[2], dossiers: v[3], rejections: v[4], interviews: v[5], trialDays: v[6], hiring: v[7] }));
const initialCandidates = [
  ['Lea Keller', 'branch-1', 'vac-1', 'Interview', 'yellow'],
  ['Marco Frei', 'branch-2', 'vac-2', 'Probetag', 'green'],
  ['Nora Meier', 'branch-3', 'vac-3', 'Anstellung', 'green'],
  ['Samira Huber', 'branch-4', 'vac-4', 'Interview', 'yellow'],
  ['David Rossi', 'branch-5', 'vac-5', 'Probetag', 'green'],
  ['Mila Schmid', 'branch-25', 'vac-6', 'Dossier', 'red'],
  ['Jonas Wyss', 'branch-14', 'vac-7', 'Anstellung', 'yellow'],
].map((c, i) => ({ id: `cand-${i + 1}`, name: c[0], branchId: c[1], vacancyId: c[2], stage: c[3], status: c[4] }));
const initialTrainees = [
  ['Anna Berger', 'branch-1', 'Startcoaching', 'green', 'Start gut gelungen'],
  ['Timo Graf', 'branch-2', 'C1', 'green', 'Naechster Termin geplant'],
  ['Elin Sutter', 'branch-3', 'C2', 'yellow', 'Mehr Begleitung noetig'],
  ['Noah Baumann', 'branch-4', 'C3', 'yellow', 'Praxisziele pruefen'],
  ['Lina Weber', 'branch-5', 'C4', 'green', 'Stabil unterwegs'],
  ['Marius Kunz', 'branch-1', 'C5', 'red', 'Rueckmeldung diese Woche'],
  ['Ben Steiner', 'branch-2', 'Verkaufsschulung', 'green', 'Modul begonnen'],
  ['Iva Novak', 'branch-24', 'Kundenbesuchschulung', 'yellow', 'Termin offen'],
  ['Luca Bieri', 'branch-3', 'Intensivtage', 'green', 'Tag 1 absolviert'],
  ['Mara Nguyen', 'branch-4', 'Admin-Schulung', 'red', 'Nachschulung einplanen'],
].map((t, i) => ({ id: `tr-${i + 1}`, name: t[0], branchId: t[1], stage: t[2], status: t[3], comment: t[4] }));
const initialReport = { week: '2026-W25', comment: 'Bern, Genf und Wetzikon brauchen prioritaere Nachfassung. Schulungstermine fuer Admin und Kundenbesuch pruefen.' };

function loadState() { try { return JSON.parse(localStorage.getItem('hr-reporting-prototype')); } catch { return null; } }
function makeId(prefix) { return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`; }
function statusLabel(status) { return status === 'green' ? 'Gruen' : status === 'yellow' ? 'Gelb' : 'Rot'; }
function emptyVacancy(branchId = 'branch-1') { return { branchId, title: '', status: 'yellow', dossiers: 0, rejections: 0, interviews: 0, trialDays: 0, hiring: 0 }; }
function emptyCandidate(branchId = 'branch-1', vacancyId = 'vac-1') { return { name: '', branchId, vacancyId, stage: 'Dossier', status: 'yellow' }; }
function emptyTrainee(branchId = 'branch-1') { return { name: '', branchId, stage: 'Startcoaching', status: 'green', comment: '' }; }

function App() {
  const saved = loadState();
  const [branches] = useState(saved?.branches || initialBranches);
  const [vacancies, setVacancies] = useState(saved?.vacancies || initialVacancies);
  const [candidates, setCandidates] = useState(saved?.candidates || initialCandidates);
  const [trainees, setTrainees] = useState(saved?.trainees || initialTrainees);
  const [report, setReport] = useState(saved?.report || initialReport);
  const [filters, setFilters] = useState({ branchId: 'all', status: 'all', query: '' });
  const [vacancyForm, setVacancyForm] = useState(emptyVacancy());
  const [candidateForm, setCandidateForm] = useState(emptyCandidate());
  const [traineeForm, setTraineeForm] = useState(emptyTrainee());

  useEffect(() => localStorage.setItem('hr-reporting-prototype', JSON.stringify({ branches, vacancies, candidates, trainees, report })), [branches, vacancies, candidates, trainees, report]);
  const branchName = (id) => branches.find((b) => b.id === id)?.name || 'Unbekannt';
  const vacancyTitle = (id) => vacancies.find((v) => v.id === id)?.title || 'Vakanz';
  const visible = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const ok = (item, text) => (filters.branchId === 'all' || item.branchId === filters.branchId) && (filters.status === 'all' || item.status === filters.status) && (!q || text.join(' ').toLowerCase().includes(q));
    return {
      vacancies: vacancies.filter((v) => ok(v, [v.title, branchName(v.branchId)])),
      candidates: candidates.filter((c) => ok(c, [c.name, branchName(c.branchId), vacancyTitle(c.vacancyId), c.stage])),
      trainees: trainees.filter((t) => ok(t, [t.name, branchName(t.branchId), t.stage, t.comment])),
    };
  }, [filters, vacancies, candidates, trainees]);
  const totals = useMemo(() => ({ branches: branches.length, vacancies: vacancies.length, dossiers: sum(vacancies, 'dossiers'), rejections: sum(vacancies, 'rejections'), activeProcesses: sum(vacancies, 'interviews') + sum(vacancies, 'trialDays') + sum(vacancies, 'hiring'), trainees: trainees.length }), [branches, vacancies, trainees]);

  function addVacancy(e) { e.preventDefault(); if (!vacancyForm.title.trim()) return; setVacancies([{ ...vacancyForm, id: makeId('vac'), title: vacancyForm.title.trim() }, ...vacancies]); setVacancyForm(emptyVacancy(vacancyForm.branchId)); }
  function updateVacancy(id, field, value) { setVacancies(vacancies.map((v) => v.id === id ? { ...v, [field]: ['title', 'status', 'branchId'].includes(field) ? value : Number(value) } : v)); }
  function addCandidate(e) { e.preventDefault(); if (!candidateForm.name.trim()) return; const vac = vacancies.find((v) => v.id === candidateForm.vacancyId); setCandidates([{ ...candidateForm, id: makeId('cand'), name: candidateForm.name.trim(), branchId: vac?.branchId || candidateForm.branchId }, ...candidates]); setCandidateForm(emptyCandidate(candidateForm.branchId, candidateForm.vacancyId)); }
  function updateCandidate(id, field, value) { setCandidates(candidates.map((c) => c.id === id ? { ...c, [field]: value } : c)); }
  function addTrainee(e) { e.preventDefault(); if (!traineeForm.name.trim()) return; setTrainees([{ ...traineeForm, id: makeId('tr'), name: traineeForm.name.trim() }, ...trainees]); setTraineeForm(emptyTrainee(traineeForm.branchId)); }
  function updateTrainee(id, field, value) { setTrainees(trainees.map((t) => t.id === id ? { ...t, [field]: value } : t)); }
  function resetDemoData() { localStorage.removeItem('hr-reporting-prototype'); setVacancies(initialVacancies); setCandidates(initialCandidates); setTrainees(initialTrainees); setReport(initialReport); setFilters({ branchId: 'all', status: 'all', query: '' }); }
  function exportCsv() {
    const rows = [['Typ', 'Filiale', 'Name/Vakanz', 'Status', 'Phase', 'Dossiers', 'Absagen', 'Interviews', 'Probetage', 'Anstellung', 'Kommentar'], ...vacancies.map((v) => ['Vakanz', branchName(v.branchId), v.title, statusLabel(v.status), '', v.dossiers, v.rejections, v.interviews, v.trialDays, v.hiring, '']), ...candidates.map((c) => ['Kandidat', branchName(c.branchId), c.name, statusLabel(c.status), c.stage, '', '', '', '', '', vacancyTitle(c.vacancyId)]), ...trainees.map((t) => ['Ausbildung', branchName(t.branchId), t.name, statusLabel(t.status), t.stage, '', '', '', '', '', t.comment]), ['Wochenreport', report.week, 'Kommentar', '', '', '', '', '', '', '', report.comment]];
    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';')).join('\n');
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); link.download = `recruiting-ausbildung-${report.week}.csv`; link.click();
  }

  return <main className="app-shell">
    <header className="topbar"><div><p className="eyebrow">Interner Prototyp</p><h1>Recruiting & Ausbildung Reporting</h1></div><div className="top-actions"><button className="ghost-button" onClick={resetDemoData}><RefreshCcw size={17}/> Demo zuruecksetzen</button><button className="primary-button" onClick={exportCsv}><Download size={17}/> CSV Export</button></div></header>
    <section className="toolbar"><Select label="Filiale" value={filters.branchId} onChange={(v) => setFilters({ ...filters, branchId: v })} options={[['all', 'Alle Filialen'], ...branches.map((b) => [b.id, b.name])]}/><Select label="Status" value={filters.status} onChange={(v) => setFilters({ ...filters, status: v })} options={[['all', 'Alle Status'], ...statusOptions.map((s) => [s, statusLabel(s)])]}/><label className="search-field"><span>Suche</span><div><Search size={17}/><input value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} placeholder="Name, Filiale oder Vakanz"/></div></label></section>
    <Dashboard totals={totals}/>
    <section className="content-grid"><Panel title="Rekrutierungspipeline" icon={<BriefcaseBusiness size={18}/>}><RecruitingPipeline items={visible.candidates} branchName={branchName} vacancyTitle={vacancyTitle} onUpdate={updateCandidate}/></Panel><WeeklyReport report={report} setReport={setReport} totals={totals}/></section>
    <Panel title="Ausbildungs- / Coachingpipeline" icon={<GraduationCap size={18}/>}><TrainingPipeline items={visible.trainees} branchName={branchName} onUpdate={updateTrainee}/></Panel>
    <section className="content-grid wide-left"><Panel title="Vakanzen erfassen und bearbeiten" icon={<Plus size={18}/>}><VacancyForm branches={branches} form={vacancyForm} setForm={setVacancyForm} onSubmit={addVacancy}/><VacancyTable vacancies={visible.vacancies} branches={branches} onUpdate={updateVacancy}/></Panel><Panel title="Neue Personen erfassen" icon={<Users size={18}/>}><CandidateForm branches={branches} vacancies={vacancies} form={candidateForm} setForm={setCandidateForm} onSubmit={addCandidate}/><TraineeForm branches={branches} form={traineeForm} setForm={setTraineeForm} onSubmit={addTrainee}/></Panel></section>
    <Panel title="Filialuebersicht 28 Filialen" icon={<MapPin size={18}/>}><BranchOverview branches={branches} vacancies={vacancies} trainees={trainees} filters={filters}/></Panel>
  </main>;
}
function sum(items, field) { return items.reduce((n, item) => n + Number(item[field] || 0), 0); }
function Select({ label, value, onChange, options }) { return <label><span>{label}</span><select value={value} onChange={(e) => onChange(e.target.value)}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>; }
function Dashboard({ totals }) { return <section className="kpi-grid"><Kpi icon={<MapPin size={22}/>} label="Filialen" value={totals.branches}/><Kpi icon={<BriefcaseBusiness size={22}/>} label="Offene Vakanzen" value={totals.vacancies} tone="red"/><Kpi icon={<BarChart3 size={22}/>} label="Dossiers" value={totals.dossiers} tone="green"/><Kpi icon={<Users size={22}/>} label="Aktive Prozesse" value={totals.activeProcesses} tone="yellow"/><Kpi icon={<GraduationCap size={22}/>} label="In Ausbildung" value={totals.trainees} tone="green"/></section>; }
function Kpi({ icon, label, value, tone = 'neutral' }) { return <article className={`kpi-tile ${tone}`}><div className="tile-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></article>; }
function Panel({ title, icon, children }) { return <section className="panel"><div className="panel-title">{icon}<h2>{title}</h2></div>{children}</section>; }
function StatusSelect({ value, onChange }) { return <select className={`status-select ${value}`} value={value} onChange={(e) => onChange(e.target.value)}>{statusOptions.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}</select>; }
function RecruitingPipeline({ items, branchName, vacancyTitle, onUpdate }) { return <div className="kanban">{recruitingStages.map((stage) => { const people = items.filter((i) => i.stage === stage); return <div className="kanban-col" key={stage}><div className="kanban-title">{stage}<span>{people.length}</span></div>{people.map((c) => <article className={`person-card ${c.status}`} key={c.id}><strong>{c.name}</strong><span>{branchName(c.branchId)} - {vacancyTitle(c.vacancyId)}</span><div className="inline-controls"><select value={c.stage} onChange={(e) => onUpdate(c.id, 'stage', e.target.value)}>{recruitingStages.map((s) => <option key={s}>{s}</option>)}</select><StatusSelect value={c.status} onChange={(v) => onUpdate(c.id, 'status', v)}/></div></article>)}{people.length === 0 && <div className="empty-stage">Keine Kandidaten</div>}</div>; })}</div>; }
function TrainingPipeline({ items, branchName, onUpdate }) { return <div className="training-pipeline"><div><div className="pipeline-subtitle">Coaching</div><div className="coaching-board">{coachingStages.map((s) => <TrainingLane key={s} stage={s} items={items} branchName={branchName} onUpdate={onUpdate}/>)}</div></div><div><div className="pipeline-subtitle">Schulungen</div><div className="training-board">{trainingStages.map((s) => <TrainingLane key={s} stage={s} items={items} branchName={branchName} onUpdate={onUpdate}/>)}</div></div></div>; }
function TrainingLane({ stage, items, branchName, onUpdate }) { const people = items.filter((i) => i.stage === stage); return <div className="stage-lane"><div className="kanban-title small">{stage}<span>{people.length}</span></div>{people.map((p) => <article className={`mini-person ${p.status}`} key={p.id}><strong>{p.name}</strong><small>{branchName(p.branchId)}</small><div className="inline-controls"><select value={p.stage} onChange={(e) => onUpdate(p.id, 'stage', e.target.value)}>{allTrainingStages.map((s) => <option key={s}>{s}</option>)}</select><StatusSelect value={p.status} onChange={(v) => onUpdate(p.id, 'status', v)}/></div></article>)}{people.length === 0 && <div className="empty-stage">Keine Personen</div>}</div>; }
function WeeklyReport({ report, setReport, totals }) { return <Panel title="Wochenreport" icon={<CalendarDays size={18}/>}><div className="weekly-report"><label><span>Kalenderwoche</span><input type="week" value={report.week} onChange={(e) => setReport({ ...report, week: e.target.value })}/></label><div className="week-metrics"><div><span>Dossiers</span><strong>{totals.dossiers}</strong></div><div><span>Absagen</span><strong>{totals.rejections}</strong></div><div><span>Aktive Prozesse</span><strong>{totals.activeProcesses}</strong></div><div><span>Ausbildung</span><strong>{totals.trainees}</strong></div></div><label><span>Kommentar</span><textarea value={report.comment} onChange={(e) => setReport({ ...report, comment: e.target.value })} rows="5"/></label></div></Panel>; }
function VacancyForm({ branches, form, setForm, onSubmit }) { return <form className="entry-form" onSubmit={onSubmit}><Select label="Filiale" value={form.branchId} onChange={(v) => setForm({ ...form, branchId: v })} options={branches.map((b) => [b.id, b.name])}/><label><span>Vakanz</span><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="z.B. Fachperson Betreuung"/></label><Select label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={statusOptions.map((s) => [s, statusLabel(s)])}/><button className="primary-button" type="submit"><Plus size={17}/> Hinzufuegen</button></form>; }
function VacancyTable({ vacancies, branches, onUpdate }) { return <div className="table-wrap"><table><thead><tr>{['Filiale', 'Vakanz', 'Status', 'Dossiers', 'Absagen', 'Interviews', 'Probetage', 'Anstellung'].map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{vacancies.map((v) => <tr key={v.id}><td><select value={v.branchId} onChange={(e) => onUpdate(v.id, 'branchId', e.target.value)}>{branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></td><td><input value={v.title} onChange={(e) => onUpdate(v.id, 'title', e.target.value)}/></td><td><StatusSelect value={v.status} onChange={(x) => onUpdate(v.id, 'status', x)}/></td>{['dossiers', 'rejections', 'interviews', 'trialDays', 'hiring'].map((f) => <td key={f}><input className="number-input" type="number" min="0" value={v[f]} onChange={(e) => onUpdate(v.id, f, e.target.value)}/></td>)}</tr>)}</tbody></table></div>; }
function CandidateForm({ branches, vacancies, form, setForm, onSubmit }) { return <form className="stack-form" onSubmit={onSubmit}><h3>Kandidat erfassen</h3><label><span>Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name Kandidat"/></label><label><span>Vakanz</span><select value={form.vacancyId} onChange={(e) => { const vac = vacancies.find((v) => v.id === e.target.value); setForm({ ...form, vacancyId: e.target.value, branchId: vac?.branchId || form.branchId }); }}>{vacancies.map((v) => <option key={v.id} value={v.id}>{branches.find((b) => b.id === v.branchId)?.name} - {v.title}</option>)}</select></label><div className="form-row"><Select label="Phase" value={form.stage} onChange={(v) => setForm({ ...form, stage: v })} options={recruitingStages.map((s) => [s, s])}/><Select label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={statusOptions.map((s) => [s, statusLabel(s)])}/></div><button className="primary-button" type="submit"><Plus size={17}/> Kandidat hinzufuegen</button></form>; }
function TraineeForm({ branches, form, setForm, onSubmit }) { return <form className="stack-form" onSubmit={onSubmit}><h3>Ausbildung erfassen</h3><label><span>Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name Mitarbeitende"/></label><Select label="Filiale" value={form.branchId} onChange={(v) => setForm({ ...form, branchId: v })} options={branches.map((b) => [b.id, b.name])}/><div className="form-row"><Select label="Coaching / Schulung" value={form.stage} onChange={(v) => setForm({ ...form, stage: v })} options={allTrainingStages.map((s) => [s, s])}/><Select label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={statusOptions.map((s) => [s, statusLabel(s)])}/></div><label><span>Kommentar</span><input value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Optionaler Hinweis"/></label><button className="primary-button" type="submit"><Plus size={17}/> Ausbildung hinzufuegen</button></form>; }
function BranchOverview({ branches, vacancies, trainees, filters }) { const q = filters.query.trim().toLowerCase(); return <div className="branch-grid">{branches.filter((b) => (!q || b.name.toLowerCase().includes(q) || vacancies.some((v) => v.branchId === b.id && v.title.toLowerCase().includes(q))) && (filters.branchId === 'all' || filters.branchId === b.id)).map((b) => { const bv = vacancies.filter((v) => v.branchId === b.id); const bt = trainees.filter((t) => t.branchId === b.id); const status = branchStatus(bv, bt); if (filters.status !== 'all' && filters.status !== status) return null; return <article className={`branch-card ${status}`} key={b.id}><div className="branch-card-head"><div><strong>{b.name}</strong><span>{b.region}</span></div><span className={`status-dot ${status}`}/></div><div className="branch-metrics"><span><b>{bv.length}</b> Vakanzen</span><span><b>{sum(bv, 'dossiers')}</b> Dossiers</span><span><b>{sum(bv, 'interviews') + sum(bv, 'trialDays') + sum(bv, 'hiring')}</b> Prozesse</span><span><b>{bt.length}</b> Ausbildung</span></div></article>; })}</div>; }
function branchStatus(vacancies, trainees) { if (vacancies.some((v) => v.status === 'red') || trainees.some((t) => t.status === 'red')) return 'red'; if (vacancies.some((v) => v.status === 'yellow') || trainees.some((t) => t.status === 'yellow')) return 'yellow'; return 'green'; }

createRoot(document.getElementById('root')).render(<App />);
