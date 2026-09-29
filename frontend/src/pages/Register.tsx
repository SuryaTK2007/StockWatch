import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { setToken } from '../api/token';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    register(form.username, form.password).then(res => {
      if (res.error) { setError(res.error); return; }
      setToken(res.token);
      navigate('/dashboard');
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>📦 StockWatch</h2>
        <h3>Register</h3>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
          <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="error">{error}</p>}
          <button className="btn-primary" type="submit">Register</button>
        </form>
        <p className="auth-switch">Already have an account? <span onClick={() => navigate('/login')}>Login</span></p>
      </div>
    </div>
  );
}
