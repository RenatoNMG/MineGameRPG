# MineGame RPG — Arquitetura simples para evolução

A regra principal é: cada coisa tem um lugar único. Uma nova mecânica deve ser adicionada no lugar responsável por ela, sem criar exceções espalhadas.

## 1. Dados
`data/items/` e `data/recipes/` contêm somente dados.

### Item Canvas
Um item visualmente desenhado usa:
- `visual:"nome"`
- `renderMode:"canvas"`
- não possui `icon`

O desenho fica somente em `core/ItemRenderer.js`.

## 2. Gameplay
`systems/` contém regras:
- Inventory: quantidade e slots.
- Crafting: receitas.
- ItemBehaviorSystem: efeitos de uso.
- InteractionSystem: decide qual interação acontece.
- DropSystem: soltar/coletar.
- sistemas específicos: água, recursos, animais etc.

Uma regra específica de um item não deve ser espalhada por vários sistemas.

## 3. Visual
`core/Renderer.js` é a fronteira do Canvas.

`core/ItemRenderer.js` é a fonte única dos desenhos dos itens.

O fluxo visual é:

data do item → ItemRenderer → mundo / inventário / quickbar / mão

Inventário e quickbar não desenham Canvas e nunca acessam `renderer.ctx` para montar um item. Eles chamam apenas `renderer.createItemIcon(item,tamanho)`.

Isso garante que o mesmo item use o mesmo desenho em todos os lugares.

## 4. Como adicionar um item novo

### Item simples com emoji
Crie `data/items/apple.js`, coloque os dados e registre no `catalog.js`.

### Item com Canvas
1. Crie `data/items/apple.js`.
2. Defina `visual:"apple"` e `renderMode:"canvas"`.
3. Não coloque emoji no item.
4. Adicione `apple` ao `ItemRenderer`.
5. Não altere InventoryUI ou QuickbarUI para desenhar a maçã.
6. Teste mundo, inventário, quickbar e mão.

## 5. Como adicionar uma mecânica

Pergunte primeiro: qual sistema é dono dessa regra?

Exemplo:
- comer → ItemBehaviorSystem;
- receita → data/recipes + Crafting;
- soltar → DropSystem;
- água → WaterInteraction;
- colisão → CollisionSystem;
- animal → entidade + AnimalSystem;
- desenho → Renderer/ItemRenderer.

Se nenhuma categoria existente servir, crie um novo sistema. Não coloque a regra em Game.js só porque ele já conhece todos os módulos.

## 6. Regra para futuras IAs

Não criar:
- if(item.id===...) espalhado;
- desenho duplicado no inventário;
- desenho duplicado na quickbar;
- emoji como fallback de item Canvas;
- acesso direto de UI ao contexto Canvas;
- uma segunda fonte de verdade para item.

Antes de modificar uma mecânica, localizar o módulo responsável e ler seus comentários.

Objetivo: adicionar uma coisa nova alterando poucos arquivos previsíveis, sem precisar entender ou reescrever o jogo inteiro.


## 9. Proteções contra regressões de renderização

### Caso da cerca
Uma chamada de desenho só pode existir depois que o método correspondente estiver implementado no ItemRenderer. Um erro nesse contrato pode interromper o render inteiro, porque o desenho acontece dentro do game loop.

Antes de concluir uma mudança visual: procurar todas as referências do item/visual, confirmar que cada método chamado existe e preservar o fluxo Renderer → game loop.

### Zona sensível: createItemIcon
O método cria um Canvas pequeno para a interface e reutiliza temporariamente o contexto do Renderer. A troca deve ser síncrona e o contexto original deve sempre ser restaurado em finally. Nunca adicionar await ou operação assíncrona nesse trecho.

### Regra de alteração segura
Se uma correção puder ser feita em um arquivo pequeno, não reescrever um arquivo grande inteiro. Alterações grandes aumentam o risco de apagar métodos, chamadas ou dependências que já funcionavam.

### Item com visual especial
Se um item possui desenho especial no mundo ou na mão e esse mesmo desenho precisa aparecer nas interfaces, não criar uma segunda versão em InventoryUI, QuickbarUI ou CraftUI. Primeiro centralizar o visual no ItemRenderer e então reutilizar a mesma fonte.

### Checklist antes de concluir
1. Ler ARCHITECTURE.md e DEVELOPMENT_GUIDELINES.md.
2. Identificar o módulo dono da regra.
3. Procurar todas as referências do ID/visual afetado.
4. Conferir mundo, mão, inventário, quickbar e craft quando aplicável.
5. Confirmar que todo método chamado pelo renderizador existe.
6. Confirmar que o game loop continua atualizando e renderizando.
7. Atualizar versão e cache.
8. Fazer commit pequeno e descritivo.
9. Não afirmar teste visual sem executar o navegador.
