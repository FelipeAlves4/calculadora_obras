import { useState } from 'react';
import { Blocks, Calculator, Droplets, Paintbrush, Ruler, Square, Info } from 'lucide-react';
import { floorMaterials, wallMaterials, concreteMaterials, paintMaterials } from './materials';
import { formatNumber } from './calculation';

type ToolName = 'piso' | 'tijolos' | 'concreto' | 'tinta';
const tools = [
  { id: 'piso', name: 'Pisos', icon: Square, hint: 'Área de revestimento e caixas' },
  { id: 'tijolos', name: 'Tijolos', icon: Blocks, hint: 'Quantidade por área de parede' },
  { id: 'concreto', name: 'Concreto', icon: Ruler, hint: 'Volume de uma peça' },
  { id: 'tinta', name: 'Pintura', icon: Paintbrush, hint: 'Litros por rendimento informado' },
] as const;
function Field({ title, value, onChange, suffix, min = 0, max = 100000 }: { title: string; value: number; onChange: (value: number) => void; suffix: string; min?:number; max?:number }) {
  return <label className="material-field"><span>{title}</span><div><input type="number" min={min} max={max} step="any" value={value} onChange={e => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))}/><strong>{suffix}</strong></div></label>;
}

export function MaterialTools() {
  const [tool, setTool] = useState<ToolName>('piso');
  const [floor, setFloor] = useState({ area: 60, wastePercent: 10, boxCoverage: 2.2 });
  const [wall, setWall] = useState({ length: 10, height: 2.8, openings: 3, blockLengthCm: 29, blockHeightCm: 19, jointCm: 1, wastePercent: 10 });
  const [concrete, setConcrete] = useState({ length: 8, width: 6, thicknessCm: 10, wastePercent: 5 });
  const [paint, setPaint] = useState({ area: 100, coats: 2, yieldPerLiter: 10, wastePercent: 10 });
  const floorResult = floorMaterials(floor);
  const wallResult = wallMaterials(wall);
  const concreteResult = concreteMaterials(concrete);
  const paintResult = paintMaterials(paint);
  const numeric = (n: number) => formatNumber(n);
  return <section className="material-section no-print" id="materiais">
    <div className="materials-heading"><div><div className="eyebrow"><Calculator size={15}/> MINI CALCULADORAS</div><h2>Planeje os materiais da sua obra.</h2><p>Ferramentas independentes com fórmulas geométricas, como nas referências do VaiVolta e Calcula Obra. Preencha medidas reais, não apenas a área construída.</p></div><div className="materials-badge"><Droplets size={15}/> Cálculos de quantidade</div></div>
    <div className="materials-layout">
      <div className="materials-tabs" role="tablist" aria-label="Tipos de calculadora">
        {tools.map(t => { const Icon = t.icon; return <button key={t.id} type="button" className={tool === t.id ? 'active' : ''} onClick={() => setTool(t.id)} role="tab" aria-selected={tool === t.id}>
          <Icon size={19}/><div><strong>{t.name}</strong><small>{t.hint}</small></div></button>; })}
      </div>
      <div className="materials-content">
        {tool === 'piso' && <><h3>Quantos pisos vou comprar?</h3><p>Estima área com sobra e quantidade de caixas, usando o rendimento declarado na embalagem.</p><div className="materials-fields">
          <Field title="Área do piso" suffix="m²" value={floor.area} onChange={v => setFloor(p => ({...p,area:v}))}/>
          <Field title="Perda no recorte" suffix="%" max={100} value={floor.wastePercent} onChange={v => setFloor(p => ({...p,wastePercent:v}))}/>
          <Field title="Cobertura por caixa" suffix="m²/caixa" min={0} value={floor.boxCoverage} onChange={v => setFloor(p => ({...p,boxCoverage:v}))}/>
        </div><div className="materials-result"><div><small>Comprar aproximadamente</small><strong>{numeric(floorResult.area)} m²</strong></div><div><small>Caixas completas</small><strong>{floor.boxCoverage > 0 ? floorResult.boxes : '—'} {floor.boxCoverage > 0 ? 'caixas' : ''}</strong></div></div><span className="formula">Fórmula: área × (1 + perda%) ÷ cobertura por caixa, arredondada para cima.</span></>}
        {tool === 'tijolos' && <><h3>Quantos tijolos / blocos vou precisar?</h3><p>Conta módulos da parede, considerando a junta de argamassa e os vãos de portas e janelas.</p><div className="materials-fields">
          <Field title="Comprimento total" suffix="m" value={wall.length} onChange={v => setWall(p => ({...p,length:v}))}/>
          <Field title="Altura das paredes" suffix="m" value={wall.height} onChange={v => setWall(p => ({...p,height:v}))}/>
          <Field title="Área das aberturas" suffix="m²" value={wall.openings} onChange={v => setWall(p => ({...p,openings:v}))}/>
          <Field title="Comprimento do bloco" suffix="cm" value={wall.blockLengthCm} onChange={v => setWall(p => ({...p,blockLengthCm:v}))}/>
          <Field title="Altura do bloco" suffix="cm" value={wall.blockHeightCm} onChange={v => setWall(p => ({...p,blockHeightCm:v}))}/>
          <Field title="Espessura da junta" suffix="cm" value={wall.jointCm} onChange={v => setWall(p => ({...p,jointCm:v}))}/>
          <Field title="Perda" suffix="%" max={100} value={wall.wastePercent} onChange={v => setWall(p => ({...p,wastePercent:v}))}/>
        </div><div className="materials-result"><div><small>Área líquida</small><strong>{numeric(wallResult.area)} m²</strong></div><div><small>Blocos / peças</small><strong>{numeric(wallResult.pieces)} peças</strong></div></div><span className="formula">Fórmula: (área total − vãos) ÷ área do módulo (bloco + junta) × fator de perdas. Confirme dimensões e paginação reais.</span></>}
        {tool === 'concreto' && <><h3>Volume de concreto da peça</h3><p>Ideal para uma laje, radier ou base retangular. A dosagem de cimento depende do projeto e do traço — não é estimada aqui.</p><div className="materials-fields">
          <Field title="Comprimento" suffix="m" value={concrete.length} onChange={v => setConcrete(p => ({...p,length:v}))}/>
          <Field title="Largura" suffix="m" value={concrete.width} onChange={v => setConcrete(p => ({...p,width:v}))}/>
          <Field title="Espessura" suffix="cm" value={concrete.thicknessCm} onChange={v => setConcrete(p => ({...p,thicknessCm:v}))}/>
          <Field title="Perda" suffix="%" max={100} value={concrete.wastePercent} onChange={v => setConcrete(p => ({...p,wastePercent:v}))}/>
        </div><div className="materials-result"><div><small>Volume geométrico</small><strong>{numeric(concreteResult.volume)} m³</strong></div><div><small>Volume com margem</small><strong>{numeric(concreteResult.purchaseVolume)} m³</strong></div></div><span className="formula">Fórmula: comprimento × largura × espessura em metros; aplicação da margem de perdas informada.</span></>}
        {tool === 'tinta' && <><h3>Quantos litros de tinta?</h3><p>Informe a área líquida a pintar e o rendimento real por demão indicado pelo fabricante.</p><div className="materials-fields">
          <Field title="Área a pintar" suffix="m²" value={paint.area} onChange={v => setPaint(p => ({...p,area:v}))}/>
          <Field title="Número de demãos" suffix="demãos" max={10} value={paint.coats} onChange={v => setPaint(p => ({...p,coats:v}))}/>
          <Field title="Rendimento por demão" suffix="m²/L" value={paint.yieldPerLiter} onChange={v => setPaint(p => ({...p,yieldPerLiter:v}))}/>
          <Field title="Perda adicional" suffix="%" max={100} value={paint.wastePercent} onChange={v => setPaint(p => ({...p,wastePercent:v}))}/>
        </div><div className="materials-result"><div><small>Consumo estimado</small><strong>{paint.yieldPerLiter > 0 ? numeric(paintResult.liters) + ' litros' : '—'}</strong></div></div><span className="formula">Fórmula: área ÷ rendimento por demão × demãos × fator de perdas. Confira a unidade do rendimento no rótulo.</span></>}
        <div className="materials-warning"><Info size={16}/><span>Quantitativos preliminares: não incluem descontos não informados, geometria complexa, perdas especiais ou especificações técnicas. <strong>Não são adicionados automaticamente ao custo da obra</strong>, evitando cobrança em duplicidade.</span></div>
      </div>
    </div>
  </section>;
}
