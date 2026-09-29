import { authHeader } from './token';
const BASE = 'http://localhost:8080/predictions';

export const runAllPredictions = () => fetch(`${BASE}/run`, { method: 'POST', headers: authHeader() }).then(r => r.json());
