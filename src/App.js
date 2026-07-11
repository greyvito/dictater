import './activities/index.js';
import { buildCurriculumIndex, getLessonsBySkill, getLessonById } from './curriculum/loader.js';
import { GRADES, gradeLabel, skillAreaForType, skillAreasForGrade } from './curriculum/schema.js';
import { renderActivity } from './activities/registry.js';
import {
  speakText,
  loadVoices,
  stopSpeech,
  bindSettingsPanel,
  setToastHandler
} from './speech/tts.js';
import {
  loadStats,
  saveStats,
  loadBadges,
  saveBadges,
  loadProfile,
  saveProfile,
  loadCustomLessons,
  saveCustomLessons,
  loadSkillMastery,
  saveSkillMastery,
  loadPlacementResults,
  savePlacementResults,
  loadSession,
  saveSession,
  calculateStreak,
  mirrorStatsToIndexedDB
} from './app/storage.js';
import {
  buildPlacementTest,
  recordSkillResult,
  recommendNextLesson
} from './adaptive/engine.js';
import { syncProgress, loginUser, fetchAssignments } from './app/api.js';
import {
  trackEvent,
  applyI18n,
  getLocale,
  setLocale,
  t,
  exportAnalyticsBlob
} from './i18n/strings.js';
import { applyPrekTheme } from './prek/theme.js';

export class DictaterApp {
  constructor() {
    const session = loadSession();
    this.grade = session.grade || '3';
    this.skillArea = session.skillArea || 'listening';
    this.pendingLessonId = session.lessonId;
    this.viewMode = 'curriculum';
    this.difficulty = 'all';
    this.currentLesson = null;
    this.stats = loadStats();
    this.badges = loadBadges();
    this.profile = loadProfile();
    this.customLessons = loadCustomLessons();
    this.skillMastery = loadSkillMastery();
    this.placement = loadPlacementResults();
    this.locale = getLocale();
    this.assignments = [];
  }

  async init() {
    await buildCurriculumIndex();
    setToastHandler((msg, type) => this.showToast(msg, type));
    this.bindShell();
    loadVoices();
    bindSettingsPanel();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        loadVoices();
        bindSettingsPanel();
      };
    }
    applyI18n(this.locale);
    const localeSelect = document.querySelector('#locale-select');
    if (localeSelect) localeSelect.value = this.locale;
    if (this.profile.authToken) {
      await this.refreshAssignments();
      document.querySelector('#auth-status').textContent = `${t('signedInAs', this.locale)} ${this.profile.email}`;
    }
    this.restoreSession();
    this.renderSetup();
    this.renderAssignments();
    this.renderRecommendations();
    this.updatePrekTheme();
    console.log('[Dictater] ELA platform initialized');
  }

  updatePrekTheme() {
    applyPrekTheme(this.grade === 'preK');
  }

  saveSessionState() {
    saveSession({
      grade: this.grade,
      skillArea: this.skillArea,
      lessonId: this.currentLesson?.id || null
    });
  }

  restoreSession() {
    if (this.pendingLessonId) {
      const lesson = getLessonById(this.pendingLessonId);
      const skillMatches = lesson && skillAreaForType(lesson.type) === this.skillArea;
      if (lesson && skillMatches && (lesson.grade === this.grade || lesson.grade === 'Custom')) {
        this.loadLesson(lesson, { skipSave: true });
        return;
      }
      this.pendingLessonId = null;
    }
  }

  bindShell() {
    document.querySelector('#btn-open-dashboard')?.addEventListener('click', () => {
      this.updateDashboard();
      this.openModal('#dashboard-modal');
    });
    document.querySelector('#btn-dashboard-close')?.addEventListener('click', () => this.closeModal('#dashboard-modal'));
    document.querySelector('#btn-settings-toggle')?.addEventListener('click', () => {
      document.querySelector('#settings-dropdown')?.classList.toggle('hidden');
    });
    document.querySelector('#btn-settings-close')?.addEventListener('click', () => {
      document.querySelector('#settings-dropdown')?.classList.add('hidden');
    });
    document.querySelector('#btn-mode-curriculum')?.addEventListener('click', () => {
      this.viewMode = 'curriculum';
      this.renderSetup();
    });
    document.querySelector('#btn-mode-custom')?.addEventListener('click', () => {
      this.viewMode = 'custom';
      this.renderSetup();
    });
    document.querySelector('#btn-placement')?.addEventListener('click', () => this.runPlacement());
    document.querySelector('#btn-auth-login')?.addEventListener('click', () => this.handleLogin());
    document.querySelector('#btn-auth-logout')?.addEventListener('click', () => this.handleLogout());
    document.querySelector('#btn-open-lesson-creator')?.addEventListener('click', () => this.openModal('#lesson-creator-modal'));
    document.querySelector('#btn-creator-close')?.addEventListener('click', () => this.closeModal('#lesson-creator-modal'));
    document.querySelector('#btn-creator-save')?.addEventListener('click', () => this.saveCustomLesson());
    document.querySelector('#locale-select')?.addEventListener('change', (e) => {
      this.locale = e.target.value;
      setLocale(this.locale);
      applyI18n(this.locale);
      this.renderAssignments();
      this.renderSetup();
    });
    document.querySelector('#btn-export-progress')?.addEventListener('click', () => this.exportProgress());
  }

  async refreshAssignments() {
    try {
      this.assignments = await fetchAssignments(this.profile);
    } catch {
      this.assignments = [];
    }
    this.renderAssignments();
  }

  renderAssignments() {
    const panel = document.querySelector('#assignments-list');
    if (!panel) return;
    panel.innerHTML = '';
    if (!this.profile.authToken) {
      panel.innerHTML = `<p class="settings-note">${t('noAssignments', this.locale)}</p>`;
      return;
    }
    if (!this.assignments.length) {
      panel.innerHTML = `<p class="settings-note">${t('noAssignments', this.locale)}</p>`;
      return;
    }
    this.assignments.forEach((a) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'exercise-item';
      const due = a.dueDate ? ` · ${t('due', this.locale)} ${a.dueDate}` : '';
      btn.innerHTML = `<div class="exercise-title-text">${a.title || a.lessonId}</div><span class="exercise-badge badge-diff-intermediate">${a.lessonId}</span>`;
      btn.title = a.lessonId + due;
      btn.addEventListener('click', () => {
        const lesson = getLessonById(a.lessonId);
        if (lesson) {
          this.viewMode = 'curriculum';
          this.loadLesson(lesson);
          trackEvent('assignment_opened', { assignmentId: a.id, lessonId: a.lessonId });
        } else {
          this.showToast(`Lesson ${a.lessonId} not found in curriculum`, 'warning');
        }
      });
      panel.appendChild(btn);
    });
  }

  exportProgress() {
    const blob = exportAnalyticsBlob(this.stats);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dictater-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    trackEvent('progress_exported', { records: this.stats.length });
    this.showToast('Progress exported', 'success');
  }

  renderSetup() {
    const gradeEl = document.querySelector('#grade-filters');
    const skillEl = document.querySelector('#skill-filters');
    const lessonEl = document.querySelector('#exercise-list');
    const customPanel = document.querySelector('#custom-lessons-panel');
    if (!gradeEl || !skillEl || !lessonEl) return;

    document.querySelector('#btn-mode-curriculum')?.classList.toggle('active', this.viewMode === 'curriculum');
    document.querySelector('#btn-mode-custom')?.classList.toggle('active', this.viewMode === 'custom');

    if (this.viewMode === 'custom') {
      gradeEl.closest('.setup-step')?.classList.add('hidden');
      skillEl.closest('.setup-step')?.classList.add('hidden');
      customPanel?.classList.remove('hidden');
      this.renderCustomLessons(lessonEl);
      return;
    }

    gradeEl.closest('.setup-step')?.classList.remove('hidden');
    skillEl.closest('.setup-step')?.classList.remove('hidden');
    customPanel?.classList.add('hidden');

    gradeEl.innerHTML = '';
    GRADES.forEach((g) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `pill-btn grade-filter ${g === this.grade ? 'active' : ''}`;
      btn.textContent = gradeLabel(g);
      btn.addEventListener('click', () => {
        this.grade = g;
        this.currentLesson = null;
        this.pendingLessonId = null;
        this.saveSessionState();
        this.updatePrekTheme();
        this.renderSetup();
      });
      gradeEl.appendChild(btn);
    });

    skillEl.innerHTML = '';
    const areas = skillAreasForGrade(this.grade);
    // Keep the active skill valid for the selected grade. Early grades
    // (PreK/K) land on Vocabulary since learners can't read yet.
    if (!areas.some((s) => s.id === this.skillArea)) {
      this.skillArea = areas[0].id;
    }
    areas.forEach((s) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `pill-btn skill-filter ${s.id === this.skillArea ? 'active' : ''}`;
      btn.innerHTML = `<span aria-hidden="true">${s.icon}</span> ${s.label}`;
      btn.addEventListener('click', () => {
        this.skillArea = s.id;
        this.currentLesson = null;
        this.pendingLessonId = null;
        this.saveSessionState();
        this.updatePrekTheme();
        this.renderSetup();
      });
      skillEl.appendChild(btn);
    });

    let lessons = getLessonsBySkill(this.grade, this.skillArea);
    if (this.difficulty !== 'all') {
      lessons = lessons.filter((l) => l.difficulty === this.difficulty);
    }

    lessonEl.innerHTML = '';
    if (!lessons.length) {
      lessonEl.innerHTML = '<p class="empty-state">No lessons yet for this skill. Try another area.</p>';
      return;
    }

    lessons.forEach((lesson) => {
      const div = document.createElement('div');
      div.className = `exercise-item ${this.currentLesson?.id === lesson.id ? 'active' : ''}`;
      div.innerHTML = `
        <div class="exercise-title-text">${lesson.title}</div>
        <span class="exercise-badge badge-diff-${lesson.difficulty || 'beginner'}">${(lesson.difficulty || 'beginner').toUpperCase()}</span>`;
      div.addEventListener('click', () => this.loadLesson(lesson));
      lessonEl.appendChild(div);
    });

    if (!this.currentLesson && lessons[0] && !this.pendingLessonId) {
      this.loadLesson(lessons[0]);
    }
    this.pendingLessonId = null;
  }

  renderCustomLessons(container) {
    container.innerHTML = '';
    if (!this.customLessons.length) {
      container.innerHTML = '<p class="empty-state">No saved lessons. Create one below.</p>';
      return;
    }
    this.customLessons.forEach((lesson) => {
      const div = document.createElement('div');
      div.className = `exercise-item ${this.currentLesson?.id === lesson.id ? 'active' : ''}`;
      div.innerHTML = `
        <div class="exercise-title-text">${lesson.title}</div>
        <span class="exercise-badge badge-grade-6">Custom</span>`;
      div.addEventListener('click', () => this.loadLesson(lesson));
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'btn-secondary btn-compact-sm';
      del.textContent = 'Delete';
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        this.customLessons = this.customLessons.filter((l) => l.id !== lesson.id);
        saveCustomLessons(this.customLessons);
        this.renderSetup();
      });
      div.appendChild(del);
      container.appendChild(div);
    });
  }

  renderRecommendations() {
    const el = document.querySelector('#recommended-lesson');
    if (!el) return;
    const completed = new Set(this.stats.map((s) => s.exerciseId));
    const next = recommendNextLesson(this.grade, this.skillMastery, completed);
    if (next) {
      el.innerHTML = `<button type="button" class="btn-secondary btn-compact" id="rec-btn">Continue: ${next.title}</button>`;
      el.querySelector('#rec-btn').addEventListener('click', () => {
        this.viewMode = 'curriculum';
        this.grade = next.grade;
        this.skillArea = skillAreaForType(next.type);
        this.renderSetup();
        this.loadLesson(next);
      });
    } else if (this.currentLesson) {
      el.innerHTML = `<span class="settings-note">Last lesson: ${this.currentLesson.title}</span>`;
    } else {
      el.textContent = 'Pick a grade and skill to start learning.';
    }
  }

  loadLesson(lesson, opts = {}) {
    stopSpeech();
    this.currentLesson = lesson;
    if (lesson.grade && lesson.grade !== 'Custom') this.grade = lesson.grade;
    this.skillArea = skillAreaForType(lesson.type);
    if (!opts.skipSave) this.saveSessionState();
    this.updatePrekTheme();

    document.querySelector('#current-title').textContent = lesson.title;
    document.querySelector('#current-meta').textContent = `${gradeLabel(lesson.grade)} • ${this.skillArea} • ${lesson.type.replace(/_/g, ' ')}`;
    const badge = document.querySelector('#level-badge-container');
    if (badge) {
      badge.innerHTML = `<span class="exercise-badge badge-diff-${lesson.difficulty || 'beginner'}">${(lesson.difficulty || 'beginner').toUpperCase()}</span>`;
    }
    const hintEl = document.querySelector('#lesson-hint');
    if (hintEl) hintEl.textContent = lesson.hint || '';

    const workspace = document.querySelector('#activity-workspace');
    renderActivity(lesson.type, {
      lesson,
      container: workspace,
      speak: (text) => speakText(text),
      showToast: (msg, type) => this.showToast(msg, type),
      onComplete: (result) => this.handleComplete(lesson, result)
    });
    this.renderSetup();
    this.renderRecommendations();
  }

  handleComplete(lesson, result) {
    const record = {
      id: 'rec-' + Date.now(),
      exerciseId: lesson.id,
      title: lesson.title,
      type: lesson.type,
      score: result.score,
      date: new Date().toISOString().split('T')[0],
      skills: lesson.skills || [skillAreaForType(lesson.type)]
    };
    this.stats.push(record);
    this.stats = saveStats(this.stats);
    mirrorStatsToIndexedDB(record);
    this.skillMastery = recordSkillResult(this.skillMastery, lesson, result.score);
    saveSkillMastery(this.skillMastery);
    this.evaluateBadges(record);
    syncProgress(this.profile, record).catch(() => {});
    trackEvent('lesson_complete', { lessonId: lesson.id, type: lesson.type, score: result.score });
    this.renderRecommendations();
    this.showToast(`Score saved: ${result.score}%`, 'success');
  }

  evaluateBadges(record) {
    let updated = false;
    if (!this.badges.firstSteps && this.stats.length >= 1) { this.badges.firstSteps = true; updated = true; }
    if (!this.badges.speakingStarter && record.type.startsWith('speak')) { this.badges.speakingStarter = true; updated = true; }
    if (!this.badges.clearSpeaker && record.type.startsWith('speak') && record.score >= 90) { this.badges.clearSpeaker = true; updated = true; }
    if (!this.badges.readingExplorer && record.type === 'comprehension') { this.badges.readingExplorer = true; updated = true; }
    if (!this.badges.phonicsMaster && record.type.includes('phonics')) { this.badges.phonicsMaster = true; updated = true; }
    if (!this.badges.customScholar && record.exerciseId.startsWith('custom-')) { this.badges.customScholar = true; updated = true; }
    if (!this.badges.streakExplorer && calculateStreak(this.stats) >= 3) { this.badges.streakExplorer = true; updated = true; }
    if (updated) { saveBadges(this.badges); this.showToast('Achievement unlocked!', 'achievement'); }
  }

  updateDashboard() {
    const total = this.stats.length;
    document.querySelector('#stat-completed').textContent = total;
    document.querySelector('#stat-accuracy').textContent = total
      ? Math.round(this.stats.reduce((a, r) => a + r.score, 0) / total) + '%'
      : '0%';
    document.querySelector('#stat-streak').textContent = calculateStreak(this.stats) + ' Days';
    document.querySelector('#stat-speaking').textContent = this.stats.filter((r) => r.type.startsWith('speak')).length;

    const badgesDef = [
      { key: 'firstSteps', icon: '🎈', title: 'First Steps', desc: 'Complete first lesson' },
      { key: 'speakingStarter', icon: '🎙️', title: 'Speaking Starter', desc: 'Finish a speaking lesson' },
      { key: 'clearSpeaker', icon: '🗣️', title: 'Clear Speaker', desc: '90%+ on speaking' },
      { key: 'readingExplorer', icon: '📖', title: 'Reading Explorer', desc: 'Complete comprehension' },
      { key: 'customScholar', icon: '🛠️', title: 'Custom Scholar', desc: 'Finish a custom lesson' },
      { key: 'streakExplorer', icon: '🔥', title: 'Streak Explorer', desc: '3-day streak' }
    ];
    const grid = document.querySelector('#badges-grid');
    grid.innerHTML = '';
    badgesDef.forEach((b) => {
      const card = document.createElement('div');
      card.className = `badge-card ${this.badges[b.key] ? '' : 'locked'}`;
      card.innerHTML = `<span class="badge-icon">${b.icon}</span><span class="badge-title">${b.title}</span><span class="badge-desc">${b.desc}</span>`;
      grid.appendChild(card);
    });

    const log = document.querySelector('#dashboard-activity-log');
    log.innerHTML = '';
    [...this.stats].reverse().slice(0, 10).forEach((entry) => {
      const row = document.createElement('div');
      row.className = 'activity-log-entry';
      row.innerHTML = `<span>${entry.title}</span><span class="activity-log-score">${entry.score}%</span>`;
      log.appendChild(row);
    });
  }

  runPlacement() {
    const items = buildPlacementTest(this.grade);
    this.placement[this.grade] = { items: items.map((i) => i.id), startedAt: Date.now() };
    savePlacementResults(this.placement);
    if (items[0]) {
      this.loadLesson(items[0]);
      this.showToast('Placement started — complete lessons to build your path', 'info');
    }
  }

  async handleLogin() {
    const email = document.querySelector('#auth-email')?.value?.trim();
    const parentConsent = document.querySelector('#parent-consent')?.checked;
    if (!email) { this.showToast('Enter an email to sign in', 'warning'); return; }
    if (!parentConsent) {
      this.showToast(t('parentConsent', this.locale), 'warning');
      return;
    }
    try {
      const result = await loginUser(email, { parentConsent });
      this.profile = { ...this.profile, ...result, authToken: result.token, email };
      saveProfile(this.profile);
      document.querySelector('#auth-status').textContent = `${t('signedInAs', this.locale)} ${email}`;
      await this.refreshAssignments();
      this.showToast('Signed in successfully', 'success');
      trackEvent('user_login', { email });
    } catch {
      this.showToast('Sign in failed — using offline mode', 'warning');
    }
  }

  handleLogout() {
    this.profile = { ...this.profile, authToken: null, userId: null, email: null };
    saveProfile(this.profile);
    this.assignments = [];
    document.querySelector('#auth-status').textContent = t('offlineMode', this.locale);
    this.renderAssignments();
  }

  saveCustomLesson() {
    const title = document.querySelector('#creator-title')?.value?.trim();
    const type = document.querySelector('#creator-type')?.value;
    const content = document.querySelector('#creator-content')?.value?.trim();
    const hint = document.querySelector('#creator-hint')?.value?.trim();
    if (!title || !content) { this.showToast('Title and content required', 'warning'); return; }
    const lesson = {
      id: 'custom-' + Date.now(),
      grade: 'Custom',
      type: type === 'words' ? 'spelling' : type === 'speak' ? 'speak_word' : 'dictation',
      title,
      hint,
      difficulty: 'beginner',
      skills: type === 'words' ? ['spelling'] : type === 'speak' ? ['speaking'] : ['listening', 'writing'],
      content: type === 'words' || type === 'speak'
        ? { words: content.split(',').map((w) => w.trim()) }
        : { text: content }
    };
    this.customLessons.push(lesson);
    saveCustomLessons(this.customLessons);
    this.closeModal('#lesson-creator-modal');
    this.viewMode = 'custom';
    this.renderSetup();
    this.loadLesson(lesson);
    this.showToast('Custom lesson saved — opening now', 'success');
  }

  openModal(sel) { document.querySelector(sel)?.classList.remove('hidden'); }
  closeModal(sel) { document.querySelector(sel)?.classList.add('hidden'); }

  showToast(message, type = 'info') {
    const container = document.querySelector('#toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }
}
