import { useId } from 'react';
interface Props { label:string; value:string; onChange:(v:string)=>void; unit?:string; units?:string[]; onUnit?:(u:string)=>void; unitLabel?:string; hint?:string; min?:number }
export function Field({label,value,onChange,unit,units,onUnit,unitLabel,hint,min}:Props) {
 const id=useId(); return <div className="field"><label htmlFor={id}>{label}</label><div className="input-wrap"><input id={id} type="number" step="any" min={min} value={value} onChange={e=>onChange(e.target.value)} autoComplete="off"/>{units&&onUnit?<select aria-label={unitLabel||`${label} unit`} value={unit} onChange={e=>onUnit(e.target.value)}>{units.map(u=><option key={u}>{u}</option>)}</select>:unit?<span>{unit}</span>:null}</div>{hint&&<small>{hint}</small>}</div>;
}
