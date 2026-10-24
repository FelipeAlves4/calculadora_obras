import { describe, expect, it } from 'vitest';
import { floorMaterials, wallMaterials, concreteMaterials, paintMaterials } from './materials';

describe('calculadoras de quantidades geométricas', () => {
  it('calcula piso com perda e arredonda caixas para cima', () => {
    expect(floorMaterials({area: 30, wastePercent: 10, boxCoverage: 2.2}).area).toBeCloseTo(33);
    expect(floorMaterials({area: 30, wastePercent: 10, boxCoverage: 2.2}).boxes).toBe(15);
    expect(floorMaterials({area: 30, wastePercent: 10, boxCoverage: 0}).boxes).toBe(0);
  });
  it('calcula peças de alvenaria a partir do módulo com junta e desconta vãos', () => {
    const r = wallMaterials({ length: 10, height: 3, openings: 3, blockLengthCm: 29, blockHeightCm: 19, jointCm: 1, wastePercent: 10 });
    expect(r.area).toBe(27);
    expect(r.pieces).toBe(495);
  });
  it('calcula volume geométrico de concreto e perdas sem presumir traço', () => {
    const r = concreteMaterials({ length: 8, width: 6, thicknessCm: 10, wastePercent: 5 });
    expect(r.volume).toBeCloseTo(4.8);
    expect(r.purchaseVolume).toBeCloseTo(5.04);
  });
  it('calcula volume de tinta via rendimento informado e número de demãos', () => {
    const r = paintMaterials({ area: 100, coats: 2, yieldPerLiter: 10, wastePercent: 10 });
    expect(r.liters).toBeCloseTo(22);
  });
  it('não gera negativos com entradas inválidas', () => {
    expect(wallMaterials({ length: 0, height: 2, openings: 30, blockLengthCm: 0, blockHeightCm: 0, jointCm: 0, wastePercent: 0 }).pieces).toBe(0);
    expect(concreteMaterials({ length: -2, width: 2, thicknessCm: 10, wastePercent: -1 }).purchaseVolume).toBe(0);
    expect(paintMaterials({area:10,coats:2,yieldPerLiter:0,wastePercent:0}).liters).toBe(0);
  });
});
