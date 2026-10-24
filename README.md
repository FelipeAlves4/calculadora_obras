# Calculadora de Obras

Simulador de custo de construção residencial e galpões, inspirado na experiência visual da Calculadora ASEX Educação. Projeto independente, sem copiar usuários, banco de dados, autenticação nem dados da ASEX.

## Começar

```bash
npm install
npm run dev
```

Para testar: `npm test`. Para gerar produção: `npm run build`.

## Importante sobre os preços

**Todos os preços, coeficientes, pesos de etapas e custos de adicionais pré-carregados são demonstrativos, não foram validados como preços de mercado.** São hipóteses de simulação, não uma cotação do CUB ou SINAPI. Substitua pela referência adequada antes de apresentar uma estimativa comercial. Preço por m² pode ser ajustado manualmente no formulário.

O local informado aparece no relatório, mas **não atualiza os preços automaticamente**. A aplicação não usa atualmente integração CUB/SINAPI, tampouco calcula quantidades físicas de insumos, estrutura ou fundações. Prazo, materiais e mão de obra detalhados dependem de projeto e orçamento técnico.

É uma **estimativa preliminar ilustrativa, não orçamento técnico, proposta vinculante ou laudo de engenharia**.

## Funcionalidades da versão inicial

- Casa residencial e galpão/barracão com composições de etapas separadas
- Padrão econômico, intermediário e alto
- Área, pavimentos, topografia e valor de referência por m² editável
- Adicionais opcionais e reserva percentual
- Composição dos custos por etapa, resumo e comparação de padrões
- Relatório em impressão/PDF pelo navegador
- Link para WhatsApp somente quando houver telefone configurado
- Layout responsivo em React + TypeScript + Vite + Recharts

## Configurar WhatsApp

Copie `.env.example` para `.env.local` e configure `VITE_WHATSAPP_NUMBER` apenas com dígitos, incluindo DDI e DDD. Exemplo de formato: `55DDDNUMERO` (substitua pelos números reais). Não coloque dados sensíveis em variáveis `VITE_`, que são públicas no frontend.

## Referências para a futura base técnica

- CUB/SindusCon: https://www.cub.org.br/
- SINAPI (IBGE): https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9270-sistema-nacional-de-pesquisa-de-custos-e-indices-da-construcao-civil.html
- VaiVolta: https://vaivolta.com.br/
- ObraFácil: https://www.obra-facil.com/simulador
- Calcula Obra: https://calculobra.com.br/calculadoras/

Consulte os dados e suas licenças/condições de uso antes de importar qualquer tabela de referência. Não copie textos, tabelas ou código proprietários de concorrentes.

## Próximas fases

1. Tabela de referências por UF, tipologia e competência com fonte original auditável.
2. Separação técnica das composições de materiais e mão de obra, BDI e encargos sem dupla contagem.
3. Calculadoras de insumos por geometria e quantitativos.
4. Cenários e relatório PDF profissional com identificação da construtora.
5. Captura consentida de leads e armazenamento seguro (opcional).
