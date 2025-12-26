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

    await page.waitForSelector('text=/have allergies|Tienes alergias/i', { timeout: 20000 });

    const saveButton = page.locator('text=/Save allergies|Guardar alergias/i');
    const skipButton = page.locator('text=/I don\'t have allergies|No tengo alergias/i');
    
    await expect(saveButton).toBeVisible();
    await expect(skipButton).toBeVisible();

    await skipButton.click();

    await expect(page.locator('text=/Hello|Hola/i')).toBeVisible({ timeout: 10000 });

    await expect(page.locator('text=/Create new list|Crear nueva lista/i')).toBeVisible();
    await expect(page.locator('text=/Search new recipes|Buscar nuevas recetas/i')).toBeVisible();
    await expect(page.locator('text=/Plan the week|Planificar la semana/i')).toBeVisible();
  });

  test('usuario selecciona alergenos y completa onboarding', async ({ page }) => {
    await page.goto('/onboarding');

    await page.waitForSelector('text=/have allergies|Tienes alergias/i', { timeout: 20000 });

    await page.locator('text=Gluten').click();

    await page.locator('text=/Save allergies|Guardar alergias/i').click();

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
