const BASE = 'http://localhost:8080/sales';

export const getSales = () => fetch(BASE).then(r => r.json());
export const createSale = (data: object) => fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());
export const deleteSale = (id: number) => fetch(`${BASE}/${id}`, { method: 'DELETE' });
