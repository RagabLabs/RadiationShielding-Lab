import { getMaterial } from './materials';
import type { DataSource, Dataset } from './types';
export function getDataset(id: string, source: DataSource = 'xcom'): Dataset {
  const dataset = getMaterial(id).datasets[source];
  if (!dataset?.points.length) throw new Error('The requested attenuation dataset is unavailable.');
  return dataset;
}
