import { test, expect } from "@playwright/test";
async function seedOrder(page, mode = "delivery") {
  await page.clock.install({ time: new Date("2026-09-15T14:00:00Z") });
  await page.addInitScript(
    ({ mode }) => {
      if (localStorage.getItem("nori-orders")) return;
      localStorage.setItem(
        "nori-orders",
        JSON.stringify([
          {
            id: "demo-123456",
            mode,
            table: mode === "table" ? "04" : null,
            total: 95.8,
            payment: "pix",
            address:
              mode === "delivery" ? "Rua de Teste, 123 · Fortaleza" : null,
            createdAt: new Date().toISOString(),
            simulationStartedAt: Date.now(),
            items: [
              {
                name: "Combinado Nori",
                qty: 1,
                price: 89.9,
                image:
                  "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100",
              },
            ],
          },
        ]),
      );
    },
    { mode },
  );
  await page.goto("/pedidos");
}
test("delivery advances automatically and stays completed after reload", async ({
  page,
}) => {
  await seedOrder(page);
  await expect(page.locator(".order-status")).toHaveText("Pedido confirmado");
  await expect(page.locator(".delivery-destination")).toContainText(
    "Rua de Teste, 123",
  );
  await page.clock.runFor(8500);
  await expect(page.locator(".order-status")).toHaveText("Em preparo");
  await page.clock.runFor(12000);
  await expect(page.locator(".order-status")).toHaveText("Saiu para entrega");
  await expect(page.locator(".courier-label")).toContainText("Rafa");
  await page.clock.runFor(21000);
  await expect(page.locator(".order-status")).toHaveText("Entregue");
  await expect(
    page.getByRole("button", { name: "Avançar simulação" }),
  ).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".order-status")).toHaveText("Entregue");
  await page.getByRole("link", { name: "Nori — início" }).first().click();
  await expect(page).toHaveURL("/");
  expect(await page.evaluate(() => document.fullscreenElement)).toBeNull();
});
test("table simulation advances manually and survives reload without a courier", async ({
  page,
}) => {
  await seedOrder(page, "table");
  await page.getByRole("button", { name: "Avançar simulação" }).click();
  await expect(page.locator(".order-status")).toHaveText("Em preparo");
  await page.getByRole("button", { name: "Avançar simulação" }).click();
  await expect(page.locator(".order-status")).toHaveText("A caminho da mesa");
  await page.reload();
  await expect(page.locator(".order-status")).toHaveText("A caminho da mesa");
  await expect(page.locator(".delivery-map")).toHaveCount(0);
  await page.getByRole("button", { name: "Avançar simulação" }).click();
  await expect(page.locator(".order-status")).toHaveText("Servido na mesa");
  await expect(page.locator(".delivery-destination")).toHaveText("Mesa 04");
});
