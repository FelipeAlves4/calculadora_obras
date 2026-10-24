export type WorkType = 'casa' | 'galpao';
export type Standard = 'economico' | 'medio' | 'alto';
export type Terrain = 'regular' | 'aclive' | 'complexo';

export type AddOnId = 'garagem' | 'piscina' | 'gourmet' | 'muro' | 'projetos' | 'doca' | 'escritorio' | 'piso' | 'ponte';
export interface AddOnValue { enabled: boolean; value: number }
export interface EstimateInput {
  type: WorkType;
  standard: Standard;
  area: number;
  floors: number;
  terrain: Terrain;
  uf: string;
  city: string;
  baseRate: number;
  reservePercent: number;
  landCost: number;
  budgetAvailable: number;
  priceSourceName: string;
  priceSourceCompetence: string;
  priceSourceUrl: string;
  addOns: Record<AddOnId, AddOnValue>;
}
export interface Stage { id: string; title: string; percentage: number; cost: number }
export interface EstimateResult {
  construction: number;
  addOnsTotal: number;
  subtotal: number;
  reserve: number;
  total: number;
  investmentTotal: number;
  perSquareMeter: number;
  terrainFactor: number;
  floorFactor: number;
  stages: Stage[];
  selectedAddOns: { id: AddOnId; title: string; cost: number }[];
}

export const DEFAULT_RATES: Record<WorkType, Record<Standard, number>> = {
  // DADOS FICTÍCIOS DE INTERFACE. NÃO SÃO CUB, SINAPI OU PREÇOS DE MERCADO.
  casa: { economico: 2300, medio: 3100, alto: 4500 },
  galpao: { economico: 1700, medio: 2400, alto: 3400 },
};
export const STANDARDS: { id: Standard; title: string; description: string }[] = [
  { id: 'economico', title: 'Econômico', description: 'Soluções e acabamentos essenciais' },
  { id: 'medio', title: 'Intermediário', description: 'Equilíbrio entre investimento e conforto' },
  { id: 'alto', title: 'Alto padrão', description: 'Materiais e soluções especiais' },
];
export const STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

export const ADD_ON_CONFIG: { id: AddOnId; title: string; description: string; types: WorkType[]; example: number }[] = [
  { id: 'garagem', title: 'Garagem adicional', description: 'Valor informado separadamente', types: ['casa'], example: 18000 },
  { id: 'piscina', title: 'Piscina', description: 'Previsão opcional, sujeita ao projeto', types: ['casa'], example: 80000 },
  { id: 'gourmet', title: 'Área gourmet', description: 'Previsão adicional se fora da área base', types: ['casa'], example: 35000 },
  { id: 'muro', title: 'Muro e portão', description: 'Previsão conforme perímetro real', types: ['casa','galpao'], example: 16000 },
  { id: 'projetos', title: 'Projetos e aprovações', description: 'Despesas externas incluídas manualmente', types: ['casa','galpao'], example: 12000 },
  { id: 'doca', title: 'Doca de carga', description: 'Investimento adicional estimativo', types: ['galpao'], example: 55000 },
  { id: 'escritorio', title: 'Escritório interno', description: 'Se não incorporado na área base', types: ['galpao'], example: 60000 },
  { id: 'piso', title: 'Piso de alta resistência', description: 'Adicional de especificação especial', types: ['galpao'], example: 75000 },
  { id: 'ponte', title: 'Previsão de ponte rolante', description: 'Requer projeto estrutural específico', types: ['galpao'], example: 95000 },
];

const HOUSE_WEIGHTS = [
  ['fundacao', 'Fundação e preparação', 12],
  ['estrutura', 'Estrutura', 16],
  ['alvenaria', 'Alvenaria e vedações', 12],
  ['cobertura', 'Cobertura', 10],
  ['hidraulica', 'Hidráulica e sanitária', 10],
  ['eletrica', 'Instalações elétricas', 7],
  ['revestimentos', 'Revestimentos e pintura', 16],
  ['acabamentos', 'Esquadrias e acabamentos', 12],
  ['outros', 'Serviços complementares', 5],
] as const;
const WAREHOUSE_WEIGHTS = [
  ['fundacao', 'Fundação e preparação', 19],
  ['estrutura', 'Estrutura principal', 27],
  ['cobertura', 'Cobertura industrial', 18],
  ['vedacoes', 'Fechamentos e vedações', 12],
  ['piso', 'Pavimentação e piso', 15],
  ['instalacoes', 'Instalações básicas', 6],
  ['outros', 'Serviços complementares', 3],
] as const;

const safeNumber = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0;
export const formatMoney = (value: number) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
}).format(Number.isFinite(value) ? value : 0);
export const formatNumber = (value: number) => new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
}).format(Number.isFinite(value) ? value : 0);

export function initialInput(): EstimateInput {
  return {
    type: 'casa', standard: 'medio', area: 120, floors: 1, terrain: 'regular', uf: 'SP', city: '',
    baseRate: DEFAULT_RATES.casa.medio, reservePercent: 10, landCost: 0, budgetAvailable: 0,
    priceSourceName: '', priceSourceCompetence: '', priceSourceUrl: '',
    addOns: Object.fromEntries(ADD_ON_CONFIG.map((item) => [item.id, { enabled: false, value: item.example }])) as EstimateInput['addOns'],
  };
}

export function switchPreset(input: EstimateInput, type: WorkType, standard: Standard): EstimateInput {
  return { ...input, type, standard, priceSourceName: '', priceSourceCompetence: '', priceSourceUrl: '', baseRate: DEFAULT_RATES[type][standard], floors: type === 'galpao' ? 1 : input.floors };
}

export function calculate(input: EstimateInput): EstimateResult {
  const area = safeNumber(input.area);
  const rate = safeNumber(input.baseRate);
  const terrainFactor = ({ regular: 1, aclive: 1.08, complexo: 1.18 } as const)[input.terrain] ?? 1;
  const floorFactor = input.type === 'casa' ? (1 + Math.max(0, Math.min(5, Math.floor(safeNumber(input.floors))) - 1) * 0.025) : 1;
  const construction = area * rate * terrainFactor * floorFactor;
  const stageWeights = input.type === 'casa' ? HOUSE_WEIGHTS : WAREHOUSE_WEIGHTS;
  const stages = stageWeights.map(([id, title, percentage]) => ({
    id, title, percentage, cost: construction * percentage / 100,
  }));
  const selectedAddOns = ADD_ON_CONFIG.filter((item) => item.types.includes(input.type) && input.addOns[item.id]?.enabled)
    .map((item) => ({ id: item.id, title: item.title, cost: safeNumber(input.addOns[item.id].value) }));
  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.cost, 0);
  const subtotal = construction + addOnsTotal;
  const reserve = subtotal * Math.min(40, safeNumber(input.reservePercent)) / 100;
  const total = subtotal + reserve;
  const investmentTotal = total + safeNumber(input.landCost);
  return { construction, addOnsTotal, subtotal, reserve, total, investmentTotal, perSquareMeter: area > 0 ? total / area : 0, terrainFactor, floorFactor, stages, selectedAddOns };
}

export function compareStandards(input: EstimateInput) {
  return STANDARDS.map((standard) => {
    // Os cenários alternativos mantêm a relação com a base personalizada informada pelo visitante.
    const ratio = DEFAULT_RATES[input.type][standard.id] / DEFAULT_RATES[input.type][input.standard];
    const next = standard.id === input.standard ? input : { ...input, standard: standard.id, baseRate: safeNumber(input.baseRate) * ratio };
    return { ...standard, result: calculate(next), selected: standard.id === input.standard };
  });
}
