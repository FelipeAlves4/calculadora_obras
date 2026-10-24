export interface FloorInputs { area: number; wastePercent: number; boxCoverage: number }
export interface WallInputs { length: number; height: number; openings: number; blockLengthCm: number; blockHeightCm: number; jointCm: number; wastePercent: number }
export interface ConcreteInputs { length: number; width: number; thicknessCm: number; wastePercent: number }
export interface PaintInputs { area: number; coats: number; yieldPerLiter: number; wastePercent: number }

const positive = (n: number) => Number.isFinite(n) ? Math.max(0, n) : 0;
const waste = (n: number) => 1 + Math.min(100, positive(n)) / 100;
export function floorMaterials(data: FloorInputs) {
  const purchaseArea = positive(data.area) * waste(data.wastePercent);
  const boxCoverage = positive(data.boxCoverage);
  return { area: purchaseArea, boxes: boxCoverage > 0 ? Math.ceil(purchaseArea / boxCoverage) : 0 };
}
export function wallMaterials(data: WallInputs) {
  const netArea = Math.max(0, positive(data.length) * positive(data.height) - positive(data.openings));
  const moduleArea = ((positive(data.blockLengthCm) + positive(data.jointCm)) / 100)
    * ((positive(data.blockHeightCm) + positive(data.jointCm)) / 100);
  return { area: netArea, pieces: moduleArea > 0 ? Math.ceil(netArea / moduleArea * waste(data.wastePercent) - 1e-9) : 0 };
}
export function concreteMaterials(data: ConcreteInputs) {
  const volume = positive(data.length) * positive(data.width) * positive(data.thicknessCm) / 100;
  return { volume, purchaseVolume: volume * waste(data.wastePercent) };
}
export function paintMaterials(data: PaintInputs) {
  const litersPerCoat = positive(data.yieldPerLiter) > 0 ? positive(data.area) / positive(data.yieldPerLiter) : 0;
  return { liters: litersPerCoat * positive(data.coats) * waste(data.wastePercent) };
}
