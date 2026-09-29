import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getSuppliers, createSupplier, deleteSupplier } from '../api/suppliers';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 5;

export default function Suppliers() {
  const { data: suppliers, loading, error, reload } = useFetch<any[]>(getSuppliers);
  const [form, setForm] = useState({ name: '', contactEmail: '', leadTimeDays: '' });
  const [formError, setFormError] = useState('');
  const [page, setPage] = useState(1);

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.contactEmail.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) return 'Invalid email format.';
    if (!form.leadTimeDays || Number(form.leadTimeDays) <= 0) return 'Lead time must be greater than 0.';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setFormError(err); return; }
    setFormError('');
    createSupplier({ ...form, leadTimeDays: Number(form.leadTimeDays) })
      .then(() => { setForm({ name: '', contactEmail: '', leadTimeDays: '' }); reload(); })
      .catch(() => setFormError('Failed to add supplier.'));
  };

  const paginated = (suppliers ?? []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page">
      <h2>Suppliers</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Contact Email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} />
        <input placeholder="Lead Time (days)" type="number" value={form.leadTimeDays} onChange={e => setForm({ ...form, leadTimeDays: e.target.value })} />
        <button className="btn-primary" type="submit">Add Supplier</button>
      </form>
      {formError && <p className="error">{formError}</p>}
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <>
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Lead Time</th><th>Action</th></tr></thead>
            <tbody>
              {paginated.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td><td>{s.name}</td><td>{s.contactEmail}</td><td>{s.leadTimeDays} days</td>
                  <td><button className="btn-danger" onClick={() => deleteSupplier(s.id).then(reload)}>Delete</button></td>
                </tr>
              ))}
              {paginated.length === 0 && <tr><td colSpan={5}>No suppliers found.</td></tr>}
            </tbody>
          </table>
          <Pagination total={suppliers?.length ?? 0} page={page} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
