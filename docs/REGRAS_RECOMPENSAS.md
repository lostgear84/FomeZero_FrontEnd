# Regras de recompensas do FOMEZERO

## Objetivo

Estas regras definem como o FOMEZERO atribui, acompanha e apresenta recompensas ao Doador depois que um lote de doação é entregue e validado.

A recompensa pertence ao **Doador do lote**. O Beneficiário registra a entrega, mas não recebe pontos por ela.

O token de rastreabilidade do lote é o campo `lote_id`. Ele é usado do cadastro até o resultado da AIPA e permite associar a recompensa ao Doador correto.

## Fluxo da recompensa

```text
Doador cadastra o lote
        ↓
Beneficiário registra a entrega
        ↓
Frontend exporta o arquivo para a AIPA
        ↓
AIPA lê a confirmação e valida a entrega
        ↓
AIPA calcula pontos, kg validados e CO₂ evitado
        ↓
Doador importa o resultado CT-04
        ↓
Painel de Recompensas mostra o total do Doador
```

## Papel de cada integrante

| Papel | Responsabilidade |
|---|---|
| Doador | Cadastra o lote, consulta seus lotes e acompanha as recompensas no Painel de Recompensas |
| Beneficiário | Registra a entrega e informa, em texto livre, quantos kg chegaram e se houve algum problema |
| AIPA | Lê a confirmação da entrega, extrai os kg recebidos, identifica ocorrências e calcula os resultados |
| Frontend FOMEZERO | Registra a entrega, exporta os dados, importa o resultado e exibe o total do Doador |

## Token do lote

O token do lote é o identificador `lote_id`.

Ele deve permanecer o mesmo em todas as etapas:

- Cadastro do lote pelo Doador.
- Consulta de lotes disponíveis.
- Registro da entrega pelo Beneficiário.
- Arquivo exportado para a AIPA.
- Resultado CT-04 devolvido pela AIPA.
- Painel de Recompensas do Doador.

Exemplo:

```text
LOTE-2026-0001
```

O `lote_id` não é uma senha, certificado ou criptomoeda. É o identificador que permite rastrear o lote e vincular a recompensa ao Doador.

## Quando o Doador recebe pontos

O Doador recebe pontos somente quando a AIPA processa a entrega e a classifica como `processado`.

Um lote apenas cadastrado não gera pontos. O cadastro demonstra a disponibilidade do alimento, mas não comprova que ele foi entregue, recebido ou aproveitado.

Uma entrega em revisão humana também não gera pontos automaticamente. Ela permanece sem pontos até que a equipe revise o caso e a AIPA classifique o lote como processado.

## Regra de pontos

A regra proposta para o protótipo é:

```text
10 pontos por cada kg recebido e validado pela AIPA
```

Exemplo:

```text
Lote cadastrado: 20 kg de arroz
Kg recebidos e validados pela AIPA: 18 kg
Pontos do lote: 18 × 10 = 180 pontos
```

Se a AIPA identificar divergência, avaria, problema de temperatura ou falta de clareza na confirmação, o lote pode ir para revisão humana ou falha. Nesses casos, o lote não recebe pontos até ser validado.

## Total do Doador

O total de pontos do Doador é a soma dos pontos dos lotes processados e vinculados à conta dele.

O frontend deve mostrar apenas os resultados cujo `doador_id` corresponde ao Doador autenticado.

O painel deve exibir:

- Total de pontos acumulados.
- Total de kg recebidos e validados.
- Selo Verde ESG atual.
- Progresso até o próximo selo.
- Estimativa de CO₂ evitado.
- Extrato por lote, com o `lote_id`, status, pontos e motivo, quando houver.

Sem resultado importado, o painel deve mostrar “Sem pontos lançados” e “Não calculado”. Ele não deve exibir zero como se fosse um resultado calculado.

## Selo Verde ESG

O Selo Verde ESG é um reconhecimento interno do protótipo FOMEZERO. Ele não é uma certificação externa.

O selo é calculado pelo total de kg recebidos e validados pelo Doador.

| Faixa | Total de kg validados |
|---|---:|
| Bronze | A partir de 50 kg |
| Prata | A partir de 200 kg |
| Ouro | A partir de 500 kg |

O progresso até o próximo selo é calculado com base no total acumulado do Doador. O selo atribuído deve vir do resultado da AIPA.

## CO₂ evitado

O CO₂ evitado é uma **estimativa calculada pela AIPA**, não um valor medido diretamente.

O frontend apenas exibe o valor informado pela AIPA, junto com a metodologia e a fonte. O FOMEZERO não deve calcular CO₂ por conta própria nem apresentar a estimativa como impacto ambiental comprovado.

Se não houver resultado processado, o painel deve exibir “Não calculado”, e não zero.

## Limites do protótipo

- Os dados são fictícios e permanecem no navegador.
- O cadastro de lote não comprova entrega.
- O registro da entrega não comprova, por si só, que o alimento é seguro para consumo.
- A AIPA é responsável pela extração dos kg e pela classificação da entrega.
- Casos duvidosos devem ir para revisão humana.
- O Selo Verde ESG é reconhecimento interno, não certificação.
- O CO₂ evitado é estimativa, não medição real.
- Telemetria e alertas de IoT não comprovam entrega nem aproveitamento do lote.

## Regra de aprovação

Estas regras são uma proposta de demonstração. Antes do merge na `master`, a equipe deve confirmar:

- A regra de 10 pontos por kg validado.
- As faixas de 50, 200 e 500 kg para Bronze, Prata e Ouro.
- O uso do `lote_id` como token de rastreabilidade.
- A responsabilidade da AIPA pelo cálculo dos pontos e do CO₂.
- A regra de que apenas lotes processados geram pontos.