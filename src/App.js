import './activities/index.js';
import { buildCurriculumIndex, getLessonsBySkill, getLessonById } from './curriculum/loader.js';
import { GRADES, SKILL_AREAS, gradeLabel, skillAreaForType } from './curriculum/schema.js';
import { renderActivity } from './activities/registry.js';
import { speakText, loadVoices, setTTSOptions, stopSpeech } from './speech/tts.js';
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
  calculateStreak,
  mirrorStatsToIndexedDB
} from './app/storage.js';
import {
  buildPlacementTest,
  recordSkillResult,
  recommendNextLesson,
  summarizePlacement
} from './adaptive/engine.js';
import { syncProgress, loginUser, fetchAssignments } from './app/api.js';
import { trackEvent } from './i18n/strings.js';

export class DictaterApp {
  constructor() {
    this.grade = '3';
    this.skillArea = 'listening';
    this.difficulty = 'all';
    this.currentLesson = null;
    this.stats = loadStats();
    this.badges = loadBadges();
    this.profile = loadProfile();
    this.customLessons = loadCustomLessons();
    this.skillMastery = loadSkillMastery();
    this.placement = loadPlacementResults();
    this.setupStep = 1;
  }

  async init() {
    await buildCurriculumIndex();
    this.bindShell();
    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    this.renderSetup();
    this.renderRecommendations();
    console.log('[Dictater] ELA platform initialized');
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
    document.querySelector('#voice-engine')?.addEventListener('change', (e) => {
      setTTSOptions({ engine: e.target.value });
    });
    document.querySelector('#btn-placement')?.addEventListener('click', () => this.runPlacement());
    document.querySelector('#btn-auth-login')?.addEventListener('click', () => this.handleLogin());
    document.querySelector('#btn-auth-logout')?.addEventListener('click', () => this.handleLogout());
    document.querySelector('#btn-open-lesson-creator')?.addEventListener('click', () => this.openModal('#lesson-creator-modal'));
    document.querySelector('#btn-creator-close')?.addEventListener('click', () => this.closeModal('#lesson-creator-modal'));
    document.querySelector('#btn-creator-save')?.addEventListener('click', () => this.saveCustomLesson());
  }

  renderSetup() {
    const gradeEl = document.querySelector('#grade-filters');
    const skillEl = document.querySelector('#skill-filters');
    const lessonEl = document.querySelector('#exercise-list');
    if (!gradeEl || !skillEl || !lessonEl) return;

    gradeEl.innerHTML = '';
    GRADES.forEach((g) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `pill-btn grade-filter ${g === this.grade ? 'active' : ''}`;
      btn.dataset.grade = g;
      btn.textContent = gradeLabel(g);
      btn.addEventListener('click', () => {
        this.grade = g;
        this.renderSetup();
      });
      gradeEl.appendChild(btn);
    });

    skillEl.innerHTML = '';
    const areas = this.grade === 'preK'
      ? SKILL_AREAS.filter((s) => ['sounds', 'phonics', 'vocabulary', 'speaking'].includes(s.id))
      : SKILL_AREAS;
    areas.forEach((s) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `pill-btn skill-filter ${s.id === this.skillArea ? 'active' : ''}`;
      btn.dataset.skill = s.id;
      btn.innerHTML = `<span aria-hidden="true">${s.icon}</span> ${s.label}`;
      btn.addEventListener('click', () => {
        this.skillArea = s.id;
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

    if (!this.currentLesson && lessons[0]) this.loadLesson(lessons[0]);
  }

  renderRecommendations() {
    const el = document.querySelector('#recommended-lesson');
    if (!el) return;
    const completed = new Set(this.stats.map((s) => s.exerciseId));
    const next = recommendNextLesson(this.grade, this.skillMastery, completed);
    if (next) {
      el.innerHTML = `<button type="button" class="btn-secondary btn-compact" id="rec-btn">Continue: ${next.title}</button>`;
      el.querySelector('#rec-btn').addEventListener('click', () => {
        this.skillArea = skillAreaForType(next.type);
        this.renderSetup();
        this.loadLesson(next);
      });
    } else {
      el.textContent = 'Great work — explore a new skill area!';
    }
  }

  loadLesson(lesson) {
    stopSpeech();
    this.currentLesson = lesson;
    document.querySelector('#current-title').textContent = lesson.title;
    document.querySelector('#current-meta').textContent = `${gradeLabel(lesson.grade)} • ${this.skillArea} • ${lesson.type.replace(/_/g, ' ')}`;
    const badge = document.querySelector('#level-badge-container');
    if (badge) {
      badge.innerHTML = `<span class="exercise-badge badge-diff-${lesson.difficulty || 'beginner'}">${(lesson.difficulty || 'beginner').toUpperCase()}</span>`;
    }
    if (lesson.hint) {
      const hintEl = document.querySelector('#lesson-hint');
      if (hintEl) hintEl.textContent = lesson.hint;
    }

    const workspace = document.querySelector('#activity-workspace');
    renderActivity(lesson.type, {
      lesson,
      container: workspace,
      speak: (text) => speakText(text),
      showToast: (msg, type) => this.showToast(msg, type),
      onComplete: (result) => this.handleComplete(lesson, result)
    });
    this.renderSetup();
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
    if (!this.badges.firstSteps && this.stats.length >= 1) {
      this.badges.firstSteps = true;
      updated = true;
    }
    if (!this.badges.speakingStarter && record.type.startsWith('speak')) {
      this.badges.speakingStarter = true;
      updated = true;
    }
    if (!this.badges.clearSpeaker && record.type.startsWith('speak') && record.score >= 90) {
      this.badges.clearSpeaker = true;
      updated = true;
    }
    if (!this.badges.readingExplorer && record.type === 'comprehension') {
      this.badges.readingExplorer = true;
      updated = true;
    }
    if (!this.badges.phonicsMaster && record.type.includes('phonics')) {
      this.badges.phonicsMaster = true;
      updated = true;
    }
    const streak = calculateStreak(this.stats);
    if (!this.badges.streakExplorer && streak >= 3) {
      this.badges.streakExplorer = true;
      updated = true;
    }
    if (updated) {
      saveBadges(this.badges);
      this.showToast('Achievement unlocked!', 'achievement');
    }
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
      { key: 'phonicsMaster', icon: '🔤', title: 'Phonics Master', desc: 'Complete phonics lesson' },
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
    if (!email) {
      this.showToast('Enter an email to sign in', 'warning');
      return;
    }
    try {
      const result = await loginUser(email);
      this.profile = { ...this.profile, ...result, authToken: result.token };
      saveProfile(this.profile);
      document.querySelector('#auth-status').textContent = `Signed in as ${email}`;
      this.showToast('Signed in successfully', 'success');
    } catch {
      this.showToast('Sign in failed — using offline mode', 'warning');
    }
  }

  handleLogout() {
    this.profile = { ...this.profile, authToken: null, userId: null };
    saveProfile(this.profile);
    document.querySelector('#auth-status').textContent = 'Offline mode';
  }

  saveCustomLesson() {
    const title = document.querySelector('#creator-title')?.value?.trim();
    const type = document.querySelector('#creator-type')?.value;
    const content = document.querySelector('#creator-content')?.value?.trim();
    const hint = document.querySelector('#creator-hint')?.value?.trim();
    if (!title || !content) {
      this.showToast('Title and content required', 'warning');
      return;
    }
    const lesson = {
      id: 'custom-' + Date.now(),
      grade: 'Custom',
      type: type === 'words' ? 'spelling' : 'dictation',
      title,
      hint,
      content: type === 'words' ? { words: content.split(',').map((w) => w.trim()) } : { text: content }
    };
    this.customLessons.push(lesson);
    saveCustomLessons(this.customLessons);
    this.closeModal('#lesson-creator-modal');
    this.showToast('Custom lesson saved', 'success');
  }

  openModal(sel) {
    document.querySelector(sel)?.classList.remove('hidden');
  }

  closeModal(sel) {
    document.querySelector(sel)?.classList.add('hidden');
  }

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
