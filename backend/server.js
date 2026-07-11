import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const DIST = path.join(ROOT, 'dist');
const WHISPER_URL = process.env.WHISPER_URL || 'http://127.0.0.1:3002';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
});

fs.mkdirSync(DATA_DIR, { recursive: true });

function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    return { users: {}, progress: [], classes: {}, assignments: [] };
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function saveDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function userByToken(db, token) {
  return Object.values(db.users).find((u) => u.id === token);
}

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  const { email, role = 'student', parentConsent = false } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const db = loadDb();
  let user = db.users[email];
  if (!user) {
    user = { id: randomUUID(), email, role, parentConsent, createdAt: Date.now() };
    db.users[email] = user;
    saveDb(db);
  } else if (parentConsent) {
    user.parentConsent = true;
    saveDb(db);
  }
  res.json({
    token: user.id,
    userId: user.id,
    email,
    role: user.role,
    parentConsent: !!user.parentConsent
  });
});

app.post('/api/progress', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const db = loadDb();
  const record = { ...req.body.record, userId: token, syncedAt: Date.now() };
  db.progress.push(record);
  saveDb(db);
  res.json({ ok: true });
});

app.get('/api/assignments', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const db = loadDb();
  const user = userByToken(db, token);
  if (!user) return res.json([]);
  res.json(
    db.assignments.filter((a) => {
      const cls = db.classes[a.classId];
      return cls?.students?.includes(user.email);
    })
  );
});

app.post('/api/teacher/classes', (req, res) => {
  const { name, teacherEmail } = req.body;
  const db = loadDb();
  const id = randomUUID().slice(0, 8);
  db.classes[id] = { id, name, teacherEmail, students: [], createdAt: Date.now() };
  saveDb(db);
  res.json(db.classes[id]);
});

app.post('/api/teacher/classes/:id/enroll', (req, res) => {
  const db = loadDb();
  const cls = db.classes[req.params.id];
  if (!cls) return res.status(404).json({ error: 'Class not found' });
  const { studentEmail } = req.body;
  if (studentEmail && !cls.students.includes(studentEmail)) cls.students.push(studentEmail);
  saveDb(db);
  res.json(cls);
});

app.get('/api/teacher/classes/:id/report', (req, res) => {
  const db = loadDb();
  const cls = db.classes[req.params.id];
  if (!cls) return res.status(404).json({ error: 'Class not found' });
  const students = cls.students.map((email) => {
    const user = db.users[email];
    const records = db.progress.filter((p) => p.userId === user?.id);
    const avg = records.length
      ? Math.round(records.reduce((a, r) => a + r.score, 0) / records.length)
      : 0;
    return { email, sessions: records.length, avgScore: avg, records };
  });
  res.json({ class: cls, students });
});

app.get('/api/teacher/classes/:id/report.csv', (req, res) => {
  const db = loadDb();
  const cls = db.classes[req.params.id];
  if (!cls) return res.status(404).json({ error: 'Class not found' });
  const rows = [['email', 'sessions', 'avg_score']];
  cls.students.forEach((email) => {
    const user = db.users[email];
    const records = db.progress.filter((p) => p.userId === user?.id);
    const avg = records.length
      ? Math.round(records.reduce((a, r) => a + r.score, 0) / records.length)
      : 0;
    rows.push([email, String(records.length), String(avg)]);
  });
  const csv = rows.map((r) => r.join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="class-${cls.id}-report.csv"`);
  res.send(csv);
});

app.post('/api/teacher/assignments', (req, res) => {
  const db = loadDb();
  const assignment = {
    id: randomUUID(),
    classId: req.body.classId,
    lessonId: req.body.lessonId,
    title: req.body.title,
    dueDate: req.body.dueDate || null,
    createdAt: Date.now()
  };
  db.assignments.push(assignment);
  saveDb(db);
  res.json(assignment);
});

app.get('/api/teacher/classes', (req, res) => {
  const db = loadDb();
  let classes = Object.values(db.classes);
  const { teacherEmail } = req.query;
  if (teacherEmail) {
    classes = classes.filter((c) => c.teacherEmail === teacherEmail);
  }
  res.json(classes);
});

app.get('/api/speech/status', async (req, res) => {
  try {
    const r = await fetch(`${WHISPER_URL}/health`, { signal: AbortSignal.timeout(2000) });
    if (!r.ok) throw new Error('Whisper down');
    res.json(await r.json());
  } catch {
    res.json({ available: false, engine: 'browser' });
  }
});

app.post('/api/speech/transcribe', upload.single('audio'), async (req, res) => {
  if (!req.file?.buffer?.length) {
    return res.status(400).json({ error: 'No audio uploaded' });
  }
  try {
    const form = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype || 'audio/webm' });
    form.append('audio', blob, req.file.originalname || 'speech.webm');
    if (req.body?.prompt) form.append('prompt', req.body.prompt);

    const r = await fetch(`${WHISPER_URL}/transcribe`, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(60000)
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      return res.status(r.status).json({ error: err.detail || 'Whisper transcription failed' });
    }
    res.json(await r.json());
  } catch {
    res.status(503).json({
      error: 'Whisper server not running. Start with: npm run whisper (see docs/LOCAL.md)'
    });
  }
});

// Production: serve built frontend
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    const file = path.join(DIST, req.path.endsWith('.html') ? req.path.slice(1) : 'index.html');
    if (fs.existsSync(file) && !fs.statSync(file).isDirectory()) {
      return res.sendFile(file);
    }
    res.sendFile(path.join(DIST, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Dictater API on http://localhost:${PORT}`);
  if (fs.existsSync(DIST)) console.log('Serving static app from dist/');
});
