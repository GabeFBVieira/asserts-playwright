# Testes E2E: LocatorLab

Suíte de testes end-to-end com [Playwright](https://playwright.dev/) (TypeScript) para a aplicação de laboratório https://locatorlab-testes.vercel.app.

## O que é coberto

| Teste | O que valida |
|---|---|
| Login (no `beforeEach`) | O usuário entra e é redirecionado para `/dashboard` |
| Upload de avatar | A imagem enviada no perfil fica visível |
| Tema claro/escuro | O `color-scheme` do `<html>` alterna entre `light` e `dark` nos dois sentidos |
| Filtro de status | Ao escolher "Concluída", a URL passa a conter `status=DONE` |
| Checkbox de tarefa | Marcar e desmarcar a tarefa altera o estado do checkbox |
| Toast com Clock API | O toast "Tarefa concluída." aparece e some após avançar o relógio |

## Pré-requisitos

- Node.js 18+
- Dependências e navegadores do Playwright:

```bash
npm install
npx playwright install
```

## Como rodar

```bash
# suíte completa (chromium, firefox e webkit)
npx playwright test 

# um navegador, com interface
npx playwright test --project=chromium --headed

# relatório da última execução
npx playwright show-report
```


## Decisões de projeto

- **Login no `beforeEach`:** todo teste começa logado. A asserção de URL garante que o login terminou antes de seguir.
- **Estado da tarefa normalizado:** o `describe` "Testar tarefa" tem um `beforeEach` que desmarca a tarefa se ela estiver concluída, para os testes não dependerem de execuções anteriores.
- **Clock API:** o relógio é instalado antes do `goto`, para controlar o tempo de vida do toast sem esperar em tempo real.

