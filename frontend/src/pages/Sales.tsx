import { useEffect, useState } from 'react';
import { getSales, createSale } from '../api/sales';
import { getProducts } from '../api/products';

export default function Sales() {
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ productId: '', quantitySold: '', saleDate: '' });
  const [error, setError] = useState('');

  const load = () => { getSales().then(setSales); getProducts().then(setProducts); };
  useEffect(() => { load(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    createSale({ product: { id: Number(form.productId) }, quantitySold: Number(form.quantitySold), saleDate: form.saleDate })
      .then(res => {
        if (res.message) { setError(res.message); return; }
        setForm({ productId: '', quantitySold: '', saleDate: '' });
        load();
      });
  };

  return (
    <div className="page">
      <h2>Sales</h2>
      <form className="form" onSubmit={handleSubmit}>
        <select value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })} required>
          <option value="">Select Product</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input placeholder="Quantity Sold" type="number" value={form.quantitySold} onChange={e => setForm({ ...form, quantitySold: e.target.value })} required />
        <input type="date" value={form.saleDate} onChange={e => setForm({ ...form, saleDate: e.target.value })} required />
        <button className="btn-primary" type="submit">Record Sale</button>
      </form>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr><th>ID</th><th>Product</th><th>Quantity Sold</th><th>Date</th></tr>
        </thead>
        <tbody>
          {sales.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td><td>{s.product.name}</td><td>{s.quantitySold}</td><td>{s.saleDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
