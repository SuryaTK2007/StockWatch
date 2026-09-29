import { authHeader } from './token';
const BASE = 'http://localhost:8080/products';

export const getProducts = () => fetch(BASE, { headers: authHeader() }).then(r => r.json());
export const createProduct = (data: object) => fetch(BASE, { method: 'POST', headers: authHeader(), body: JSON.stringify(data) }).then(r => r.json());
export const deleteProduct = (id: number) => fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeader() });
