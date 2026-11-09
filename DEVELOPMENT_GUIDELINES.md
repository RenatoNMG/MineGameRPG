# MineGame RPG — Boas práticas

## Regra principal
Cada funcionalidade deve ter um único lugar responsável. Antes de editar, localizar o dono da regra e alterar somente esse módulo e suas dependências diretas.

## Arquitetura para IA
Leia primeiro:
1. `AI_ARCHITECTURE.md`
2. `FEATURE_MAP.md`
3. a caixa relacionada em `features/`
4. somente depois os sistemas/entidades diretamente usados.

A arquitetura usa caixas para reduzir o contexto necessário. GameLoop
orquestra; Game.js compõe; entidades guardam estado; sistemas são motores
reutilizáveis.

## Itens
- Cada item tem arquivo em `data/items/`.
- `catalog.js` é a fonte única dos itens.
- IDs são contratos estáveis.
- Item Canvas usa `renderMode:"canvas"` + `visual` e não possui `icon`.
- Não duplicar visual em InventoryUI, QuickbarUI ou CraftUI.

## Comportamentos
- Efeitos de uso ficam em ItemBehaviorSystem.
- Não espalhar `if(item.id===...)`.
- Inventário cuida de quantidade/slots.
- Crafting cuida das receitas.
- DropSystem cuida do motor de drops; DropFeature coordena entrada/coleta.
- PlayerFeature coordena movimento/necessidades/cooldown.
- InteractionFeature coordena ação/carregamento/interação.
- FenceFeature é dona do estado de construção da cerca.

## GameLoop
GameLoop não contém regra específica de item, animal, cerca ou recurso.
Ele apenas chama as caixas na ordem do ciclo.

## Entidades
Player, Tree, Stone, Chicken, Chick e Rooster devem permanecer focadas em
estado e operações mínimas. IA de animais e transformações pertencem aos
sistemas/features.

## Checklist antes de concluir
1. Ler a documentação de arquitetura.
2. Localizar a caixa/sistema dono.
3. Procurar referências do ID/API afetado.
4. Preservar mecânicas existentes.
5. Conferir update + render.
6. Para item visual, verificar mundo + mão + inventário + quickbar + craft.
7. Atualizar versão e cache.
8. Fazer commit pequeno e descritivo.
9. Não afirmar teste visual sem executar navegador.

## Proteção contra regressões
O bug histórico da cerca mostrou que uma chamada de desenho inválida dentro do
game loop pode parar todo o render. Sempre confirme consumidores e implementação.

Para `createItemIcon`, manter troca de contexto síncrona com `try/finally`.
Nunca adicionar operação assíncrona nessa região.

## Regra de migração
Não é necessário mover todos os sistemas para features de uma vez. Quando uma
área crescer, crie uma caixa que encapsule o sistema existente. Só depois,
em uma alteração isolada, migre o motor interno se isso trouxer benefício real.

## Regra de documentação
Toda nova caixa deve começar com comentário contendo responsabilidade,
limites, API, dependências e fluxo. Atualize `FEATURE_MAP.md` quando criar
uma caixa nova.
