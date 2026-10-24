import type { Standard, WorkType } from './calculation';

/**
 * Interface de curadoria de preços regionais. Não contém preços publicados ou certificados.
 * Inserções futuras exigem revisão de um profissional habilitado, fonte e delimitação de escopo.
 */
export interface PricingReference {
  id: string;
  workType: WorkType;
  standard: Standard;
  uf: string;
  competence: string; // AAAA-MM
  publisher: string;
  sourceType: 'CUB_COMPATIVEL' | 'SINAPI_ORCAMENTO_COMPOSTO' | 'LEVANTAMENTO_LOCAL';
  sourceUrl: string;
  sourceDocument: string;
  valuePerM2: number;
  inclusionNotes: string;
  exclusionNotes: string;
  approval: 'draft' | 'approved';
  reviewer: string;
  reviewedAt: string; // AAAA-MM-DD
}

/**
 * Intencionalmente vazio: não há base de CUB/SINAPI licenciada, auditada e
 * compatível com as duas tipologias implementadas. Nunca carregar exemplos
 * fictícios aqui como se fossem oficiais.
 */
export const APPROVED_PRICING_REFERENCES: PricingReference[] = [];

export function validatePricingReference(record: PricingReference): string[] {
  const problems: string[] = [];
  if (!record.id.trim()) problems.push('Identificador ausente');
  if (!['casa','galpao'].includes(record.workType)) problems.push('Tipologia inválida');
  if (!['economico','medio','alto'].includes(record.standard)) problems.push('Padrão inválido');
  if (!/^[A-Z]{2}$/.test(record.uf)) problems.push('UF inválida');
  if (!/^20\d{2}-(0[1-9]|1[0-2])$/.test(record.competence)) problems.push('Competência inválida');
  if (!record.publisher.trim()) problems.push('Publicador ausente');
  if (!record.sourceDocument.trim()) problems.push('Documento de origem ausente');
  if (!record.inclusionNotes.trim() || !record.exclusionNotes.trim()) problems.push('Escopo de inclusões e exclusões incompleto');
  if (!Number.isFinite(record.valuePerM2) || record.valuePerM2 <= 0) problems.push('Valor por m² inválido');
  try { if (new URL(record.sourceUrl).protocol !== 'https:') problems.push('URL da fonte não HTTPS'); }
  catch { problems.push('URL da fonte inválida'); }
  if (record.approval !== 'approved') problems.push('Registro ainda não aprovado');
  if (!record.reviewer.trim() || !/^20\d{2}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/.test(record.reviewedAt))
    problems.push('Revisão técnica não documentada');
  return problems;
}

export function findMatchingReference(
  references: PricingReference[],
  filters: Pick<PricingReference,'workType'|'standard'|'uf'>,
  latestAllowedCompetence?: string
): PricingReference | null {
  const approved = references.filter(ref =>
    ref.workType === filters.workType &&
    ref.standard === filters.standard &&
    ref.uf === filters.uf &&
    (!latestAllowedCompetence || ref.competence <= latestAllowedCompetence) &&
    validatePricingReference(ref).length === 0
  );
  approved.sort((a,b) => b.competence.localeCompare(a.competence));
  return approved[0] ?? null;
}
