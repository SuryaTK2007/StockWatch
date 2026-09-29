const BASE = 'http://localhost:8080/alerts';

export const getAlerts = () => fetch(BASE).then(r => r.json());
export const getUnresolvedAlerts = () => fetch(`${BASE}/unresolved`).then(r => r.json());
export const resolveAlert = (id: number) => fetch(`${BASE}/${id}/resolve`, { method: 'PUT' }).then(r => r.json());
