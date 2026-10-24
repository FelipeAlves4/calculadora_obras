# Calculadora de Obras

Simulador aberto de custos de construção residencial e galpões, com identidade visual navy/dourada inspirada na Calculadora ASEX Educação. Projeto autônomo: **nenhum banco, login, dados ou segredos da ASEX foram reutilizados**.

Site: https://calculadora-obras.vercel.app/

## Rodar localmente

```bash
npm install
npm run dev
```

- `npm test`: testes unitários de cálculo e planejamento
- `npm run build`: verificação TypeScript e build Vite
- `npm run preview`: visualizar o build de produção

Stack: React 18, TypeScript, Vite, Recharts, Lucide.

## O que está implementado

### Simulação de obra
- Modo **passo a passo** (3 etapas) ou **tudo de uma vez**
- Cálculos separados para **casa residencial** e **galpão/barracão**
- Área, cidade/UF (informativas), padrão de construção, pavimentos residenciais, terreno e reserva de imprevistos
- Preço base por m² ajustável e adicionais opcionais em reais
- Custo de construção, adicionais, reserva, total da obra e custo por m²
- Valor do terreno opcional apresentado *separadamente* e cálculo de investimento incluindo terreno
- Comparação com o orçamento disponível e cenários de sensibilidade **hipotéticos** de ±15%
- Comparação de padrões compatível com preço unitário personalizado
- Gráfico de composição por etapas e impressão/salvamento do relatório em PDF

### Planejamento financeiro
- Número de meses escolhido pelo usuário
- Distribuição de desembolso por fases definidas **para demonstração**
- Gráfico mensal e provisão média mensal
- Não representa cronograma técnico de execução nem previsão de prazo.

### Calculadoras geométricas independentes
- **Piso**: área com margem de perda e caixas conforme cobertura informada
- **Blocos/tijolos**: área líquida, dimensões com juntas, perdas e arredondamento
- **Concreto**: volume geométrico de elemento retangular e margem de perdas
- **Pintura**: litros por área, demãos, rendimento declarado do produto e perdas

Esses quantitativos **não são somados automaticamente ao orçamento**, para não duplicar valores já incorporados ao custo por m². Eles não substituem medições em projeto.

## Transparência das premissas

**ATENÇÃO: NÃO USAR COMO ORÇAMENTO REAL SEM VALIDAÇÃO TÉCNICA.**

Os valores de preços base, pesos de etapas, adicionais predefinidos e fatores de terreno/pavimentos **são fictícios**, usados apenas para demonstrar o funcionamento. Não representam preços oficiais do CUB, SINAPI nem levantamentos de fornecedores.

- Selecionar UF não muda o preço por m².
- Padrão de obra não equivale automaticamente a tipologia CUB.
- O CUB R8-N de SP (set/2026, R$ 2.238,58/m² sem desoneração), documentado no site com link, é **apenas uma referência contextual** — não é o preço de uma casa ou galpão, e não alimenta o cálculo.
- Comparação de padrões utiliza multiplicadores relativos aos valores hipotéticos do mesmo tipo de obra, ajustados à base personalizada.
- A projeção de ±15% é um exercício ilustrativo de sensibilidade; não constitui intervalo de confiança estatístico.
- Planejamento financeiro usa fases e durações convencionadas internamente, e não um cronograma profissional.
- Materiais e mão de obra não podem ser segregados corretamente sem composições e quantitativos compatíveis.

### Fórmula da simulação financeira

```text
construção = área × taxa_m2_informada × fator_terreno × fator_pavimentos
adicionais = soma dos opcionais selecionados compatíveis com a tipologia
subtotal = construção + adicionais
reserva = subtotal × percentual_de_reserva
total_obra = subtotal + reserva
investimento = total_obra + terreno (se informado)
```

Peso percentual de etapa distribui **apenas o custo da construção**, sem recontabilizar reserva/adicionais.

## Contato comercial

Para habilitar o botão do WhatsApp, configure a variável pública de build `VITE_WHATSAPP_NUMBER` na Vercel (apenas dígitos, DDI+DDD+número real autorizado). Veja `.env.example`. Não armazene segredos em variáveis `VITE_`: são expostas no bundle público.

Sem essa configuração o simulador permanece funcional, sem botão falso de contato. Não há captação automática de dados pessoais, servidor ou login.

## Referências estudadas

Sites de terceiros são referências de experiência, categorias de insumos e perguntas, não fonte de código ou tabelas copiadas.

- VaiVolta: https://vaivolta.com.br/ferramentas/calculadora-de-orcamento-de-obra
- ObraFácil: https://www.obra-facil.com/simulador
- Habituz: https://www.habituz.com.br/ferramentas/quanto-custa-sua-obra
- Tudo de Imóvel: https://www.tudodeimovel.com.br/custo-de-construcao/
- Calcula Obra: https://calculobra.com.br/calculadoras/
- CUB/SP oficial: https://sindusconsp.com.br/cub-paulista-sobe-013-em-setembro/
- SINAPI/IBGE: https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9270-sistema-nacional-de-pesquisa-de-custos-e-indices-da-construcao-civil.html

## Próxima evolução

1. Base estruturada, auditável e atualizada por competência, UF e **tipologia** (não misturar R8-N com casas/galpões).
2. Motor de composições com quantitativos, produtividade, preços de materiais e mão de obra, encargos e BDI, sem dupla contagem.
3. Perguntas condicionais aprofundadas para banheiros, cômodos, estrutura, pé-direito, fechamentos e equipamentos industriais.
4. PDF profissional personalizado para a construtora, incluindo premissas, fonte, data e exclusões.
5. Integração opcional de leads com consentimento, armazenamento seguro e controles LGPD.

O briefing de implementação incremental está em [CODEX_BRIEF.md](./CODEX_BRIEF.md).
