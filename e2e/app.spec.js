import { test, expect } from '@playwright/test';

async function openAccountPanel(page) {
  await page.locator('details.auth-disclosure summary').click();
}

async function openMoreTools(page) {
  await page.locator('details.sidebar-disclosure summary').click();
}

test('loads learning studio with grade navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-headline')).toContainText('Listen');
  await expect(page.locator('#grade-filters .pill-btn')).toHaveCount(8);
  await expect(page.locator('#skill-filters .pill-btn').first()).toBeVisible();
});

test('PreK word intro gallery shows picture and navigation', async ({ page }) => {
  await page.goto('/');
  await page.locator('#grade-filters .pill-btn', { hasText: 'PreK' }).click();
  await page.locator('#skill-filters .pill-btn', { hasText: 'Vocabulary' }).click();
  await page.locator('.exercise-item', { hasText: 'Learn: Hello & Manners' }).first().click();
  await expect(page.locator('.word-intro-activity')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.word-intro-card img, .word-intro-card .prek-prompt-emoji').first()).toBeVisible();
  await expect(page.locator('#word-intro-next')).toBeVisible();
  await expect(page.locator('.prek-mascot')).toBeVisible();
});

test('PreK picture vocab shows image choice cards', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#grade-filters .pill-btn')).toHaveCount(8);
  await page.locator('#grade-filters .pill-btn', { hasText: 'PreK' }).click();
  await expect(page.locator('body')).toHaveClass(/prek-mode/);
  await page.locator('#skill-filters .pill-btn', { hasText: 'Vocabulary' }).click();
  await page.locator('.exercise-item', { hasText: 'Quiz: Colors' }).first().click();
  await expect(page.locator('.prek-prompt-img')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.prek-choice-card')).toHaveCount(3);
  await expect(page.locator('.prek-choice-img').first()).toBeVisible();
  await expect(page.locator('.prek-mascot')).toBeVisible();
});

test('custom lesson mode toggle', async ({ page }) => {
  await page.goto('/');
  await page.locator('#btn-mode-custom').click();
  await expect(page.locator('#btn-mode-custom')).toHaveClass(/active/);
});

test('settings panel opens from more tools', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#grade-filters .pill-btn')).toHaveCount(8);
  await openMoreTools(page);
  await page.locator('#btn-settings-toggle').click();
  await expect(page.locator('#settings-dropdown')).toBeVisible();
  await expect(page.locator('#voice-engine')).toBeVisible();
  await expect(page.locator('#voice-engine option')).toHaveCount(7);
});

test('dashboard modal closes with Escape', async ({ page }) => {
  await page.goto('/');
  await page.locator('#btn-open-dashboard').click();
  await expect(page.locator('#dashboard-modal')).toBeVisible();
  await expect(page.locator('.modal-open-mask')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#dashboard-modal')).toBeHidden();
});

test('assignments panel shows when signed out', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#assignments-list')).toBeVisible();
  await expect(page.locator('#assignments-list')).toContainText(/No assignments|Sin tareas/i);
});

test('language toggle switches to Spanish', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#grade-filters .pill-btn')).toHaveCount(8);
  await openAccountPanel(page);
  await page.selectOption('#locale-select', 'es');
  await expect(page.locator('#btn-mode-curriculum')).toHaveText('Plan de estudios');
});

test('export progress button exists in more tools', async ({ page }) => {
  await page.goto('/');
  await openMoreTools(page);
  await expect(page.locator('#btn-export-progress')).toBeVisible();
});

test('parent consent checkbox is interactive', async ({ page }) => {
  await page.goto('/');
  await openAccountPanel(page);
  const consent = page.locator('#parent-consent');
  await expect(consent).toBeVisible();
  await consent.check();
  await expect(consent).toBeChecked();
});

test('session persists grade and skill across reload', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#grade-filters .pill-btn')).toHaveCount(8);
  await page.locator('#grade-filters .pill-btn', { hasText: 'Grade 2' }).click();
  await page.locator('#skill-filters .pill-btn', { hasText: 'Writing' }).click();
  await page.reload();
  await expect(page.locator('#grade-filters .pill-btn')).toHaveCount(8);
  await expect(page.locator('#grade-filters .pill-btn.active', { hasText: 'Grade 2' })).toBeVisible();
  await expect(page.locator('#skill-filters .pill-btn.active', { hasText: 'Writing' })).toBeVisible();
});

test('PreK defaults to Sounds when stored skill is invalid', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('DICTATER_SESSION', JSON.stringify({ grade: 'preK', skillArea: 'listening', lessonId: null }));
  });
  await page.reload();
  await expect(page.locator('#skill-filters .pill-btn.active', { hasText: 'Sounds' })).toBeVisible();
});

test('mobile lesson bar opens sidebar sheet', async ({ page }) => {
  await page.goto('/');
  await page.locator('#grade-filters .pill-btn', { hasText: 'Grade 3' }).click();
  await page.locator('#skill-filters .pill-btn', { hasText: 'Listening' }).click();
  await page.locator('.exercise-item').first().click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('#mobile-lesson-bar')).toBeVisible();
  await page.locator('#btn-change-lesson').click();
  await expect(page.locator('#sidebar-panel')).toHaveClass(/sidebar-panel--mobile-open/);
});

test('PreK activity shows post-check actions after answer', async ({ page }) => {
  await page.goto('/');
  await page.locator('#grade-filters .pill-btn', { hasText: 'PreK' }).click();
  await page.locator('#skill-filters .pill-btn', { hasText: 'Sounds' }).click();
  await page.locator('.exercise-item').first().click();
  await page.locator('.prek-choice-card').first().click();
  await expect(page.locator('.post-check-actions')).toBeVisible();
  await expect(page.locator('.post-check-actions button')).toHaveCount(2);
});

test('comprehension shows post-check actions after completion', async ({ page }) => {
  await page.goto('/');
  await page.locator('#grade-filters .pill-btn', { hasText: 'Grade 3' }).click();
  await page.locator('#skill-filters .pill-btn', { hasText: 'Reading' }).click();
  await page.locator('.exercise-item', { hasText: 'Park Story' }).first().click();
  await page.locator('.choice-btn').first().click();
  await page.locator('.choice-btn').first().click();
  await expect(page.locator('.post-check-actions')).toBeVisible();
  await expect(page.locator('.post-check-actions button')).toHaveCount(2);
});

test('teacher portal has class hub and report table', async ({ page }) => {
  await page.goto('/teacher.html');
  await expect(page.locator('#teacher-hub-section')).toBeAttached();
  await expect(page.locator('#class-hub-table')).toBeAttached();
  await expect(page.locator('#report-table')).toBeAttached();
});
