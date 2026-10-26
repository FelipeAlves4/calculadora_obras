# Referências de calculadoras — pesquisa de produto

Pesquisa documental realizada em 26/10/2026 nas páginas públicas indicadas. O objetivo é registrar princípios de experiência que serão adaptados, sem reproduzir código, interface, textos exclusivos, marca ou preços de terceiros. Não foi executada navegação autenticada ou preenchimento automatizado; por isso, resultados dinâmicos não são declarados como verificados.

## VaiVolta

- **URL:** https://vaivolta.com.br/ferramentas/calculadora-de-orcamento-de-obra
- **Funcionalidades verificadas:** sequência com UF, padrão de acabamento, área, quartos, banheiros, pavimentos e reserva; detalhamento por etapas; comparador de padrões e orientação de metodologia.
- **Campos e fórmula pública observada:** a página declara cálculo orientado por CUB e mostra que quartos, banheiros e pavimentos participam da estimativa. Não adotamos sua fórmula ou seus preços.
- **Resultados observados em testes:** página informativa acessível; nenhum resultado dinâmico foi submetido.
- **Adaptação:** sequência de coleta, área direta/por ambientes, reserva visível e detalhamento por etapas cadastradas.
- **Não implementado:** CUB, comparação baseada em preços externos, adicionais automáticos por banheiro/pavimento e financiamento.
- **Limitações:** não há afirmação de equivalência de cálculo entre os produtos.

## ObraFácil

- **URL:** https://www.obra-facil.com/simulador
- **Funcionalidades verificadas:** construção/reforma, área, padrão, extras condicionais (piscina, muro, garagem, edícula e área gourmet), topografia, instalações especiais, terreno e lista de exclusões.
- **Campos e fórmula pública observada:** a página identifica uma estimativa paramétrica baseada em CUB; seus extras e topografia aparecem como entradas.
- **Resultados observados em testes:** não submetidos; somente estados e conteúdo público foram lidos.
- **Adaptação:** custos externos/addicionais explícitos e editáveis, terreno em linha separada, campos de escopo para galpão e ressalvas.
- **Não implementado:** percentuais automáticos, CUB, variação ±15%, financiamento e cadastro de lead.
- **Limitações:** reforma é expansão futura; a entrega prioriza casas e galpões.

## Calcula Obra

- **URL:** https://calculobra.com.br/calculadoras/concreto-laje/
- **Funcionalidades verificadas:** cálculo de laje solicita área, espessura e traço; a fórmula publicada é `volume = área × espessura`, com arredondamento de sacos e alerta de que dimensão/armadura dependem de projeto.
- **Campos necessários:** medidas fornecidas pelo usuário, unidade, espessura e, quando existir, perda escolhida.
- **Resultados observados em testes:** o exemplo textual publica 30 m² × 0,10 m = 3,00 m³; nenhum formulário foi submetido.
- **Adaptação:** mantemos as calculadoras geométricas independentes e não as somamos automaticamente ao orçamento. Elas explicam fórmula, exigem medidas e validam unidades.
- **Não implementado:** consumo técnico, traços e tabelas publicadas pela referência — não são assumidos como composição comercial da construtora.
- **Limitações:** não foram verificadas todas as calculadoras do catálogo.

## Habituz

- **URL:** https://www.habituz.com.br/ferramentas/quanto-custa-sua-obra
- **Funcionalidades verificadas:** seleção de tipo/padrão, construção da residência por ambientes, área total acumulada e termo de responsabilidade.
- **Campos necessários:** categoria de ambiente e área de cada ambiente.
- **Resultados observados em testes:** o resultado é condicionado a autenticação; não foi verificado.
- **Adaptação:** modo opcional de ambientes substitui a área direta e nunca se soma a ela. A quantidade/tipo de cômodo não cria custo automático.
- **Não implementado:** login, CUB e precificação regional externa.
- **Limitações:** não há análise de cálculos autenticados.

## Tudo de Imóvel

- **URL:** https://www.tudodeimovel.com.br/custo-de-construcao/
- **Funcionalidades verificadas:** resumo por etapas, prazo, extras declarados, separação explícita do terreno e orientação de cronograma de desembolso como planejamento.
- **Campos e fórmula pública observada:** a página declara que terreno não compõe custo da obra e lista exclusões do CUB.
- **Resultados observados em testes:** nenhum cálculo/relatório foi submetido.
- **Adaptação:** resumo financeiro separa construção, adicionais, reserva, terreno e investimento. Planejamento existente continua isolado de juros/taxas.
- **Não implementado:** CUB, comparação construir/comprar, financiamento e captação de contato.
- **Limitações:** não são reutilizados percentuais ou dados financeiros da referência.

## Decisão de implementação

Os modos são alternativas: a estimativa rápida calcula `área × preço/m² informado + adicionais + reserva`; o orçamento detalhado soma apenas `quantidade × preço unitário + adicionais + reserva`. Localização, padrão, ambientes, pavimentos e topografia são descritivos até que a construtora registre um valor/regra explícita. Nenhuma referência externa alimenta preço comercial.
