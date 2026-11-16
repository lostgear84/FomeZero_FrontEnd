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
- Doador no Painel de Recompensas: acompanhamento de pontos, Selo Verde ESG e CO₂ evitado (estimativa) calculados pelo robô da AIPA.

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
- Registro da entrega do lote pelo Beneficiário (kg recebidos, problemas marcados e texto de confirmação), processado na hora pelo robô da AIPA (serviço local), com exportação em JSON como alternativa.
- Perfil **Operador FOMEZERO** com a tela de revisão humana (`/operador`): fila dos lotes que a AIPA não validou sozinha, com motivos, kg cadastrado × informado × lido no texto, triagem por foto e IoT; aprovar (com os kg aprovados) gera as recompensas, reprovar encerra sem pontos. O operador é registrado por código, nunca pelo nome.
- Indicador no cabeçalho com a situação dos módulos de IA (AIPA, VCIA e GENAI: no ar, fora do ar ou simulado), atualizado a cada 30 s.
- Painel de Recompensas do Doador com os resultados da AIPA (atualizados automaticamente ou importados): pontos, Selo Verde ESG, progresso até o próximo selo, CO₂ evitado (estimativa, com metodologia), Termo de Doação em PDF e lotes em revisão humana.
- Assistente de consulta para doadores (GENAI), com respostas citando documentos oficiais, em modo simulado ou integrado.
- Triagem inteligente por foto (VCIA), com o modelo real de visão computacional, ligada ao cadastro do lote; itens com sinais visuais de deterioração seguem para compostagem.

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
│   ├── genai_respostas_SIMULADO.json
│   └── seed.js
├── pages/
│   ├── AssistenteConsulta.jsx
│   ├── BeneficiarioHome.jsx
│   ├── Cadastro.jsx
│   ├── CadastroLote.jsx
│   ├── DoadorHome.jsx
│   ├── Login.jsx
│   ├── LotesDisponiveis.jsx
│   ├── MeusLotes.jsx
│   ├── PainelRecompensas.jsx
│   ├── RegistrarEntrega.jsx
│   ├── TriagemInteligente.jsx
│   └── SolicitacaoCidadao.jsx
├── services/
│   ├── aipaService.js
│   ├── assistenteService.js
│   ├── entregasService.js
│   ├── lotesService.js
│   ├── solicitacaoService.js
│   └── triagemService.js
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
| `/cadastro` | Público | Cadastro de Doador, Beneficiário ou Operador FOMEZERO |
| `/` | Protegida | Redireciona para a área correspondente ao perfil |
| `/doador` | Protegida | Área inicial do Doador |
| `/doador/cadastro-lote` | Protegida | Cadastro de lote de doação |
| `/doador/meus-lotes` | Protegida | Consulta dos lotes do Doador |
| `/doador/assistente` | Protegida | Assistente de consulta (GENAI) |
| `/doador/triagem` | Protegida | Triagem inteligente por foto (VCIA) |
| `/beneficiario` | Protegida | Área inicial do Beneficiário |
| `/beneficiario/lotes-disponiveis` | Protegida | Consulta de lotes disponíveis |
| `/beneficiario/solicitacao` | Protegida | Solicitação do cidadão |
| `/operador` | Protegida (Operador) | Fila de revisão humana da AIPA: aprovar ou reprovar |
| `/beneficiario/registrar-entrega` | Protegida | Registro da entrega, processamento na AIPA e situação de cada entrega |
| `/recompensas` | Protegida | Painel de Recompensas do Doador |
| `*` | Público | Renderiza a tela de login para caminhos não reconhecidos |

O componente `ProtectedRoute` verifica a sessão e restringe as áreas por perfil antes de renderizar o conteúdo protegido. Usuários não autenticados são direcionados para `/login`; usuários autenticados que tentam acessar a área de outro perfil são direcionados para sua própria área.

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

O cálculo de CO₂ não é feito pelo frontend. O valor exibido vem do robô da AIPA, como estimativa, com a metodologia e a fonte (FAO, 2013) mostradas no painel; a aprovação do método pelo grupo segue pendente.

Além das regras locais, há dois processamentos com IA de outros módulos do FOMEZERO:

- **Assistente de consulta (GENAI):** RAG sobre o corpus de documentos oficiais da PLN (Lei 15.224/2025, RDC ANVISA 216/2004 e guias da ANVISA). Modo simulado (padrão): as 10 respostas reais gravadas pela GENAI em `src/data/genai_respostas_SIMULADO.json`. Modo integrado: o usuário informa o link do Gradio do notebook da GENAI e o frontend chama o endpoint `/consultar` com `@gradio/client`; se a conexão falhar, a tela avisa e volta ao modo simulado.
- **Robô pós-entrega (AIPA):** a IA da AIPA lê a confirmação escrita pelo beneficiário, extrai os kg recebidos e identifica ocorrências; casos duvidosos vão para revisão humana. Ao confirmar a entrega, o frontend envia o lote ao serviço local da AIPA e mostra o resultado; sem o serviço, exporta e importa por arquivo.

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
- Os fluxos implementados de cadastro, login, consulta, solicitação simulada e importação histórica IoT são locais. Não foi implementado envio desses dados a uma API externa nem conexão MQTT pelo frontend.
- Não há chaves de API no código ou no repositório.
- A senha é tratada como dado de demonstração e não como mecanismo de segurança production-ready.
- Nenhum módulo declara que um alimento é seguro para consumo.

## Relação com os ODS

| ODS | Relação com o FOMEZERO |
|---|---|
| ODS 2 — Fome Zero | Organiza o registro e a consulta de lotes de doação, apoiando o acesso a alimentos. |
| ODS 12 — Consumo e Produção Responsáveis | Contribui para reduzir o desperdício ao organizar alimentos que poderiam ser desperdiçados. |
| ODS 13 — Ação contra a Mudança Global do Clima | Reserva espaço para acompanhamento de impacto ambiental, sem calcular CO₂ sem metodologia validada. |

## Situação das integrações

| Integração | Status | Pendência |
|---|---|---|
| AIPA | Integrada (serviço local) | Confirmação da entrega → `POST /api/lotes` do `servico_aipa.py` (`http://127.0.0.1:5070`) → robô completo → CT-04 no Painel. Sem o serviço: arquivos `lotes_entregues.json` / `ct04_lotes.json`. Regras de pontos e selo de demonstração, pendentes de aprovação do grupo |
| GENAI | Integrada (simulado e integrado) | Modo integrado depende do notebook da GENAI no Colab (link temporário) |
| IoT | Parcial — importação histórica implementada | Conexão ao vivo não implementada |
| VCIA | Integrada (modelo real, app local) | Triagem inteligente em `/doador/triagem`; depende do app da VCIA rodando em `http://127.0.0.1:7860` (ou link `gradio.live`) |

O Painel de Recompensas só exibe pontos, selo e CO₂ evitado que vieram do robô da AIPA, com a regra e a fonte. Sem resultado importado, mostra "Sem pontos lançados" e "Não calculado" (nunca zero).

Fluxo para demonstrar a AIPA:

1. No repositório da AIPA (https://github.com/meloleonardo-dev/GS_2TIAPR_2026_FOMEZERO_AIPA), suba o serviço local: `python servico_aipa.py` (porta 5070).
2. Doador cadastra lotes (opcionalmente pela triagem por foto, ou gera os lotes `DEMO-`).
3. Beneficiário registra a entrega em `/beneficiario/registrar-entrega`: kg recebidos, problemas marcados e texto. O robô roda na hora (cerca de 8 s) e a tela mostra se a entrega foi validada ou foi para revisão humana, e por quê.
4. Doador abre o Painel de Recompensas: pontos, Selo Verde ESG, CO₂ evitado e o Termo de Doação em PDF já aparecem ("Atualizar resultados da AIPA" relê o serviço).

Regras da AIPA que mandam para revisão humana (sem pontos): ocorrência ou baixa confiança na leitura do texto; kg que não bate (cadastrado × informado × escrito no texto, tolerância de 5% ou 0,5 kg); alerta de quebra da cadeia de frio da IoT; triagem por foto do cadastro inconclusiva, que pediu avaliação pessoal ou viu deterioração; qualquer problema marcado pelo beneficiário.

Sem o serviço: "Exportar entregas para a AIPA (JSON)" → `AIPA/entrada/lotes_entregues.json` → `python executar_robo.py` → importar `saida/ct04/ct04_lotes.json` no Painel.

Assistente da GENAI: https://github.com/meloleonardo-dev/GS_2TIAPR_2026_FOMEZERO_GENAI

## Demonstração em um clique

Com os repositórios da AIPA e da VCIA clonados ao lado deste (mesma pasta-mãe), rode no PowerShell, na raiz deste repositório:

```powershell
.\iniciar_demo.ps1
```

O script abre uma janela para cada serviço (AIPA em 5070, VCIA em 7860, portal em 5173), reaproveita o que já estiver no ar e abre o navegador. Pastas em outro lugar: `-PastaAipa`, `-PastaVcia`, `-PythonAipa`, `-PythonVcia`; sem a triagem: `-SemVcia`. Se o Windows bloquear o script, rode antes `Set-ExecutionPolicy -Scope Process Bypass` (vale só para aquela janela). A GENAI roda no Colab: cole o link `gradio.live` na tela do assistente ou use o modo simulado.

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

## Capturas do protótipo

As capturas estão organizadas no [índice de evidências visuais](docs/evidencias/README.md).

A sequência principal da demonstração inclui:

1. [Cadastro do lote](docs/evidencias/04-cadastro-lote.png).
2. [Consulta pelo Doador](docs/evidencias/06-meus-lotes.png).
3. [Consulta pelo Beneficiário](docs/evidencias/08-lotes-disponiveis.png).
4. [Solicitação do cidadão](docs/evidencias/09-solicitacao.png).
5. [Resposta simulada e ação sugerida](docs/evidencias/10-resposta-simulada.png).

As capturas complementam o relato dos testes e a demonstração ao vivo; não comprovam integrações que permanecem pendentes.

## Triagem inteligente por foto (VCIA)

O doador acessa **Triagem inteligente por foto** (`/doador/triagem`), envia a foto de um item de hortifrúti e o
frontend chama o modelo real de visão computacional do FOMEZERO (EfficientNet-B0, repositório
https://github.com/meloleonardo-dev/GS_2TIAPR_2026_FOMEZERO_VISAO_COMPUTACIONAL) pelo endpoint `/triagem` do app
Gradio, com `@gradio/client`. O resultado mostra a condição visual sugerida, a confiança, o produto reconhecido, o
aviso de nitidez e o aviso de que a triagem não é laudo.

- **Uso no cadastro:** "Usar no cadastro do lote" leva ao formulário com o texto sugerido em "Condição informada pelo
  doador" (editável) e anexa o resumo da triagem ao lote (classe, confiança, produto, modelo, data). A foto **não** é
  guardada.
- **Sinais visuais de deterioração:** o lote é registrado com destino **compostagem** e não aparece em "Lotes
  disponíveis" nem em "Registrar entrega".
- **Inconclusivo ou foto borrada:** a tela pede outra foto; se o doador seguir, o cadastro avisa que precisa de
  avaliação pessoal.
- **Validação da imagem:** só JPEG ou PNG (conferido pela assinatura do arquivo), até 5 MB.
- **Serviço fora do ar:** mensagem explicando que o app da VCIA precisa estar rodando.
- **Limite:** a triagem é opcional; ela apoia o doador e não substitui a avaliação pessoal nem a vigilância sanitária.

Para subir o modelo (no repositório da VCIA, ambiente com `torch`, `torchvision`, `gradio`, `opencv-python-headless`,
`scikit-learn`, `matplotlib`): `python app/app.py` (abre em `http://127.0.0.1:7860`). O endereço pode ser trocado na
própria tela ou pela variável `VITE_VCIA_URL`.

## Importação histórica de registros IoT

Na tela Meus lotes, o Doador pode importar um arquivo `.log` ou `.txt`
com até 2 MB, no formato tópico MQTT seguido de JSON por linha.

### Escopo implementado

- Leitura dos schemas `fomezero.telemetria.v1` e `fomezero.alerta.v1`.
- Associação ao lote `LOTE-2026-0001` da conta autenticada.
- Identificação do dispositivo `esp32-caixa-01`.
- Exibição dos estados informados pelo IoT, sem recalculá-los pela temperatura.
- Filtro de eventos de alerta e normalização.
- Campos ausentes apresentados como não informados.
- Temperatura sentinela `-127` apresentada como falha de leitura.
- ACKs, status e registros não associados ao lote da conta são ignorados.
- Registros idênticos repetidos no mesmo arquivo são desconsiderados.
- Uma nova importação bem-sucedida substitui a visualização anterior.
- A limpeza da visualização não apaga os lotes cadastrados.

### Limitações

A importação é uma visualização histórica local, não monitoramento ao vivo.
Os registros importados ficam apenas no estado da tela, sem persistência
após recarga ou saída da página.

Não há conexão MQTT, publicação de mensagens, alteração do firmware,
geração de recompensas ou validação sanitária.

A normalização não apaga ocorrências anteriores. O estado `FRIO_OK`
é uma informação técnica do dispositivo, não garantia de alimento seguro.

O log utilizado na validação foi `mqtt-20261111-102301.log`.
O arquivo original não é incluído automaticamente no repositório.
 

 (Esse projeto foi desenvolvido em conjunto em novembro de 2026)
 