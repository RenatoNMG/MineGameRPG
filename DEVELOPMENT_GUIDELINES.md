# MineGame RPG — Boas práticas

## Regra principal
Cada funcionalidade deve ter um único lugar responsável. Antes de editar, localizar o módulo dono da regra e alterar somente esse módulo e suas dependências diretas.

## Itens
- Cada item tem um arquivo em data/items/.
- catalog.js é a fonte única dos itens.
- IDs são contratos e não devem ser renomeados sem revisar todas as referências.
- Item Canvas usa renderMode:"canvas" + visual único e NÃO possui icon.
- O desenho de Item Canvas existe somente em core/ItemRenderer.js.
- Mundo, mão, inventário, quickbar e craft usam o mesmo desenho.
- UI nunca acessa renderer.ctx para desenhar item.
- UI chama Renderer.createItemIcon(item,tamanho).
- Nunca criar um desenho especial da mesma cerca/comida/arma em InventoryUI ou QuickbarUI.

## Comportamentos
- Efeitos de uso ficam em ItemBehaviorSystem.
- Não espalhar if(item.id===...) por GameLoop, InventoryUI, QuickbarUI ou outros sistemas.
- Inventário cuida de quantidade e slots; não desenha.
- Crafting cuida das regras de receitas; receitas ficam em data/recipes.
- DropSystem cuida de soltar/coletar.

## Arquitetura
- core: Canvas, renderizadores e infraestrutura.
- data: dados declarativos.
- entities: estado das entidades.
- systems: regras de gameplay e UI.
- Game.js apenas monta os módulos.
- Se uma responsabilidade nova não couber claramente em um módulo existente, criar um sistema separado em vez de sobrecarregar outro.

## Checklist antes de concluir uma atualização
1. Ler ARCHITECTURE.md e os módulos envolvidos.
2. Procurar referências do ID afetado.
3. Preservar as mecânicas existentes.
4. Evitar duplicação de regra.
5. Para item visual, verificar mundo + mão + inventário + quickbar + craft.
6. Atualizar versão e cache.
7. Fazer commit pequeno e descritivo.
