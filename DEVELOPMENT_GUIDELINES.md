# MineGame RPG — Boas práticas de desenvolvimento

## Checklist obrigatório antes de cada atualização

1. Preservar o que já funciona: ler os arquivos relacionados antes de editar e alterar somente o necessário.
2. Rastrear a cadeia completa: dados -> sistema -> UI -> renderização -> interação.
3. Usar fonte única da verdade para IDs, nomes, propriedades e visuais dos itens.
4. Separar testes de gameplay: quantidades artificiais não devem alterar as regras reais.
5. Cache e versão: incrementar a versão e atualizar index.html, game.js e parâmetros de cache relacionados.
6. Compatibilidade: procurar imports e versões antigas antes e depois da alteração.
7. Renderização: conferir mundo, inventário, quickbar, mão e preview quando um visual mudar.
8. Validação: conferir IDs, slots, quantidades e propriedades; não afirmar testes de navegador sem executá-los.
9. Commits pequenos e descritivos, sempre identificados com a versão.

## Arquitetura e responsabilidade dos arquivos

10. Uma responsabilidade por arquivo: cada arquivo deve cuidar de uma função bem definida e não acumular regras de sistemas diferentes.
11. Separar responsabilidades: dados/configuração, regras de gameplay, entidades, renderização, interface (UI), entrada do jogador e ciclo do jogo devem permanecer em módulos próprios quando a complexidade justificar.
12. Não colocar atalhos de teste, lógica de renderização, regras de gameplay ou manipulação de UI dentro de um arquivo que não seja responsável por aquela camada.
13. Antes de adicionar uma função, verificar se ela pertence ao arquivo atual. Se tiver outra responsabilidade, criar ou usar o módulo apropriado.
14. Evitar arquivos sobrecarregados: quando um arquivo começar a concentrar várias responsabilidades independentes, separar em módulos pequenos e claros sem quebrar as dependências existentes.
15. Preferir comunicação explícita entre módulos (imports, parâmetros e métodos) em vez de acessar ou modificar internamente a responsabilidade de outro sistema.

## Regra especial para evolução por IA

16. Antes de criar qualquer item, mecânica ou receita, ler `ARCHITECTURE.md` e o guia específico da camada alterada.
17. Não criar um novo padrão de item se já existir um padrão documentado.
18. Não resolver uma funcionalidade adicionando `if(item.id===...)` em vários sistemas. Criar/usar o sistema responsável.
19. Se uma função não pertence ao arquivo atual, não colocá-la ali apenas para reduzir o número de arquivos.
20. Comentários de arquitetura devem explicar **onde** uma futura IA deve adicionar a funcionalidade, não apenas explicar o que uma linha faz.
21. Sempre procurar duplicações de regra antes de adicionar uma nova implementação.

## Inventário e empilhamento

22. Respeitar sempre o `maxStack` definido no catálogo de itens. Itens não empilháveis (`maxStack:1`) devem ocupar apenas uma unidade por slot.
23. Quantidades de teste devem respeitar as regras reais do item. Para testes, usar no máximo 5 unidades nos itens empilháveis e 1 unidade nos não empilháveis.
24. Nunca aumentar `maxStack` no inventário apenas para fazer um teste. O catálogo continua sendo a fonte da regra real.

## Regra principal

Antes de cada nova atualização: entender o estado atual, preservar o que funciona, mudar o mínimo necessário, manter cada arquivo com responsabilidade clara, revisar dependências e cache, atualizar a versão e verificar a cadeia completa da funcionalidade.

A arquitetura documentada é uma regra do jogo: uma atualização que funciona mas mistura responsabilidades e cria duplicação não deve ser considerada concluída.
