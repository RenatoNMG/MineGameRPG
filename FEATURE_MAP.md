# MineGame RPG — Mapa rápido para IA

Use este arquivo antes de abrir dezenas de arquivos.

## Entrada por tarefa

- **movimento, fome, sede, vida do jogador** -> `features/player/PlayerFeature.js` + Player
- **cerca, rotação, preview, colocação** -> `features/fence/FenceFeature.js`
- **botão de ação, usar, atacar, carregar galinha/galo** -> `features/interaction/InteractionFeature.js`
- **soltar item, coleta automática de madeira/pedra** -> `features/drops/DropFeature.js`
- **árvore/pedra e ferramentas** -> `systems/ResourceInteraction.js` + ToolSystem
- **água** -> `systems/WaterInteraction.js`
- **ovo, crescimento, morte, carne podre** -> `systems/TransformationSystem.js`
- **movimento/acasamento/ovos de animais** -> `systems/AnimalSystem.js`
- **inventário/quantidades** -> `systems/Inventory.js`
- **craft/receitas** -> `systems/Crafting.js` + `data/recipes/`
- **comportamento de item** -> `systems/ItemBehaviorSystem.js` + `data/items/`
- **visual de item** -> `core/ItemRenderer.js`
- **visual do mundo** -> `core/WorldRenderer.js`
- **HUD/inventário/quickbar/craft HTML** -> `systems/*UI.js`
- **colisão** -> `systems/CollisionSystem.js`
- **geração do mapa** -> `systems/WorldGenerator.js`
- **consulta de objetos próximos** -> `systems/WorldQuery.js`

## Regra de decisão

Se a tarefa atravessar mais de uma área, comece pela caixa principal e só abra
os consumidores necessários. Não carregue o projeto inteiro por padrão.

## Quando criar uma nova caixa

Crie uma nova caixa quando a funcionalidade:
- tiver estado próprio;
- tiver entrada própria;
- possuir várias regras relacionadas;
- estiver começando a exigir vários arquivos;
- ou estiver criando muitos `if` em GameLoop/Game.js/Player/World.

## Quando NÃO criar uma caixa

Não crie uma caixa só para uma função trivial ou para cada linha de código.
A meta é isolamento útil, não dezenas de microarquivos.

## Contrato obrigatório

Toda nova caixa deve ter no topo:
1. responsabilidade;
2. o que não pertence nela;
3. API pública;
4. dependências diretas;
5. fluxo de entrada/saída.

Isso é memória estrutural para futuras IAs.
