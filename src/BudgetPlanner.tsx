import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CalendarClock, Info } from 'lucide-react';
import { formatMoney, type EstimateResult, type WorkType } from './calculation';
import { buildPhases, monthlyProvision } from './cashFlow';
export function BudgetPlanner({result,type}:{result:EstimateResult;type:WorkType}) {
  const [months,setMonths]=useState(12);
  const plan=useMemo(()=>monthlyProvision(result,type,months),[result,type,months]);
  const phases=useMemo(()=>buildPhases(result,type),[result,type]);
  const chartData=plan.map(row=>({name:'M'+row.month,valor:Math.round(row.cost)}));
  return <div className="panel result-panel budget-planner">
    <div className="panel-heading"><div><span className="eyebrow">PLANEJAMENTO FINANCEIRO</span><h2>Previsão de desembolso</h2></div><CalendarClock size={22}/></div>
    <p className="small-description">Distribuição <strong>ilustrativa</strong> do orçamento conforme uma sequência hipotética de etapas. O número de meses é informado por você, não é uma previsão técnica de prazo.</p>
    <div className="months-bar"><label htmlFor="construction-months">Horizonte de planejamento</label><select id="construction-months" value={months} onChange={e=>setMonths(Number(e.target.value))}>{[3,6,9,12,15,18,24,30,36].map(n=><option key={n} value={n}>{n} meses</option>)}</select></div>
    <div className="phase-summary">{phases.map(p=><div key={p.name}><span>{p.name}</span><strong>{formatMoney(p.cost)}</strong></div>)}</div>
    <div className="budget-chart" role="img" aria-label="Gráfico com estimativa ilustrativa de desembolso por mês">
      <ResponsiveContainer width="100%" height={210}><BarChart data={chartData} margin={{left:-18,right:0,top:8,bottom:2}}>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,.09)" strokeDasharray="3 3"/>
        <XAxis dataKey="name" tick={{fill:'#96aec2',fontSize:10}} interval={months>15?2:0}/>
        <YAxis tick={{fill:'#96aec2',fontSize:10}} tickFormatter={v=>(v/1000).toFixed(0)+'k'}/>
        <Tooltip formatter={(v:number|string)=>formatMoney(Number(v))} contentStyle={{background:'#081929',border:'1px solid #5b523c',borderRadius:8,color:'#fff'}} itemStyle={{color:'#efcc83'}}/>
        <Bar dataKey="valor" name="Estimativa mensal" fill="#d0a554" radius={[3,3,0,0]}/>
      </BarChart></ResponsiveContainer>
    </div>
    <div className="budget-footer"><span>Provisão média mensal</span><strong>{formatMoney(months>0?result.total/months:0)}</strong></div>
    <div className="materials-warning"><Info size={16}/><span>As fases e durações são hipóteses didáticas. Custos reais dependem de projeto, contratos, medições, produtividade e cronograma de obra. Terreno não foi distribuído nas fases.</span></div>
  </div>;
}
