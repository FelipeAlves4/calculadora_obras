import { describe, it, expect } from 'vitest';
import { calculate, initialInput, switchPreset } from './calculation';
import { buildPhases, monthlyProvision } from './cashFlow';

describe('simulação ilustrativa do fluxo de caixa', () => {
  for (const type of ['casa','galpao'] as const) {
    it('preserva o total para '+type, () => {
      const input=switchPreset(initialInput(),type,'medio');
      input.addOns.muro={enabled:true,value:9000};
      const result=calculate(input);
      const phases=buildPhases(result,type);
      expect(phases.reduce((s,p)=>s+p.cost,0)).toBeCloseTo(result.total,4);
      const months=monthlyProvision(result,type,12);
      expect(months.reduce((s,p)=>s+p.cost,0)).toBeCloseTo(result.total,4);
      expect(months[11].cumulative).toBeCloseTo(result.total,4);
    });
  }
  it('distribui totais positivos com custo base zerado',()=> {
    const input=initialInput();input.area=0;input.addOns.piscina={enabled:true,value:10000};
    const res=calculate(input);
    expect(monthlyProvision(res,'casa',6).reduce((sum,row)=>sum+row.cost,0)).toBeCloseTo(res.total);
  });
});
