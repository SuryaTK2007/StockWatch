import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getInventory, createInventory, updateInventory } from '../api/inventory';
import { getProducts } from '../api/products';
import { getSuppliers } from '../api/suppliers';

export default function Inventory() {
  const { data: inventory, loading, error, reload } = useFetch<any[]>(getInventory);
  const { data: products } = useFetch<any[]>(getProducts);
  const { data: suppliers } = useFetch<any[]>(getSuppliers);
  const [form, setForm] = useState({ productId: '', supplierId: '', quantity: '', reorderThreshold: '' });
  const [formError, setFormError] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editQty, setEditQty] = useState('');

  const validate = () => {
    if (!form.productId) return 'Please select a product.';
    if (!form.supplierId) return 'Please select a supplier.';
    if (!form.quantity || Number(form.quantity) < 0) return 'Quantity must be 0 or more.';
    if (!form.reorderThreshold || Number(form.reorderThreshold) < 0) return 'Reorder threshold must be 0 or more.';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setFormError(err); return; }
    setFormError('');
    createInventory({ product: { id: Number(form.productId) }, supplier: { id: Number(form.supplierId) }, quantity: Number(form.quantity), reorderThreshold: Number(form.reorderThreshold) })
      .then(() => { setForm({ productId: '', supplierId: '', quantity: '', reorderThreshold: '' }); reload(); })
      .catch(() => setFormError('Failed to add inventory.'));
  };

  const handleUpdate = (item: any) => {
    if (!editQty || Number(editQty) < 0) return;
    updateInventory(item.id, { product: { id: item.product.id }, supplier: { id: item.supplier.id }, quantity: Number(editQty), reorderThreshold: item.reorderThreshold })
      .then(() => { setEditId(null); reload(); });
  };

  return (
    <div className="page">
      <h2>Inventory</h2>
      <form className="form" onSubmit={handleSubmit}>
        <select value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })}>
          <option value="">Select Product</option>
          {(products ?? []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })}>
          <option value="">Select Supplier</option>
          {(suppliers ?? []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input placeholder="Quantity" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
        <input placeholder="Reorder Threshold" type="number" value={form.reorderThreshold} onChange={e => setForm({ ...form, reorderThreshold: e.target.value })} />
        <button className="btn-primary" type="submit">Add Inventory</button>
      </form>
      {formError && <p className="error">{formError}</p>}
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <table>
          <thead><tr><th>Product</th><th>Supplier</th><th>Quantity</th><th>Reorder At</th><th>Action</th></tr></thead>
          <tbody>
            {(inventory ?? []).map(i => (
              <tr key={i.id}>
                <td>{i.product.name}</td>
                <td>{i.supplier.name}</td>
                <td>
                  {editId === i.id
                    ? <input type="number" value={editQty} onChange={e => setEditQty(e.target.value)} style={{ width: '80px' }} />
                    : `${i.quantity} ${i.product.unit}`}
                </td>
                <td>{i.reorderThreshold}</td>
                <td>
                  {editId === i.id
                    ? <button className="btn-primary" onClick={() => handleUpdate(i)}>Save</button>
                    : <button className="btn-sm" onClick={() => { setEditId(i.id); setEditQty(i.quantity); }}>Edit</button>}
                </td>
              </tr>
            ))}
            {(inventory ?? []).length === 0 && <tr><td colSpan={5}>No inventory records.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
