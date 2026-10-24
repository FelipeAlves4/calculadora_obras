import type { EstimateResult, WorkType } from './calculation';

export interface Phase { name: string; shareTime: number; cost: number }
export interface MonthProvision { month: number; cost: number; cumulative: number }

export function buildPhases(result: EstimateResult, type: WorkType): Phase[] {
  const defs: { name:string; shareTime:number; stages:string[] }[] = type === 'casa' ? [
    { name:'Fundação e estrutura', shareTime:.25, stages:['fundacao','estrutura'] },
    { name:'Alvenaria e cobertura', shareTime:.25, stages:['alvenaria','cobertura'] },
    { name:'Instalações', shareTime:.20, stages:['hidraulica','eletrica'] },
    { name:'Acabamentos e entrega', shareTime:.30, stages:['revestimentos','acabamentos','outros'] },
  ] : [
    { name:'Fundação e estrutura', shareTime:.35, stages:['fundacao','estrutura'] },
    { name:'Cobertura e fechamento', shareTime:.30, stages:['cobertura','vedacoes'] },
    { name:'Piso e instalações', shareTime:.35, stages:['piso','instalacoes','outros'] },
  ];
  const multiplier = result.construction > 0 ? result.total / result.construction : 0;
  if (result.construction <= 0) {
    // Distribuição uniforme de adicionais e reserva quando a construção base foi zerada.
    return defs.map(item => ({ name:item.name, shareTime:item.shareTime, cost:result.total * item.shareTime }));
  }
  return defs.map(item => ({ name:item.name, shareTime:item.shareTime,
    cost:result.stages.filter(s => item.stages.includes(s.id)).reduce((sum,s) => sum+s.cost,0)*multiplier }));
}

export function monthlyProvision(result:EstimateResult,type:WorkType,months:number):MonthProvision[] {
  const n = Math.max(1,Math.min(60,Math.floor(Number.isFinite(months)?months:1)));
  const phases = buildPhases(result,type);
  const buckets = Array.from({length:n},(_,i)=>({ month:i+1, cost:0, cumulative:0 }));
  let start = 0;
  for (const phase of phases) {
    const end = start + phase.shareTime*n;
    const width = end-start;
    if(width > 0) for(let month=0;month<n;month++) {
      const overlap=Math.max(0,Math.min(month+1,end)-Math.max(month,start));
      buckets[month].cost += phase.cost * overlap/width;
    }
    start=end;
  }
  let cumulative=0;
  return buckets.map(item => ({ ...item, cumulative: (cumulative += item.cost) }));
}
