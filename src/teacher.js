import { buildCurriculumIndex } from './curriculum/loader.js';

const api = '/api';
let teacherEmail = '';
/** @type {import('./activities/registry.js').Lesson[]} */
let allLessons = [];

function showToast(message, type = 'info') {
  const container = document.querySelector('#teacher-toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function setSignedIn(email) {
  teacherEmail = email;
  const status = document.querySelector('#teacher-status');
  const signInSection = document.querySelector('#teacher-signin-section');
  if (status) status.textContent = `Signed in as ${email}`;
  if (signInSection) signInSection.classList.add('hidden');
  document.querySelector('#teacher-signed-in')?.classList.remove('hidden');
}

function showResult(elId, message, isError = false) {
  const el = document.querySelector(`#${elId}`);
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
  el.classList.toggle('result-card--error', isError);
  showToast(message, isError ? 'error' : 'success');
}

function clearChildren(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
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

async function init() {
  const index = await buildCurriculumIndex();
  allLessons = Object.values(index).flatMap((g) => g.lessons || []);
  populateLessonPicker();

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
      showToast(`Welcome, ${email}`, 'success');
    } catch {
      showToast('Sign in failed — check the API server', 'error');
    }
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
      ['class-id', 'assign-class-id', 'report-class-id'].forEach((id) => {
        const input = document.querySelector(`#${id}`);
        if (input) input.value = data.id;
      });
    } catch {
      showToast('Could not create class', 'error');
    }
  });

  document.querySelector('#enroll-student')?.addEventListener('click', async () => {
    const id = document.querySelector('#class-id')?.value?.trim();
    const studentEmail = document.querySelector('#student-email')?.value?.trim();
    if (!id || !studentEmail) {
      showToast('Class ID and student email required', 'warning');
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
    } catch {
      showToast('Enrollment failed', 'error');
    }
  });

  document.querySelector('#create-assignment')?.addEventListener('click', async () => {
    const lessonSelect = document.querySelector('#assign-lesson-select');
    const lessonIdInput = document.querySelector('#assign-lesson-id');
    const lessonId = lessonSelect?.value || lessonIdInput?.value?.trim();
    const body = {
      classId: document.querySelector('#assign-class-id')?.value?.trim(),
      lessonId,
      title: document.querySelector('#assign-title')?.value?.trim(),
      dueDate: document.querySelector('#assign-due')?.value || null
    };
    if (!body.classId || !lessonId || !body.title) {
      showToast('Class, lesson, and title are required', 'warning');
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

  document.querySelector('#view-report')?.addEventListener('click', async () => {
    const id = document.querySelector('#report-class-id')?.value?.trim();
    if (!id) {
      showToast('Enter a class ID', 'warning');
      return;
    }
    try {
      const res = await fetch(`${api}/teacher/classes/${id}/report`);
      const data = await res.json();
      const output = document.querySelector('#report-output');
      if (output) output.textContent = JSON.stringify(data, null, 2);
      const csvLink = document.querySelector('#csv-link');
      if (csvLink) csvLink.href = `${api}/teacher/classes/${id}/report.csv`;
      showToast('Report loaded', 'success');
    } catch {
      showToast('Could not load report', 'error');
    }
  });
}

init().catch((err) => console.error('[Teacher]', err));
