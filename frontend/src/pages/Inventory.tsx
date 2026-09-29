import { useEffect, useState } from 'react';
import { getInventory, createInventory, updateInventory } from '../api/inventory';
import { getProducts } from '../api/products';
import { getSuppliers } from '../api/suppliers';

export default function Inventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [form, setForm] = useState({ productId: '', supplierId: '', quantity: '', reorderThreshold: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [editQty, setEditQty] = useState('');

  const load = () => {
    getInventory().then(setInventory);
    getProducts().then(setProducts);
    getSuppliers().then(setSuppliers);
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createInventory({
      product: { id: Number(form.productId) },
      supplier: { id: Number(form.supplierId) },
      quantity: Number(form.quantity),
      reorderThreshold: Number(form.reorderThreshold)
    }).then(() => { setForm({ productId: '', supplierId: '', quantity: '', reorderThreshold: '' }); load(); });
  };

  const handleUpdate = (item: any) => {
    updateInventory(item.id, {
      product: { id: item.product.id },
      supplier: { id: item.supplier.id },
      quantity: Number(editQty),
      reorderThreshold: item.reorderThreshold
    }).then(() => { setEditId(null); load(); });
  };

  return (
    <div className="page">
      <h2>Inventory</h2>
      <form className="form" onSubmit={handleSubmit}>
        <select value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })} required>
          <option value="">Select Product</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })} required>
          <option value="">Select Supplier</option>
          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input placeholder="Quantity" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
        <input placeholder="Reorder Threshold" type="number" value={form.reorderThreshold} onChange={e => setForm({ ...form, reorderThreshold: e.target.value })} required />
        <button className="btn-primary" type="submit">Add Inventory</button>
      </form>
      <table>
        <thead>
          <tr><th>Product</th><th>Supplier</th><th>Quantity</th><th>Reorder At</th><th>Action</th></tr>
        </thead>
        <tbody>
          {inventory.map(i => (
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
        </tbody>
      </table>
    </div>
  );
}
