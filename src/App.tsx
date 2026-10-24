import { useMemo, useState } from 'react';
import {
  ArrowRight, BarChart3, Building2, Calculator, CheckCircle2, ClipboardList,
  Download, FileText, HardHat, Home, Info, MapPin, Maximize2, PhoneCall,
  RotateCcw, Ruler, ShieldAlert, SlidersHorizontal, TrendingUp, Wallet
} from 'lucide-react';
import {
  ADD_ON_CONFIG, DEFAULT_RATES, STATES, STANDARDS, calculate,
  compareStandards, formatMoney, formatNumber, initialInput, switchPreset,
  type AddOnId, type EstimateInput, type Standard, type WorkType
} from './calculation';

const phone = String(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');
const whatsappReady = /^\d{10,15}$/.test(phone);

function Field({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return <label className="field"><span>{title}</span>{children}{note ? <small>{note}</small> : null}</label>;
}
function SectionTitle({ number, title, description }: { number: string; title: string; description: string }) {
  return <div className="section-title"><div className="step-badge">{number}</div><div><h2>{title}</h2><p>{description}</p></div></div>;
}
function App() {
  const [form, setForm] = useState<EstimateInput>(initialInput);
  const [view, setView] = useState<'inputs' | 'results'>('inputs');
  const [details, setDetails] = useState(true);
  const result = useMemo(() => calculate(form), [form]);
  const comparisons = useMemo(() => compareStandards(form), [form]);
  const set = <K extends keyof EstimateInput>(key: K, value: EstimateInput[K]) => setForm(previous => ({ ...previous, [key]: value }));
  const updateType = (type: WorkType) => setForm(previous => switchPreset(previous, type, previous.standard));
  const updateStandard = (standard: Standard) => setForm(previous => switchPreset(previous, previous.type, standard));
  const updateAddOn = (id: AddOnId, property: 'enabled' | 'value', value: number | boolean) => setForm(previous => ({
    ...previous, addOns: { ...previous.addOns, [id]: { ...previous.addOns[id], [property]: value } }
  }));
  const filteredAddOns = ADD_ON_CONFIG.filter(item => item.types.includes(form.type));
  const printReport = () => window.print();
  const reset = () => {
    if (window.confirm('Deseja limpar os dados e restaurar o exemplo inicial?')) {
      setForm(initialInput()); setView('inputs');
    }
  };
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
      else await document.exitFullscreen?.();
    } catch { /* browser may block fullscreen */ }
  };
  const whatsappText = [
    'Olá! Gostaria de solicitar um orçamento de construção.',
    'Tipo: ' + (form.type === 'casa' ? 'Casa residencial' : 'Galpão/Barracão'),
    'Área: ' + formatNumber(form.area) + ' m²',
    'Padrão: ' + (STANDARDS.find(s => s.id === form.standard)?.title || form.standard),
    'Local: ' + (form.city || 'Não informado') + '/' + form.uf,
    'Estimativa demonstrativa: ' + formatMoney(result.total),
    'Gostaria de uma avaliação técnica personalizada.'
  ].join('\n');
  const openWhatsapp = () => {
    if (!whatsappReady) return;
    window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(whatsappText), '_blank', 'noopener,noreferrer');
  };

  return <div className="app">
    <header className="site-header no-print">
      <div className="shell header-inner">
        <div className="brand"><span className="brand-icon"><HardHat size={22}/></span><div><strong>CALCULADORA <em>DE OBRAS</em></strong><small>Planejamento inteligente de construção</small></div></div>
        <div className="header-actions">
          <button className="btn btn-ghost hide-mobile" onClick={toggleFullscreen}><Maximize2 size={16}/> Tela cheia</button>
          <button className="btn btn-ghost" onClick={reset}><RotateCcw size={16}/> Reiniciar</button>
          <button className="btn btn-gold" onClick={printReport}><Download size={16}/> Exportar PDF</button>
        </div>
      </div>
    </header>

    <main className="shell no-print">
      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-dot"/> ESTIMATIVA PRELIMINAR DE CONSTRUÇÃO</div>
        <h1>Transforme seu projeto em <span>números claros.</span></h1>
        <p>Simule diferentes cenários, visualize os custos por etapa e entenda o impacto de cada escolha, com a mesma clareza de um painel financeiro.</p>
        <div className="hero-tags"><span><CheckCircle2 size={14}/> Sem cadastro</span><span><BarChart3 size={14}/> Atualização em tempo real</span><span><FileText size={14}/> Relatório para impressão</span></div>
      </section>

      <div className="notice notice-top" role="note"><ShieldAlert size={19}/><div><strong>Modo demonstrativo — valores não oficiais.</strong> As tabelas de preços, percentuais por etapa e acréscimos são exemplos editáveis, sem validação CUB/SINAPI. Os resultados não são um orçamento técnico ou proposta da construtora.</div></div>

      <div className="mobile-view-switch" role="tablist" aria-label="Navegação do simulador">
        <button className={view === 'inputs' ? 'selected' : ''} onClick={() => setView('inputs')} role="tab" aria-selected={view === 'inputs'}><SlidersHorizontal size={16}/> Configurar obra</button>
        <button className={view === 'results' ? 'selected' : ''} onClick={() => setView('results')} role="tab" aria-selected={view === 'results'}><BarChart3 size={16}/> Resultados</button>
      </div>

      <div className="main-grid">
        <section className={view === 'inputs' ? 'form-column mobile-active' : 'form-column'} aria-label="Dados da obra">
          <div className="panel">
            <SectionTitle number="01" title="Tipo de construção" description="Escolha o cenário que vamos simular."/>
            <div className="type-grid">
              <button className={'type-card ' + (form.type === 'casa' ? 'is-active' : '')} onClick={() => updateType('casa')} aria-pressed={form.type === 'casa'}><Home size={27}/><strong>Casa residencial</strong><span>Moradia e construção residencial</span></button>
              <button className={'type-card ' + (form.type === 'galpao' ? 'is-active' : '')} onClick={() => updateType('galpao')} aria-pressed={form.type === 'galpao'}><Building2 size={27}/><strong>Galpão / Barracão</strong><span>Estrutura comercial ou industrial</span></button>
            </div>
            <div className="separator"/>
            <SectionTitle number="02" title="Características da obra" description="Defina o tamanho e o contexto do projeto."/>
            <div className="fields-grid">
              <Field title="Área construída (m²)" note="Apenas a área que será efetivamente construída"><div className="input-wrap"><Ruler size={17}/><input type="number" inputMode="decimal" min="0" max="1000000" value={form.area} onChange={e => set('area', Math.max(0, Number(e.target.value) || 0))} aria-label="Área construída"/><b>m²</b></div></Field>
              <Field title="Estado (UF)" note="Localização informativa; não altera os preços"><div className="input-wrap"><MapPin size={17}/><select value={form.uf} onChange={e => set('uf', e.target.value)} aria-label="Estado">{STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}</select></div></Field>
              <Field title="Cidade"><div className="input-wrap"><input type="text" value={form.city} maxLength={80} onChange={e => set('city', e.target.value)} placeholder="Ex.: Marília" aria-label="Cidade"/></div></Field>
              {form.type === 'casa' ? <Field title="Quantidade de pavimentos" note="Acréscimo demonstrativo de 2,5% por pavimento extra"><div className="input-wrap"><select value={form.floors} onChange={e => set('floors', Number(e.target.value))} aria-label="Pavimentos">{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'pavimento' : 'pavimentos'}</option>)}</select></div></Field> : <div className="context-note"><Building2 size={17}/><span>Para galpões, o dimensionamento estrutural específico deverá ser orçado separadamente por profissional habilitado.</span></div>}
            </div>
            <div className="separator"/>
            <SectionTitle number="03" title="Padrão da construção" description="Compare materiais, acabamentos e investimento."/>
            <div className="standards-grid">{STANDARDS.map(standard => <button key={standard.id} className={'standard-card ' + (form.standard === standard.id ? 'is-active' : '')} onClick={() => updateStandard(standard.id)} aria-pressed={form.standard === standard.id}><span className="standard-check">{form.standard === standard.id ? '●' : '○'}</span><strong>{standard.title}</strong><small>{standard.description}</small></button>)}</div>
            <div className="fields-grid mt-space">
              <Field title="Preço base de referência por m²" note="Editável. Valor inicial ilustrativo; não é uma cotação CUB ou SINAPI."><div className="input-wrap emphasis-input"><span>R$</span><input type="number" min="0" step="10" value={form.baseRate} onChange={e => set('baseRate', Math.max(0, Number(e.target.value) || 0))} aria-label="Preço base por metro quadrado"/><b>/ m²</b></div></Field>
              <div className="context-note"><Info size={18}/><span>Preço pré-preenchido para demonstração: {formatMoney(DEFAULT_RATES[form.type][form.standard])}/m². Troque pelo seu custo unitário documentado.</span></div>
            </div>
            <div className="separator"/>
            <SectionTitle number="04" title="Terreno e reservas" description="Simule acréscimos e a margem de imprevistos."/>
            <div className="fields-grid">
              <Field title="Condições do terreno" note="Fatores exemplificativos, não substituem sondagem"><div className="input-wrap"><select value={form.terrain} onChange={e => set('terrain', e.target.value as EstimateInput['terrain'])}><option value="regular">Plano / regular (0%)</option><option value="aclive">Ajustes moderados (+8%)</option><option value="complexo">Ajustes complexos (+18%)</option></select></div></Field>
              <Field title="Reserva para imprevistos (%)" note="Aplicada ao subtotal, inclusive adicionais"><div className="input-wrap"><input type="number" min="0" max="40" value={form.reservePercent} onChange={e => set('reservePercent', Math.max(0, Math.min(40, Number(e.target.value) || 0)))}/><b>%</b></div></Field>
            </div>
            <div className="separator"/>
            <SectionTitle number="05" title="Adicionais da construção" description="Inclua apenas itens que não estão no preço base por m²."/>
            <div className="addon-list">{filteredAddOns.map(extra => <div className={'addon ' + (form.addOns[extra.id].enabled ? 'addon-enabled' : '')} key={extra.id}>
              <label className="addon-main"><input type="checkbox" checked={form.addOns[extra.id].enabled} onChange={e => updateAddOn(extra.id, 'enabled', e.target.checked)}/><div><strong>{extra.title}</strong><small>{extra.description}</small></div></label>
              {form.addOns[extra.id].enabled && <div className="addon-cost"><span>Custo adicional estimado</span><div className="input-wrap"><span>R$</span><input type="number" min="0" step="100" value={form.addOns[extra.id].value} onChange={e => updateAddOn(extra.id, 'value', Math.max(0, Number(e.target.value) || 0))}/></div></div>}
            </div>)}</div>
          </div>
          <button className="btn btn-gold next-results" onClick={() => {setView('results'); window.scrollTo({top: 0, behavior:'smooth'});}}><Calculator size={18}/> Visualizar resultado <ArrowRight size={18}/></button>
        </section>

        <section className={view === 'results' ? 'results-column mobile-active' : 'results-column'} aria-label="Estimativa da obra">
          <div className="result-hero">
            <div className="result-head"><span><Wallet size={17}/> INVESTIMENTO TOTAL ESTIMADO</span><span className="result-status">SIMULAÇÃO</span></div>
            <div className="result-value">{formatMoney(result.total)}</div>
            <p>Projeção ilustrativa para {formatNumber(form.area)} m² de {form.type === 'casa' ? 'casa residencial' : 'galpão ou barracão'}.</p>
            <div className="result-per-meter"><span>Custo final estimado / m²</span><strong>{formatMoney(result.perSquareMeter)}</strong></div>
            <div className="result-glow"/>
          </div>

          <div className="metrics-grid">
            <div className="metric"><div className="metric-icon"><HardHat size={19}/></div><span>Construção base</span><strong>{formatMoney(result.construction)}</strong><small>Área × preço/m² × fatores</small></div>
            <div className="metric"><div className="metric-icon"><TrendingUp size={19}/></div><span>Adicionais</span><strong>{formatMoney(result.addOnsTotal)}</strong><small>Itens opcionais selecionados</small></div>
            <div className="metric"><div className="metric-icon"><ShieldAlert size={19}/></div><span>Reserva técnica</span><strong>{formatMoney(result.reserve)}</strong><small>{form.reservePercent}% sobre o subtotal</small></div>
          </div>

          <div className="panel result-panel">
            <div className="panel-heading"><div><span className="eyebrow">COMPOSIÇÃO DA ESTIMATIVA</span><h2>Custos por etapa</h2></div><BarChart3 size={21}/></div>
            <p className="small-description">Distribuição percentual ilustrativa da construção base; os adicionais e a reserva são apresentados separadamente.</p>
            <div className="stage-list">{result.stages.map(stage => <div className="stage-row" key={stage.id}>
              <div className="stage-label"><span>{stage.title}</span><strong>{formatMoney(stage.cost)}</strong></div>
              <div className="stage-track"><div style={{width: stage.percentage + '%'}}/></div>
              <span className="stage-percent">{stage.percentage}% da base</span>
            </div>)}</div>
            <div className="cost-footer"><div><span>Subtotal da obra e adicionais</span><strong>{formatMoney(result.subtotal)}</strong></div><div><span>Reserva ({form.reservePercent}%)</span><strong>{formatMoney(result.reserve)}</strong></div><div className="cost-total"><span>Total estimado</span><strong>{formatMoney(result.total)}</strong></div></div>
          </div>

          <div className="panel result-panel">
            <div className="panel-heading"><div><span className="eyebrow">ANÁLISE DE CENÁRIOS</span><h2>Compare os padrões</h2></div><SlidersHorizontal size={21}/></div>
            <p className="small-description">Mesma área, terreno e adicionais. O cenário selecionado respeita seu preço/m² personalizado; os demais usam exemplos pré-definidos.</p>
            <div className="compare-grid">{comparisons.map(item => <div key={item.id} className={'compare-card ' + (item.selected ? 'compare-selected' : '')}>
              <div className="compare-top"><span>{item.title}</span>{item.selected ? <b>ATUAL</b> : null}</div><strong>{formatMoney(item.result.total)}</strong><small>{formatMoney(item.result.perSquareMeter)} / m²</small>
            </div>)}</div>
          </div>

          <div className="panel result-panel methodology">
            <button className="methodology-toggle" onClick={() => setDetails(value => !value)} aria-expanded={details}><div><Info size={19}/><strong>Como calculamos esta estimativa?</strong></div><span>{details ? '−' : '+'}</span></button>
            {details ? <div className="methodology-body">
              <p><strong>Base:</strong> {formatNumber(form.area)} m² × {formatMoney(form.baseRate)} por m².</p>
              <p><strong>Terreno:</strong> fator demonstrativo {formatNumber(result.terrainFactor)}×. <strong>Pavimentos:</strong> fator {formatNumber(result.floorFactor)}×.</p>
              <p><strong>Etapas:</strong> custo base dividido em pesos hipotéticos específicos para {form.type === 'casa' ? 'residências' : 'galpões'}.</p>
              <p><strong>Adicionais:</strong> soma dos itens escolhidos. <strong>Reserva:</strong> {form.reservePercent}% do subtotal.</p>
              <div className="info-note"><ShieldAlert size={16}/> Não considera automaticamente projetos, licenças, impostos, BDI, tributos, fretes, sondagem, condições estruturais, quantidades físicas de materiais ou diferenças regionais. Adicione valores devidos e obtenha orçamento profissional.</div>
            </div> : null}
          </div>

          <div className="cta-panel"><div><span>PRÓXIMO PASSO</span><h2>Seu projeto merece um orçamento real.</h2><p>Use esta simulação como ponto de partida e solicite uma análise personalizada de uma construtora.</p></div>
            <div className="cta-actions"><button className="btn btn-gold" onClick={printReport}><Download size={17}/> Salvar relatório em PDF</button>
              {whatsappReady ? <button className="btn btn-outline" onClick={openWhatsapp}><PhoneCall size={17}/> Solicitar orçamento <ArrowRight size={16}/></button> : <small>Contato por WhatsApp disponível após configurar o número comercial.</small>}
            </div>
          </div>
        </section>
      </div>
      <footer className="footer"><span>Calculadora de Obras — simulação preliminar</span><span>Projeto demonstrativo · Valores sem validação de mercado</span></footer>
    </main>

    <article className="print-only">
      <header><h1>Relatório de estimativa de obra</h1><p>SIMULAÇÃO DEMONSTRATIVA — NÃO É ORÇAMENTO TÉCNICO</p></header>
      <section className="print-summary"><div><span>Tipo de construção</span><strong>{form.type === 'casa' ? 'Casa residencial' : 'Galpão / Barracão'}</strong></div><div><span>Área</span><strong>{formatNumber(form.area)} m²</strong></div><div><span>Local</span><strong>{(form.city || 'Não informado') + ' / ' + form.uf}</strong></div><div><span>Padrão</span><strong>{STANDARDS.find(s => s.id === form.standard)?.title}</strong></div><div><span>Preço base/m² (informado)</span><strong>{formatMoney(form.baseRate)}</strong></div><div><span>Terreno</span><strong>{form.terrain}</strong></div></section>
      <div className="print-highlight"><small>Total estimado, incluindo adicionais e reserva</small><strong>{formatMoney(result.total)}</strong><span>{formatMoney(result.perSquareMeter)} por m²</span></div>
      <h2>Custos por etapa</h2><table><thead><tr><th>Etapa</th><th>Participação da base</th><th>Custo</th></tr></thead><tbody>{result.stages.map(s => <tr key={s.id}><td>{s.title}</td><td>{s.percentage}%</td><td>{formatMoney(s.cost)}</td></tr>)}</tbody></table>
      <h2>Adicionais</h2><table><thead><tr><th>Descrição</th><th>Custo</th></tr></thead><tbody>{result.selectedAddOns.length ? result.selectedAddOns.map(s => <tr key={s.id}><td>{s.title}</td><td>{formatMoney(s.cost)}</td></tr>) : <tr><td>Nenhum adicional selecionado</td><td>{formatMoney(0)}</td></tr>}</tbody></table>
      <table className="print-totals"><tbody><tr><td>Construção base</td><td>{formatMoney(result.construction)}</td></tr><tr><td>Adicionais</td><td>{formatMoney(result.addOnsTotal)}</td></tr><tr><td>Reserva ({form.reservePercent}%)</td><td>{formatMoney(result.reserve)}</td></tr><tr><td><strong>Total</strong></td><td><strong>{formatMoney(result.total)}</strong></td></tr></tbody></table>
      <p className="print-disclaimer">Valores e percentuais fictícios, sem atualização regional. Esta é uma simulação exploratória e não substitui projeto, análise técnica, orçamento de engenharia ou cotação formal. O usuário é responsável por conferir os valores preenchidos. Relatório gerado em {new Date().toLocaleDateString('pt-BR')}.</p>
    </article>
  </div>;
}
export default App;
