# FOMEZERO — Front End & Mobile Development

Frontend do **Protótipo Integrado CitizenTech com IA para Apoiar o Cidadão**, desenvolvido em **React + Vite** para a Global Solution 2026.2 da FIAP.

O FOMEZERO organiza o cadastro e a consulta de lotes de doação, o registro de solicitações do cidadão, a confirmação das entregas e o acompanhamento de recompensas dos doadores.

Este repositório apresenta a entrega da disciplina **Front End & Mobile Development**, incluindo o código-fonte da interface, as instruções de execução e as evidências de validação.

## Equipe

**Curso:** Tecnologia em Inteligência Artificial  
**Turma:** 2TIAPR-2026  
**Instituição:** FIAP

| Integrante | RM | GitHub |
|---|---:|---|
| Erick Miguel | 564896 | [lostgear84](https://github.com/lostgear84) |
| Leonardo Melo | 567097 | [meloleonardo-dev](https://github.com/meloleonardo-dev) |
| Luna Oliveira | 564215 | [LunaRousseau](https://github.com/LunaRousseau) |

## Projeto interdisciplinar

O FOMEZERO foi desenvolvido como um projeto interdisciplinar. O lote de doação é o registro central que conecta as interfaces e os módulos das diferentes matérias.

- **Frontend — este repositório:**  
  https://github.com/lostgear84/FomeZero_FrontEnd

- **Repositório unificado — projeto completo e materiais das demais disciplinas:**  
  https://github.com/lostgear84/GS_2TIAPR_2026_FOMEZERO_GABA)

O repositório unificado complementa esta entrega com a visão geral do projeto. O código e a documentação necessários para avaliar o frontend estão neste repositório.

### Repositórios dos módulos

| Módulo | Repositório |
|---|---|
| AI for Robotic Process Automation — AIPA | [Acessar repositório](https://github.com/meloleonardo-dev/GS_2TIAPR_2026_FOMEZERO_AIPA) |
| Generative AI & Advanced Nets — GENAI | [Acessar repositório](https://github.com/meloleonardo-dev/GS_2TIAPR_2026_FOMEZERO_GENAI) |
| Processamento de Linguagem Natural — PLN | [Acessar repositório](https://github.com/meloleonardo-dev/GS_2TIAPR_2026_FOMEZERO_PLN) |
| Visão Computacional — VCIA | [Acessar repositório](https://github.com/meloleonardo-dev/GS_2TIAPR_2026_FOMEZERO_VISAO_COMPUTACIONAL) |
| IoT | [Acessar repositório](https://github.com/lostgear84/fomezero-iot) |
| Governança (unificado) | [Acessar repositório](https://github.com/lostgear84/GS_2TIAPR_2026_FOMEZERO_GABA) |

## Problema escolhido

O desperdício de alimentos e a insegurança alimentar motivam uma solução que facilite a organização de doações e o acesso às informações sobre elas.

Estabelecimentos podem ter alimentos disponíveis para doação, enquanto entidades sociais e cidadãos precisam localizar essas informações e acompanhar as etapas do recebimento.

O FOMEZERO propõe uma interface para organizar esse fluxo, desde o cadastro do lote até a entrega e a apresentação do resultado de seu processamento.

## Público afetado

- **Doadores:** restaurantes, mercados e outros estabelecimentos com alimentos disponíveis para doação.
- **Beneficiários:** ONGs, cozinhas comunitárias e cidadãos que consultam os lotes e registram o recebimento.
- **Operadores FOMEZERO:** pessoas responsáveis pela análise de casos encaminhados à revisão humana.

## Objetivo da solução

Desenvolver uma interface acessível e responsiva que permita:

- Cadastrar e consultar lotes de doação.
- Registrar uma solicitação do cidadão e apresentar uma resposta ou ação sugerida.
- Confirmar entregas e informar possíveis problemas.
- Exibir os resultados devolvidos pelos módulos integrados.
- Apresentar pendências e situações que exigem análise humana.
- Acompanhar recompensas demonstrativas vinculadas ao Doador.

Os benefícios apresentados são propostas do protótipo. Não representam redução de fome, desperdício ou emissões já medida em operação real.

## Tecnologias e justificativas

| Tecnologia ou abordagem | Uso no projeto |
|---|---|
| React | Construção das telas por componentes, com props e estado |
| Vite | Ambiente de desenvolvimento e geração do build do frontend |
| React Router | Navegação entre as páginas e organização das áreas por perfil |
| Contexto de autenticação | Compartilhamento do usuário e da sessão entre componentes |
| `localStorage` | Persistência demonstrativa de cadastros, lotes, entregas e resultados no navegador |
| CSS | Identidade visual, responsividade e apresentação dos estados da interface |
| Serviços JavaScript | Separação entre as telas, a persistência e a comunicação com os módulos |

O armazenamento local permite demonstrar persistência sem depender de um backend compartilhado de contas e lotes. Essa escolha também limita o protótipo: os dados não são sincronizados entre dispositivos.

## Funcionalidades implementadas

### Acesso e navegação

- Cadastro local de Doador, Beneficiário ou Operador FOMEZERO.
- Login local.
- Persistência da sessão no navegador.
- Restrição demonstrativa de rotas conforme a sessão e o perfil.
- Menus e atalhos específicos para cada área.

### Lotes e consultas

- Cadastro de lote de doação.
- Consulta dos lotes vinculados ao Doador.
- Consulta e busca de lotes disponíveis pelo Beneficiário.
- Persistência dos registros no navegador.
- Geração identificada de lotes fictícios com prefixo `DEMO-`.

### Solicitação do cidadão

- Entrada de uma solicitação em texto.
- Processamento por regras locais simuladas.
- Exibição da resposta e da ação sugerida.
- Identificação explícita da natureza simulada do processamento.

### Entregas e recompensas

- Registro da quantidade recebida.
- Marcação de problemas na entrega.
- Confirmação em texto livre.
- Envio da entrega ao serviço local da AIPA.
- Tratamento de entregas pendentes quando o serviço está indisponível.
- Exportação e importação por arquivos como alternativa.
- Consulta dos resultados no Painel de Recompensas.
- Revisão humana pelo perfil Operador.
- Acesso ao Termo de Doação e, quando atribuído pela AIPA, ao certificado do Selo Verde ESG.

### Interfaces dos módulos interdisciplinares

- Assistente de dúvidas do Doador, em modo simulado ou integrado à GENAI.
- Triagem por foto integrada à VCIA.
- Importação e visualização de registros históricos IoT.
- Indicação da situação dos serviços na interface.

## Fluxo central da disciplina

A solicitação do cidadão conecta uma entrada a um processamento e apresenta o resultado na interface:

```text
Cidadão registra uma solicitação
                ↓
Regras locais simuladas processam a entrada
                ↓
Portal apresenta uma resposta e uma ação sugerida
```

Essa funcionalidade é uma simulação baseada em regras. Ela não deve ser apresentada como um modelo de inteligência artificial treinado.

## Fluxo de entrega integrado à AIPA

```text
Doador cadastra o lote
                ↓
Beneficiário consulta e registra a entrega
                ↓
Frontend monta os dados no formato CT-03
                ↓
Serviço local da AIPA processa a entrega
                ↓
AIPA devolve resultado CT-04 ou encaminha à revisão humana
                ↓
Doador acompanha o resultado no Painel de Recompensas
```

O identificador `lote_id` relaciona o cadastro, a entrega e o resultado do processamento.

O cadastro do lote não gera pontos por si só. No fluxo integrado, os pontos, o selo e a estimativa de CO₂ são devolvidos pela AIPA.

Quando o serviço está indisponível, a entrega permanece registrada no navegador e pode ser enviada posteriormente.

## Integrações e modos de execução

| Módulo | Funcionamento no portal | Dependência ou limite |
|---|---|---|
| AIPA | Envio das entregas ao serviço local e leitura dos resultados | Exige o ambiente da AIPA; há alternativa por arquivos |
| GENAI | Respostas previamente gravadas no modo simulado ou consulta ao serviço no modo integrado | O modo integrado depende do notebook e do endereço configurado |
| VCIA | Envio de imagem ao aplicativo de triagem por foto | Exige o serviço; a análise é apoio visual, não laudo sanitário |
| IoT | Importação e consulta de registros históricos | Não é conexão MQTT ao vivo |

A visualização de registros IoT é uma funcionalidade distinta do envio das entregas. A existência de alertas na tela não deve ser interpretada, por si só, como comprovação de que esse histórico foi considerado pela AIPA.

Os modos integrados fazem requisições aos serviços correspondentes. Portanto, embora os cadastros e registros do portal sejam mantidos localmente, nem todo processamento acontece exclusivamente no navegador.

## Componentes, props e estado

A aplicação utiliza componentes reutilizáveis e separa as responsabilidades entre páginas, contexto e serviços.

| Exemplo | Aplicação |
|---|---|
| `TelaAutenticacao` | Recebe `children` e compartilha a estrutura visual de login e cadastro |
| `AtalhoAcao` | Recebe propriedades para destino, ícone, título e matéria |
| `ProtectedRoute` | Verifica a sessão e o perfil antes de apresentar as páginas |
| `StatusServicos` | Mantém o estado de disponibilidade dos módulos |
| Páginas de cadastro | Mantêm estados dos campos, mensagens e envio |
| Contexto de autenticação | Disponibiliza o usuário autenticado para os componentes |
| Serviços | Organizam persistência, transformação dos dados e chamadas aos módulos |

## Estrutura do projeto

```text
frontend/
├── src/
│   ├── assets/       # Marca e recursos visuais
│   ├── components/   # Componentes reutilizáveis e layout
│   ├── context/      # Autenticação local e sessão
│   ├── data/         # Dados e respostas simuladas
│   ├── pages/        # Telas dos fluxos
│   ├── services/     # Persistência e comunicação com módulos
│   ├── App.jsx       # Composição e rotas
│   ├── index.css     # Estilos e identidade visual
│   └── main.jsx      # Entrada da aplicação
└── package.json
```

## Rotas principais

| Rota | Funcionalidade |
|---|---|
| `/login` | Login local |
| `/cadastro` | Cadastro de conta |
| `/doador` | Área inicial do Doador |
| `/doador/cadastro-lote` | Cadastro de lote |
| `/doador/meus-lotes` | Consulta de lotes e importação histórica IoT |
| `/doador/assistente` | Assistente de dúvidas |
| `/doador/triagem` | Triagem por foto |
| `/beneficiario` | Área inicial do Beneficiário |
| `/beneficiario/lotes-disponiveis` | Consulta dos lotes disponíveis |
| `/beneficiario/solicitacao` | Solicitação do cidadão |
| `/beneficiario/registrar-entrega` | Registro de entrega |
| `/operador` | Revisão humana |
| `/recompensas` | Painel de Recompensas |

A restrição de acesso implementada no frontend tem finalidade demonstrativa. Ela não substitui autenticação e autorização em um servidor de produção.

## Instalação e execução

### Pré-requisitos

- Git.
- Node.js e npm.
- Navegador atualizado.

Os módulos Python possuem dependências próprias, descritas nos respectivos repositórios.

### Executar o frontend

```bash
git clone [https://github.com/lostgear84/FomeZero_FrontEnd.git](https://github.com/lostgear84/FomeZero_FrontEnd.git)
cd FomeZero_FrontEnd/frontend
npm install
npm run dev
```

Abra o endereço informado pelo Vite no terminal.

O frontend pode ser iniciado sem os serviços de IA. As funcionalidades integradas, entretanto, dependem da disponibilidade dos módulos correspondentes.

### Verificações técnicas

Na pasta `frontend/`, execute:

```bash
npm run lint
npm run build
```

- `npm run lint`: análise estática do código.
- `npm run build`: geração do build do frontend.

Essas verificações não substituem os testes funcionais, de acessibilidade ou de segurança.

## Executar os serviços integrados

### AIPA

No ambiente do repositório da AIPA:

```bash
python servico_aipa.py
```

Endereço local padrão:

```text
http://127.0.0.1:5070
```

### Visão Computacional

No ambiente do repositório da VCIA:

```bash
python app/app.py
```

O endereço do serviço pode ser configurado na interface.

### GENAI

Utilize uma das opções:

- Modo simulado, com respostas previamente gravadas.
- Modo integrado, com o notebook em execução e o endereço configurado na tela do assistente.

### Inicialização no Windows

Há um iniciador opcional na raiz do repositório:

```powershell
.\iniciar_demo.ps1
```

O script pressupõe os repositórios e ambientes necessários disponíveis. Consulte o próprio script e a documentação dos módulos para ajustar caminhos.

No Linux, execute o frontend e os serviços necessários em terminais separados, utilizando os ambientes correspondentes.

## Alternativa por arquivos para a AIPA

Quando não for utilizado o serviço local:

1. Registre a entrega.
2. Exporte o arquivo `lotes_entregues.json`.
3. Coloque o arquivo em `AIPA/entrada/lotes_entregues.json`.
4. Execute o robô no ambiente da AIPA:

   ```bash
   python executar_robo.py
   ```

5. Importe `saida/ct04/ct04_lotes.json` pelo Painel de Recompensas.

Esse caminho exige o repositório e o ambiente da AIPA.

## Importação histórica IoT

Na tela Meus lotes, o Doador pode importar um arquivo `.log` ou `.txt`, com até 2 MB, contendo tópico MQTT seguido de JSON por linha.

O escopo documentado inclui:

- Schemas `fomezero.telemetria.v1` e `fomezero.alerta.v1`.
- Associação ao lote `LOTE-2026-0001` da conta autenticada.
- Identificação do dispositivo `esp32-caixa-01`.
- Exibição de estados e eventos informados pelo dispositivo.
- Filtro de alertas e normalizações.
- Apresentação de campos ausentes como não informados.
- Temperatura sentinela `-127` apresentada como falha de leitura.

A importação é histórica. Não há conexão MQTT ao vivo pelo frontend.

O estado `FRIO_OK` é uma informação técnica do dispositivo, não uma garantia de segurança do alimento.

## Acessibilidade

O projeto registra revisão manual dos seguintes aspectos:

- Navegação por teclado com `Tab`, `Shift + Tab`, `Enter` e `Espaço`.
- Foco visível nos elementos interativos.
- Link para o conteúdo principal.
- Rótulos associados aos campos dos formulários.
- Mensagens de erro, confirmação e pendência.
- Interface em largura aproximada de 375 px.
- Ampliação de 200%.

Os procedimentos e resultados estão documentados em
[EVIDENCIAS_VALIDACAO.md](EVIDENCIAS_VALIDACAO.md).

Essas verificações são uma revisão manual inicial. Não representam certificação de conformidade integral de acessibilidade.

## Proteção de dados pessoais

O protótipo utiliza dados fictícios para representar contas, lotes e entregas.

Cuidados adotados e limites:

- Não utilizar dados reais de beneficiários em situação de vulnerabilidade.
- Não publicar senhas, tokens ou informações pessoais nas capturas e arquivos de demonstração.
- Não inserir chaves de API ou outros segredos no código e no repositório.
- Não tratar variáveis expostas pelo Vite como armazenamento de segredos.
- Considerar o login local como recurso demonstrativo, não segurança de produção.
- Não tratar o armazenamento do navegador como banco seguro ou compartilhado.
- Verificar o destino das requisições nos modos integrados.
- Utilizar imagens fictícias ou adequadamente autorizadas na demonstração.

A entrega é enviada à AIPA; a imagem é enviada à VCIA; e a pergunta é enviada à GENAI quando seu modo integrado é utilizado.

Nenhuma funcionalidade do portal garante que um alimento seja seguro para consumo.

## Relação com os Objetivos de Desenvolvimento Sustentável

| ODS | Relação proposta com o FOMEZERO |
|---|---|
| ODS 2 — Fome Zero e Agricultura Sustentável | Apoiar a organização das doações e o acesso às informações sobre alimentos disponíveis |
| ODS 12 — Consumo e Produção Responsáveis | Organizar registros e fluxos que apoiem o enfrentamento do desperdício de alimentos |
| ODS 13 — Ação Contra a Mudança Global do Clima | Apresentar uma estimativa ambiental associada ao fluxo das doações |

O CO₂ evitado exibido no painel é uma estimativa devolvida pela AIPA, não uma medição direta.

A metodologia e os parâmetros devem ser consultados no módulo responsável. O registro de validação identifica a aprovação do método pelo grupo como pendência.

O Selo Verde ESG é um reconhecimento interno do protótipo, não uma certificação externa.

O projeto não apresenta impactos sociais ou ambientais como resultados já medidos em operação real.

## Evidências de validação

Os materiais estão organizados em:

- [Registro de testes e limitações](EVIDENCIAS_VALIDACAO.md).
- [Índice das capturas do protótipo](docs/evidencias/README.md).
- [Roteiro de apresentação](ROTEIRO_APRESENTACAO.md).

O registro contém etapas de validação dos fluxos básicos, acessibilidade, importação histórica IoT, integrações, revisão humana, identidade visual e certificado do selo.

Há registros de execução de lint e build sem erros nas datas documentadas.

### Como interpretar as evidências

- Os resultados são relatos dos responsáveis nas datas indicadas.
- Uma captura isolada não comprova todo o comportamento da funcionalidade.
- Testes anteriores não significam que todos os cenários foram repetidos após cada alteração.
- Os testes automáticos da AIPA citados no registro pertencem àquele módulo, não a uma suíte automática do frontend.
- As evidências não constituem certificação de acessibilidade ou segurança.

## Evolução e contribuição da equipe

O histórico do repositório registra a evolução do projeto por commits e Pull Requests.

- [Histórico de commits](https://github.com/lostgear84/FomeZero_FrontEnd/commits/master/).
- [Pull Requests](https://github.com/lostgear84/FomeZero_FrontEnd/pulls?q=is%3Apr).
- [Contribuidores](https://github.com/lostgear84/FomeZero_FrontEnd/graphs/contributors).

A autoria deve refletir a participação real de cada integrante. O histórico permite consultar as alterações realizadas e sua evolução.

## Benefícios propostos para o cidadão

- Acesso organizado às informações sobre os lotes disponíveis.
- Orientação após o registro de uma solicitação.
- Maior clareza sobre entregas, problemas e pendências.
- Possibilidade de análise humana dos casos que exigem revisão.
- Incentivo à participação de doadores por meio de recompensas demonstrativas.

A avaliação desses benefícios em uso real depende de estudos e validações posteriores.

## Limitações do protótipo

- Não há sincronização dos dados locais entre dispositivos.
- Não há autenticação de produção nem backend compartilhado de contas e lotes.
- A solicitação do cidadão utiliza processamento simulado por regras.
- Os serviços integrados precisam estar disponíveis no ambiente da demonstração.
- A importação IoT é histórica, não conexão ao vivo.
- As regras de recompensa e a metodologia ambiental são de demonstração e exigem alinhamento da equipe.
- Cadastro, entrega registrada e triagem não comprovam segurança sanitária.
- Não há comprovação de impacto social ou ambiental medido em operação real.

## Apresentação da Global Solution

A demonstração apresenta:

1. O problema escolhido e o público afetado.
2. As justificativas das escolhas técnicas.
3. O cadastro e a consulta de lotes.
4. A persistência no navegador.
5. A solicitação do cidadão, seu processamento e a resposta apresentada.
6. O fluxo integrado de entrega e acompanhamento do resultado.
7. Os cuidados de acessibilidade e proteção de dados.
8. As evidências de validação e a evolução do código.
9. A relação com os ODS e os benefícios propostos para o cidadão.

## Entrega acadêmica

O arquivo [ENTREGA_FEMD.txt](ENTREGA_FEMD.txt) identifica os integrantes e o endereço deste repositório.

Este repositório contém a entrega de Front End & Mobile Development. A visão interdisciplinar do FOMEZERO está disponível no repositório unificado indicado no início deste documento.
