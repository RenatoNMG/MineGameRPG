# Como adicionar um item com segurança

Este diretório contém **somente definições de dados dos itens**.

## 1. Criar o arquivo do item

Exemplo conceitual:

```js
export const BERRY={
  id:"berry",
  name:"Fruta",
  icon:"🍓",
  category:"food",
  maxStack:99,
  visual:"berry",
  effects:{hunger:15}
};
```

Não coloque neste arquivo:
- `if` espalhado para alterar o jogo;
- código de Canvas;
- manipulação de HTML/DOM;
- acesso direto ao GameLoop;
- lógica de inventário;
- lógica de craft.

## 2. Registrar no catálogo

Importe o item em `catalog.js` e adicione-o em `ITEMS`.

O catálogo é a **fonte única da verdade** para descobrir um item pelo ID.

## 3. Se o item for uma comida/consumível simples

Prefira dados declarativos:

- `category:"food"` + `effects.hunger` para comida;
- `category:"consumable"` + `heal`, `effects.hunger` ou `effects.thirst` para consumíveis.

Não crie um `if(item.id===...)` no `ItemInteraction`, `GameLoop` ou `Inventory`.

## 4. Se precisar de uma mecânica nova

Use o campo `behavior` no item e registre o comportamento no
`assets/js/systems/ItemBehaviorSystem.js`.

O comportamento deve receber um contexto e retornar `true` somente quando a
ação realmente tiver sido executada.

## 5. Se precisar de uma receita

Crie um arquivo separado em `assets/js/data/recipes/` e registre a receita em
`assets/js/data/recipes/index.js`.

O sistema de crafting não deve ter `if` específico para cada item/receita.

## 6. Se precisar de um visual novo

A regra é:

**mesmo item = mesmo visual conceitual no mundo, inventário, quickbar e mão.**

A implementação visual deve ficar na camada de renderização (`core`), nunca
no catálogo ou no sistema de gameplay.

## 7. Checklist antes de terminar

- [ ] ID único e estável.
- [ ] Arquivo próprio em `data/items/`.
- [ ] Registrado no `catalog.js`.
- [ ] `maxStack` correto.
- [ ] `visual` definido.
- [ ] Comportamento especial separado do catálogo.
- [ ] Receita separada, se existir.
- [ ] Nenhum `if(item.id===...)` desnecessário espalhado pelo jogo.
- [ ] Mundo, inventário, quickbar e mão continuam usando a mesma definição.
- [ ] Versão atualizada.
- [ ] Dependências/imports revisados.

> **Regra para futuras IAs:** antes de criar um item, leia este arquivo,
> `DEVELOPMENT_GUIDELINES.md` e o `catalog.js`. Não invente um novo padrão de
> item se já existir um padrão neste projeto.
