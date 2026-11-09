# MineGame RPG — Arquitetura pensada para IA

## Objetivo

O projeto deve ser fácil de modificar por uma IA com contexto limitado. A IA
não deve precisar entender o jogo inteiro para alterar uma mecânica pequena.

A regra é **contexto local + contrato pequeno + dono único**.

## As 5 camadas

1. **data/** — dados declarativos: itens e receitas.
2. **entities/** — estado puro de entidades/objetos do mundo.
3. **features/** — caixas de funcionalidades; cada caixa coordena uma mecânica.
4. **systems/** — motores reutilizáveis usados pelas caixas.
5. **core/** — infraestrutura, mundo e renderização.

Fluxo preferido:

Input -> Feature -> System/Entity -> Renderer/UI

## O que é uma caixa

Uma caixa em `features/<nome>/` deve ter:
- uma responsabilidade;
- dependências explícitas;
- poucos métodos públicos;
- estado específico da funcionalidade;
- comentários dizendo claramente o que NÃO pertence nela.

O GameLoop apenas orquestra caixas. Game.js apenas monta caixas.

## Mapa atual

| Funcionalidade | Caixa | Motor interno | Estado principal |
|---|---|---|---|
| Jogador/movimento/necessidades | features/player | Player | Player |
| Cerca/rotação/preview | features/fence | FencePlacement/Renderer | FenceFeature |
| Ação/interação/carregar animais | features/interaction | InteractionSystem + Carry | Player/World |
| Drops/soltar/coleta de recursos | features/drops | DropSystem | World/Inventory |
| Animais | systems/AnimalSystem | entidades animais | World |
| Transformações ovo/animal/carne | systems/TransformationSystem | entidades + itens | World |
| Recursos árvore/pedra | systems/ResourceInteraction | ToolSystem | World/Inventory |
| Água | systems/WaterInteraction | WorldQuery | World/Player |
| Inventário | systems/Inventory | catálogo de itens | Inventory |
| Craft | systems/Crafting | data/recipes | Inventory |
| Itens/uso | systems/ItemSystem + ItemBehaviorSystem | data/items | Item |
| Colisão | systems/CollisionSystem | entidades do mundo | World |
| Geração | systems/WorldGenerator | entidades | World |
| UI | systems/*UI | DOM + Renderer API | Game/UI |
| Renderização | core/*Renderer | Canvas | Renderer |

### Regra importante

Um sistema listado no mapa não é uma desculpa para colocar novas regras
espalhadas nele. Se uma mecânica ficar grande ou possuir estado próprio,
crie uma caixa e use o sistema como motor interno.

## Objetos do jogo

### Itens
A definição fica em `data/items/<id>.js` e o catálogo é a fonte única.
Comportamento fica em ItemBehaviorSystem. Visual deve ter uma única fonte.

### Entidades
Player, Tree, Stone, Chicken, Chick e Rooster guardam estado e operações
mínimas da própria entidade. Regras de ciclo/IA devem ficar em features/systems.

### Objetos do mundo
World é o contêiner do estado do mapa. CollisionSystem e WorldQuery são as
portas para consultar/alterar o mundo sem espalhar loops pelo projeto.

## Regra visual

Um item não pode ter uma aparência independente para mundo, mão, inventário,
quickbar ou craft.

Canvas:
- `renderMode:"canvas"`
- `visual:"nome"`
- sem `icon` como segunda fonte.

A UI chama apenas `renderer.createItemIcon()`.

## Como uma IA deve fazer uma atualização

1. Ler este arquivo e `ARCHITECTURE.md`.
2. Procurar a funcionalidade em `FEATURE_MAP.md`.
3. Abrir a caixa correspondente.
4. Ler somente dependências diretas.
5. Se não houver caixa, criar uma.
6. Alterar o menor número possível de arquivos.
7. Procurar todas as referências da API/ID afetada.
8. Conferir fluxo de update e render.
9. Atualizar versão/cache e documentação.
10. Fazer commit pequeno e descritivo.

## Anti-regressão

Nunca adicionar uma chamada `drawX()` sem confirmar sua implementação.
Nunca remover/renomear uma API sem procurar seus consumidores.
Nunca mover regra para GameLoop só por ser conveniente.
Nunca transformar Player ou World em depósito de regras de uma mecânica.
Nunca fazer uma feature depender de Game.js inteiro.

## Regra de evolução

A arquitetura não deve ser "refatorada inteira" a cada nova mecânica.
Primeiro encaixe a funcionalidade na caixa correta. Migrações maiores devem
ser pequenas, isoladas e reversíveis.
