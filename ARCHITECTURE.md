# MineGame RPG — Arquitetura para evolução segura

O objetivo desta arquitetura é permitir que novas IAs continuem o projeto sem
precisar reescrever sistemas antigos para cada nova mecânica.

## Camadas

```text
data/       -> dados declarativos (itens, receitas)
entities/   -> estado/comportamento das entidades do mundo
systems/    -> regras de gameplay e orquestração
core/       -> renderização e infraestrutura do jogo
UI          -> apresentação e interação da interface
```

## Regra de dependência

Uma funcionalidade deve seguir, quando aplicável:

```text
DADO -> SISTEMA -> INTERAÇÃO -> UI/RENDER
```

O fluxo contrário deve ser evitado. Por exemplo, um item não deve conhecer o
DOM e o inventário não deve desenhar o item.

## Onde colocar cada coisa

### Novo item
`assets/js/data/items/<item>.js`

Depois registrar em `data/items/catalog.js`.

### Nova receita
`assets/js/data/recipes/<receita>.js`

Depois registrar em `data/recipes/index.js`.

### Nova regra de uso de item
`assets/js/systems/ItemBehaviorSystem.js`

Não adicionar regras específicas no `GameLoop`, `ItemInteraction` ou
`Inventory`.

### Nova regra de inventário
`assets/js/systems/Inventory.js`

Deve ser uma regra genérica, não uma regra específica de um item.

### Novo visual
`assets/js/core/ItemRenderer.js` ou outro renderer especializado quando a
complexidade justificar.

Não colocar Canvas em `data/` ou `systems/`.

### Nova interação do jogador
Usar/estender os sistemas de interação apropriados. O `InteractionSystem`
é o ponto de composição; os detalhes devem continuar separados.

### Nova entidade
Criar/alterar uma classe em `entities/` e colocar sua lógica de atualização
no sistema correspondente.

## Regras contra regressões

1. Não duplicar cadastro de item.
2. Não duplicar regra de uso de item.
3. Não duplicar receita em `Crafting.js` se ela já existe em `data/recipes`.
4. Não criar `if(item.id===...)` em vários arquivos para a mesma mecânica.
5. Não acessar diretamente o estado interno de outro sistema quando existir
   um método público para a operação.
6. Antes de alterar uma mecânica, rastrear todas as referências do ID/classe.
7. Fazer alterações pequenas e verificáveis.
8. Atualizar a versão em toda alteração entregue.

## Protocolo obrigatório para futuras IAs

Antes de alterar o código:

1. Ler `DEVELOPMENT_GUIDELINES.md`.
2. Ler este arquivo.
3. Ler os arquivos diretamente envolvidos na funcionalidade.
4. Identificar a fonte única da verdade.
5. Alterar somente a camada responsável.
6. Procurar referências antigas/imports antes de finalizar.
7. Atualizar versão e cache conforme as regras do projeto.
8. Revisar a cadeia completa da funcionalidade.

**Não vale criar uma solução rápida em um arquivo errado apenas porque ela é
mais curta. A arquitetura é parte da funcionalidade e deve ser preservada.**
