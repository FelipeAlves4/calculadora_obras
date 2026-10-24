# Brief para continuar no Codex

## Objetivo
Evoluir a Calculadora de Obras para uma solução comercial profissional, preservando a identidade navy + dourado e a responsividade da Calculadora ASEX Educação. Consulte a implementação existente antes de alterar.

## Referências e estudo — não copiar código de terceiros
- Fonte original da identidade/UX: https://github.com/FelipeAlves4/Calculadora_AsexEduca-o (privado, somente leitura; nunca publicar auth, dados ou env)
- Novo projeto: https://github.com/FelipeAlves4/calculadora_obras
- https://vaivolta.com.br/
- https://www.obra-facil.com/simulador
- https://calculobra.com.br/calculadoras/
- https://www.cub.org.br/
- https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9270-sistema-nacional-de-pesquisa-de-custos-e-indices-da-construcao-civil.html

## Cuidados obrigatórios
- Não se apresentar como fonte do SINAPI/CUB antes de obter e validar tabela atualizada e licença de uso.
- O custo/m², os pesos de etapas e os fatores atuais são fictícios, apenas para demonstração. Não os tratar como engenharia orçamentária.
- Casa e galpão possuem motores, tipologias e composições separados; não usar um desconto fixo entre eles.
- Não somar BDI, encargos, impostos ou administração duas vezes; separar custos diretos e indiretos.
- Não declarar quantitativos reais de tijolos, concreto, aço, área de telhado e alvenaria sem dados geométricos ou projeto suficientes.
- Não adicionar login obrigatório; não inserir chaves privadas no frontend.
- A experiência precisa continuar excelente no mobile, especialmente gráficos, barras e formulário.
- Preservar testes de somatório e acrescentar testes para cada fórmula nova.

## Próximas tarefas
1. Testar build e navegação em desktop e mobile; corrigir eventuais problemas.
2. Adicionar modo assistido de perguntas condicionais e manter modo avançado editável.
3. Criar módulo de referência com UF, competência, tipologia, fonte, URL e data de atualização verificáveis.
4. Integrar bases autorizadas / ingestão manual auditável de dados oficiais, sem inventar números.
5. Refazer composição real de custo com produtividade, mão de obra, materiais e quantitativos.
6. Galpão: perguntas para pé-direito, vão livre, estrutura, piso, fechamento e instalações; separar da composição residencial.
7. Criar relatório PDF com identidade configurável da construtora, data e rastreabilidade.
8. Adicionar WhatsApp comercial (configurado) e, se houver consentimento e backend seguro, captura de leads.

## Critérios de aceite
- Executar `npm test` e `npm run build` sem erros.
- Mostrar ao usuário a origem, competência e limitações dos dados (não chamar valores demonstrativos de reais).
- Navegação e gráficos sem overflow em celulares de 320px.
- Não alterar repositório da ASEX.
