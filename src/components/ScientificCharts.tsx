import { Chart, type Series } from './Chart';
import type { Analysis } from '../physics/analysis';
import type { Page, Language } from '../content';
import { getDataset } from '../physics/attenuationData';
import { materials } from '../physics/materials';
import { lookup } from '../physics/interpolation';
import { linearAttenuation } from '../physics/linearAttenuation';
import { transmission } from '../physics/transmission';
import { requiredThickness } from '../physics/shieldThickness';
import { interactionContributions, processKeys } from '../physics/interactions';
import { processNames } from '../content';
import { fromCm, type LengthUnit } from '../physics/units';
const colors=['#6ce5bd','#79a8ff','#f2bf71','#cc9cff','#f48c9b'];
type ChartProps={a:Analysis;page:Page;lang:Language;lengthUnit:LengthUnit};
export function ScientificCharts(props:ChartProps) {
  try { return buildCharts(props); }
  catch(e) { return <section className="notice">{props.lang==='en'?'Some plots cannot be represented at these numerical magnitudes. Scalar results and retained logs remain available.':'بعض الرسوم غير قابلة للتمثيل عند هذه المقادير العددية. تظل النتائج العددية واللوغاريتمات متاحة.'} <small>{String(e)}</small></section>; }
}
function buildCharts({a,page,lang,lengthUnit}:ChartProps) {
  const t=(en:string,ar:string)=>lang==='en'?en:ar;
  const primary=a.input.layers[0], data=getDataset(primary.materialId,a.input.source);
  const energy=(linear=false):Series[]=>[{name:linear?'μ':'μ/ρ',color:colors[0],points:data.points.map(p=>({x:p.energyMeV,y:linear?linearAttenuation(p.total,primary.density):p.total,breakBefore:p.side==='above'}))}];
  const rawRange=Math.max(primary.thicknessCm*2,a.tvlCm?2*a.tvlCm:1,Number.MIN_VALUE*80);
  const maxThickness=Math.min(rawRange,1e6);
  const trans:Series[]=[{name:t('Uncollided photons','فوتونات غير متصادمة'),color:colors[0],points:Array.from({length:81},(_,i)=>{const x=maxThickness*i/80;return {x:fromCm(x,lengthUnit),y:100*transmission(a.mu,x).fraction};})}];
  const profile:Series[]=[{name:t('Cumulative transmission','النفاذ التراكمي'),color:colors[0],points:[{x:0,y:100},...a.stack.layers.map(l=>({x:fromCm(l.positionCm,lengthUnit),y:l.cumulativeTransmission.fraction*100}))]}];
  const comparison:Series[]=materials.slice(0,5).map((m,i)=>({name:m.name,color:colors[i],points:Array.from({length:61},(_,k)=>{const x=maxThickness*k/60;return {x:fromCm(x,lengthUnit),y:100*transmission(linearAttenuation(lookup(m.id,a.input.energyMeV,a.input.source,a.input.side).value,m.density),x).fraction};})}));
  const charts=[];
  if(['complete','transmission','hvl','tvl','mfp'].includes(page))charts.push(<Chart key="trans" title={t('Transmission through the primary shield','النفاذ عبر الدرع الأساسي')} subtitle={t('Monoenergetic reference • uncollided component only','مرجع أحادي الطاقة • المكوّن غير المتصادم فقط')+(rawRange>1e6?' • Plot range capped at 10 km':'')} xLabel={`Thickness / ${lengthUnit}`} yLabel="Transmission / %" series={trans}/>);
  if(['complete','mass'].includes(page))charts.push(<Chart key="mass" title={t('Mass attenuation vs photon energy','التوهين الكتلي مقابل طاقة الفوتون')} subtitle={`${a.material.name} • ${a.input.source.toUpperCase()} • 1 keV–20 MeV`} xLabel="Energy / MeV" yLabel="μ/ρ / cm² g⁻¹" series={energy()} logX logY/>);
  if(page==='linear')charts.push(<Chart key="linear" title={t('Linear attenuation vs energy','التوهين الخطي مقابل الطاقة')} subtitle={`ρ = ${primary.density} g/cm³`} xLabel="Energy / MeV" yLabel="μ / cm⁻¹" series={energy(true)} logX logY/>);
  if(['complete','thickness'].includes(page)&&a.mu>0)charts.push(<Chart key="required" title={t('Thickness for a target transmission','السمك مقابل النفاذ المطلوب')} subtitle={t('Inverse narrow-beam model, primary material','عكس نموذج الحزمة الضيقة للمادة الأساسية')} xLabel="Target T / fraction" yLabel={`Thickness / ${lengthUnit}`} series={[{name:a.material.name,color:colors[1],points:Array.from({length:61},(_,i)=>{const target=10**(-12+i/5);return {x:target,y:fromCm(requiredThickness(a.mu,target),lengthUnit)};})}]} logX/>);
  if(['complete','multilayer'].includes(page))charts.push(<Chart key="profile" title={t('Multilayer attenuation profile','مسار التوهين متعدد الطبقات')} subtitle={t('Layer boundaries; not a continuous interpolation of the heterogeneous shield','حدود الطبقات؛ لا تمثل الخطوط استيفاءً فيزيائيًا داخل الدرع')} xLabel={`Depth / ${lengthUnit}`} yLabel="Transmission / %" series={profile}/>);
  if(['complete','thickness','linear'].includes(page))charts.push(<Chart key="comparison" title={t('Material comparison','مقارنة المواد')} subtitle={`${a.input.energyMeV} MeV • ${t('NIST reference densities, equal physical thickness','كثافات NIST المرجعية؛ سمك مادي متساوٍ')}`} xLabel={`Thickness / ${lengthUnit}`} yLabel="Transmission / %" series={comparison}/>);
  if(['complete','interactions'].includes(page)){
    const xd=getDataset(primary.materialId,'xcom');
    const processes=processKeys.map((key,i)=>({name:processNames[key][lang==='en'?0:1],color:colors[i],points:xd.points.map(p=>({x:p.energyMeV,y:interactionContributions(primary.materialId,p.energyMeV,p.side||'above').parts.find(k=>k.key===key)!.value,breakBefore:p.side==='above'}))}));
    charts.push(<Chart key="interaction" title={t('Interaction coefficients vs energy','معاملات التفاعل مقابل الطاقة')} subtitle={t('One XCOM dataset • zero channels omitted on log scale','بيانات XCOM واحدة • القنوات الصفرية لا تُرسم على المقياس اللوغاريتمي')} xLabel="Energy / MeV" yLabel="Partial μ/ρ / cm² g⁻¹" series={processes} logX logY/>);
  }
  if(a.spectrum&&['complete','spectrum'].includes(page)){
    const s=a.spectrum; const scale=Math.max(...s.lines.map(l=>l.weight));
    charts.unshift(<Chart key="spectrum" title={t('Input and transmitted photon spectrum','طيف الفوتونات الداخل والنافذ')} subtitle={t('Discrete lines; both spectra share the same input normalization','خطوط متقطعة؛ الطيفان بالتطبيع الابتدائي نفسه')} xLabel="Energy / MeV" yLabel="Photon weight / max input" series={[{name:t('Input','الداخل'),color:colors[1],points:s.lines.map(l=>({x:l.energyMeV,y:l.weight/scale}))},{name:t('Transmitted','النافذ'),color:colors[0],points:s.lines.map(l=>({x:l.energyMeV,y:l.outputWeight/scale}))}]} stems/>);
  }
  return <div className="charts-grid">{charts}</div>;
}
