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
- Pontos, Selo Verde ESG e CO₂ evitado permanecem pendentes até a integração AIPA.
- Não há validação sanitária de alimentos.
- Nenhum módulo declara que um alimento é seguro para consumo.

## Pendências de integração

- AIPA: pontos, selo, CO₂ evitado, associação de lote e Doador e tratamento de reprocessamento.
- GENAI: assistente de consulta para doadores.
- IoT: alerta térmico do lote.
- VCIA: funcionalidade de imagem, sujeita à decisão da equipe.
