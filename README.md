# FOMEZERO — Frontend FEMD

O FOMEZERO é o frontend React + Vite do protótipo integrado CitizenTech com IA para apoiar o cidadão. A aplicação organiza o registro de lotes de doação, a consulta de alimentos disponíveis, a solicitação do cidadão e o acompanhamento de recompensas.

O projeto foi desenvolvido para a disciplina Front End & Mobile Development da Global Solution 2026.2, da FIAP.

## Equipe

| Integrante | RM |
|---|---:|
| Erick Miguel | 564896 |
| Leonardo Melo | 567097 |
| Luna Oliveira | 564215 |

## Problema escolhido

O desperdício de alimentos e a insegurança alimentar afetam diferentes públicos e exigem organização entre quem doa, quem recebe e quem solicita apoio. O FOMEZERO representa esse fluxo por meio do lote de doação, registro central que reúne doador, alimento, quantidade, condição informada e acompanhamento posterior.

A solução busca apoiar a redução do desperdício, facilitar a consulta de doações e organizar solicitações de cidadãos em situação de vulnerabilidade alimentar.

## Público afetado

- Doador: restaurante ou mercado responsável pelo cadastro do lote.
- Beneficiário: ONG, cozinha comunitária ou cidadão que consulta lotes disponíveis.
- Cidadão: pessoa que realiza uma solicitação e recebe uma resposta e uma ação sugerida.
- Doador no Painel de Recompensas: acompanhamento de pontos, selo e impacto ambiental pendentes.

## Escopo do protótipo

Este repositório contém o frontend do FOMEZERO. Os dados são armazenados exclusivamente no navegador, sem backend, banco de dados externo ou sincronização entre dispositivos.

A autenticação é local e demonstrativa. Ela permite validar o fluxo de acesso por perfil, mas não substitui autenticação profissional, recuperação de senha, criptografia de senha ou proteção de dados em produção.

## Funcionalidades implementadas

- Cadastro local de Doador ou Beneficiário.
- Login local com validação de e-mail e senha.
- Sessão persistida no navegador.
- Proteção de rotas por tipo de conta.
- Cadastro de lote de doação.
- Consulta dos lotes cadastrados pelo Doador.
- Consulta de lotes disponíveis pelo Beneficiário, com busca.
- Solicitação do cidadão processada por regras locais simuladas.
- Exibição de resposta e ação sugerida após o processamento.
- Geração explícita de lotes fictícios com identificadores `DEMO-`.
- Painel de Recompensas do Doador, com pendências explícitas para pontos, selo e CO₂ evitado.

## Arquitetura do frontend

```text
frontend/src/
├── components/
│   ├── GeradorLotesDemo.jsx
│   ├── Layout.jsx
│   └── ProtectedRoute.jsx
├── context/
│   ├── AuthContext.jsx
│   └── auth.js
├── data/
│   └── seed.js
├── pages/
│   ├── BeneficiarioHome.jsx
│   ├── Cadastro.jsx
│   ├── CadastroLote.jsx
│   ├── DoadorHome.jsx
│   ├── Login.jsx
│   ├── LotesDisponiveis.jsx
│   ├── MeusLotes.jsx
│   ├── PainelRecompensas.jsx
│   └── SolicitacaoCidadao.jsx
├── services/
│   ├── lotesService.js
│   └── solicitacaoService.js
├── App.jsx
└── main.jsx
```

## Componentes, props e estado

| Elemento | Responsabilidade | Props e estado |
|---|---|---|
| `App` | Define as rotas e organiza a aplicação | Utiliza `BrowserRouter` e `Routes` |
| `AuthProvider` | Disponibiliza o contexto de autenticação | Recebe `children`; mantém o estado `usuario` |
| `ProtectedRoute` | Impede acesso de usuário não autenticado a rotas protegidas | Recebe `children` |
| `Layout` | Estrutura visual, menu e navegação | Utiliza `Outlet` para renderizar as rotas internas |
| `Login` | Realiza login local | Estados de e-mail, senha, erro e processamento |
| `Cadastro` | Cria conta local de Doador ou Beneficiário | Estados de nome, e-mail, senha, perfil, erro e processamento |
| `CadastroLote` | Cadastra um lote de doação | Estados de identificador, alimento, quantidade e condição |
| `MeusLotes` | Consulta os lotes do Doador | Estados de dados e busca |
| `LotesDisponiveis` | Consulta lotes disponíveis ao Beneficiário | Estados de dados, busca e mensagem |
| `CartaoLote` | Apresenta um lote do Doador | Recebe a prop `lote` |
| `CartaoLoteDisponivel` | Apresenta um lote disponível ao Beneficiário | Recebe a prop `lote` |
| `SolicitacaoCidadao` | Recebe e processa a solicitação do cidadão | Estados de solicitação, texto processado, resultado e erro |
| `PainelRecompensas` | Exibe o acompanhamento de recompensas | Utiliza o componente `IndicadorRecompensa` |
| `IndicadorRecompensa` | Apresenta um indicador do painel | Recebe `titulo`, `valor` e `descricao` |
| `GeradorLotesDemo` | Gera lotes fictícios para demonstração | Estados de confirmação, processamento, conclusão, mensagem e erro |

## Rotas e acesso

| Rota | Acesso | Funcionalidade |
|---|---|---|
| `/login` | Público | Login local |
| `/cadastro` | Público | Cadastro de Doador ou Beneficiário |
| `/` | Protegida | Redireciona ou apresenta a área conforme o perfil |
| `/doador` | Protegida | Área inicial do Doador |
| `/doador/cadastro-lote` | Protegida | Cadastro de lote de doação |
| `/doador/meus-lotes` | Protegida | Consulta dos lotes do Doador |
| `/beneficiario` | Protegida | Área inicial do Beneficiário |
| `/beneficiario/lotes-disponiveis` | Protegida | Consulta de lotes disponíveis |
| `/beneficiario/solicitacao` | Protegida | Solicitação do cidadão |
| `/recompensas` | Protegida | Painel de Recompensas do Doador |
| `*` | Público | Redireciona para o login |

O componente `ProtectedRoute` verifica a sessão antes de renderizar o conteúdo protegido. Usuários não autenticados são direcionados para `/login`.

## Cadastro e consulta de lotes

O cadastro de lote utiliza os campos:

- Identificador do lote.
- Doador.
- Alimento.
- Quantidade em kg.
- Condição informada pelo doador.

Os lotes são persistidos no `localStorage` por meio do serviço `lotesService.js`. O Doador consulta os lotes vinculados à própria conta; o Beneficiário consulta os lotes disponíveis e pode utilizar a busca para localizar registros.

Os lotes gerados pelo componente `GeradorLotesDemo` utilizam o prefixo `DEMO-` e são fictícios. Eles servem exclusivamente para demonstração da interface e não representam dispositivos IoT, leituras de sensores ou novos eventos físicos.

## Processamento inteligente

A solicitação do cidadão é processada por regras locais simuladas no serviço `solicitacaoService.js`. A interface recebe o texto informado, realiza o processamento, exibe a resposta gerada e apresenta a ação sugerida.

Este processamento é uma simulação baseada em regras, não um modelo de inteligência artificial treinado. A interface identifica essa natureza para não induzir o usuário a erro.

O cálculo de CO₂ não é tratado como processamento inteligente. Ele permanece pendente até que exista uma metodologia e uma fonte validadas.

## Acessibilidade

A interface foi revisada manualmente quanto aos seguintes aspectos:

- Navegação por teclado com `Tab`, `Shift + Tab`, `Enter` e `Espaço`.
- Foco visível nos elementos interativos.
- Link para o conteúdo principal.
- Formulários com `label` associado por `htmlFor`.
- Interface revisada em largura aproximada de 375 px.
- Interface revisada com ampliação de 200%.
- Mensagens de erro, confirmação e pendência apresentadas na interface.

Esses testes são uma revisão manual inicial. Não representam uma certificação completa de acessibilidade.

## Proteção de dados

- O protótipo utiliza dados fictícios.
- Não são coletados dados pessoais reais de beneficiários.
- Os cadastros, lotes e sessões permanecem no navegador do usuário.
- Não há envio de dados para servidores externos por esta aplicação.
- Não há chaves de API no código ou no repositório.
- A senha é tratada como dado de demonstração e não como mecanismo de segurança production-ready.
- Nenhum módulo declara que um alimento é seguro para consumo.

## Relação com os ODS

| ODS | Relação com o FOMEZERO |
|---|---|
| ODS 2 — Fome Zero | Organiza o registro e a consulta de lotes de doação, apoiando o acesso a alimentos. |
| ODS 12 — Consumo e Produção Responsáveis | Contribui para reduzir o desperdício ao organizar alimentos que poderiam ser desperdiçados. |
| ODS 13 — Ação contra a Mudança Global do Clima | Reserva espaço para acompanhamento de impacto ambiental, sem calcular CO₂ sem metodologia validada. |

## Integrações pendentes

| Integração | Status | Pendência |
|---|---|---|
| AIPA | Pendente | Pontos, Selo Verde ESG, CO₂ evitado, associação de lote e Doador e tratamento de reprocessamento |
| GENAI | Pendente | Assistente de consulta para doadores |
| IoT | Pendente | Consumo do alerta térmico do lote |
| VCIA | Pendente | Decisão da equipe sobre onde será hospedada a funcionalidade de imagem |

O Painel de Recompensas permanece com pendências explícitas. Não são exibidos pontos, selos ou valores de CO₂ sem origem, regra e fonte definidas.

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

## Evidências de validação

Os testes realizados estão registrados em `EVIDENCIAS_VALIDACAO.md`. Eles incluem login, cadastro, consultas, solicitação simulada, geração de lotes fictícios, lint, build, navegação por teclado, foco visível, responsividade e ampliação.
