import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

test("baseline: jogo renderiza floresta, personagem e HUD", async ({ page }) => {
  const consoleErrors = [];
  page.on("pageerror", error => consoleErrors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/");
  await expect(page).toHaveTitle(/MineGame RPG/);
  const canvas = page.locator("#game-canvas");
  await expect(canvas).toBeVisible();
  await expect(page.locator("#hp-value")).toHaveText("100 / 100");
  await expect(page.locator("#mana-value")).toHaveText("40 / 40");

  await page.waitForTimeout(300);
  const canvasHasContent = await canvas.evaluate(element => {
    const context = element.getContext("2d");
    const pixels = context.getImageData(0, 0, element.width, element.height).data;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i] !== 0 || pixels[i + 1] !== 0 || pixels[i + 2] !== 0 || pixels[i + 3] !== 0) return true;
    }
    return false;
  });
  expect(canvasHasContent).toBeTruthy();

  fs.mkdirSync(path.join("test-results", "screenshots"), { recursive: true });
  await page.screenshot({
    path: path.join("test-results", "screenshots", "baseline.png"),
    fullPage: true
  });

  await page.keyboard.down("d");
  await page.waitForTimeout(500);
  await page.keyboard.up("d");
  await page.screenshot({
    path: path.join("test-results", "screenshots", "after-movement.png"),
    fullPage: true
  });

  expect(consoleErrors, "O jogo não deve gerar erros no console").toEqual([]);
});
