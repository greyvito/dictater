const API_BASE = '/api';

export async function loginUser(email, options = {}) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, parentConsent: options.parentConsent || false })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function syncProgress(profile, record) {
  if (!profile.authToken) return null;
  const res = await fetch(`${API_BASE}/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${profile.authToken}`
    },
    body: JSON.stringify({ record })
  });
  if (!res.ok) throw new Error('Sync failed');
  return res.json();
}

export async function fetchAssignments(profile) {
  if (!profile.authToken) return [];
  const res = await fetch(`${API_BASE}/assignments`, {
    headers: { Authorization: `Bearer ${profile.authToken}` }
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchTeacherReport(profile, classId) {
  const res = await fetch(`${API_BASE}/teacher/classes/${classId}/report`, {
    headers: { Authorization: `Bearer ${profile.authToken}` }
  });
  if (!res.ok) throw new Error('Report failed');
  return res.json();
}
