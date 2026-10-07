import { expect, test } from "@playwright/test";

test("quiz completo leva ao resultado e ao detalhe", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Começar agora" }).click();
  await expect(page.getByRole("heading", { name: "Onde você topa morar?" })).toBeVisible();

  // Escolha única avança sozinha quando vem de toque/clique.
  await page.getByText("Fortaleza ou Região Metropolitana").click();
  await expect(page.getByRole("heading", { name: "Para onde você vai quase todo dia?" })).toBeVisible();
  await page.getByText("Unifor", { exact: true }).click();
  await expect(page.getByRole("heading", { name: "Como você costuma se deslocar?" })).toBeVisible();
  await page.getByText("Ônibus ou metrô").click();

  // "Quem vai morar" não avança sozinha por causa do "Tenho pet".
  await expect(page.getByRole("heading", { name: "Quem vai morar com você?" })).toBeVisible();
  await page.getByText("Família com crianças").click();
  await page.getByText("Tenho pet").click();
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page.getByRole("heading", { name: "O que não pode faltar no condomínio?" })).toBeVisible();
  await page.getByText("Piscina", { exact: true }).click();
  await page.getByText("Playground", { exact: true }).click();
  await expect(page.getByText("2 de 3 escolhidas")).toBeVisible();
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page.getByRole("heading", { name: "E no bairro, o que pesa mais?" })).toBeVisible();
  await page.getByRole("button", { name: "Pular" }).click();

  await expect(page.getByRole("heading", { name: "Quando você quer se mudar?" })).toBeVisible();
  await page.getByText("O quanto antes").click();

  // Orçamento em faixas: a pessoa informa, o resultado nunca mostra preço.
  await expect(page.getByRole("heading", { name: "Quanto a família ganha por mês?" })).toBeVisible();
  await page.getByText("De R$ 4.700 a R$ 8.600").click();
  await expect(page.getByRole("heading", { name: "Quanto dá para dar de entrada?" })).toBeVisible();
  await page.getByText("De R$ 10 mil a R$ 30 mil").click();

  await expect(page).toHaveURL(/\/descobrir\/resultado\?.*r=r3&e=e2/);
  // Revelação do ranking no mapa, pulável
  await expect(page.getByRole("status", { name: /Encontramos o seu MRV/ })).toBeVisible();
  await page.getByRole("button", { name: "Pular" }).click();
  await expect(page.getByRole("status", { name: /Encontramos o seu MRV/ })).toBeHidden();

  // 1º lugar em filme, com o motivo e a compatibilidade
  await expect(page.getByText("#1 para você")).toBeVisible();
  await expect(page.getByText(/^\d+%$/).first()).toBeVisible();
  await expect(page.getByRole("tab", { name: "Piscina" })).toBeVisible();

  // do 2º ao 5º, com a diferença para o 1º
  await expect(page.getByRole("heading", { name: "Também combinam com você" })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(4);
  await expect(page.getByText(/até a Unifor/).first()).toBeVisible();
  await expect(page.getByText(/R\$/)).toHaveCount(0);

  await page.getByRole("link", { name: /Detalhes/ }).click();
  await expect(page.getByRole("heading", { name: "Por que combina com você" })).toBeVisible();
  await page.getByRole("link", { name: "Voltar ao meu resultado" }).click();
  await expect(page).toHaveURL(/\/descobrir\/resultado\?/);
});

test("quem prefere não informar a renda vai direto ao resultado", async ({ page }) => {
  await page.goto("/descobrir?o=fortaleza&d=centro&t=onibus&m=so&z=tanto_faz&passo=8");
  await expect(page.getByRole("heading", { name: "Quanto a família ganha por mês?" })).toBeVisible();
  await page.getByText("Prefiro não informar").click();
  await expect(page).toHaveURL(/\/descobrir\/resultado\?.*r=nao_informar/);
});

test("o voltar do navegador volta uma pergunta, sem perder a resposta", async ({ page }) => {
  await page.goto("/descobrir");
  await page.getByText("Só em Fortaleza").click();
  await expect(page.getByRole("heading", { name: "Para onde você vai quase todo dia?" })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Onde você topa morar?" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Só em Fortaleza" })).toBeChecked();
});

test("explorar filtra e o detalhe abre plantas em tela cheia", async ({ page }) => {
  await page.goto("/empreendimentos");
  await expect(page.getByText("16 empreendimentos")).toBeVisible();
  await page.getByRole("button", { name: "Caucaia" }).click();
  await expect(page.getByText("2 empreendimentos")).toBeVisible();
  await page.getByRole("link", { name: "Ville de Lisboa" }).click();
  await page.getByRole("button", { name: /Abrir planta 1/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("destino pode ser qualquer bairro, achado pela busca sem acento", async ({ page }) => {
  await page.goto("/descobrir?o=metropolitana&passo=2");
  await page.getByRole("searchbox", { name: "Buscar bairro ou lugar" }).fill("joao xx");
  await page.getByText("João XXIII").click();
  await expect(page.getByRole("heading", { name: "Como você costuma se deslocar?" })).toBeVisible();
  await expect(page).toHaveURL(/d=b\d+/);
});

test("mapa da Home mostra os 16 empreendimentos e abre o cartão", async ({ page }) => {
  await page.goto("/");
  const mapa = page.getByRole("group", { name: /Mapa de Fortaleza/ });
  await expect(mapa.getByRole("button")).toHaveCount(16);
  await mapa.getByRole("button", { name: /Eco Park/ }).click();
  await expect(page.getByRole("dialog", { name: "Eco Park" })).toBeVisible();
  await page.getByRole("dialog", { name: "Eco Park" }).getByRole("link", { name: "Conhecer" }).click();
  await expect(page).toHaveURL(/\/empreendimentos\/eco-park/);
});

test("leque do lazer abre a galeria na foto tocada e devolve o foco ao fechar", async ({ page }) => {
  await page.goto("/empreendimentos/ville-de-lisboa");
  const carta = page.getByRole("button", { name: "Ver foto: Espaço kids" });
  await carta.scrollIntoViewIfNeeded();
  await carta.click();
  const galeria = page.getByRole("dialog", { name: /Fotos do Ville de Lisboa/ });
  await expect(galeria).toBeVisible();
  // a foto tocada fica no topo da lista (a galeria rolou até ela)
  const foto = galeria.locator("li", { hasText: /espaço kids/i }).first();
  await expect(foto).toBeInViewport();
  await page.keyboard.press("Escape");
  await expect(galeria).toBeHidden();
  await expect(carta).toBeFocused();
});
