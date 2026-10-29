import { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly campoUsuario: Locator;
  readonly campoSenha: Locator;
  readonly botaoEntrar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.campoUsuario = page.getByPlaceholder("voce@exemplo.com");
    this.campoSenha = page.getByPlaceholder("Sua senha");
    this.botaoEntrar = page.getByRole("button", { name: "Entrar" });
  }

  async goto() {
    await this.page.goto(
      "https://locatorlab-testes.vercel.app/login",
    );
  }
  async login(usuario: string, senha: string) {
    await this.campoUsuario.fill(usuario);
    await this.campoSenha.fill(senha);
    await this.botaoEntrar.click();
  }
}

export class AvatarPage {
  readonly page: Page;
  readonly botaoAbrirMenu: Locator;
  readonly botaoMeuPerfil: Locator;
  readonly localizarImagem: Locator;
  readonly botaoEnviarImagem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.botaoAbrirMenu = page.getByRole("button", {
      name: "Abrir menu do usuário",
    });
    this.botaoMeuPerfil = page.getByRole("menuitem", { name: "Meu perfil" });
    this.localizarImagem = page.locator("[id=avatar]");
    this.botaoEnviarImagem = page.getByRole("button", {
      name: "Enviar imagem",
    });
  }

  async entrarMenu() {
    await this.botaoAbrirMenu.click();
    await this.botaoMeuPerfil.click();
  }

  async uploadImagem() {
    await this.localizarImagem.setInputFiles("tests/singer-ozzy-osbourne.jpg");
    await this.botaoEnviarImagem.click();
  }
}

export class ModoEscuroClaro {
  readonly page: Page;
  readonly botaoAlternarEscuroClaro: Locator;

  constructor(page: Page) {
    this.page = page;
    this.botaoAlternarEscuroClaro = page.getByRole("button", {
      name: "Alternar entre tema claro e escuro",
    });
  }
  async alternarLuz() {
    await this.botaoAlternarEscuroClaro.click();
  }
}

export class FiltroStatusTarefa {
    readonly page: Page;
    readonly filtroConcluido: Locator;
 
constructor(page: Page){
    this.page = page;
    this.filtroConcluido = page.getByTestId("tasks-status-filter");
}
 async goto() {
    await this.page.goto(
      "https://locatorlab-testes.vercel.app/tasks",
    );
  }
async selection(){
    await this.filtroConcluido.selectOption("DONE")
}
}

export class TestTask{
    readonly page: Page
    readonly checkbox: Locator
    readonly toast: Locator

constructor(page: Page){
    this.page = page;
    this.checkbox = page.locator("[data-testid=task-done-checkbox-24]");
    this.toast = page
        .getByTestId("toast-success")
        .filter({ hasText: "Tarefa concluída" });
}
async uncheckcheckbox(){
    if(await this.checkbox.isChecked()){
        await this.checkbox.click()
    } 
}
async goto() {
    await this.page.goto(
      "https://locatorlab-testes.vercel.app/tasks",
    );
  }
async clickbox(){
    await this.checkbox.click()
}
}