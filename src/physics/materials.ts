import database from '../data/materials.json';
import type { Material } from './types';
export const materials = database.materials as unknown as Material[];
export const databaseMetadata = database.metadata;
export function getMaterial(id: string): Material {
  const material = materials.find(m => m.id === id);
  if (!material) throw new Error(`Material data unavailable: ${id}`);
  return material;
}
