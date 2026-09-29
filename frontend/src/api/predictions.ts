const BASE = 'http://localhost:8080/predictions';

export const runAllPredictions = () => fetch(`${BASE}/run`, { method: 'POST' }).then(r => r.json());
