import { test, expect } from "@playwright/test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QRCodeSVG } from "qrcode.react";
import { demoTables } from "../src/tables.js";
async function qrImage(context, value) {
  const fixture = await context.newPage();
  await fixture.setContent(
    renderToStaticMarkup(
      React.createElement(QRCodeSVG, { value, size: 300, marginSize: 4 }),
    ),
  );
  const png = await fixture.locator("svg").screenshot();
  await fixture.close();
  return png;
}
test("dedicated pages preserve table UID, favorites and browser history", async ({
  page,
  isMobile,
}) => {
  const uid = demoTables[3].uid;
  await page.goto(`/?mesa=${uid}`);
  const nav = page.getByRole("navigation", {
    name: isMobile ? "Navegação principal" : "Navegação do site",
    exact: true,
  });
  await nav.getByRole("link", { name: "Cardápio", exact: true }).click();
  await expect(page).toHaveURL(`/cardapio?mesa=${uid}`);
  await expect(page.locator(".hero")).toHaveCount(0);
  await expect(
    nav.getByRole("link", { name: "Cardápio", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page
    .getByRole("button", {
      name: "Adicionar Combinado Nori aos favoritos",
      exact: true,
    })
    .click();
  await nav.getByRole("link", { name: "Favoritos", exact: true }).click();
  await expect(page).toHaveURL(`/favoritos?mesa=${uid}`);
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".location")).toContainText("Mesa 04");
  await nav.getByRole("link", { name: "Pedidos", exact: true }).click();
  await expect(page).toHaveURL(`/pedidos?mesa=${uid}`);
  await expect(
    page.getByRole("heading", { name: "Meus pedidos." }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(`/favoritos?mesa=${uid}`);
  await page
    .getByRole("button", {
      name: "Remover Combinado Nori dos favoritos",
      exact: true,
    })
    .click();
  await expect(page.locator(".product-card")).toHaveCount(0);
});
test("client scans an actual QR image and opens its opaque table URL", async ({
  page,
  context,
}) => {
  await page.goto("/");
  const origin = new URL(page.url()).origin;
  const uid = demoTables[3].uid;
  const png = await qrImage(context, `${origin}/cardapio?mesa=${uid}`);
  await page.getByRole("button", { name: "Presencial", exact: true }).click();
  await page
    .locator("input[type=file]")
    .setInputFiles({ name: "mesa.png", mimeType: "image/png", buffer: png });
  await expect(page).toHaveURL(`/cardapio?mesa=${uid}`);
  await expect(page.locator(".location")).toContainText("Mesa 04");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Presencial", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("scanner rejects forged QR IDs and explains denied camera access", async ({
  page,
  context,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: () =>
          Promise.reject(new DOMException("Denied", "NotAllowedError")),
      },
    });
  });
  await page.goto("/");
  const png = await qrImage(
    context,
    `${new URL(page.url()).origin}/cardapio?mesa=12`,
  );
  await page.getByRole("button", { name: "Presencial", exact: true }).click();
  await page.getByRole("button", { name: "Ativar câmera" }).click();
  await expect(page.getByRole("alert")).toContainText("Permita o acesso");
  await page
    .locator("input[type=file]")
    .setInputFiles({ name: "invalid.png", mimeType: "image/png", buffer: png });
  await expect(page.getByRole("alert")).toContainText(
    "QR code não reconhecido",
  );
  await expect(page).toHaveURL("/");
  await page.getByRole("button", { name: "Fechar", exact: true }).click();
  await expect(
    page.getByRole("link", { name: /QR codes das mesas/ }),
  ).toHaveCount(0);
});
