import { useState } from 'react';
import { login } from '../api/auth';
import { setToken } from '../api/token';

interface Props { onSuccess: () => void; onSwitch: () => void; }

export default function Login({ onSuccess, onSwitch }: Props) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    login(form.username, form.password).then(res => {
      if (res.error) { setError(res.error); return; }
      setToken(res.token);
      onSuccess();
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>📦 StockWatch</h2>
        <h3>Login</h3>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
          <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="error">{error}</p>}
          <button className="btn-primary" type="submit">Login</button>
        </form>
        <p className="auth-switch">Don't have an account? <span onClick={onSwitch}>Register</span></p>
      </div>
    </div>
  );
}
