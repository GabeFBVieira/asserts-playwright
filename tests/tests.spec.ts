import { test, expect, Page } from "@playwright/test";

const URL = "https://locatorlab-testes.vercel.app/login";
const USUARIO = { nome: "aluno@locatorlab.dev", senha: "Aluno@123" };

async function fazerLogin(page: Page, nome: string, senha: string) {
  await page.getByPlaceholder("voce@exemplo.com").fill(nome);
  await page.getByPlaceholder("Sua senha").fill(senha);
  await page.getByRole("button", { name: "Entrar" }).click();
}
// No describe abaixo, o test de login já é validado automaticamente através do assert utilizando a url
test.describe("Aplicação Laboratório", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await fazerLogin(page, USUARIO.nome, USUARIO.senha);
    await expect(page).toHaveURL(/dashboard/);
  });
  //No teste abaixo, se utilizou os seguintes asserts: testar se o upload da imagem está sendo feito.
  test("Fazer upload", async ({ page }) => {
    await page.getByRole("button", { name: "Abrir menu do usuário" }).click();
    await page.getByRole("menuitem", { name: "Meu perfil" }).click();
    await page
      .locator("[id=avatar]")
      .setInputFiles("tests/singer-ozzy-osbourne.jpg");
    await page.getByRole("button", { name: "Enviar imagem" }).click();
    const avatar = page.getByTestId("profile-avatar-image");
    await expect(avatar).toBeVisible();
  });
  // asserts utilizados no teste abaixo: testar se as cores alternavam utilizando o seletor CSS color scheme para validar o case. Utilizei o ToHaveCSS pois de acordo com a inspeção realizada na página, achei que seria o mais adequado. o teste abaixo valida os dois cases, tanto escuro quanto claro.
  test("Testar acionamento modo escuro/claro", async ({ page }) => {
    await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
    await page
      .getByRole("button", { name: "Alternar entre tema claro e escuro" })
      .click();
    await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
    await page
      .getByRole("button", { name: "Alternar entre tema claro e escuro" })
      .click();
    await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
  });
  // o teste abaixo utiliza o toHaveURL pois a forma encontrada para se certificar que houve mudança do status das tarefas, pois o elemento que se alterava conforme o status era a URL, e também era o mais estável.
  test("Testar filtro de status de tarefas", async ({ page }) => {
    await page.goto("https://locatorlab-testes.vercel.app/tasks");
    const filtroConcluido = page.getByTestId("tasks-status-filter");
    await filtroConcluido.selectOption("DONE");
    await expect(page).toHaveURL(/status=DONE/);
  });
  // Nos testes abaixo, foi utilizado um before each para permitir que o status da checkbox sempre esteja desmarcado, e assim o teste possa ser realizado sem falhas. No caso desses testes, ele testa se a checkbox da tarefa está de fato funcionando e testa o pop-up que aparece quando a tarefa é marcada como concluída. Foi utilizado o clock para lidar com o sumiço do pop-up. A ferramenta permite que o aparecimento e o desaparecimento do pop up possa ser validado.
  test.describe("Testar tarefa", () => {
    test.beforeEach(async ({ page }) => {
      const checkbox = page.locator("[data-testid=task-done-checkbox-24]");
      await page.goto("https://locatorlab-testes.vercel.app/tasks");
      await expect(checkbox).toBeVisible();
      if (await checkbox.isChecked()) {
        await checkbox.click();
      }
      await expect(checkbox).not.toBeChecked();
    });
    test("Checkbox", async ({ page }) => {
      const checkbox = page.locator("[data-testid=task-done-checkbox-24]");
      await expect(checkbox).not.toBeChecked();
      await checkbox.click();
      await expect(checkbox).toBeChecked();
      await checkbox.click();
      await expect(checkbox).not.toBeChecked();
    });
    test("Testa a notificação pop-up com API clock", async ({ page }) => {
      const checkbox = page.locator("[data-testid=task-done-checkbox-24]");
      await page.clock.install();
      await page.goto("https://locatorlab-testes.vercel.app/tasks");
      await expect(checkbox).not.toBeChecked();
      await checkbox.click();
      const toast = page
        .getByTestId("toast-success")
        .filter({ hasText: "Tarefa concluída" });
      await expect(toast).toBeVisible();
      await page.clock.fastForward(5000);
      await expect(toast).toBeHidden();
      await checkbox.click();
      await expect(checkbox).not.toBeChecked();
    });
  });
});
