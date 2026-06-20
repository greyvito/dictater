// Dictater — Application Logic

// --- App State ---
let currentGrade = '3';
let currentMode = 'curriculum';  // 'curriculum' or 'custom'
let currentFormat = 'passage';    // 'passage' or 'words'
let currentExerciseIndex = 0;
let currentExercise = null;
let currentSpeed = 1.0;
let isPlaying = false;
let isPausedState = false;

// Audio Engines & State
let currentSpeechUtterance = null;
let puterAudioObj = null;
let selectedEngine = 'webspeech';
let selectedVoiceName = '';
let selectedAccent = 'US'; // 'US' or 'UK'

// Pause/Resume Memory Coordinates
let currentlyPlayingText = "";
let currentPlayCharIndex = 0;
let speechTextOffset = 0;

// Phrase Playback State
let phrases = [];
let currentPhraseIndex = 0;

// Word Spelling Test State
let spellingWords = [];
let currentWordIndex = 0;
let spellingHistory = [];

// Custom Lessons Data
let customLessons = [];
try {
  customLessons = JSON.parse(localStorage.getItem('DICTATER_CUSTOM_LESSONS')) || [];
} catch (e) {
  console.error("Error parsing custom lessons from localStorage:", e);
}

// Student Stats & Progress Data
let studentStats = [];
try {
  studentStats = JSON.parse(localStorage.getItem('DICTATER_STATS')) || [];
} catch (e) {
  console.error("Error parsing stats from localStorage:", e);
}

let studentBadges = {
  firstSteps: false,
  accuracyExpert: false,
  spellingHero: false,
  streakExplorer: false,
  superWriter: false,
  customScholar: false
};
try {
  const storedBadges = localStorage.getItem('DICTATER_BADGES');
  if (storedBadges) {
    studentBadges = { ...studentBadges, ...JSON.parse(storedBadges) };
  }
} catch (e) {
  console.error("Error parsing badges from localStorage:", e);
}

// --- DOM Element References ---
const btnModeCurriculum = document.getElementById('btn-mode-curriculum');
const btnModeCustom = document.getElementById('btn-mode-custom');
const formatSelectionContainer = document.getElementById('format-selection-container');
const btnFormatPassage = document.getElementById('btn-format-passage');
const btnFormatWords = document.getElementById('btn-format-words');
const curriculumFilters = document.getElementById('curriculum-filters');
const customTextPanel = document.getElementById('custom-text-panel');
const customDictationText = document.getElementById('custom-dictation-text');
const btnLoadCustom = document.getElementById('btn-load-custom');
const exerciseList = document.getElementById('exercise-list');

// Custom Lesson Manager elements
const btnOpenLessonCreator = document.getElementById('btn-open-lesson-creator');
const lessonCreatorModal = document.getElementById('lesson-creator-modal');
const btnCreatorClose = document.getElementById('btn-creator-close');
const creatorTitle = document.getElementById('creator-title');
const creatorType = document.getElementById('creator-type');
const creatorContent = document.getElementById('creator-content');
const creatorHint = document.getElementById('creator-hint');
const btnCreatorSave = document.getElementById('btn-creator-save');
const customSavedList = document.getElementById('custom-saved-list');

// Student Dashboard elements
const btnOpenDashboard = document.getElementById('btn-open-dashboard');
const dashboardModal = document.getElementById('dashboard-modal');
const btnDashboardClose = document.getElementById('btn-dashboard-close');
const statCompleted = document.getElementById('stat-completed');
const statAccuracy = document.getElementById('stat-accuracy');
const statStreak = document.getElementById('stat-streak');
const badgesGrid = document.getElementById('badges-grid');
const dashboardActivityLog = document.getElementById('dashboard-activity-log');

// Main Workspace elements
const currentTitle = document.getElementById('current-title');
const currentMeta = document.getElementById('current-meta');
const levelBadgeContainer = document.getElementById('level-badge-container');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnTitleSpeaker = document.getElementById('btn-title-speaker');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const btnReplay = document.getElementById('btn-replay');
const visualizer = document.getElementById('visualizer');
const speedButtons = document.querySelectorAll('.speed-btn');

// Phrase Controls
const phraseNavigationContainer = document.getElementById('phrase-navigation-container');
const btnPhrasePrev = document.getElementById('btn-phrase-prev');
const btnPhrasePlay = document.getElementById('btn-phrase-play');
const btnPhraseNext = document.getElementById('btn-phrase-next');
const phraseProgressIndicator = document.getElementById('phrase-progress-indicator');

// Workspaces
const passageWorkspaceContainer = document.getElementById('passage-workspace-container');
const wordWorkspaceContainer = document.getElementById('word-workspace-container');

// Passage Workspace elements
const studentWriting = document.getElementById('student-writing');
const wordCount = document.getElementById('word-count');
const btnClear = document.getElementById('btn-clear');
const btnCheckDictation = document.getElementById('btn-check-dictation');
const resultsPanel = document.getElementById('results-panel');
const evaluationScore = document.getElementById('evaluation-score');
const diffResults = document.getElementById('diff-results');
const btnTogglePeek = document.getElementById('btn-toggle-peek');
const originalTextPeek = document.getElementById('original-text-peek');

// Word Workspace elements
const wordSpellingInput = document.getElementById('word-spelling-input');
const btnWordSkip = document.getElementById('btn-word-skip');
const btnWordSubmit = document.getElementById('btn-word-submit');
const wordSpellingProgress = document.getElementById('word-spelling-progress');
const wordResultsReport = document.getElementById('word-results-report');
const wordEvaluationScore = document.getElementById('word-evaluation-score');
const wordSpellingDiff = document.getElementById('word-spelling-diff');

// Global Show Text elements
const btnShowTextGlobal = document.getElementById('btn-show-text-global');
const globalTextPeek = document.getElementById('global-text-peek');

// Settings elements
const btnSettingsToggle = document.getElementById('btn-settings-toggle');
const btnSettingsClose = document.getElementById('btn-settings-close');
const settingsDropdown = document.getElementById('settings-dropdown');
const voiceEngine = document.getElementById('voice-engine');
const voiceAccent = document.getElementById('voice-accent');
const voiceSelect = document.getElementById('voice-select');
const voiceSelectionRow = document.getElementById('voice-selection-row');

// Modal Background Mask Element
let modalMask = null;

// --- Initialization ---
function init() {
  setupEventListeners();
  loadVoices();
  
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
  
  // Set default state
  switchMode('curriculum');
  switchFormat('passage');
  filterExercises();
  loadExercise(0);
  renderCustomSavedLessons();
}

// --- Event Listeners Setup ---
function setupEventListeners() {
  // Mode Selection
  btnModeCurriculum.addEventListener('click', () => switchMode('curriculum'));
  btnModeCustom.addEventListener('click', () => switchMode('custom'));

  // Format Selection
  btnFormatPassage.addEventListener('click', () => switchFormat('passage'));
  btnFormatWords.addEventListener('click', () => switchFormat('words'));

  // Grade Filters
  document.querySelectorAll('.grade-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.grade-filter').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentGrade = e.target.dataset.grade;
      filterExercises();
    });
  });

  // Custom text loader
  btnLoadCustom.addEventListener('click', loadCustomText);

  // Playback controls
  btnPlayPause.addEventListener('click', togglePlayback);
  btnTitleSpeaker.addEventListener('click', playTitleSpeech);
  btnReplay.addEventListener('click', replaySpeech);
  
  speedButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      speedButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentSpeed = parseFloat(e.target.dataset.speed);
      
      // If playing webspeech, restart with new speed
      if (isPlaying && selectedEngine === 'webspeech' && currentSpeechUtterance) {
        const remainingText = currentlyPlayingText.slice(currentPlayCharIndex);
        speechTextOffset = currentPlayCharIndex;
        stopSpeech();
        speakWebSpeech(remainingText, true);
      } else if (isPlaying && selectedEngine === 'puter' && puterAudioObj) {
        puterAudioObj.playbackRate = currentSpeed;
      }
    });
  });

  // Phrase Navigation Controls
  btnPhrasePrev.addEventListener('click', () => navigatePhrase(-1));
  btnPhraseNext.addEventListener('click', () => navigatePhrase(1));
  btnPhrasePlay.addEventListener('click', playActivePhrase);

  // Word Spelling Keyboard/Submit Controls
  btnWordSubmit.addEventListener('click', submitSpelledWord);
  btnWordSkip.addEventListener('click', skipSpelledWord);
  wordSpellingInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      submitSpelledWord();
    }
  });

  // Input area updates
  studentWriting.addEventListener('input', updateWordCount);
  
  // Evaluation actions
  btnClear.addEventListener('click', () => {
    studentWriting.value = '';
    updateWordCount();
    resultsPanel.classList.add('hidden');
  });
  
  btnCheckDictation.addEventListener('click', checkDictation);
  btnTogglePeek.addEventListener('click', toggleOriginalPeek);
  btnShowTextGlobal.addEventListener('click', toggleGlobalTextPeek);

  // Custom Lesson Creator
  btnOpenLessonCreator.addEventListener('click', () => openModal(lessonCreatorModal));
  btnCreatorClose.addEventListener('click', () => closeModal(lessonCreatorModal));
  btnCreatorSave.addEventListener('click', saveCustomLesson);

  // Student Dashboard
  btnOpenDashboard.addEventListener('click', () => {
    updateDashboardStats();
    openModal(dashboardModal);
  });
  btnDashboardClose.addEventListener('click', () => closeModal(dashboardModal));

  // Settings
  btnSettingsToggle.addEventListener('click', () => settingsDropdown.classList.toggle('hidden'));
  btnSettingsClose.addEventListener('click', () => settingsDropdown.classList.add('hidden'));
  voiceEngine.addEventListener('change', (e) => {
    selectedEngine = e.target.value;
    updateVoiceSelectDropdown();
  });
  voiceAccent.addEventListener('change', (e) => {
    selectedAccent = e.target.value;
    updateVoiceSelectDropdown();
  });
  voiceSelect.addEventListener('change', (e) => {
    selectedVoiceName = e.target.value;
  });

  // Close settings clicking outside
  document.addEventListener('click', (e) => {
    if (!settingsDropdown.contains(e.target) && e.target !== btnSettingsToggle && !btnSettingsToggle.contains(e.target)) {
      settingsDropdown.classList.add('hidden');
    }
  });
}

// --- Modal Utilities ---
function openModal(modal) {
  // Create mask overlay if not exists
  if (!modalMask) {
    modalMask = document.createElement('div');
    modalMask.className = 'modal-open-mask';
    document.body.appendChild(modalMask);
  }
  modalMask.classList.remove('hidden');
  modal.classList.remove('hidden');
}

// Close modal helper
function closeModal(modal) {
  modal.classList.add('hidden');
  if (modalMask) modalMask.classList.add('hidden');
}

// --- View State Switches ---
function switchMode(mode) {
  currentMode = mode;
  stopSpeech();
  
  if (mode === 'curriculum') {
    btnModeCurriculum.classList.add('active');
    btnModeCustom.classList.remove('active');
    formatSelectionContainer.classList.remove('hidden');
    curriculumFilters.classList.remove('hidden');
    customTextPanel.classList.add('hidden');
    
    filterExercises();
  } else {
    btnModeCurriculum.classList.remove('active');
    btnModeCustom.classList.add('active');
    formatSelectionContainer.classList.remove('hidden'); // Format stays visible in custom mode to filter saved lists!
    curriculumFilters.classList.add('hidden');
    customTextPanel.classList.remove('hidden');
    
    // Default in custom mode to whatever exercise format was selected last
    switchFormat(currentFormat);
  }
}

function switchFormat(format) {
  currentFormat = format;
  stopSpeech();
  
  if (format === 'passage') {
    btnFormatPassage.classList.add('active');
    btnFormatWords.classList.remove('active');
    
    passageWorkspaceContainer.classList.remove('hidden');
    wordWorkspaceContainer.classList.add('hidden');
    phraseNavigationContainer.classList.remove('hidden');
  } else {
    btnFormatPassage.classList.remove('active');
    btnFormatWords.classList.add('active');
    
    passageWorkspaceContainer.classList.add('hidden');
    wordWorkspaceContainer.classList.remove('hidden');
    phraseNavigationContainer.classList.add('hidden');
  }
  
  if (currentMode === 'curriculum') {
    filterExercises();
    loadExercise(0);
  } else {
    // If Custom Mode, reload saved custom lessons sidebar list
    renderCustomSavedLessons();
    
    // Setup empty workspace message
    currentExercise = null;
    btnShowTextGlobal.classList.add('hidden');
    globalTextPeek.classList.add('hidden');
    globalTextPeek.innerHTML = '';
    currentTitle.textContent = 'Custom Lesson Workspace';
    currentMeta.textContent = 'Select a saved lesson below or click "Create Custom Lesson"';
    levelBadgeContainer.innerHTML = '<span class="exercise-badge badge-grade-5">Custom</span>';
    studentWriting.value = '';
    wordSpellingInput.value = '';
    updateWordCount();
    resultsPanel.classList.add('hidden');
    wordResultsReport.classList.add('hidden');
    phraseNavigationContainer.style.display = 'none';
  }
}

function filterExercises() {
  const gradeData = DICTATER_CURRICULUM[currentGrade];
  if (!gradeData) return;
  
  const list = currentFormat === 'passage' ? gradeData.passages : gradeData.words;
  exerciseList.innerHTML = '';
  
  list.forEach((ex, idx) => {
    const div = document.createElement('div');
    div.className = `exercise-item ${idx === currentExerciseIndex ? 'active' : ''}`;
    div.dataset.index = idx;
    
    div.innerHTML = `
      <div class="exercise-title-text">${ex.title}</div>
      <span class="exercise-badge badge-grade-${currentGrade}">G${currentGrade}</span>
    `;
    
    div.addEventListener('click', () => {
      document.querySelectorAll('.exercise-item').forEach(item => item.classList.remove('active'));
      div.classList.add('active');
      loadExercise(idx);
    });
    
    exerciseList.appendChild(div);
  });
}

function loadExercise(index, isCustomSaved = false, customObj = null) {
  stopSpeech();
  
  if (isCustomSaved && customObj) {
    currentExercise = customObj;
    currentExerciseIndex = -1;
  } else {
    currentExerciseIndex = index;
    const gradeData = DICTATER_CURRICULUM[currentGrade];
    if (!gradeData) return;
    const list = currentFormat === 'passage' ? gradeData.passages : gradeData.words;
    currentExercise = list[index];
  }
  
  if (!currentExercise) {
    btnShowTextGlobal.classList.add('hidden');
    return;
  }
  btnShowTextGlobal.classList.remove('hidden');
  
  currentTitle.textContent = currentExercise.title;
  const gradeText = isCustomSaved ? 'Custom' : `Grade ${currentGrade}`;
  
  if (currentExercise.text) {
    // PASSAGE MODE
    currentFormat = 'passage';
    btnFormatPassage.classList.add('active');
    btnFormatWords.classList.remove('active');
    passageWorkspaceContainer.classList.remove('hidden');
    wordWorkspaceContainer.classList.add('hidden');
    
    currentMeta.textContent = `${gradeText} Passage • Dictation Exercise`;
    levelBadgeContainer.innerHTML = `<span class="exercise-badge badge-grade-6">${gradeText}</span>`;
    
    // Clear user typing
    studentWriting.value = '';
    updateWordCount();
    resultsPanel.classList.add('hidden');
    
    // Split phrases
    phrases = splitIntoPhrases(currentExercise.text);
    currentPhraseIndex = 0;
    updatePhraseProgress();
    
    // Show Text element update
    renderInteractivePhrases(phrases);
    globalTextPeek.classList.add('hidden');
    btnShowTextGlobal.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      Show Text
    `;
    
    phraseNavigationContainer.style.display = 'flex';
  } else if (currentExercise.words) {
    // WORD LIST MODE
    currentFormat = 'words';
    btnFormatPassage.classList.remove('active');
    btnFormatWords.classList.add('active');
    passageWorkspaceContainer.classList.add('hidden');
    wordWorkspaceContainer.classList.remove('hidden');
    
    currentMeta.textContent = `${gradeText} Word List • Spelling Practice`;
    levelBadgeContainer.innerHTML = `<span class="exercise-badge badge-grade-5">${gradeText} Words</span>`;
    
    // Initialize Spelling Test
    spellingWords = currentExercise.words;
    currentWordIndex = 0;
    spellingHistory = [];
    
    wordSpellingInput.value = '';
    wordResultsReport.classList.add('hidden');
    updateSpellingProgress();
    
    // Show Text element update (list words)
    renderInteractiveWords(spellingWords);
    globalTextPeek.classList.add('hidden');
    btnShowTextGlobal.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      Show Words
    `;
    
    phraseNavigationContainer.style.display = 'none';
  }
}

function loadCustomText() {
  const text = customDictationText.value.trim();
  if (!text) {
    alert('Please enter some text or words to dictate.');
    return;
  }
  
  stopSpeech();
  
  currentExercise = {
    id: 'custom-active',
    grade: 'Custom',
    title: 'Quick Custom Exercise',
    text: text,
    hint: 'Custom text inputted by user.'
  };
  
  btnShowTextGlobal.classList.remove('hidden');
  currentTitle.textContent = currentExercise.title;
  currentMeta.textContent = 'Custom User Passage • Listening Practice';
  levelBadgeContainer.innerHTML = '<span class="exercise-badge badge-grade-6">Custom</span>';
  
  studentWriting.value = '';
  updateWordCount();
  resultsPanel.classList.add('hidden');
  
  // Split phrases
  phrases = splitIntoPhrases(text);
  currentPhraseIndex = 0;
  updatePhraseProgress();
  
  renderInteractivePhrases(phrases);
  globalTextPeek.classList.add('hidden');
  btnShowTextGlobal.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
    Show Text
  `;
  
  phraseNavigationContainer.style.display = 'flex';
}

// --- Custom Lesson Manager Logics ---
function saveCustomLesson() {
  const title = creatorTitle.value.trim();
  const type = creatorType.value;
  const content = creatorContent.value.trim();
  const hint = creatorHint.value.trim() || 'Custom created exercise.';
  
  if (!title || !content) {
    alert('Please enter both a title and some content.');
    return;
  }
  
  const lessonObj = {
    id: 'custom-' + Date.now(),
    grade: 'Custom',
    title: title,
    hint: hint
  };
  
  if (type === 'passage') {
    lessonObj.text = content;
  } else {
    // Split by commas, filter out empty elements, and trim
    lessonObj.words = content.split(',').map(w => w.trim()).filter(w => w.length > 0);
    if (lessonObj.words.length === 0) {
      alert('Please enter at least one word (separated by commas).');
      return;
    }
  }
  
  customLessons.push(lessonObj);
  localStorage.setItem('DICTATER_CUSTOM_LESSONS', JSON.stringify(customLessons));
  
  // Reset Form and close
  creatorTitle.value = '';
  creatorContent.value = '';
  creatorHint.value = '';
  closeModal(lessonCreatorModal);
  
  // Re-render
  renderCustomSavedLessons();
}

function renderCustomSavedLessons() {
  if (!customSavedList) return;
  customSavedList.innerHTML = '';
  
  // Filter saved custom lessons based on currently active formats
  const filtered = customLessons.filter(l => {
    if (currentFormat === 'passage') return l.text !== undefined;
    return l.words !== undefined;
  });
  
  if (filtered.length === 0) {
    customSavedList.innerHTML = '<div style="color: var(--text-muted); font-size: 0.8rem; text-align: center; padding: 1rem;">No saved lessons yet.</div>';
    return;
  }
  
  filtered.forEach(lesson => {
    const div = document.createElement('div');
    div.className = `custom-lesson-item ${currentExercise && currentExercise.id === lesson.id ? 'active' : ''}`;
    
    const label = currentFormat === 'passage' ? 'Passage' : 'Words';
    div.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.15rem; max-width: 80%;">
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lesson.title}</span>
        <span style="font-size: 0.7rem; color: var(--text-muted);">${label} • ${lesson.words ? lesson.words.length + ' words' : '1 passage'}</span>
      </div>
      <button class="btn-delete-lesson" title="Delete custom lesson" data-id="${lesson.id}">&times;</button>
    `;
    
    // Load click
    div.addEventListener('click', (e) => {
      // Don't trigger load if clicking delete button
      if (e.target.classList.contains('btn-delete-lesson')) return;
      
      document.querySelectorAll('.custom-lesson-item').forEach(item => item.classList.remove('active'));
      div.classList.add('active');
      loadExercise(-1, true, lesson);
    });
    
    // Delete click
    const btnDel = div.querySelector('.btn-delete-lesson');
    btnDel.addEventListener('click', () => {
      if (confirm(`Are you sure you want to delete "${lesson.title}"?`)) {
        deleteCustomLesson(lesson.id);
      }
    });
    
    customSavedList.appendChild(div);
  });
}

function deleteCustomLesson(id) {
  customLessons = customLessons.filter(l => l.id !== id);
  localStorage.setItem('DICTATER_CUSTOM_LESSONS', JSON.stringify(customLessons));
  
  if (currentExercise && currentExercise.id === id) {
    currentExercise = null;
  }
  
  renderCustomSavedLessons();
}

// --- Phrase Replay Logics ---
function splitIntoPhrases(text) {
  // Splits on punctuation: , ; : . ! ? and retains it at the end of the phrase.
  return text.match(/[^,;:.!?]+[,;:.!?]+(?:\s+|$)/g) || [text];
}

function updatePhraseProgress() {
  if (phrases.length === 0) return;
  phraseProgressIndicator.textContent = `Phrase ${currentPhraseIndex + 1} of ${phrases.length}`;
}

function navigatePhrase(direction) {
  stopSpeech();
  let newIndex = currentPhraseIndex + direction;
  
  if (newIndex >= 0 && newIndex < phrases.length) {
    currentPhraseIndex = newIndex;
    updatePhraseProgress();
    highlightActivePhraseSpan();
    playActivePhrase();
  }
}

function playActivePhrase() {
  if (phrases.length === 0) return;
  const phraseText = phrases[currentPhraseIndex].trim();
  
  stopSpeech();
  
  currentlyPlayingText = phraseText;
  speechTextOffset = 0;
  currentPlayCharIndex = 0;
  
  if (selectedEngine === 'webspeech') {
    speakWebSpeech(phraseText);
  } else {
    speakPuterSpeech(phraseText);
  }
}

function renderInteractivePhrases(phraseList) {
  globalTextPeek.innerHTML = '';
  phraseList.forEach((s, idx) => {
    const span = document.createElement('span');
    span.className = 'interactive-phrase';
    span.textContent = s;
    span.dataset.index = idx;
    span.style.cursor = 'pointer';
    span.style.transition = 'background var(--transition-fast)';
    span.style.borderRadius = '4px';
    span.style.padding = '0.1rem 0.25rem';
    
    // Hover highlight styling
    span.addEventListener('mouseenter', () => {
      if (currentPhraseIndex !== idx) span.style.background = 'rgba(255,255,255,0.05)';
    });
    span.addEventListener('mouseleave', () => {
      if (currentPhraseIndex !== idx) span.style.background = 'transparent';
    });
    
    span.addEventListener('click', () => {
      currentPhraseIndex = idx;
      updatePhraseProgress();
      highlightActivePhraseSpan();
      playActivePhrase();
    });
    
    globalTextPeek.appendChild(span);
  });
  highlightActivePhraseSpan();
}

function highlightActivePhraseSpan() {
  const spans = globalTextPeek.querySelectorAll('.interactive-phrase');
  spans.forEach(span => {
    const idx = parseInt(span.dataset.index);
    if (idx === currentPhraseIndex) {
      span.style.background = 'rgba(99, 102, 241, 0.2)';
      span.style.borderBottom = '2px solid var(--primary)';
      span.style.color = '#fff';
    } else {
      span.style.background = 'transparent';
      span.style.borderBottom = 'none';
      span.style.color = 'inherit';
    }
  });
}

// --- Word Spelling Test Logics ---
function updateSpellingProgress() {
  if (spellingWords.length === 0) return;
  
  const correctCount = spellingHistory.filter(h => h.correct).length;
  
  if (currentWordIndex < spellingWords.length) {
    wordSpellingProgress.textContent = `Word ${currentWordIndex + 1} of ${spellingWords.length} | Score: ${correctCount}`;
  } else {
    wordSpellingProgress.textContent = `Test Finished! | Final Score: ${correctCount}/${spellingWords.length}`;
  }
}

function playActiveWord() {
  if (spellingWords.length === 0 || currentWordIndex >= spellingWords.length) return;
  const word = spellingWords[currentWordIndex];
  
  stopSpeech();
  
  currentlyPlayingText = word;
  speechTextOffset = 0;
  currentPlayCharIndex = 0;
  
  if (selectedEngine === 'webspeech') {
    speakWebSpeech(word);
  } else {
    speakPuterSpeech(word);
  }
}

function submitSpelledWord() {
  if (currentWordIndex >= spellingWords.length) return;
  
  const typedValue = wordSpellingInput.value.trim();
  if (!typedValue) {
    alert('Please type the word first!');
    return;
  }
  
  const correctValue = spellingWords[currentWordIndex];
  const isCorrect = typedValue.toLowerCase() === correctValue.toLowerCase();
  
  spellingHistory.push({
    word: correctValue,
    typed: typedValue,
    correct: isCorrect
  });
  
  // Visual Feedback animation on input box
  if (isCorrect) {
    wordSpellingInput.style.borderColor = 'var(--success)';
    wordSpellingInput.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4)';
  } else {
    wordSpellingInput.style.borderColor = 'var(--error)';
    wordSpellingInput.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.4)';
  }
  
  setTimeout(() => {
    wordSpellingInput.value = '';
    wordSpellingInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    wordSpellingInput.style.boxShadow = 'none';
    
    currentWordIndex++;
    updateSpellingProgress();
    
    if (currentWordIndex < spellingWords.length) {
      playActiveWord();
      wordSpellingInput.focus();
    } else {
      finishSpellingTest();
    }
  }, 600);
}

function skipSpelledWord() {
  if (currentWordIndex >= spellingWords.length) return;
  
  spellingHistory.push({
    word: spellingWords[currentWordIndex],
    typed: '[Skipped]',
    correct: false
  });
  
  currentWordIndex++;
  updateSpellingProgress();
  
  if (currentWordIndex < spellingWords.length) {
    playActiveWord();
    wordSpellingInput.focus();
  } else {
    finishSpellingTest();
  }
}

function finishSpellingTest() {
  stopSpeech();
  
  const total = spellingWords.length;
  const correct = spellingHistory.filter(h => h.correct).length;
  
  wordEvaluationScore.textContent = `${correct} / ${total} Correct`;
  wordSpellingDiff.innerHTML = '';
  spellingHistory.forEach(item => {
    const div = document.createElement('div');
    div.style.marginRight = '0.5rem';
    div.style.display = 'inline-block';
    
    const span = document.createElement('span');
    span.className = 'diff-word';
    
    if (item.correct) {
      span.classList.add('correct');
      span.textContent = item.word;
    } else {
      span.classList.add('incorrect');
      span.textContent = `${item.typed} (${item.word})`;
      span.title = `Typed: ${item.typed} | Correct: ${item.word}`;
    }
    
    div.appendChild(span);
    wordSpellingDiff.appendChild(div);
  });
  
  wordResultsReport.classList.remove('hidden');
  wordResultsReport.scrollIntoView({ behavior: 'smooth' });
  
  // Log score to dashboard statistics
  const scorePct = Math.round((correct / total) * 100);
  saveScoreToStats(currentExercise.id, currentExercise.title, 'words', scorePct);
}

function renderInteractiveWords(wordList) {
  globalTextPeek.innerHTML = '';
  wordList.forEach((w, idx) => {
    const span = document.createElement('span');
    span.className = 'interactive-phrase'; 
    span.textContent = w;
    span.style.cursor = 'pointer';
    span.style.marginRight = '0.75rem';
    span.style.display = 'inline-block';
    span.style.padding = '0.15rem 0.4rem';
    span.style.borderRadius = '4px';
    span.style.border = '1px dashed rgba(255,255,255,0.15)';
    
    span.addEventListener('mouseenter', () => {
      span.style.background = 'rgba(255,255,255,0.05)';
    });
    span.addEventListener('mouseleave', () => {
      span.style.background = 'transparent';
    });
    
    span.addEventListener('click', () => {
      stopSpeech();
      currentlyPlayingText = w;
      speechTextOffset = 0;
      currentPlayCharIndex = 0;
      if (selectedEngine === 'webspeech') {
        speakWebSpeech(w);
      } else {
        speakPuterSpeech(w);
      }
    });
    
    globalTextPeek.appendChild(span);
  });
}

// --- Voice & Speech Managers ---
let availableSpeechSynthesisVoices = [];

function loadVoices() {
  if (window.speechSynthesis) {
    availableSpeechSynthesisVoices = window.speechSynthesis.getVoices();
    updateVoiceSelectDropdown();
  }
}

function updateVoiceSelectDropdown() {
  voiceSelect.innerHTML = '';
  
  if (selectedEngine === 'webspeech') {
    voiceSelectionRow.classList.remove('hidden');
    
    // Filter voices based on Accent Preference
    let filteredVoices = [];
    if (selectedAccent === 'US') {
      filteredVoices = availableSpeechSynthesisVoices.filter(v => {
        const lang = (v.lang || '').toLowerCase().replace('_', '-');
        return lang.startsWith('en-us');
      });
    } else {
      // Commonwealth Accents: en-gb, en-au, en-ie, en-ca
      filteredVoices = availableSpeechSynthesisVoices.filter(v => {
        const lang = (v.lang || '').toLowerCase().replace('_', '-');
        return lang.startsWith('en-gb') || 
               lang.startsWith('en-au') || 
               lang.startsWith('en-ie') || 
               lang.startsWith('en-ca');
      });
    }
    
    // If no accented voices, fallback to any English
    if (filteredVoices.length === 0) {
      filteredVoices = availableSpeechSynthesisVoices.filter(v => {
        const lang = (v.lang || '').toLowerCase().replace('_', '-');
        return lang.startsWith('en');
      });
    }
    
    // If absolutely nothing, display all
    const displayList = filteredVoices.length > 0 ? filteredVoices : availableSpeechSynthesisVoices;

    if (displayList.length === 0) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'System Default Voice';
      voiceSelect.appendChild(option);
      return;
    }

    displayList.forEach(v => {
      const option = document.createElement('option');
      const vName = v.name || 'Unknown Voice';
      const vLang = v.lang || 'unknown';
      option.value = vName;
      option.textContent = `${vName} (${vLang})`;
      
      // Auto-select natural-sounding voices
      if (vName.includes('Natural') || vName.includes('Aria') || vName.includes('Google US')) {
        option.selected = true;
        selectedVoiceName = vName;
      }
      
      voiceSelect.appendChild(option);
    });
    
    if (!selectedVoiceName && displayList.length > 0) {
      selectedVoiceName = displayList[0].name || '';
    }
  } else {
    voiceSelectionRow.classList.add('hidden');
  }
}

// --- Audio Playback Controls ---
function togglePlayback() {
  if (!currentExercise) {
    alert('Please select an exercise or load custom text first!');
    return;
  }

  if (isPlaying) {
    pauseSpeech();
  } else {
    resumeSpeech();
  }
}

function resumeSpeech() {
  if (isPlaying) return;

  if (isPausedState && currentlyPlayingText) {
    isPlaying = true;
    updatePlaybackUI(true);
    isPausedState = false;
    
    if (selectedEngine === 'webspeech') {
      const remainingText = currentlyPlayingText.slice(currentPlayCharIndex);
      speechTextOffset = currentPlayCharIndex;
      speakWebSpeech(remainingText, true);
    } else {
      if (puterAudioObj) {
        puterAudioObj.play();
      }
    }
  } else {
    playSpeech();
  }
}

function playSpeech() {
  if (isPlaying) return;
  
  if (currentFormat === 'passage') {
    playActivePhrase();
  } else {
    playActiveWord();
  }
}

function pauseSpeech() {
  isPlaying = false;
  isPausedState = true;
  updatePlaybackUI(false);
  
  if (selectedEngine === 'webspeech') {
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
  } else {
    if (puterAudioObj) {
      puterAudioObj.pause();
    }
  }
}

// Stop speech helper
function stopSpeech() {
  isPlaying = false;
  isPausedState = false;
  currentPlayCharIndex = 0;
  speechTextOffset = 0;
  currentlyPlayingText = "";
  
  updatePlaybackUI(false);
  
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  
  if (puterAudioObj) {
    puterAudioObj.pause();
    puterAudioObj.currentTime = 0;
  }
  
  currentSpeechUtterance = null;
}

function replaySpeech() {
  stopSpeech();
  setTimeout(() => {
    playSpeech();
  }, 100);
}

function speakWebSpeech(text, isResume = false) {
  if (!window.speechSynthesis) {
    alert('Web Speech API is not supported on this browser.');
    return;
  }

  if (!isResume) {
    currentlyPlayingText = text;
    speechTextOffset = 0;
    currentPlayCharIndex = 0;
  }

  window.speechSynthesis.cancel();

  currentSpeechUtterance = new SpeechSynthesisUtterance(text);
  currentSpeechUtterance.rate = currentSpeed;
  
  const voice = availableSpeechSynthesisVoices.find(v => v.name === selectedVoiceName);
  if (voice) {
    currentSpeechUtterance.voice = voice;
  }
  
  currentSpeechUtterance.onstart = () => {
    isPlaying = true;
    updatePlaybackUI(true);
  };
  
  currentSpeechUtterance.onboundary = (event) => {
    if (event.name === 'word') {
      currentPlayCharIndex = speechTextOffset + event.charIndex;
    }
  };
  
  currentSpeechUtterance.onend = () => {
    if (!isPausedState) {
      isPlaying = false;
      isPausedState = false;
      currentPlayCharIndex = 0;
      speechTextOffset = 0;
      updatePlaybackUI(false);
      currentSpeechUtterance = null;
    }
  };
  
  currentSpeechUtterance.onerror = (e) => {
    if (isPausedState) return;
    console.error('SpeechSynthesis error:', e);
    isPlaying = false;
    isPausedState = false;
    updatePlaybackUI(false);
    currentSpeechUtterance = null;
  };

  window.speechSynthesis.speak(currentSpeechUtterance);
}

async function speakPuterSpeech(text) {
  if (puterAudioObj && puterAudioObj.dataset.text === text) {
    puterAudioObj.playbackRate = currentSpeed;
    puterAudioObj.play();
    isPlaying = true;
    updatePlaybackUI(true);
    return;
  }

  stopSpeech();
  currentlyPlayingText = text;
  
  try {
    updatePlaybackUI(true);
    const prevTitle = currentTitle.textContent;
    currentTitle.textContent = "Generating AI Speech...";
    
    puterAudioObj = await puter.ai.txt2speech(text);
    puterAudioObj.dataset.text = text;
    puterAudioObj.playbackRate = currentSpeed;
    
    currentTitle.textContent = prevTitle;
    
    puterAudioObj.onplay = () => {
      isPlaying = true;
      updatePlaybackUI(true);
    };
    
    puterAudioObj.onended = () => {
      if (!isPausedState) {
        isPlaying = false;
        isPausedState = false;
        updatePlaybackUI(false);
      }
    };
    
    puterAudioObj.onerror = () => {
      alert('Failed to load Puter AI voice. Falling back.');
      isPlaying = false;
      isPausedState = false;
      updatePlaybackUI(false);
    };

    puterAudioObj.play();
  } catch (error) {
    console.error('Puter TTS Error:', error);
    selectedEngine = 'webspeech';
    voiceEngine.value = 'webspeech';
    updateVoiceSelectDropdown();
    currentTitle.textContent = currentExercise ? currentExercise.title : 'Curriculum';
    speakWebSpeech(text);
  }
}

function playTitleSpeech() {
  if (!currentExercise || !currentExercise.title) return;
  const titleText = currentExercise.title.trim();
  
  stopSpeech();
  
  currentlyPlayingText = titleText;
  speechTextOffset = 0;
  currentPlayCharIndex = 0;
  
  if (selectedEngine === 'webspeech') {
    speakWebSpeech(titleText);
  } else {
    speakPuterSpeech(titleText);
  }
}

function updatePlaybackUI(speaking) {
  if (speaking) {
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    btnPlayPause.classList.add('playing');
    visualizer.classList.add('active');
    
    if (btnTitleSpeaker) {
      btnTitleSpeaker.style.background = 'rgba(99, 102, 241, 0.15)';
      btnTitleSpeaker.style.borderColor = 'var(--primary)';
      btnTitleSpeaker.style.color = 'var(--primary)';
    }
  } else {
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    btnPlayPause.classList.remove('playing');
    visualizer.classList.remove('active');
    
    if (btnTitleSpeaker) {
      btnTitleSpeaker.style.background = 'rgba(255, 255, 255, 0.03)';
      btnTitleSpeaker.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      btnTitleSpeaker.style.color = 'var(--text-primary)';
    }
  }
}

// --- Dictation Scoring & Alignment (Word-by-word) ---
function checkDictation() {
  if (!currentExercise || !currentExercise.text) {
    alert('No exercise text selected.');
    return;
  }

  const typedText = studentWriting.value.trim();
  if (!typedText) {
    alert('Please write something before checking your accuracy!');
    return;
  }

  const originalText = currentExercise.text;
  const originalWords = splitIntoWords(originalText);
  const typedWords = splitIntoWords(typedText);
  
  const alignment = alignWords(originalWords, typedWords);
  renderDiff(alignment);
  
  const correctCount = alignment.filter(item => item.status === 'correct').length;
  const score = Math.round((correctCount / originalWords.length) * 100);
  
  evaluationScore.textContent = `${score}% Accuracy`;
  evaluationScore.className = 'result-score';
  
  if (score >= 90) {
    evaluationScore.classList.add('score-high');
    resultsPanel.className = 'result-card success';
  } else if (score >= 70) {
    evaluationScore.classList.add('score-medium');
    resultsPanel.className = 'result-card feedback';
  } else {
    evaluationScore.classList.add('score-low');
    resultsPanel.className = 'result-card feedback';
  }
  
  originalTextPeek.textContent = originalText;
  resultsPanel.classList.remove('hidden');
  resultsPanel.scrollIntoView({ behavior: 'smooth' });
  
  // Save to Dashboard statistics
  saveScoreToStats(currentExercise.id, currentExercise.title, 'passage', score);
}

function splitIntoWords(text) {
  return text.match(/\b[\w'-]+\b|[.,!?;()]/g) || [];
}

function normalizeWord(word) {
  return word.replace(/[.,!?;()]/g, '').toLowerCase().trim();
}

function alignWords(origList, typedList) {
  const m = origList.length;
  const n = typedList.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (normalizeWord(origList[i-1]) === normalizeWord(typedList[j-1])) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }
  
  let i = m;
  let j = n;
  const alignment = [];
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && normalizeWord(origList[i-1]) === normalizeWord(typedList[j-1])) {
      alignment.unshift({
        original: origList[i-1],
        typed: typedList[j-1],
        status: 'correct'
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      alignment.unshift({
        original: null,
        typed: typedList[j-1],
        status: 'incorrect'
      });
      j--;
    } else {
      alignment.unshift({
        original: origList[i-1],
        typed: null,
        status: 'missing'
      });
      i--;
    }
  }
  
  return alignment;
}

function renderDiff(alignment) {
  diffResults.innerHTML = '';
  alignment.forEach(item => {
    const span = document.createElement('span');
    span.className = 'diff-word';
    
    if (item.status === 'correct') {
      span.classList.add('correct');
      span.textContent = item.original;
    } else if (item.status === 'incorrect') {
      span.classList.add('incorrect');
      span.textContent = item.typed;
      span.title = 'Extra or incorrect word written';
    } else if (item.status === 'missing') {
      span.classList.add('missing');
      span.textContent = item.original;
      span.title = 'Missing word';
    }
    
    diffResults.appendChild(span);
  });
}

function toggleOriginalPeek() {
  if (originalTextPeek.classList.contains('hidden')) {
    originalTextPeek.classList.remove('hidden');
    btnTogglePeek.textContent = 'Hide Original Passage';
  } else {
    originalTextPeek.classList.add('hidden');
    btnTogglePeek.textContent = 'Show Original Passage';
  }
}

function toggleGlobalTextPeek() {
  const isHidden = globalTextPeek.classList.contains('hidden');
  const isWords = (currentFormat === 'words');
  const labelHide = isWords ? 'Hide Words' : 'Hide Text';
  const labelShow = isWords ? 'Show Words' : 'Show Text';

  if (isHidden) {
    globalTextPeek.classList.remove('hidden');
    btnShowTextGlobal.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
      ${labelHide}
    `;
  } else {
    globalTextPeek.classList.add('hidden');
    btnShowTextGlobal.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      ${labelShow}
    `;
  }
}

// --- Student Dashboard & Score Logging ---
function saveScoreToStats(exerciseId, title, type, score) {
  const statsRecord = {
    id: 'rec-' + Date.now(),
    exerciseId: exerciseId,
    title: title,
    type: type,
    score: score,
    date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
  };
  
  studentStats.push(statsRecord);
  localStorage.setItem('DICTATER_STATS', JSON.stringify(studentStats));
  
  // Evaluate and award achievements / badges
  evaluateBadges(statsRecord);
}

function calculateCurrentStreak() {
  if (studentStats.length === 0) return 0;
  
  // Get all unique dates on which student completed exercises, sorted descending
  const dates = [...new Set(studentStats.map(r => r.date))].sort().reverse();
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // If the last activity wasn't today or yesterday, streak is broken
  if (dates[0] !== today && dates[0] !== yesterday) {
    return 0;
  }
  
  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const current = new Date(dates[i]);
    const prev = new Date(dates[i+1]);
    const diffTime = Math.abs(current - prev);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
    } else if (diffDays > 1) {
      break;
    }
  }
  return streak;
}

function evaluateBadges(newRecord) {
  let updated = false;

  // 1. First Steps: Complete first dictation
  if (!studentBadges.firstSteps && studentStats.length >= 1) {
    studentBadges.firstSteps = true;
    updated = true;
  }
  
  // 2. Accuracy Expert: Score 90%+ on any passage
  if (!studentBadges.accuracyExpert && newRecord.type === 'passage' && newRecord.score >= 90) {
    studentBadges.accuracyExpert = true;
    updated = true;
  }
  
  // 3. Spelling Hero: Get a perfect score (100%) on any word list
  if (!studentBadges.spellingHero && newRecord.type === 'words' && newRecord.score === 100) {
    studentBadges.spellingHero = true;
    updated = true;
  }
  
  // 4. Streak Explorer: Reach 3-day streak
  const streak = calculateCurrentStreak();
  if (!studentBadges.streakExplorer && streak >= 3) {
    studentBadges.streakExplorer = true;
    updated = true;
  }
  
  // 5. Super Writer: Transcribe 5 passages
  const passageCount = studentStats.filter(r => r.type === 'passage').length;
  if (!studentBadges.superWriter && passageCount >= 5) {
    studentBadges.superWriter = true;
    updated = true;
  }
  
  // 6. Custom Scholar: Complete a custom saved lesson
  if (!studentBadges.customScholar && newRecord.exerciseId.startsWith('custom-')) {
    studentBadges.customScholar = true;
    updated = true;
  }
  
  if (updated) {
    localStorage.setItem('DICTATER_BADGES', JSON.stringify(studentBadges));
    // Pop a small notification banner
    setTimeout(() => {
      alert('🏆 Achievement Unlocked! Check your Student Dashboard to view your new badge.');
    }, 800);
  }
}

function updateDashboardStats() {
  const total = studentStats.length;
  statCompleted.textContent = total;
  
  // Calculate average accuracy
  if (total > 0) {
    const sum = studentStats.reduce((acc, r) => acc + r.score, 0);
    statAccuracy.textContent = Math.round(sum / total) + '%';
  } else {
    statAccuracy.textContent = '0%';
  }
  
  // Calculate daily streak
  const streak = calculateCurrentStreak();
  statStreak.textContent = streak === 1 ? '1 Day' : streak + ' Days';
  
  // Render Badges grid
  badgesGrid.innerHTML = '';
  const badgesDef = [
    { key: 'firstSteps', icon: '🎈', title: 'First Steps', desc: 'Complete your first dictation' },
    { key: 'accuracyExpert', icon: '🎯', title: 'Accuracy Expert', desc: '90%+ on any passage' },
    { key: 'spellingHero', icon: '🏆', title: 'Spelling Hero', desc: 'Perfect 100% on a word list' },
    { key: 'streakExplorer', icon: '🔥', title: 'Streak Explorer', desc: '3-day practice streak' },
    { key: 'superWriter', icon: '✍️', title: 'Super Writer', desc: 'Complete 5 passages' },
    { key: 'customScholar', icon: '🛠️', title: 'Custom Scholar', desc: 'Finish a custom saved lesson' }
  ];
  
  badgesDef.forEach(badge => {
    const isUnlocked = studentBadges[badge.key];
    const card = document.createElement('div');
    card.className = `badge-card ${isUnlocked ? '' : 'locked'}`;
    card.innerHTML = `
      <span class="badge-icon">${badge.icon}</span>
      <span class="badge-title">${badge.title}</span>
      <span class="badge-desc">${badge.desc}</span>
    `;
    badgesGrid.appendChild(card);
  });
  
  // Render Recent Activity Logs
  if (total === 0) {
    dashboardActivityLog.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No activity recorded yet. Start practicing to log scores!</p>';
    return;
  }
  
  dashboardActivityLog.innerHTML = '';
  // Show last 10 entries descending
  const logs = [...studentStats].reverse().slice(0, 10);
  logs.forEach(log => {
    const logDiv = document.createElement('div');
    logDiv.style.display = 'flex';
    logDiv.style.justify = 'space-between';
    logDiv.style.alignItems = 'center';
    logDiv.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
    logDiv.style.padding = '0.35rem 0';
    
    const typeLabel = log.type === 'passage' ? '📝' : '🔤';
    logDiv.innerHTML = `
      <div style="display: flex; gap: 0.4rem; align-items: center; max-width: 70%;">
        <span>${typeLabel}</span>
        <span style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${log.title}</span>
      </div>
      <div style="display: flex; gap: 0.75rem; align-items: center; font-size: 0.8rem;">
        <span style="color: var(--text-muted);">${log.date}</span>
        <span style="font-weight: 700; color: ${log.score >= 90 ? 'var(--success)' : log.score >= 70 ? 'var(--warning)' : 'var(--error)'}">${log.score}%</span>
      </div>
    `;
    dashboardActivityLog.appendChild(logDiv);
  });
}

// Run app init on load or immediately if DOM is already parsed
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
