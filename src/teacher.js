import { buildCurriculumIndex } from './curriculum/loader.js';

const api = '/api';
let teacherEmail = '';
/** @type {import('./activities/registry.js').Lesson[]} */
let allLessons = [];
/** @type {Array<{ id: string, name: string, teacherEmail: string, students: string[] }>} */
let teacherClasses = [];

function showToast(message, type = 'info') {
  const container = document.querySelector('#teacher-toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function clearChildren(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

function getActiveClassId() {
  return document.querySelector('#active-class-select')?.value?.trim() || '';
}

function setActiveClassId(id) {
  const select = document.querySelector('#active-class-select');
  if (select) select.value = id;
  updateClassHints();
  updateCsvLink();
}

function updateClassHints() {
  const id = getActiveClassId();
  const cls = teacherClasses.find((c) => c.id === id);
  const enrollHint = document.querySelector('#enroll-class-hint');
  const reportHint = document.querySelector('#report-hint');
  if (enrollHint) {
    enrollHint.textContent = cls
      ? `Enrolling into ${cls.name} (${cls.id})`
      : 'Select an active class above first.';
  }
  if (reportHint) {
    reportHint.textContent = cls
      ? `Report for ${cls.name} — ${cls.students.length} enrolled student(s).`
      : 'Select a class, then load the report to see student scores.';
  }
}

function updateCsvLink() {
  const id = getActiveClassId();
  const csvLink = document.querySelector('#csv-link');
  if (!csvLink) return;
  if (id) {
    csvLink.href = `${api}/teacher/classes/${id}/report.csv`;
    csvLink.classList.remove('is-disabled');
  } else {
    csvLink.href = '#';
    csvLink.classList.add('is-disabled');
  }
}

function setSignedIn(email) {
  teacherEmail = email;
  const status = document.querySelector('#teacher-status');
  const signInSection = document.querySelector('#teacher-signin-section');
  const hubSection = document.querySelector('#teacher-hub-section');
  if (status) status.textContent = `Signed in as ${email}`;
  if (signInSection) signInSection.classList.add('hidden');
  document.querySelector('#teacher-signed-in')?.classList.remove('hidden');
  hubSection?.classList.remove('hidden');
}

function showResult(elId, message, isError = false) {
  const el = document.querySelector(`#${elId}`);
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
  el.classList.toggle('result-card--error', isError);
  showToast(message, isError ? 'error' : 'success');
}

function scoreClass(score) {
  if (score >= 80) return 'score-high';
  if (score >= 60) return '';
  return 'score-low';
}

function populateLessonPicker() {
  const select = document.querySelector('#assign-lesson-select');
  const datalist = document.querySelector('#lesson-id-list');
  if (!select && !datalist) return;

  const sorted = [...allLessons].sort((a, b) => a.title.localeCompare(b.title));

  if (select) {
    clearChildren(select);
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Choose a lesson…';
    select.appendChild(placeholder);
    sorted.forEach((lesson) => {
      const opt = document.createElement('option');
      opt.value = lesson.id;
      opt.textContent = `${lesson.title} (${lesson.grade})`;
      select.appendChild(opt);
    });
  }

  if (datalist) {
    clearChildren(datalist);
    sorted.forEach((lesson) => {
      const opt = document.createElement('option');
      opt.value = lesson.id;
      opt.label = lesson.title;
      datalist.appendChild(opt);
    });
  }
}

function renderClassHub() {
  const body = document.querySelector('#class-hub-body');
  const empty = document.querySelector('#class-hub-empty');
  const select = document.querySelector('#active-class-select');
  if (!body || !select) return;

  const previous = getActiveClassId();
  clearChildren(body);

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select a class…';
  clearChildren(select);
  select.appendChild(placeholder);

  if (!teacherClasses.length) {
    empty?.classList.remove('hidden');
    document.querySelector('#report-table')?.setAttribute('hidden', '');
    updateClassHints();
    updateCsvLink();
    return;
  }

  empty?.classList.add('hidden');

  teacherClasses.forEach((cls) => {
    const row = document.createElement('tr');
    row.dataset.classId = cls.id;

    const nameCell = document.createElement('td');
    nameCell.textContent = cls.name;

    const idCell = document.createElement('td');
    const code = document.createElement('code');
    code.className = 'teacher-class-id';
    code.textContent = cls.id;
    idCell.appendChild(code);

    const countCell = document.createElement('td');
    countCell.textContent = String(cls.students.length);

    const actionCell = document.createElement('td');
    actionCell.className = 'teacher-table-actions';
    const useBtn = document.createElement('button');
    useBtn.type = 'button';
    useBtn.className = 'btn-secondary btn-compact';
    useBtn.textContent = 'Select';
    useBtn.addEventListener('click', () => {
      setActiveClassId(cls.id);
      loadClassReport(cls.id).catch(() => {});
    });
    actionCell.appendChild(useBtn);

    row.appendChild(nameCell);
    row.appendChild(idCell);
    row.appendChild(countCell);
    row.appendChild(actionCell);
    body.appendChild(row);

    const opt = document.createElement('option');
    opt.value = cls.id;
    opt.textContent = `${cls.name} (${cls.id})`;
    select.appendChild(opt);
  });

  if (previous && teacherClasses.some((c) => c.id === previous)) {
    setActiveClassId(previous);
  }
  updateClassHints();
  updateCsvLink();
}

async function fetchTeacherClasses() {
  if (!teacherEmail) return;
  const res = await fetch(`${api}/teacher/classes?teacherEmail=${encodeURIComponent(teacherEmail)}`);
  if (!res.ok) throw new Error('Could not load classes');
  teacherClasses = await res.json();
  renderClassHub();
}

function renderReportTable(data) {
  const table = document.querySelector('#report-table');
  const tbody = document.querySelector('#report-table-body');
  const summary = document.querySelector('#report-summary');
  const jsonDetails = document.querySelector('#report-json-details');
  const jsonOutput = document.querySelector('#report-output');
  if (!table || !tbody || !summary) return;

  clearChildren(tbody);
  const { class: cls, students } = data;

  const totalSessions = students.reduce((sum, s) => sum + s.sessions, 0);
  const classAvg = students.length
    ? Math.round(students.reduce((sum, s) => sum + s.avgScore, 0) / students.length)
    : 0;

  summary.textContent = `${cls.name}: ${students.length} students · ${totalSessions} total sessions · class average ${classAvg}%`;
  summary.classList.remove('hidden');

  if (!students.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 4;
    cell.textContent = 'No students enrolled yet.';
    row.appendChild(cell);
    tbody.appendChild(row);
  } else {
    students.forEach((student) => {
      const row = document.createElement('tr');

      const emailCell = document.createElement('td');
      emailCell.textContent = student.email;

      const sessionsCell = document.createElement('td');
      sessionsCell.textContent = String(student.sessions);

      const avgCell = document.createElement('td');
      const avgSpan = document.createElement('span');
      avgSpan.className = scoreClass(student.avgScore);
      avgSpan.textContent = student.sessions ? `${student.avgScore}%` : '—';
      avgCell.appendChild(avgSpan);

      const recentCell = document.createElement('td');
      recentCell.className = 'teacher-recent-cell';
      const recent = (student.records || []).slice(-3).reverse();
      recentCell.textContent = recent.length
        ? recent.map((r) => `${r.title || r.exerciseId} (${r.score}%)`).join(' · ')
        : 'No activity yet';

      row.appendChild(emailCell);
      row.appendChild(sessionsCell);
      row.appendChild(avgCell);
      row.appendChild(recentCell);
      tbody.appendChild(row);
    });
  }

  table.removeAttribute('hidden');
  if (jsonDetails && jsonOutput) {
    jsonOutput.textContent = JSON.stringify(data, null, 2);
    jsonDetails.classList.remove('hidden');
  }
}

async function loadClassReport(classId = getActiveClassId()) {
  if (!classId) {
    showToast('Select a class first', 'warning');
    return;
  }
  const res = await fetch(`${api}/teacher/classes/${classId}/report`);
  if (!res.ok) throw new Error('Report not found');
  const data = await res.json();
  renderReportTable(data);
  showToast('Report loaded', 'success');
}

async function init() {
  const index = await buildCurriculumIndex();
  allLessons = Object.values(index).flatMap((g) => g.lessons || []);
  populateLessonPicker();
  updateCsvLink();

  document.querySelector('#teacher-login')?.addEventListener('click', async () => {
    const email = document.querySelector('#teacher-email')?.value?.trim();
    if (!email) {
      showToast('Enter your school email', 'warning');
      return;
    }
    try {
      await fetch(`${api}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: 'teacher' })
      });
      setSignedIn(email);
      await fetchTeacherClasses();
      showToast(`Welcome, ${email}`, 'success');
    } catch {
      showToast('Sign in failed — check the API server', 'error');
    }
  });

  document.querySelector('#refresh-classes')?.addEventListener('click', () => {
    fetchTeacherClasses().catch(() => showToast('Could not refresh classes', 'error'));
  });

  document.querySelector('#active-class-select')?.addEventListener('change', () => {
    updateClassHints();
    updateCsvLink();
  });

  document.querySelector('#create-class')?.addEventListener('click', async () => {
    const name = document.querySelector('#class-name')?.value?.trim();
    if (!name) {
      showToast('Enter a class name', 'warning');
      return;
    }
    if (!teacherEmail) {
      showToast('Sign in first', 'warning');
      return;
    }
    try {
      const res = await fetch(`${api}/teacher/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, teacherEmail })
      });
      const data = await res.json();
      showResult('class-result', `Class "${data.name}" created. ID: ${data.id}`);
      await fetchTeacherClasses();
      setActiveClassId(data.id);
    } catch {
      showToast('Could not create class', 'error');
    }
  });

  document.querySelector('#enroll-student')?.addEventListener('click', async () => {
    const id = getActiveClassId();
    const studentEmail = document.querySelector('#student-email')?.value?.trim();
    if (!id || !studentEmail) {
      showToast('Select a class and enter a student email', 'warning');
      return;
    }
    try {
      const res = await fetch(`${api}/teacher/classes/${id}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentEmail })
      });
      const data = await res.json();
      showToast(`Enrolled. Class now has ${data.students.length} student(s).`, 'success');
      await fetchTeacherClasses();
      document.querySelector('#student-email').value = '';
    } catch {
      showToast('Enrollment failed', 'error');
    }
  });

  document.querySelector('#create-assignment')?.addEventListener('click', async () => {
    const lessonSelect = document.querySelector('#assign-lesson-select');
    const lessonIdInput = document.querySelector('#assign-lesson-id');
    const lessonId = lessonSelect?.value || lessonIdInput?.value?.trim();
    const classId = getActiveClassId();
    const body = {
      classId,
      lessonId,
      title: document.querySelector('#assign-title')?.value?.trim(),
      dueDate: document.querySelector('#assign-due')?.value || null
    };
    if (!body.classId || !lessonId || !body.title) {
      showToast('Active class, lesson, and title are required', 'warning');
      return;
    }
    try {
      const res = await fetch(`${api}/teacher/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      showResult('assign-result', `Assigned "${data.title}" (id: ${data.id})`);
    } catch {
      showToast('Assignment failed', 'error');
    }
  });

  document.querySelector('#assign-lesson-select')?.addEventListener('change', (e) => {
    const input = document.querySelector('#assign-lesson-id');
    const select = /** @type {HTMLSelectElement} */ (e.target);
    const lesson = allLessons.find((l) => l.id === select.value);
    if (input) input.value = select.value;
    const titleInput = document.querySelector('#assign-title');
    if (titleInput && lesson && !titleInput.value.trim()) {
      titleInput.value = lesson.title;
    }
  });

  document.querySelector('#view-report')?.addEventListener('click', () => {
    loadClassReport().catch(() => showToast('Could not load report', 'error'));
  });

  document.querySelector('#csv-link')?.addEventListener('click', (e) => {
    if (!getActiveClassId()) {
      e.preventDefault();
      showToast('Select a class first', 'warning');
    }
  });
}

init().catch((err) => console.error('[Teacher]', err));
