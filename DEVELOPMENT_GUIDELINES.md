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


## Proteção contra regressões

O caso da cerca mostrou que uma chamada de desenho ausente dentro do game loop pode fazer o jogo inteiro parar de renderizar. Portanto, nunca adicionar ou renomear drawX sem procurar suas chamadas e confirmar a implementação.

Se uma alteração pequena puder ser feita em um arquivo pequeno, não reescrever um arquivo grande inteiro. Preservar APIs existentes e alterar o menor número possível de arquivos.

Para createItemIcon: a troca temporária de contexto Canvas é protegida por try/finally e deve continuar síncrona. Nunca colocar await ou callbacks assíncronos nessa região.

Para itens com visual especial, não criar uma segunda implementação em UI. O visual deve ser centralizado no ItemRenderer antes de ser reutilizado.

Checklist adicional: procurar referências do ID/visual, conferir mundo + mão + inventário + quickbar + craft, confirmar métodos de desenho existentes, confirmar game loop ativo e somente então atualizar versão/commit.


## Arquitetura em caixas

Funcionalidades independentes devem ser isoladas em `assets/js/features/<feature>/`.

Uma caixa deve possuir estado e regras próprios e oferecer uma API pequena.
GameLoop não recebe regras específicas da funcionalidade; ele apenas chama a
caixa durante o ciclo de atualização.

Antes de criar código novo, procurar uma caixa existente. Se não existir uma
caixa adequada, criar uma em vez de aumentar GameLoop, Game.js ou Player.

A primeira caixa é `features/fence/FenceFeature.js`.

O objetivo é reduzir o contexto necessário para futuras IAs: uma mudança em
uma funcionalidade deve exigir leitura de uma caixa pequena + suas
dependências diretas, e não do projeto inteiro.
