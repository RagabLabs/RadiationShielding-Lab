import { jsPDF } from 'jspdf';
import type { ReportSnapshot } from './snapshot';
import { snapshotCSV } from './snapshot';
export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
export function exportCSV(report: ReportSnapshot) { saveBlob(new Blob([snapshotCSV(report)], { type: 'text/csv;charset=utf-8' }), 'shielding-analysis.csv'); }
export function createPDF(report: ReportSnapshot): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const ascii = (s: string) => s.replaceAll('μ','mu').replaceAll('ρ','rho').replaceAll('λ','lambda').replaceAll('²','2').replaceAll('³','3').replaceAll('⁻','-').replaceAll('¹','1').replace(/[–—−]/g,'-').replace(/[^\x20-\x7E\n]/g,'');
  let y = 0;
  const header = () => { doc.setFont('helvetica','normal'); doc.setFillColor(12,26,42); doc.rect(0,0,210,31,'F'); doc.setTextColor(103,225,185); doc.setFontSize(10); doc.text('RADIATION SHIELDING / SCIENTIFIC REPORT',14,13); doc.setTextColor(255,255,255); doc.setFontSize(12); doc.text(`Lab v${report.version} | ${report.createdAt.slice(0,10)}`,14,23); doc.setTextColor(40,55,70); y=41; };
  const ensure = (height: number) => { if (y+height>279) { doc.addPage(); header(); } };
  header();
  doc.setFontSize(9); const intro = doc.splitTextToSize(report.warning,182); doc.text(intro,14,y); y += intro.length*4.4+6;
  let section = '';
  for (const r of report.rows) {
    if (r.section !== section) { ensure(18); section=r.section; doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(17,99,80); doc.text(ascii(section),14,y); y+=7; }
    doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(40,55,70);
    const rawValue = r.value === null ? 'Not available / not supplied' : typeof r.value === 'number' ? (r.value === 0 ? '0' : r.value.toPrecision(4)) : r.value;
    const left = doc.splitTextToSize(ascii(r.name),65), right = doc.splitTextToSize(ascii(`${rawValue}${r.unit ? ' '+r.unit : ''}`),110);
    const height = Math.max(left.length,right.length)*4.2+3;
    ensure(height); doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(40,55,70); doc.setDrawColor(226,232,237); doc.line(14,y-3,196,y-3); doc.text(left,14,y); doc.text(right,84,y); y+=height;
  }
  const total = doc.getNumberOfPages();
  for (let n=1;n<=total;n++) { doc.setPage(n); doc.setFontSize(8); doc.setTextColor(100,110,120); doc.text('Uncollided photons. Research / education. No safety certification.',14,289); doc.text(`${n} / ${total}`,185,289); }
  return doc;
}
export function exportPDF(report: ReportSnapshot) { saveBlob(createPDF(report).output('blob'), 'shielding-analysis.pdf'); }
export async function exportPNG(svg: SVGSVGElement, filename = 'shielding-chart.png') {
  const clone = svg.cloneNode(true) as SVGSVGElement; clone.setAttribute('xmlns','http://www.w3.org/2000/svg'); clone.setAttribute('width','1520'); clone.setAttribute('height','640');
  const xml = new XMLSerializer().serializeToString(clone); const source = URL.createObjectURL(new Blob([xml],{type:'image/svg+xml'}));
  try {
    const image = new Image(); image.src = source; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width=1520; canvas.height=640;
    const ctx=canvas.getContext('2d'); if(!ctx) throw new Error('Canvas export unavailable in this browser.');
    ctx.fillStyle='#101c2c'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.drawImage(image,0,0,canvas.width,canvas.height);
    const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('PNG encoding failed.')),'image/png'));
    saveBlob(blob,filename);
  } finally { URL.revokeObjectURL(source); }
}
