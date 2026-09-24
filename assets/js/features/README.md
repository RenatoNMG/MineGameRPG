# Caixas de funcionalidade — arquitetura para IA

A pasta `features/` é a camada de **mecânicas isoladas** do MineGame RPG.

## Contrato obrigatório de uma caixa

Cada caixa deve explicar no topo do arquivo:
1. responsabilidade;
2. o que não pertence nela;
3. API pública;
4. dependências diretas;
5. fluxo.

Fluxo preferido:

`Input -> Feature -> System/Entity -> Renderer/UI`

### Regras

- GameLoop apenas orquestra caixas.
- Game.js apenas monta caixas.
- Player e World não devem receber regras específicas de novas mecânicas.
- Uma feature não deve importar Game.js.
- Evitar dependência circular entre features.
- Sistemas existentes podem ser usados como motores internos durante a
  migração. Não é necessário reescrever o jogo inteiro para criar uma caixa.
- Uma caixa nova deve ser pequena e reversível.

## Caixas atuais

- `fence/` — cerca, rotação, preview e estado de colocação.
- `player/` — movimento, fome, sede e cooldown do jogador.
- `interaction/` — ação, interação e carregar animais.
- `drops/` — soltar itens e coleta automática de drops.

## Como uma IA deve atualizar

1. Leia `AI_ARCHITECTURE.md`.
2. Leia `FEATURE_MAP.md`.
3. Abra a caixa relacionada.
4. Leia somente dependências diretas.
5. Faça a menor alteração possível.
6. Atualize versão/cache/documentação.
7. Faça commit pequeno.

Não transforme a pasta `features/` em um framework genérico. Ela existe para
reduzir o contexto necessário para uma IA entender uma funcionalidade.
