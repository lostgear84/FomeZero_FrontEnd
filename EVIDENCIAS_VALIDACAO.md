# Evidências de validação — FEMD

Data da revisão: 13/11/2026  
Responsável pelos testes: Erick Miguel

## Testes realizados

| Teste | Resultado | Evidência |
|---|---|---|
| Login local e restrição por perfil | OK | Fluxo de login testado pelo operador |
| Cadastro de lote | OK | Fluxo de cadastro testado pelo operador |
| Consulta de lotes pelo Doador | OK | Fluxo de consulta testado pelo operador |
| Consulta de lotes pelo Beneficiário | OK | Fluxo de consulta testado pelo operador |
| Solicitação do cidadão simulada | OK | Fluxo de solicitação testado pelo operador |
| Geração de lotes fictícios `DEMO-` | OK | Fluxo de geração testado pelo operador |
| Painel de Recompensas sem valores indevidos | OK | Painel mantém pendências explícitas |
| Lint | OK | `npm run lint` executado sem erros |
| Build de produção | OK | `npm run build` executado sem erros |
| Navegação por teclado | OK | Revisão manual com `Tab`, `Shift + Tab`, `Enter` e `Espaço` |
| Foco visível | OK | Revisão manual |
| Link para o conteúdo principal | OK | Revisão manual |
| Interface em largura de celular | OK | Revisão manual em aproximadamente 375 px |
| Ampliação de 200% | OK | Revisão manual |
| Avisos de simulação e pendências | OK | Revisão manual |

## Limitações

- Os dados são armazenados apenas no navegador.
- A autenticação é local e demonstrativa.
- Não há sincronização entre dispositivos.
- A solicitação do cidadão usa regras locais, não um modelo de IA.
- Os lotes `DEMO-` são fictícios e não representam dispositivos IoT.
- Pontos, Selo Verde ESG e CO₂ evitado permanecem pendentes até a integração AIPA.
- Não há validação sanitária de alimentos; nenhum módulo declara que um alimento é seguro para consumo.

## Pendências de integração

- AIPA: pontos, selo, CO₂ evitado, associação de lote e Doador, tratamento de reprocessamento.
- GENAI: assistente de consulta para doadores.
- IoT: alerta térmico do lote.
- VCIA: funcionalidade de imagem, sujeita à decisão da equipe.

## Commits relevantes

- `4cfdeca` — refactor: separa contexto e hooks para compatibilidade com fast refresh.
- `ee33037` — feat: adiciona geração explícita de lotes fictícios para demonstração.
- `170c1c6` — feat: adiciona painel de recompensas com integração AIPA pendente.
- `fee19b2` — feat: implementa solicitação do cidadão com IA simulada.
- `fb1ba53` — feat: implementa consulta local de lotes para beneficiário.
- `aafed22` — feat: implementa cadastro e consulta local de lotes do doador.
- `5ca21e3` — feat: valida login local e restringe acesso por perfil.
- `79442f8` — feat: adiciona telas temporárias das áreas do FOMEZERO.
