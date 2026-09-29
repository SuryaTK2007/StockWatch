const BASE = 'http://localhost:8080/auth';

export const register = (username: string, password: string) =>
  fetch(`${BASE}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }).then(r => r.json());

export const login = (username: string, password: string) =>
  fetch(`${BASE}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }).then(r => r.json());
