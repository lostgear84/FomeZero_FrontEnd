# Integração IoT → AIPA no FOMEZERO

## Objetivo

Esta integração permite que os registros IoT históricos importados pelo Doador sejam incluídos na exportação de entregas para o robô da AIPA.

O objetivo é dar à AIPA informações de contexto sobre o transporte e o armazenamento do lote, sem afirmar que o alimento é seguro para consumo.

## Fluxo implementado

```text
Doador cadastra o lote
        ↓
Doador importa o log IoT histórico
        ↓
Registros são vinculados ao lote_id
        ↓
Beneficiário registra a entrega
        ↓
Frontend exporta lote + entrega + IoT
        ↓
AIPA processa a confirmação e o contexto IoT
        ↓
Doador importa o resultado CT-04
        ↓
Painel de Recompensas exibe o resultado
```

## O que é exportado

Para cada entrega registrada pelo Beneficiário, o frontend exporta:

| Campo | Origem |
|---|---|
| `lote_id` | Token do lote cadastrado pelo Doador |
| `doador_id` | Identificador do Doador autenticado |
| `beneficiario_id` | Identificador do Beneficiário que registrou a entrega |
| `alimento_descricao` | Alimento informado no cadastro do lote |
| `quantidade_disponibilizada_kg` | Quantidade cadastrada pelo Doador |
| `quantidade_recebida_kg` | `null`; a AIPA extrai essa informação da confirmação |
| `confirmacao_entrega_texto` | Texto escrito pelo Beneficiário |
| `estado_termico` | Último estado informado pelo IoT histórico do lote |
| `evento_atual` | Último evento informado pelo IoT histórico do lote |
| `simulado` | `true`; os dados são fictícios e locais |

## Regras da integração

- O registro IoT é vinculado ao lote pelo `lote_id`.
- A exportação considera somente entregas registradas pelo Beneficiário autenticado.
- Se não houver registro IoT para o lote, `estado_termico` e `evento_atual` permanecem `null`.
- Uma nova importação IoT bem-sucedida substitui os registros anteriores do mesmo lote.
- A limpeza da visualização remove os registros IoT salvos no navegador.
- A interface não recalcula o estado informado pelo IoT.
- A normalização não apaga ocorrências anteriores.
- Temperatura `-127` é tratada como falha de leitura, não como temperatura real.

## Limites

- A importação IoT é histórica e local; não há conexão MQTT ao vivo.
- O frontend não publica mensagens MQTT nem altera o firmware.
- A presença de telemetria, alerta ou normalização não comprova entrega.
- Nenhum registro IoT atesta que o alimento é seguro para consumo.
- O CO₂ evitado continua sendo estimativa calculada pela AIPA, não valor medido.
- A AIPA continua responsável por extrair os kg recebidos e classificar a entrega.

## Teste de demonstração

1. Entre como Doador.
2. Cadastre ou selecione o lote `LOTE-2026-0001`.
3. Em **Meus lotes**, importe o log IoT histórico.
4. Confirme que os registros aparecem vinculados ao lote.
5. Entre como Beneficiário.
6. Registre a entrega do lote.
7. Exporte `lotes_entregues.json`.
8. Confira no arquivo se `estado_termico` e `evento_atual` foram preenchidos com os dados do IoT.
9. Execute o robô da AIPA.
10. Volte como Doador e importe `saida/ct04/ct04_lotes.json`.
11. Confira o Painel de Recompensas.
