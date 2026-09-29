import { authHeader } from './token';
const BASE = 'http://localhost:8080/alerts';

export const getAlerts = () => fetch(BASE, { headers: authHeader() }).then(r => r.json());
export const getUnresolvedAlerts = () => fetch(`${BASE}/unresolved`, { headers: authHeader() }).then(r => r.json());
export const resolveAlert = (id: number) => fetch(`${BASE}/${id}/resolve`, { method: 'PUT', headers: authHeader() }).then(r => r.json());
