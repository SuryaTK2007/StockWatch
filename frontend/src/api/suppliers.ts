import { authHeader } from './token';
const BASE = 'http://localhost:8080/suppliers';

export const getSuppliers = () => fetch(BASE, { headers: authHeader() }).then(r => r.json());
export const createSupplier = (data: object) => fetch(BASE, { method: 'POST', headers: authHeader(), body: JSON.stringify(data) }).then(r => r.json());
export const deleteSupplier = (id: number) => fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeader() });
