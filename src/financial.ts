export type Mode = 'quick' | 'detailed';
export type Item = { id: string; stage: string; description: string; unit: string; quantity: number; price: number };
export type Extra = { id: string; description: string; value: number };
export type Data = { area: number; rate: number; reserve: number; land: number; extras: Extra[]; items: Item[] };
const safe=(n:number)=>Number.isFinite(n)?Math.max(0,n):0; const cent=(n:number)=>Math.round(safe(n)*100);
export const money=(n:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(safe(n));
export const itemTotal=(i:Item)=>Math.round(safe(i.quantity)*cent(i.price))/100;
export function calculate(data:Data,mode:Mode){const base=mode==='quick'?Math.round(safe(data.area)*cent(data.rate))/100:0;const services=mode==='detailed'?data.items.reduce((s,i)=>s+itemTotal(i),0):0;const extras=data.extras.reduce((s,e)=>s+safe(e.value),0);const subtotal=Math.round((base+services+extras)*100)/100;const reserve=Math.round(subtotal*Math.min(100,safe(data.reserve)))/100;const construction=Math.round((subtotal+reserve)*100)/100;return {base,services,extras,subtotal,reserve,construction,investment:construction+safe(data.land),perM2:data.area?construction/data.area:0};}
