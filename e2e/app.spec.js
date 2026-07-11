import { test, expect } from '@playwright/test';

test('loads learning studio with grade navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-headline')).toContainText('Listen');
  await expect(page.locator('#grade-filters .pill-btn')).toHaveCount(8);
  await expect(page.locator('#skill-filters .pill-btn').first()).toBeVisible();
});

test('PreK rhyme lesson renders choices', async ({ page }) => {
  await page.goto('/');
  await page.locator('#grade-filters .pill-btn', { hasText: 'PreK' }).click();
  await page.locator('#skill-filters .pill-btn', { hasText: 'Sounds' }).click();
  await page.locator('.exercise-item').first().click();
  await expect(page.locator('.choice-grid .choice-btn').first()).toBeVisible({ timeout: 10000 });
});

test('custom lesson mode toggle', async ({ page }) => {
  await page.goto('/');
  await page.locator('#btn-mode-custom').click();
  await expect(page.locator('#btn-mode-custom')).toHaveClass(/active/);
});

test('settings panel opens', async ({ page }) => {
  await page.goto('/');
  await page.locator('#btn-settings-toggle').click();
  await expect(page.locator('#voice-engine')).toBeVisible();
  await expect(page.locator('#voice-engine option')).toHaveCount(7);
});

test('session persists grade selection', async ({ page }) => {
  await page.goto('/');
  await page.locator('#grade-filters .pill-btn', { hasText: 'PreK' }).click();
  await page.reload();
  await expect(page.locator('#grade-filters .pill-btn.active')).toHaveText('PreK');
});
