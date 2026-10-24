import {describe,it,expect} from 'vitest';
import { findMatchingReference, validatePricingReference, type PricingReference } from './pricingReferences';
const valid: PricingReference = {
  id:'REVISADO-1', workType:'casa',standard:'medio',uf:'SP',competence:'2026-06',
  publisher:'Fonte demonstrativa de teste',sourceType:'LEVANTAMENTO_LOCAL',
  sourceUrl:'https://example.org/arquivos/teste.pdf',sourceDocument:'Planilha teste',
  valuePerM2:3000,inclusionNotes:'Inclui mão de obra e materiais informados no teste',
  exclusionNotes:'Exclui terreno e aprovações', approval:'approved',reviewer:'Revisor de teste',
  reviewedAt:'2026-07-01'
};
describe('curadoria e compatibilidade de referências de custo',()=>{
 it('aceita o esquema de teste com todos os metadados',()=>{
   expect(validatePricingReference(valid)).toEqual([]);
 });
 it('não usa fonte de edifício ou galpão para casa e não usa estado incorreto',()=>{
   expect(findMatchingReference([valid],{workType:'galpao',standard:'medio',uf:'SP'})).toBeNull();
   expect(findMatchingReference([valid],{workType:'casa',standard:'medio',uf:'RJ'})).toBeNull();
 });
 it('impede rascunho ou fonte incompleta de virar preço de referência',()=>{
   expect(findMatchingReference([{...valid,approval:'draft'}],{workType:'casa',standard:'medio',uf:'SP'})).toBeNull();
   expect(validatePricingReference({...valid,sourceDocument:''}).length).toBeGreaterThan(0);
 });
 it('seleciona competência mais recente, sem consultar meses futuros',()=>{
   const second = {...valid,id:'REVISADO-2',competence:'2026-09',valuePerM2:4500};
   const result = findMatchingReference([valid,second],{workType:'casa',standard:'medio',uf:'SP'},'2026-08');
   expect(result?.competence).toBe('2026-06');
 });
});
