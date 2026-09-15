import { test, expect } from "@playwright/test";
test("delivery cart survives reload and completes a Pix demo", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Um match com a sua fome." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page
    .getByRole("button", { name: "Adicionar Combinado Nori", exact: true })
    .click();
  await page.reload();
  await page.locator(".bag-button").click();
  await expect(page.locator(".cart-summary .total")).toContainText("95,80");
  await page.getByRole("button", { name: "Continuar para pagamento" }).click();
  await page.getByLabel("Como podemos chamar você?").fill("Cliente Teste");
  await page
    .getByLabel("Endereço completo de entrega")
    .fill("Rua de Teste, 123, Centro, Fortaleza / CE");
  await page.getByRole("button", { name: "Escolher pagamento" }).click();
  await page.getByRole("button", { name: /Simular pagamento Pix/ }).click();
  await expect(
    page.getByRole("heading", { name: "Seu pedido está confirmado." }),
  ).toBeVisible();
  await expect(page.locator(".order-receipt")).toContainText("95,80");
  await expect(page.locator(".bag-button b")).toHaveText("0");
});
test("QR table link completes card demo without delivery fee", async ({
  page,
}) => {
  await page.goto("/?mesa=12");
  await expect(page.locator(".location")).toContainText("Mesa 12");
  await page
    .getByRole("button", {
      name: "Adicionar Uramaki Philadelphia",
      exact: true,
    })
    .click();
  await page.locator(".bag-button").click();
  await expect(page.locator(".cart-summary .total")).toContainText("29,90");
  await page.getByRole("button", { name: "Continuar para pagamento" }).click();
  await expect(page.getByLabel("Número da mesa")).toHaveValue("12");
  await expect(page.getByLabel("Número da mesa")).not.toBeEditable();
  await page.getByLabel("Como podemos chamar você?").fill("Teste Mesa");
  await page.getByRole("button", { name: "Escolher pagamento" }).click();
  await page.getByRole("button", { name: "Cartão Crédito" }).click();
  await page.getByLabel("Nome no cartão (fictício)").fill("TESTE CLIENTE");
  await page
    .getByLabel("Número do cartão de teste")
    .fill("4242 4242 4242 4242");
  await page.getByLabel("Validade", { exact: true }).fill("12/30");
  await page.getByLabel("CVV fictício").fill("123");
  await page.getByRole("button", { name: /Simular pagamento ·/ }).click();
  await expect(
    page.getByRole("heading", { name: "Seu pedido está confirmado." }),
  ).toBeVisible();
  await expect(page.locator(".success")).toContainText("mesa 12");
});
test("search, categories and cart removal work", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("O que você está com vontade?").fill("tropical");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Limpar busca" }).click();
  await page
    .locator(".categories")
    .getByRole("button", { name: "Combos" })
    .click();
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Adicionar Combinado Nori", exact: true })
    .click();
  await page.locator(".bag-button").click();
  await page.getByRole("button", { name: "Diminuir Combinado Nori" }).click();
  await expect(
    page.getByRole("heading", { name: "Falta um pouco de sushi por aqui" }),
  ).toBeVisible();
});

test("mode is fixed by entry link and invalid table links use delivery", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".service-label")).toHaveText("Delivery");
  await expect(
    page.getByRole("button", { name: "Na mesa", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Pedir na mesa", exact: true }),
  ).toHaveCount(0);
  await page.goto("/?mesa=07");
  await expect(page.locator(".service-label")).toHaveText("Mesa 07");
  await expect(page.locator(".location")).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Delivery", exact: true }),
  ).toHaveCount(0);
  await page.goto("/?mesa=abc");
  await expect(page.locator(".service-label")).toHaveText("Delivery");
});
