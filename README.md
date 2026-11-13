# FOMEZERO — Frontend FEMD

Frontend React + Vite do FOMEZERO, protótipo integrado CitizenTech com IA para apoiar o cidadão. A aplicação conecta doadores e beneficiários por meio de lotes de doação, solicitações do cidadão e painel de recompensas.

## Equipe

| Integrante | RM |
|---|---:|
| Erick Miguel | 564896 |
| Leonardo Melo | 567097 |
| Luna Oliveira | 564215 |

## Problema e público

O FOMEZERO busca reduzir o desperdício de alimentos e apoiar pessoas em situação de vulnerabilidade alimentar. O protótipo permite registrar lotes de doação, consultar itens disponíveis e processar solicitações do cidadão por regras locais.

Públicos representados:

- Doador: restaurante ou mercado.
- Beneficiário: ONG, cozinha comunitária ou cidadão.
- Painel de Recompensas: área do Doador, destinada ao acompanhamento de pontos, selo e impacto.

## Funcionalidades implementadas

- Cadastro e login locais de Doador e Beneficiário, com sessão persistida no navegador.
- Proteção de rotas por tipo de conta.
- Cadastro de lote de doação com identificador, Doador, alimento, quantidade em kg e condição informada.
- Consulta de lotes pelo Doador e pelo Beneficiário.
- Solicitação do cidadão processada por regras locais simuladas, com resposta e ação sugerida.
- Geração explícita de lotes fictícios com identificadores `DEMO-`.
- Painel de Recompensas com estado de pendência para pontos, selo e CO₂ evitado.
- Interface responsiva, navegação por teclado, foco visível e link para o conteúdo principal.

## Execução

Na pasta `frontend/`:

```bash
npm install
npm run dev
```

Verificações:

```bash
npm run lint
npm run build
```

## Persistência e autenticação

Os cadastros, lotes e sessões são armazenados apenas no navegador. Não há backend, banco de dados externo ou sincronização entre dispositivos.

A autenticação é demonstrativa e local. Não substitui autenticação profissional, recuperação de senha ou proteção de dados em produção.

## Processamento inteligente

A solicitação do cidadão é processada por regras locais simuladas, não por um modelo de IA. O sistema interpreta palavras-chave da solicitação, gera uma resposta e sugere uma ação.

Isso atende ao requisito de processamento inteligente simulado e é identificado na interface como simulação. O cálculo de CO₂ não é apresentado como processamento inteligente.

## Relação com os ODS

- ODS 2 — Fome Zero: apoio ao acesso a alimentos por meio de doações.
- ODS 12 — Consumo e Produção Responsáveis: redução do desperdício de alimentos.
- ODS 13 — Ação contra a Mudança Global do Clima: registro de impacto ambiental potencial, sem cálculo não fundamentado.

## Integrações pendentes

- AIPA: pontos, Selo Verde ESG e CO₂ evitado após confirmação de entrega.
- GENAI: assistente de consulta para doadores.
- IoT: alerta térmico do lote.
- VCIA: funcionalidade de imagem, sujeita à decisão da equipe.

O painel de Recompensas permanece pendente até que existam regras e dados validados. Não são exibidos valores, pontos, selos ou CO₂ calculados sem origem definida.

## Proteção de dados

- Não utilizar dados pessoais reais de beneficiários.
- Utilizar apenas dados sintéticos ou públicos.
- Não inserir chaves de API no código ou no repositório.
- Não declarar que um alimento é seguro para consumo.
- Identificar simulações e dados fictícios.

## Estrutura

```text
frontend/
  src/
    components/
    context/
    pages/
  README.md
EVIDENCIAS_VALIDACAO.md
```
