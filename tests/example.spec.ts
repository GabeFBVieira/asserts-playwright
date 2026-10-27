import { test, expect, Page } from "@playwright/test";

const URL = "https://locatorlab-testes.vercel.app/login";
const USUARIO = { nome: "aluno@locatorlab.dev", senha: "Aluno@123" };

async function fazerLogin(page: Page, nome: string, senha: string) {
  await page.getByPlaceholder("voce@exemplo.com").fill(nome);
  await page.getByPlaceholder("Sua senha").fill(senha);
  await page.getByRole("button", { name: "Entrar" }).click();
}

test.describe("Autenticação", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await fazerLogin(page, USUARIO.nome, USUARIO.senha);
    await expect(page).toHaveURL(/dashboard/)

  })
  test("Fazer upload", async({page}) => {
    await page.getByRole("button", {name: "Abrir menu do usuário"}).click()
    await page.getByRole("menuitem",{ name:"Meu perfil"}).click()
    await page.locator("[id=avatar]").setInputFiles("tests/singer-ozzy-osbourne.jpg")
    await page.getByRole("button", {name: "Enviar imagem"}).click()
    const avatar = page.getByTestId('profile-avatar-image')
    await expect(avatar).toBeVisible()
  })

  test("Checkbox", async ({page}) => {
    await page.goto("https://locatorlab-testes.vercel.app/tasks")
    await page.locator("[data-testid=task-done-checkbox-24]").click()
    await expect(page.locator("[data-testid=task-done-checkbox-24]")).toBeChecked()
  })
  test("Testar acionamento modo escuro/claro", async({page}) =>{
    await page.getByRole("button", {name:"Alternar entre tema claro e escuro"}).click()
    await expect(page.locator("html")).toHaveCSS("color-scheme", "dark") 
  })
  test("Testar filtro de status de tarefas", async({page}) =>{
    await page.goto("https://locatorlab-testes.vercel.app/tasks")
    const filtroConcluido = page.getByTestId("tasks-status-filter")
    await filtroConcluido.selectOption("DONE")
    await expect(page).toHaveURL(/status=DONE/)
  })
});


