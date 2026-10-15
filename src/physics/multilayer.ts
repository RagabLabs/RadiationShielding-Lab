import type { Layer, DataSource, EdgeSide } from './types';
import { lookup } from './interpolation';
import { linearAttenuation } from './linearAttenuation';
import { transmission, transmissionFromDepth } from './transmission';
import { finite } from './validation';
export function multilayer(layers: Layer[], energy: number, source: DataSource = 'xcom', side: EdgeSide = 'above') {
  if (!layers.length) throw new Error('At least one shield layer is required.');
  let depth = 0, position = 0;
  const profile = layers.map((layer, index) => {
    const coefficient = lookup(layer.materialId, energy, source, side);
    const mu = linearAttenuation(coefficient.value, layer.density);
    const layerResult = transmission(mu, layer.thicknessCm);
    depth = finite(depth + layerResult.opticalDepth, 'Total optical depth');
    position = finite(position + layer.thicknessCm, 'Total thickness');
    return { ...layer, index, mu, coefficient, depth: layerResult.opticalDepth, layerTransmission: layerResult,
      cumulativeTransmission: transmissionFromDepth(depth), positionCm: position };
  });
  return { layers: profile, total: transmissionFromDepth(depth), totalThicknessCm: position,
    warnings: [...new Set(profile.flatMap(p => p.coefficient.warnings))] };
}
