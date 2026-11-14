# Roteiro de apresentação — FOMEZERO / FEMD

## Objetivo da demonstração

Demonstrar o frontend React + Vite conectando o cadastro de um lote de
doação à consulta pelo Beneficiário e ao processamento simulado da
solicitação do cidadão.

A apresentação deve distinguir funcionalidades implementadas, simulações
e integrações pendentes.

## Preparação

- Executar o frontend com `npm run dev` na pasta `frontend/`.
- Conferir as contas fictícias de Doador e Beneficiário.
- Ter ao menos um lote de arroz cadastrado para demonstrar correspondência.
- Não reutilizar senhas reais.
- Não limpar o armazenamento do navegador antes da apresentação.
- Manter as capturas em `docs/evidencias/` como apoio caso a demonstração
  ao vivo seja interrompida.
- Conferir o estado do projeto antes da apresentação.
- Não afirmar integração com AIPA, GENAI, IoT ou VCIA enquanto pendentes.

## 1. Problema, público e proposta

Fala sugerida:

“O FOMEZERO aborda o desperdício de alimentos e a dificuldade de organizar
o acesso a doações. O protótipo representa dois perfis: o Doador, que
cadastra lotes, e o Beneficiário, que consulta os registros e pode realizar
uma solicitação. O lote de doação é o registro central desse fluxo.”

Benefício demonstrado:
organização do cadastro e facilidade de consulta de registros.

Limite:
a demonstração não mede redução real de desperdício nem atendimento
efetivo de pessoas.

## 2. Escolhas técnicas

Mostrar a estrutura de `frontend/src/`.

Explicar:

- React + Vite: base tecnológica solicitada na disciplina.
- Componentes: separação entre layout, proteção de acesso, páginas e
  geração de dados demonstrativos.
- Props: `lote` nos cartões; `titulo`, `valor` e `descricao` nos indicadores;
  `children` no provider e na proteção de rotas.
- Estado: campos de formulários, busca, mensagens e resultado da solicitação.
- Contexto: compartilhamento do estado de autenticação.
- Serviços: separação da persistência de lotes e das regras da solicitação.
- Rotas: navegação entre login, cadastro e áreas internas.
- Persistência: contas, sessão e lotes armazenados no navegador.

Limite:
o armazenamento é local; não existe sincronização entre dispositivos.

## 3. Login e perfis

Demonstrar:

1. Mostrar os avisos de autenticação local e dados fictícios.
2. Entrar com a conta fictícia de Doador.
3. Mostrar a área do Doador.
4. Explicar que Recompensas é um painel do Doador, não outro perfil.

Se demonstrar proteção de acesso, executar o teste previamente validado
e explicar o comportamento observado, sem presumir segurança de produção.

Limite:
autenticação local demonstrativa, sem backend de autenticação.

## 4. Cadastro e consulta do lote

Demonstrar:

1. Abrir o formulário de cadastro.
2. Apontar identificador, Doador, alimento, quantidade em kg e condição.
3. Explicar que o Doador é preenchido pela conta autenticada.
4. Cadastrar um lote fictício com identificador ainda não utilizado.
5. Abrir Meus lotes e localizar o registro.
6. Recarregar a página para demonstrar a persistência.

Não reutilizar um identificador existente para cadastrar outro lote.

Explicar:
a condição é uma declaração do Doador; não é uma inspeção sanitária.

## 5. Consulta pelo Beneficiário

Demonstrar:

1. Sair da conta do Doador.
2. Entrar com a conta fictícia de Beneficiário no mesmo navegador.
3. Abrir Lotes disponíveis.
4. Buscar um alimento cadastrado.

Explicar:
a lista representa os registros locais. Não confirma disponibilidade
operacional, reserva, recebimento ou entrega.

## 6. Processamento inteligente simulado

Demonstrar:

1. Abrir Solicitação do cidadão.
2. Mostrar o aviso de IA simulada por regras locais.
3. Informar: “Preciso de arroz para cozinha comunitária”.
4. Processar a solicitação.
5. Mostrar o resultado, o lote correspondente e a ação sugerida.
6. Abrir a consulta de lotes pela ação apresentada.

Fala sugerida:

“O processamento compara palavras da solicitação com os nomes dos
alimentos cadastrados neste navegador. Ele apresenta correspondências
e uma ação de navegação. Não utiliza modelo treinado nem serviço externo.”

Limites:

- Não compreende integralmente a intenção do usuário.
- Não avalia se a quantidade atende à necessidade.
- Não avalia restrições alimentares nem segurança para consumo.
- Não reserva alimentos nem confirma entrega.
- A solicitação e a resposta não formam histórico persistente.

## 7. Acessibilidade e proteção de dados

Demonstrar:

- Navegação por teclado e foco visível.
- Link para o conteúdo principal.
- Labels dos formulários.
- Uma tela em largura móvel.
- Avisos para utilizar apenas dados fictícios.

Explicar:

- O documento HTML está identificado como português do Brasil.
- A revisão de teclado, responsividade e ampliação foi manual.
- Não houve certificação formal de acessibilidade.
- As contas são demonstrativas; não se deve reutilizar senha real.
- Nenhum módulo declara um alimento seguro para consumo.

## 8. Relação com os ODS

Apresentar como alinhamento da proposta:

- ODS 2: apoio à organização do acesso a doações de alimentos.
- ODS 12: organização de doações como proposta para reduzir desperdício.
- ODS 13: acompanhamento ambiental previsto, ainda sem cálculo validado.

Não apresentar esses objetivos como impactos já medidos pelo protótipo.

## 9. Evidências de validação

Mostrar:

- `EVIDENCIAS_VALIDACAO.md`.
- Índice e capturas em `docs/evidencias/`.
- Resultado de lint e build.
- Histórico de commits demonstrando evolução.

Explicar:
as capturas documentam estados da interface; os testes manuais são
relatos do operador e a demonstração ao vivo complementa as evidências.

Apresentar apenas contribuições reais dos integrantes. Não atribuir
commits ou testes a quem não os realizou.

## 10. Limitações e próximos passos

Mostrar o Painel de Recompensas e explicar:

- AIPA: dados e regras de pontos, Selo Verde ESG e CO₂ ainda pendentes.
- GENAI: assistente do Doador ainda não integrado.
- IoT: importação histórica disponível em Meus lotes; conexão ao vivo não implementada.
- VCIA: hospedagem da funcionalidade de imagem depende de decisão da equipe.

O gerador de lotes fictícios não simula telemetria e não publica MQTT.

O frontend não inventa pontos, selos ou valores de carbono para preencher
o painel. O cadastro de lote não comprova entrega ou aproveitamento.

## Encerramento

“O protótipo demonstra cadastro, consulta, persistência local e uma
solicitação do cidadão conectada a processamento simulado com resposta
e ação. As integrações e os impactos ainda não comprovados permanecem
explicitamente identificados como pendentes.”

## Demonstração complementar — importação histórica IoT

1. Entrar como Doador proprietário do lote LOTE-2026-0001.
2. Abrir Meus lotes.
3. Importar o log original mqtt-20261111-102301.log.
4. Marcar o filtro de eventos de alerta e normalização.
5. Mostrar a normalização anterior e o novo alerta posterior.
6. Explicar que os estados vêm do IoT, sem recálculo pelo frontend.
7. Limpar a visualização e mostrar que os lotes permanecem.

A importação é histórica, local e temporária. Não é monitoramento ao vivo
e não exige manter ESP32, broker ou dashboards ligados durante a leitura
do arquivo já capturado.
