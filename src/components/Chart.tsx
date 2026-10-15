import { useId, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { exportPNG } from '../reports/export';
export interface PlotPoint { x:number; y:number; breakBefore?:boolean }
export interface Series { name:string; color:string; points:PlotPoint[] }
interface Props { title:string; subtitle:string; xLabel:string; yLabel:string; series:Series[]; logX?:boolean; logY?:boolean; stems?:boolean; source?:string }
export function Chart({title,subtitle,xLabel,yLabel,series,logX=false,logY=false,stems=false,source='NIST data · local scientific engine'}:Props) {
  const id=useId(), ref=useRef<SVGSVGElement>(null);
  const [hidden,setHidden]=useState<string[]>([]),[hover,setHover]=useState<number|null>(null),[error,setError]=useState('');
  const visible=series.filter(s=>!hidden.includes(s.name));
  const usable=(p:PlotPoint)=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&(!logX||p.x>0)&&(!logY||p.y>0);
  const all=visible.flatMap(s=>s.points).filter(usable);
  const tx=(x:number)=>logX?Math.log10(x):x, ty=(y:number)=>logY?Math.log10(y):y;
  const minX=all.length?Math.min(...all.map(p=>tx(p.x))):0;
  const maxX0=all.length?Math.max(...all.map(p=>tx(p.x))):1, maxX=maxX0===minX?minX+1:maxX0;
  const minY=logY&&all.length?Math.min(...all.map(p=>ty(p.y))):0;
  const maxY0=all.length?Math.max(...all.map(p=>ty(p.y))):1,maxY=maxY0===minY?minY+1:maxY0;
  const sx=(x:number)=>72+(tx(x)-minX)/(maxX-minX)*650,sy=(y:number)=>242-(ty(y)-minY)/(maxY-minY)*203;
  const fmt=(n:number)=>n===0?'0':Math.abs(n)>=1e4||Math.abs(n)<0.001?n.toExponential(1):Number(n.toPrecision(3)).toString();
  const values=[...new Set(all.map(p=>p.x))].sort((a,b)=>a-b);
  const active=hover===null?null:values[Math.min(hover,values.length-1)];
  const path=(s:Series)=>{let pen=false;return s.points.map(p=>{if(!usable(p)){pen=false;return '';}const cmd=!pen||p.breakBefore?'M':'L';pen=true;return `${cmd}${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`;}).join(' ');};
  return <section className="card chart-card"><div className="card-heading"><div><h3>{title}</h3><p>{subtitle}</p></div><button className="icon-btn" title="Download PNG" aria-label={`Download PNG: ${title}`} onClick={()=>{if(ref.current)void exportPNG(ref.current,title.replaceAll(/[^a-zA-Z0-9]/g,'-')+'.png').catch(e=>setError(String(e)));}}><Download size={16}/></button></div>
    <svg ref={ref} viewBox="0 0 760 320" role="img" aria-labelledby={id} tabIndex={0} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();setHover(v=>Math.max(0,Math.min(values.length-1,(v??0)+(e.key==='ArrowRight'?1:-1))));}}} onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();const x=((e.clientX-r.left)/r.width*760-72)/650*(maxX-minX)+minX;let best=0;values.forEach((v,i)=>{if(Math.abs(tx(v)-x)<Math.abs(tx(values[best])-x))best=i;});setHover(best);}} onPointerLeave={()=>setHover(null)}>
      <title id={id}>{title}. {xLabel}; {yLabel}. Arrow keys explore data.</title><rect width="760" height="320" rx="10" fill="#101c2c"/>
      <text x="72" y="20" fill="#a9b8cc" fontSize="10" fontFamily="Arial">{source}</text>
      {[0,1,2,3,4].map(i=>{const val=minY+(maxY-minY)*i/4,y=242-203*i/4;return <g key={i}><line x1="72" y1={y} x2="722" y2={y} stroke="#29364a" strokeDasharray="3 5"/><text x="62" y={y+4} textAnchor="end" fill="#a9b8cc" fontSize="11" fontFamily="Arial">{logY?`10^${fmt(val)}`:fmt(val)}</text></g>;})}
      {[0,1,2,3,4].map(i=>{const val=minX+(maxX-minX)*i/4,x=72+650*i/4;return <text key={i} x={x} y="262" textAnchor="middle" fill="#a9b8cc" fontSize="11" fontFamily="Arial">{fmt(logX?10**val:val)}</text>;})}
      <text x="400" y="283" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="Arial">{xLabel}{logX?' (log scale)':''}</text><text x="18" y="145" transform="rotate(-90 18 145)" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="Arial">{yLabel}{logY?' (log scale)':''}</text>
      {visible.map((s,si)=>stems?<g key={s.name}>{s.points.filter(usable).map((p,i)=><g key={i}><line x1={sx(p.x)+si*5} x2={sx(p.x)+si*5} y1="242" y2={sy(p.y)} stroke={s.color} strokeWidth="4"/><circle cx={sx(p.x)+si*5} cy={sy(p.y)} r="3" fill={s.color}/></g>)}</g>:<path key={s.name} d={path(s)} stroke={s.color} strokeWidth="2.5" fill="none" strokeLinejoin="round"/>)}
      {active!==null&&Number.isFinite(active)&&<line x1={sx(active)} x2={sx(active)} y1="35" y2="242" stroke="#d9e3ee" strokeDasharray="3 4"/>}
      {visible.map((s,i)=><g key={s.name} transform={`translate(${72+(i%3)*220},${301+Math.floor(i/3)*12})`}><rect width="14" height="3" y="-4" fill={s.color}/><text x="20" fill="#cad5e4" fontSize="9" fontFamily="Arial">{s.name.slice(0,29)}</text></g>)}
    </svg>
    <div className="chart-legend">{series.map(s=><button key={s.name} aria-pressed={!hidden.includes(s.name)} onClick={()=>setHidden(h=>h.includes(s.name)?h.filter(x=>x!==s.name):h.length<series.length-1?[...h,s.name]:h)}><i style={{background:s.color}}/>{s.name}</button>)}</div>
    {active!==null?<div className="plot-readout" aria-live="polite"><b>{fmt(active)} {xLabel}</b>{visible.map(s=>{const p=s.points.find(p=>p.x===active);return p?<span key={s.name} style={{color:s.color}}>{s.name}: {fmt(p.y)}</span>:null;})}</div>:<p className="chart-hint">Hover or use arrow keys to inspect • Click a legend to isolate a series</p>}
    {error&&<p role="alert">{error}</p>}
  </section>;
}
