import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

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

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const db = loadDb();
  let user = db.users[email];
  if (!user) {
    user = { id: randomUUID(), email, role: 'student', createdAt: Date.now() };
    db.users[email] = user;
    saveDb(db);
  }
  res.json({ token: user.id, userId: user.id, email, role: user.role });
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
  res.json(db.assignments.filter((a) => !a.userId || a.userId === token));
});

app.post('/api/teacher/classes', (req, res) => {
  const { name, teacherEmail } = req.body;
  const db = loadDb();
  const id = randomUUID();
  db.classes[id] = { id, name, teacherEmail, students: [], createdAt: Date.now() };
  saveDb(db);
  res.json(db.classes[id]);
});

app.post('/api/teacher/classes/:id/enroll', (req, res) => {
  const db = loadDb();
  const cls = db.classes[req.params.id];
  if (!cls) return res.status(404).json({ error: 'Class not found' });
  const { studentEmail } = req.body;
  if (!cls.students.includes(studentEmail)) cls.students.push(studentEmail);
  saveDb(db);
  res.json(cls);
});

app.get('/api/teacher/classes/:id/report', (req, res) => {
  const db = loadDb();
  const cls = db.classes[req.params.id];
  if (!cls) return res.status(404).json({ error: 'Class not found' });
  const studentProgress = cls.students.map((email) => {
    const user = db.users[email];
    const records = db.progress.filter((p) => p.userId === user?.id);
    const avg = records.length
      ? Math.round(records.reduce((a, r) => a + r.score, 0) / records.length)
      : 0;
    return { email, sessions: records.length, avgScore: avg };
  });
  res.json({ class: cls, students: studentProgress });
});

app.post('/api/teacher/assignments', (req, res) => {
  const db = loadDb();
  const assignment = { id: randomUUID(), ...req.body, createdAt: Date.now() };
  db.assignments.push(assignment);
  saveDb(db);
  res.json(assignment);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Dictater API on http://localhost:${PORT}`));
