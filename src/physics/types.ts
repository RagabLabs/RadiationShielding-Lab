export type DataSource = 'xcom' | 'srd126';
export type EdgeSide = 'below' | 'above';
export interface Composition { z: number; symbol: string; weightFraction: number }
export interface AttenuationPoint {
  energyMeV: number; total: number; energyAbsorption?: number; edge?: string; side?: EdgeSide;
  coherent?: number; incoherent?: number; photoelectric?: number; pairNuclear?: number; pairElectron?: number;
}
export interface Dataset {
  source: DataSource; sourceUrl: string; version: string; retrievalDate: string;
  rangeMeV: [number, number]; units: string; points: AttenuationPoint[]; rawFile: string; sha256: string;
  request?: Record<string, string>; status: string;
}
export interface Material {
  id: string; name: string; nameAr: string; symbol: string; category: string;
  density: number; densitySource: string; densityNote: string; composition: Composition[];
  compositionSource: string; datasets: Record<DataSource, Dataset>;
}
export interface Lookup {
  value: number; energyAbsorption?: number; energyMeV: number; source: DataSource; sourceUrl: string;
  version: string; method: 'exact tabulated' | 'segmented log-log';
  bracketMeV: [number, number]; side?: EdgeSide; warnings: string[];
}
export interface Layer { materialId: string; thicknessCm: number; density: number }
export interface SpectrumLine { energyMeV: number; weight: number }
