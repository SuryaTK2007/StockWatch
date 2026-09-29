import { authHeader } from './token';
const BASE = 'http://localhost:8080/sales';

export const getSales = () => fetch(BASE, { headers: authHeader() }).then(r => r.json());
export const createSale = (data: object) => fetch(BASE, { method: 'POST', headers: authHeader(), body: JSON.stringify(data) }).then(r => r.json());
export const deleteSale = (id: number) => fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeader() });
