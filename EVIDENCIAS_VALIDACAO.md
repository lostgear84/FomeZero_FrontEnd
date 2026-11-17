# Evidências de validação — FEMD

Data da revisão: 13/11/2026  
Responsável pelos testes: Erick Miguel

## Objetivo

Registrar os testes manuais realizados no frontend FOMEZERO e separar o que foi validado do que permanece pendente. Os testes não constituem uma certificação formal de acessibilidade, segurança ou qualidade de software.

## Testes funcionais

| Teste | Procedimento | Resultado |
|---|---|---|
| Cadastro local | Criar conta de Doador ou Beneficiário com dados fictícios | OK |
| Login local | Informar e-mail e senha cadastrados | OK |
| Restrição por perfil | Acessar áreas do Doador e do Beneficiário após login | OK |
| Proteção de rota | Acessar rota protegida sem sessão ativa | OK |
| Cadastro de lote | Preencher identificador, Doador, alimento, quantidade e condição | OK |
| Consulta do Doador | Consultar os lotes vinculados à conta | OK |
| Consulta do Beneficiário | Consultar lotes disponíveis e utilizar a busca | OK |
| Solicitação do cidadão | Informar uma solicitação e observar resposta e ação sugerida | OK |
| Geração de lotes fictícios | Confirmar a geração de lotes `DEMO-` | OK |
| Painel de Recompensas | Conferir que pontos, selo e CO₂ permanecem pendentes | OK |
| Persistência no navegador | Recarregar a página e verificar os dados armazenados | OK |

## Verificações técnicas

| Verificação | Comando | Resultado |
|---|---|---|
| Análise estática | `npm run lint` | OK |
| Build de produção | `npm run build` | OK |

## Testes de acessibilidade

| Teste | Procedimento | Resultado |
|---|---|---|
| Navegação por teclado | Utilizar `Tab`, `Shift + Tab`, `Enter` e `Espaço` | OK |
| Foco visível | Percorrer links, campos e botões | OK |
| Link para conteúdo principal | Ativar o link e verificar o direcionamento | OK |
| Responsividade | Revisar a interface em largura aproximada de 375 px | OK |
| Ampliação | Revisar a interface com zoom de 200% | OK |
| Mensagens e avisos | Conferir avisos de simulação, erro e pendência | OK |

## Evidências visuais recomendadas

Registrar capturas de tela sem dados pessoais reais para:

- Tela de login.
- Tela de cadastro.
- Área do Doador.
- Cadastro de lote.
- Meus lotes.
- Área do Beneficiário.
- Lotes disponíveis.
- Solicitação do cidadão com resposta e ação.
- Geração de lotes `DEMO-`.
- Painel de Recompensas com pendências.
- Terminal com `npm run lint` e `npm run build` concluídos.
- Interface em largura de celular.
- Interface com zoom de 200%.

## Limitações

- Os dados são armazenados apenas no navegador.
- Não há backend, banco de dados externo ou sincronização entre dispositivos.
- A autenticação é local e demonstrativa.
- A solicitação do cidadão utiliza regras locais, não um modelo de IA treinado.
- Os lotes `DEMO-` são fictícios e não representam dispositivos IoT.
- Pontos, Selo Verde ESG e CO₂ evitado vêm do robô da AIPA (integrado em 16/11/2026); as regras de pontos e selo são de demonstração e o fator de CO₂ depende de aprovação do grupo.
- AIPA e VCIA rodam como serviços locais no computador da demonstração; não há hospedagem compartilhada.
- Não há validação sanitária de alimentos.
- Nenhum módulo declara que um alimento é seguro para consumo.

## Pendências de integração

Situação em 16/11/2026:

- AIPA: integrada por serviço local (confirmação da entrega, revisão humana, pontos, selo, CO₂ evitado e Termo de Doação). Pendente: aprovação do grupo para as regras de pontos, selo e fator de CO₂.
- GENAI: assistente integrado (modo simulado com respostas gravadas; modo integrado pelo link temporário do Colab).
- IoT: importação histórica implementada; conexão ao vivo não implementada.
- VCIA: triagem por foto integrada com o app local da VCIA; sem hospedagem pública.

## Capturas anexadas ao repositório

Consulte o [índice de evidências visuais](docs/evidencias/README.md), com 14 capturas fornecidas pelo operador.

As imagens documentam login, cadastro, áreas dos perfis, formulário de lote, consultas, geração fictícia, solicitação e resposta simulada, painel pendente, visualização móvel e execução de build/lint.

Os resultados dos testes manuais permanecem relatos do operador. Uma captura isolada não comprova persistência após recarga, bloqueio de acesso por perfil ou conformidade completa de acessibilidade.

## Validação da importação histórica IoT — 14/11/2026

Testes manuais realizados e confirmados por Erick Miguel.

Arquivo utilizado: `mqtt-20261111-102301.log`.

| Teste | Resultado observado |
|---|---|
| Importação do log na conta vinculada ao lote | Registros apresentados na interface |
| Filtro de alertas e normalização | Dois eventos exibidos |
| Normalização | Registro de 11/11/2026 às 13:24:39Z, com 4 °C |
| Alerta posterior | Registro de 11/11/2026 às 13:32:35Z, com 8,2 °C, limite de 5 °C, duração de 31 s e severidade alta |
| Campos ausentes | Apresentados como não informados |
| Reimportação do mesmo arquivo | Continuam dois eventos filtrados, sem acumular a importação anterior |
| Limpeza da visualização | Registros importados removidos; lotes cadastrados preservados |
| Lint | Executado sem erros reportados |
| Build | Concluído com sucesso |

Os dois eventos pertencem a momentos distintos: normalização anterior
e novo alerta posterior.

Esta validação não comprova conexão MQTT ao vivo.
O teste com JSON inválido foi realizado e confirmado pelo operador:
o arquivo foi rejeitado e a visualização válida anterior foi preservada.

O teste de arquivo maior que 2 MB não foi realizado, por decisão de escopo.
Os testes de conta sem lote correspondente e temperatura sentinela ainda
não têm execução confirmada neste registro.

## Validação das integrações VCIA e AIPA — 16/11/2026

Responsável: Leonardo Melo. Dados fictícios; portal parceiro simulado.
Ambiente: portal local, serviço da AIPA (`servico_aipa.py`, porta 5070) e app
da VCIA (porta 7860) no mesmo computador.

| Teste | Resultado observado |
|---|---|
| Triagem com foto de tomate fresco | “sem sinais visuais de deterioração”; resultado usado no cadastro do lote |
| Triagem com foto desfocada | Mensagem de nitidez e resultado inconclusivo |
| Triagem com laranja deteriorada | “sinais visuais de deterioração”; lote registrado com destino compostagem e fora da lista do Beneficiário |
| App da VCIA desligado | Mensagem de serviço indisponível; nenhum dado alterado |
| Entrega sem divergência (30 kg) | Validada pela AIPA: 300 pontos, CO₂ evitado de 76,2 kg CO₂eq (estimativa) e Termo de Doação em PDF |
| Entrega com problema marcado e triagem que pediu avaliação | Encaminhada para revisão humana, com os motivos exibidos |
| Serviço da AIPA desligado | Entrega salva como pendente; processada depois por “Enviar entregas pendentes à AIPA” |
| Identificador de lote com espaço | Recusado pelo serviço na primeira versão; corrigido e aceito |
| Revisão humana: aprovar com 17 kg | Lote processado: 170 pontos e Termo emitido |
| Revisão humana: reprovar | Lote encerrado sem pontos, com “Reprovado na revisão humana” |
| Decisão repetida ou revisor identificado por nome | Recusadas pelo serviço |
| Indicador de serviços no cabeçalho | Verde com o serviço no ar; vermelho com a AIPA desligada; GENAI “simulado” sem link |
| Tela de revisão em largura de 375 px | Conteúdo legível, sem rolagem horizontal |
| Demonstração completa com `iniciar_demo.ps1` | Executada sem erros |
| Lint e build | Concluídos sem erros |
| Testes automáticos da AIPA (pytest) | 63 aprovados |

O teste de proteção da rota `/operador` para outros perfis seguiu a mesma
regra já validada para Doador e Beneficiário e não foi repetido isoladamente.
Nenhuma etapa declara que um alimento é seguro para consumo: a triagem é
apoio visual e a revisão humana decide sobre a quantidade entregue.

## Validação da identidade visual e do certificado do selo — 17/11/2026

Responsável: Leonardo Melo. Dados fictícios.

| Teste | Resultado observado |
|---|---|
| Login e cadastro | Fundo vermelho, logo principal e cartão branco; perfis Doador, Beneficiário e Operador |
| Telas iniciais | Faixa de boas-vindas e atalhos com ícone e nome oficial da matéria |
| Títulos dos módulos | Nome oficial da matéria entre parênteses (Visão Computacional; Generative AI & Advanced Nets; AI for Robotic Process Automation; Physical Computing, Embedded AI, Robotics & Cognitive IoT) |
| Painel sem resultados | Selos Bronze, Prata e Ouro apagados; nenhum botão de certificado |
| Doador com 55 kg validados | Selo Bronze aceso e botão "Baixar certificado do Selo Bronze (PDF)" |
| Certificado em PDF | Nível, nome fictício, kg, lotes, pontos, código de conferência e aviso de que não é certificação |
| Certificado sem selo | Recusado pelo serviço da AIPA |
| Interface em 375 px | Atalhos em duas colunas; cabeçalho e faixa de módulos sem rolagem horizontal |
| Lint e build | Concluídos sem erros |
