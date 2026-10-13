import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getReports } from '../../../lib/storage';
import { exportCSV } from '../../../lib/exports';

export default function AnalysisHistoryTable() {
  const navigate = useNavigate();
  const [reports] = useState(getReports);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date');
  const rows = useMemo(() => reports.filter(row => filter==='all' || row.analysisInput.location===filter).sort((a,b)=>sort==='score'?b.analysisResult.successRate-a.analysisResult.successRate:sort==='location'?a.analysisInput.location.localeCompare(b.analysisInput.location):b.timestamp.localeCompare(a.timestamp)),[reports,filter,sort]);
  return <section className="surface p-5 md:p-7"><div className="flex flex-wrap justify-between gap-4 mb-6"><div><p className="eyebrow">YOUR RESEARCH</p><h2 className="text-2xl mt-1">Previous analysis history</h2></div><div className="flex gap-2 flex-wrap"><select className="field !w-auto" aria-label="Filter reports by location" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All locations</option>{[...new Set(reports.map(row=>row.analysisInput.location))].map(name=><option key={name}>{name}</option>)}</select><select className="field !w-auto" aria-label="Sort reports" value={sort} onChange={e=>setSort(e.target.value)}><option value="date">Newest first</option><option value="score">Highest score</option><option value="location">Location A–Z</option></select></div></div>
    {!rows.length ? <div className="text-center py-12 border border-dashed border-border rounded-xl"><h3 className="text-xl">Your next idea starts with a location.</h3><p className="text-muted-foreground my-3">Completed analyses will be saved here on this device.</p><Link to="/new-analysis" className="action">Start an analysis →</Link></div> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left border-b border-border">{['Date','Location','Cuisine','Planning score','Actions'].map(label=><th key={label} className="p-3 whitespace-nowrap">{label}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row.id} className="border-b border-border/50"><td className="p-3 whitespace-nowrap">{new Date(row.timestamp).toLocaleDateString('en-IN')}</td><td className="p-3 font-semibold">{row.analysisInput.location}</td><td className="p-3">{row.analysisInput.cuisine}</td><td className="p-3"><span className="badge">{row.analysisResult.successRate}/100</span></td><td className="p-3"><div className="flex gap-3"><button className="text-primary font-semibold" onClick={()=>navigate('/analysis-results',{state:row})}>View</button><button onClick={()=>navigate('/new-analysis',{state:{analysisInput:row.analysisInput}})}>Rerun</button><button onClick={()=>exportCSV(row)}>Export CSV</button></div></td></tr>)}</tbody></table></div>}
  </section>;
}
