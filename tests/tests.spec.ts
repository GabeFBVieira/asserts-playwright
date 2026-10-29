import { test, expect } from "@playwright/test";
import { LoginPage, AvatarPage, ModoEscuroClaro, FiltroStatusTarefa,TestTask } from "../pages/page";

const USUARIO = { nome: "aluno@locatorlab.dev", senha: "Aluno@123" };

// No describe abaixo, o test de login já é validado automaticamente através do assert utilizando a url
test.describe("Aplicação Laboratório", () => {
  test.beforeEach(async({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USUARIO.nome, USUARIO.senha);
    await expect(page).toHaveURL(/dashboard/);
  })
  
  //No teste abaixo, se utilizou os seguintes asserts: testar se o upload da imagem está sendo feito.

  test("Fazer upload", async ({ page }) => {
    const avatarPage = new AvatarPage(page);
    await avatarPage.entrarMenu();
    await avatarPage.uploadImagem();
    const avatar = page.getByTestId("profile-avatar-image");
    await expect(avatar).toBeVisible();
  });
  
  
  // asserts utilizados no teste abaixo: testar se as cores alternavam utilizando o seletor CSS color scheme para validar o case. Utilizei o ToHaveCSS pois de acordo com a inspeção realizada na página, achei que seria o mais adequado. o teste abaixo valida os dois cases, tanto escuro quanto claro.

  test("Testar acionamento modo escuro/claro", async ({ page }) => {
    const Luz = new ModoEscuroClaro(page);
    await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
    await Luz.alternarLuz();
    await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
    await Luz.alternarLuz();
    await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
  });
  
  // o teste abaixo utiliza o toHaveURL pois a forma encontrada para se certificar que houve mudança do status das tarefas, pois o elemento que se alterava conforme o status era a URL, e também era o mais estável.

  test("Testar filtro de status de tarefas", async ({ page }) => {
    const testarFiltro = new FiltroStatusTarefa(page)
    await testarFiltro.goto()
    await testarFiltro.selection();
    await expect(page).toHaveURL(/status=DONE/);
  });
  
  // Nos testes abaixo, foi utilizado um before each para permitir que o status da checkbox sempre esteja desmarcado, e assim o teste possa ser realizado sem falhas. No caso desses testes, ele testa se a checkbox da tarefa está de fato funcionando e testa o pop-up que aparece quando a tarefa é marcada como concluída. Foi utilizado o clock para lidar com o sumiço do pop-up. A ferramenta permite que o aparecimento e o desaparecimento do pop up possa ser validado.

  test.describe("Testar tarefa", () => {
    test.beforeEach(async ({ page }) => {
      const testTask = new TestTask(page)
      await testTask.goto()
      await expect(testTask.checkbox).toBeVisible();
      await testTask.uncheckcheckbox()
      await expect(testTask.checkbox).not.toBeChecked();
    });
    test("Checkbox", async ({ page }) => {
      const testTask = new TestTask(page)
      await expect(testTask.checkbox).not.toBeChecked();
      await testTask.clickbox()
      await expect(testTask.checkbox).toBeChecked();
      await testTask.clickbox()
      await expect(testTask.checkbox).not.toBeChecked();
    });
    test("Testa a notificação pop-up com API clock", async ({ page }) => {
      const testTask = new TestTask(page)
      await page.clock.install();
      await testTask.goto()
      await expect(testTask.checkbox).not.toBeChecked();
      await testTask.clickbox()
      await expect(testTask.toast).toBeVisible();
      await page.clock.fastForward(5000);
      await expect(testTask.toast).toBeHidden();
      await testTask.clickbox();
      await expect(testTask.checkbox).not.toBeChecked();
    });
  });
});
