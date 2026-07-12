import { test, expect } from '@playwright/test';

async function waitForAppReady(page) {
  await expect(page.locator('#grade-filters .pill-btn')).toHaveCount(8);
}

async function selectGrade(page, label) {
  await waitForAppReady(page);
  await page.locator('#grade-filters .pill-btn').filter({ hasText: label }).click();
}

async function selectSkill(page, label) {
  await page.locator('#skill-filters .pill-btn').filter({ hasText: label }).click();
}

async function openAccountPanel(page) {
  await waitForAppReady(page);
  await page.locator('details.auth-disclosure summary').click();
}

async function openMoreTools(page) {
  await waitForAppReady(page);
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
  await selectGrade(page, 'PreK');
  await selectSkill(page, 'Vocabulary');
  const lesson = page.locator('.exercise-item').filter({ hasText: 'Learn: Hello & Manners' }).first();
  await expect(lesson).toBeVisible();
  await lesson.click();
  await expect(page.locator('.word-intro-activity')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.word-intro-card img, .word-intro-card .prek-prompt-emoji').first()).toBeVisible();
  await expect(page.locator('#word-intro-next')).toBeVisible();
  await expect(page.locator('.prek-mascot')).toBeVisible();
});

test('PreK picture vocab shows image choice cards', async ({ page }) => {
  await page.goto('/');
  await selectGrade(page, 'PreK');
  await expect(page.locator('body')).toHaveClass(/prek-mode/);
  await selectSkill(page, 'Vocabulary');
  const lesson = page.locator('.exercise-item').filter({ hasText: 'Quiz: Colors' }).first();
  await expect(lesson).toBeVisible();
  await lesson.click();
  await expect(page.locator('.prek-prompt-img')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.prek-choice-card')).toHaveCount(3);
  await expect(page.locator('.prek-choice-img').first()).toBeVisible();
  await expect(page.locator('.prek-mascot')).toBeVisible();
});

test('PreK picture vocab shuffles choices and accepts correct answer', async ({ page }) => {
  const contentOrder = ['red', 'blue', 'green'];
  await page.addInitScript(() => {
    let call = 0;
    const values = [0.9, 0.1];
    Math.random = () => values[call++ % values.length];
  });
  await page.goto('/');
  await selectGrade(page, 'PreK');
  await selectSkill(page, 'Vocabulary');
  const lesson = page.locator('.exercise-item').filter({ hasText: 'Quiz: Colors (1)' }).first();
  await expect(lesson).toBeVisible();
  await lesson.click();
  await expect(page.locator('.prek-choice-card')).toHaveCount(3, { timeout: 10000 });
  const displayedLabels = await page.locator('.prek-choice-label').allTextContents();
  const normalized = displayedLabels.map((label) => label.trim().toLowerCase());
  expect(normalized).not.toEqual(contentOrder);
  const correctIndex = normalized.indexOf('red');
  expect(correctIndex).toBeGreaterThanOrEqual(0);
  const correctCard = page.locator('.prek-choice-card').nth(correctIndex);
  await correctCard.click();
  await expect(correctCard).toHaveClass(/choice-correct/);
  await expect(page.locator('#prek-feedback')).toHaveClass(/prek-feedback--yes/);
});

test('Spanish word intro shows localized strings', async ({ page }) => {
  await page.goto('/');
  await openAccountPanel(page);
  await page.selectOption('#locale-select', 'es');
  await selectGrade(page, 'PreK');
  await selectSkill(page, 'Vocabulary');
  const lesson = page.locator('.exercise-item').filter({ hasText: 'Learn: Hello & Manners' }).first();
  await expect(lesson).toBeVisible();
  await lesson.click();
  await expect(page.locator('.word-intro-activity')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#word-intro-next')).toHaveText('Siguiente →');
  await expect(page.locator('#word-intro-listen')).toHaveText('🔊 Escuchar');
  await expect(page.locator('#word-intro-prev')).toHaveText('← Atrás');
  await expect(page.locator('#word-intro-progress')).toContainText(/Palabra 1 de/i);
  await expect(page.locator('.prek-instruction')).toContainText(/toca Siguiente/i);
});

test('PreK review mix lesson shows picture choice cards', async ({ page }) => {
  await page.goto('/');
  await selectGrade(page, 'PreK');
  await selectSkill(page, 'Vocabulary');
  const lesson = page.locator('.exercise-item').filter({ hasText: 'Review Mix (1)' }).first();
  await expect(lesson).toBeVisible();
  await lesson.click();
  await expect(page.locator('.prek-choice-card')).toHaveCount(3, { timeout: 10000 });
  await expect(page.locator('.prek-choice-img').first()).toBeVisible();
  await expect(page.locator('.prek-prompt-img, .prek-prompt-label').first()).toBeVisible();
});

test('custom lesson mode toggle', async ({ page }) => {
  await page.goto('/');
  await waitForAppReady(page);
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

test('unit progress modal lists PreK vocabulary units', async ({ page }) => {
  await page.goto('/');
  await selectGrade(page, 'PreK');
  await selectSkill(page, 'Vocabulary');
  await expect(page.locator('#btn-open-unit-progress')).toBeVisible();
  await page.locator('#btn-open-unit-progress').click();
  await expect(page.locator('#unit-progress-modal')).toBeVisible();
  await expect(page.locator('.unit-progress-row')).toHaveCount(18);
  await expect(page.locator('.unit-progress-summary')).toContainText(/71|0 of 71/i);
  await page.keyboard.press('Escape');
  await expect(page.locator('#unit-progress-modal')).toBeHidden();
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
  await selectGrade(page, 'Grade 2');
  await selectSkill(page, 'Writing');
  await page.reload();
  await waitForAppReady(page);
  await expect(page.locator('#grade-filters .pill-btn.active').filter({ hasText: 'Grade 2' })).toBeVisible();
  await expect(page.locator('#skill-filters .pill-btn.active').filter({ hasText: 'Writing' })).toBeVisible();
});

test('PreK defaults to Sounds when stored skill is invalid', async ({ page }) => {
  await page.goto('/');
  await waitForAppReady(page);
  await page.evaluate(() => {
    localStorage.setItem('DICTATER_SESSION', JSON.stringify({ grade: 'preK', skillArea: 'listening', lessonId: null }));
  });
  await page.reload();
  await waitForAppReady(page);
  await expect(page.locator('#skill-filters .pill-btn.active').filter({ hasText: 'Sounds' })).toBeVisible();
});

test('mobile lesson bar opens sidebar sheet', async ({ page }) => {
  await page.goto('/');
  await selectGrade(page, 'Grade 3');
  await selectSkill(page, 'Listening');
  const lesson = page.locator('.exercise-item').first();
  await expect(lesson).toBeVisible();
  await lesson.click();
  await expect(page.locator('#current-title')).not.toHaveText(/Choose a lesson/i);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('#mobile-lesson-bar')).toBeVisible();
  await page.locator('#btn-change-lesson').click();
  await expect(page.locator('#sidebar-panel')).toHaveClass(/sidebar-panel--mobile-open/);
});

test('PreK activity shows post-check actions after answer', async ({ page }) => {
  await page.goto('/');
  await selectGrade(page, 'PreK');
  await selectSkill(page, 'Sounds');
  const lesson = page.locator('.exercise-item').first();
  await expect(lesson).toBeVisible();
  await lesson.click();
  await expect(page.locator('.prek-choice-card').first()).toBeVisible({ timeout: 10000 });
  await page.locator('.prek-choice-card').first().click();
  await expect(page.locator('.post-check-actions')).toBeVisible();
  await expect(page.locator('.post-check-actions button').first()).toBeVisible();
  expect(await page.locator('.post-check-actions button').count()).toBeGreaterThanOrEqual(1);
});

test('comprehension shows post-check actions after completion', async ({ page }) => {
  await page.goto('/');
  await selectGrade(page, 'Grade 3');
  await selectSkill(page, 'Reading');
  const lesson = page.locator('.exercise-item').filter({ hasText: 'The Park Story' }).first();
  await expect(lesson).toBeVisible();
  await lesson.click();
  await expect(page.locator('.choice-btn').first()).toBeVisible({ timeout: 10000 });
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
