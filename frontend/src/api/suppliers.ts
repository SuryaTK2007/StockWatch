const BASE = 'http://localhost:8080/suppliers';

export const getSuppliers = () => fetch(BASE).then(r => r.json());
export const createSupplier = (data: object) => fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());
export const deleteSupplier = (id: number) => fetch(`${BASE}/${id}`, { method: 'DELETE' });
