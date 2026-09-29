import { useEffect, useState } from 'react';
import { getSuppliers, createSupplier, deleteSupplier } from '../api/suppliers';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', contactEmail: '', leadTimeDays: '' });

  const load = () => getSuppliers().then(setSuppliers);
  useEffect(() => { load(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSupplier({ ...form, leadTimeDays: Number(form.leadTimeDays) }).then(() => {
      setForm({ name: '', contactEmail: '', leadTimeDays: '' });
      load();
    });
  };

  return (
    <div className="page">
      <h2>Suppliers</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Contact Email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} required />
        <input placeholder="Lead Time (days)" type="number" value={form.leadTimeDays} onChange={e => setForm({ ...form, leadTimeDays: e.target.value })} required />
        <button className="btn-primary" type="submit">Add Supplier</button>
      </form>
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Lead Time</th><th>Action</th></tr>
        </thead>
        <tbody>
          {suppliers.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td><td>{s.name}</td><td>{s.contactEmail}</td><td>{s.leadTimeDays} days</td>
              <td><button className="btn-danger" onClick={() => deleteSupplier(s.id).then(load)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
