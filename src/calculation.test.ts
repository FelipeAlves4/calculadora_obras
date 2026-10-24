import { describe, expect, it } from 'vitest';
import { ADD_ON_CONFIG, calculate, compareStandards, initialInput, switchPreset } from './calculation';

describe('simulador', () => {
  it('soma as etapas ao custo base e adiciona reserva ao subtotal', () => {
    const input = initialInput();
    const result = calculate(input);
    expect(result.construction).toBe(120 * 3100);
    expect(result.stages.reduce((sum, stage) => sum + stage.cost, 0)).toBeCloseTo(result.construction, 5);
    expect(result.reserve).toBeCloseTo(37200);
    expect(result.total).toBeCloseTo(409200);
  });

  it('não duplica adicionais não selecionados e respeita seleção por tipologia', () => {
    const input = initialInput();
    input.addOns.piscina = { enabled: true, value: 100000 };
    const house = calculate(input);
    expect(house.addOnsTotal).toBe(100000);
    const industrial = calculate(switchPreset(input, 'galpao', 'medio'));
    expect(industrial.addOnsTotal).toBe(0);
    expect(industrial.stages.reduce((total, item) => total + item.percentage, 0)).toBe(100);
  });

  it('permite valores zero sem dividir por zero', () => {
    const input = initialInput();
    input.area = 0;
    input.baseRate = Number.NaN;
    const result = calculate(input);
    expect(result.total).toBe(0);
    expect(result.perSquareMeter).toBe(0);
  });

  it('separa o terreno do custo por metro quadrado de construção', () => {
    const input = initialInput();
    input.landCost = 150000;
    const result = calculate(input);
    expect(result.investmentTotal).toBeCloseTo(result.total + 150000);
    expect(result.perSquareMeter).toBeCloseTo(result.total / 120);
    expect(result.stages.reduce((sum, stage) => sum + stage.cost, 0)).toBeCloseTo(result.construction);
  });

  it('escala os outros padrões a partir do custo personalizado', () => {
    const input = initialInput();
    input.baseRate = 4000;
    const comparison = compareStandards(input);
    const economic = comparison.find(s => s.id === 'economico')!;
    const high = comparison.find(s => s.id === 'alto')!;
    expect(economic.result.construction).toBeCloseTo(120 * 4000 * (2300 / 3100), 4);
    expect(high.result.construction).toBeCloseTo(120 * 4000 * (4500 / 3100), 4);
  });

  it('compara os padrões e preserva um preço editado no padrão selecionado', () => {
    const input = initialInput();
    input.baseRate = 4000;
    const scenarios = compareStandards(input);
    expect(scenarios).toHaveLength(3);
    expect(scenarios.find(s => s.selected)?.result.construction).toBe(480000);
    expect(scenarios[0].result.total).toBeLessThan(scenarios[2].result.total);
    expect(ADD_ON_CONFIG.length).toBeGreaterThan(5);
  });
});
