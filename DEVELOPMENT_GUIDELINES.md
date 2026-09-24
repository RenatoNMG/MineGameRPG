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

## Regra principal

Antes de cada nova atualização: entender o estado atual, preservar o que funciona, mudar o mínimo necessário, revisar dependências e cache, atualizar a versão e verificar a cadeia completa da funcionalidade.
