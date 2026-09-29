const BASE = 'http://localhost:8080/products';

export const getProducts = () => fetch(BASE).then(r => r.json());
export const createProduct = (data: object) => fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());
export const deleteProduct = (id: number) => fetch(`${BASE}/${id}`, { method: 'DELETE' });
