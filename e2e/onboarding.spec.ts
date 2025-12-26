import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('usuario completa el onboarding y ve el home', async ({ page }) => {
    await page.goto('/onboarding');

    await expect(page.locator('[data-testid="splash-screen"]')).toBeVisible({ timeout: 10000 });

    await page.locator('[data-testid="onboarding-layout"]').waitFor({ state: 'visible', timeout: 20000 });

    const progressBar = page.locator('[data-testid="onboarding-progress"]');
    await expect(progressBar).toBeVisible();

    const closeButton = page.locator('[data-testid="onboarding-close-button"]');
    await expect(closeButton).toBeVisible();

    const primaryButton = page.locator('[data-testid="onboarding-primary-button"]');
    const secondaryButton = page.locator('[data-testid="onboarding-secondary-button"]');

    await expect(primaryButton).toBeVisible();
    await expect(secondaryButton).toBeVisible();

    await secondaryButton.click();

    await page.locator('[data-testid="onboarding-layout"]').waitFor({ state: 'visible', timeout: 5000 });
    await secondaryButton.click();

    await expect(page.locator('text=/Hello|Hola/i')).toBeVisible({ timeout: 10000 });

    await expect(page.locator('text=/Create new list|Crear nueva lista/i')).toBeVisible();
    await expect(page.locator('text=/Search new recipes|Buscar nuevas recetas/i')).toBeVisible();
    await expect(page.locator('text=/Plan the week|Planificar la semana/i')).toBeVisible();
  });

  test('usuario navega entre pasos y completa onboarding', async ({ page }) => {
    await page.goto('/onboarding');

    await page.locator('[data-testid="onboarding-layout"]').waitFor({ state: 'visible', timeout: 20000 });

    const primaryButton = page.locator('[data-testid="onboarding-primary-button"]');
    await primaryButton.click();

    await page.waitForTimeout(500);

    const backButton = page.locator('[data-testid="onboarding-back-button"]');
    await expect(backButton).toBeVisible();

    await backButton.click();

    await page.waitForTimeout(500);

    await primaryButton.click();
    await primaryButton.click();

    await expect(page.locator('text=/Hello|Hola/i')).toBeVisible({ timeout: 10000 });

    const hasOnboarding = await page.evaluate(() => {
      return localStorage.getItem('comelo_has_onboarding');
    });
    expect(hasOnboarding).toBe('true');
  });

  test('usuario puede cerrar el onboarding en cualquier momento', async ({ page }) => {
    await page.goto('/onboarding');

    await page.locator('[data-testid="onboarding-layout"]').waitFor({ state: 'visible', timeout: 20000 });

    const closeButton = page.locator('[data-testid="onboarding-close-button"]');
    await expect(closeButton).toBeVisible();

    await closeButton.click();

    await expect(page.locator('text=/Hello|Hola/i')).toBeVisible({ timeout: 10000 });

    const hasOnboarding = await page.evaluate(() => {
      return localStorage.getItem('comelo_has_onboarding');
    });
    expect(hasOnboarding).toBe('true');
  });

  test('splash screen se muestra correctamente', async ({ page }) => {
    await page.goto('/onboarding');

    const splashScreen = page.locator('[data-testid="splash-screen"]');
    await expect(splashScreen).toBeVisible({ timeout: 5000 });
  });
});
