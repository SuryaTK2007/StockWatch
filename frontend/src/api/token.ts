export const getToken = () => localStorage.getItem('token');
export const setToken = (token: string) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');
export const authHeader = () => ({ 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' });
