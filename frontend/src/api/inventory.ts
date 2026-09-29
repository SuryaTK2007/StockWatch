const BASE = 'http://localhost:8080/inventory';

export const getInventory = () => fetch(BASE).then(r => r.json());
export const createInventory = (data: object) => fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());
export const updateInventory = (id: number, data: object) => fetch(`${BASE}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());
export const deleteInventory = (id: number) => fetch(`${BASE}/${id}`, { method: 'DELETE' });
