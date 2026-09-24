# Caixas de funcionalidade — arquitetura para IA

Este projeto usa uma arquitetura modular orientada a **caixas**.

Uma caixa é uma funcionalidade pequena, com estado próprio, regras próprias,
entrada própria, dependências explícitas e uma interface pequena.

## Regra

Quando uma nova mecânica não pertence claramente a um sistema existente, crie:

`assets/js/features/<nome-da-feature>/`

A caixa deve esconder seus detalhes internos.

### Fluxo

`Input -> Feature -> estado/API -> Renderer/Gameplay`

O GameLoop apenas chama o ponto de atualização da caixa. Ele não deve conter
regras específicas da funcionalidade.

## Como uma IA deve trabalhar

1. Ler `ARCHITECTURE.md`.
2. Localizar a caixa relacionada.
3. Ler somente a caixa e suas dependências diretas.
4. Alterar a menor quantidade possível de arquivos.
5. Procurar todas as referências da API pública alterada.
6. Atualizar versão, cache e documentação.
7. Fazer um commit pequeno e descritivo.

## Dependências

Evite dependências circulares. Uma caixa pode usar infraestrutura comum, mas
não deve conhecer o jogo inteiro.

**Evitar:**

`Feature -> GameLoop -> Feature`

**Preferir:**

`Input -> Feature -> Renderer`

## Primeira caixa

`features/fence/FenceFeature.js` concentra a lógica específica da cerca:
orientação, rotação e preview.

O objetivo é que futuras IAs consigam modificar a cerca sem precisar carregar
todo o projeto na memória.
