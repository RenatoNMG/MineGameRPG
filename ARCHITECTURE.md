# MineGame RPG — Arquitetura simples para evolução

A regra principal é: cada coisa tem um lugar único. Uma nova mecânica deve ser adicionada no lugar responsável por ela, sem criar exceções espalhadas.

## 1. Dados
`data/items/` e `data/recipes/` contêm somente dados.

### Item Canvas
Um item visualmente desenhado usa:
- `visual:"nome"`
- `renderMode:"canvas"`
- não possui `icon`

O desenho deve ter uma única fonte. Hoje os itens Canvas são centralizados no ItemRenderer; visuais de recursos do mundo são compartilhados pelos renderizadores do mundo e pelo ItemRenderer. Uma futura migração deve preservar a mesma fonte visual sem duplicação.

## 2. Gameplay
`systems/` contém motores reutilizáveis:
- Inventory: quantidade e slots.
- Crafting: receitas.
- ItemBehaviorSystem: efeitos de uso.
- InteractionSystem: decide qual interação acontece.
- DropSystem: soltar/coletar.
- sistemas específicos: água, recursos, animais etc.

As caixas em `features/` são a camada que coordena essas regras quando uma
funcionalidade possui estado/entrada própria.

## 3. Visual
`core/Renderer.js` é a fronteira do Canvas.
`core/ItemRenderer.js` é a fonte principal dos desenhos dos itens.
Inventário e quickbar não acessam `renderer.ctx`.

## 4. Como adicionar um item novo
1. Crie `data/items/<item>.js`.
2. Registre no `catalog.js`.
3. Se for Canvas, use `renderMode:"canvas"` + `visual` e não use `icon`.
4. Coloque o visual na fonte de renderização correspondente.
5. Não altere InventoryUI/QuickbarUI para criar desenho duplicado.
6. Se houver comportamento novo, use ItemBehaviorSystem ou uma nova Feature.

## 5. Como adicionar uma mecânica
Pergunte primeiro qual caixa é dona da regra.
- jogador -> `features/player`
- cerca/construção -> `features/fence`
- ação/interação -> `features/interaction`
- drops -> `features/drops`
- animais -> `systems/AnimalSystem` (criar caixa quando crescer)
- transformação -> `systems/TransformationSystem`
- recursos -> `systems/ResourceInteraction`
- água -> `systems/WaterInteraction`
- item -> `ItemBehaviorSystem`
- craft -> `Crafting`
- render -> `core/*Renderer`

Se uma área começar a exigir vários arquivos/estado próprio, crie uma caixa
antes de aumentar GameLoop, Game.js, Player ou World.

## 6. Regra para futuras IAs
Não criar:
- if(item.id===...) espalhado;
- desenho duplicado;
- emoji como fallback de item Canvas;
- acesso direto de UI ao contexto Canvas;
- segunda fonte de verdade para item;
- regra específica dentro do GameLoop.

Antes de modificar, ler `AI_ARCHITECTURE.md` e `FEATURE_MAP.md`.

## 7. Proteções contra regressões de renderização
Uma chamada de desenho só pode existir depois que o método correspondente estiver implementado. Um erro nesse contrato pode interromper o render inteiro.

Antes de uma mudança visual:
1. procurar referências do item/visual;
2. confirmar métodos de desenho;
3. conferir mundo, mão, inventário, quickbar e craft;
4. confirmar que o game loop continua atualizando e renderizando.

## 8. Zona sensível: createItemIcon
A troca temporária de contexto Canvas deve ser síncrona e protegida por `finally`.
Nunca adicionar await/callback assíncrono nesse trecho.

## 9. Alteração segura
Se uma correção cabe em arquivo pequeno, não reescreva arquivo grande.
Preserve APIs existentes e faça commits pequenos.

## 10. Arquitetura em caixas para IA
`features/` é a camada de contexto local. Uma caixa deve concentrar estado,
entrada e regras de uma funcionalidade e oferecer uma API pequena.

Fluxo:
`Input -> Feature -> System/Entity -> Renderer/UI`

GameLoop apenas orquestra. Game.js apenas compõe.

### Caixas atuais
- `player`
- `fence`
- `interaction`
- `drops`

O mapa completo está em `FEATURE_MAP.md` e o manual para IA em
`AI_ARCHITECTURE.md`.

### Regra de expansão
Não criar um framework genérico. Criar uma caixa somente quando ela reduzir
o contexto necessário para entender/modificar uma funcionalidade.
