import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getSales, createSale } from '../api/sales';
import { getProducts } from '../api/products';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 8;

export default function Sales() {
  const { data: sales, loading, error, reload } = useFetch<any[]>(getSales);
  const { data: products } = useFetch<any[]>(getProducts);
  const [form, setForm] = useState({ productId: '', quantitySold: '', saleDate: '' });
  const [formError, setFormError] = useState('');
  const [page, setPage] = useState(1);

  const validate = () => {
    if (!form.productId) return 'Please select a product.';
    if (!form.quantitySold || Number(form.quantitySold) <= 0) return 'Quantity must be greater than 0.';
    if (!form.saleDate) return 'Sale date is required.';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setFormError(err); return; }
    setFormError('');
    createSale({ product: { id: Number(form.productId) }, quantitySold: Number(form.quantitySold), saleDate: form.saleDate })
      .then(res => {
        if (res.message) { setFormError(res.message); return; }
        setForm({ productId: '', quantitySold: '', saleDate: '' });
        reload();
      })
      .catch(() => setFormError('Failed to record sale.'));
  };

  const paginated = (sales ?? []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page">
      <h2>Sales</h2>
      <form className="form" onSubmit={handleSubmit}>
        <select value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })}>
          <option value="">Select Product</option>
          {(products ?? []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input placeholder="Quantity Sold" type="number" value={form.quantitySold} onChange={e => setForm({ ...form, quantitySold: e.target.value })} />
        <input type="date" value={form.saleDate} onChange={e => setForm({ ...form, saleDate: e.target.value })} />
        <button className="btn-primary" type="submit">Record Sale</button>
      </form>
      {formError && <p className="error">{formError}</p>}
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <>
          <table>
            <thead><tr><th>ID</th><th>Product</th><th>Quantity Sold</th><th>Date</th></tr></thead>
            <tbody>
              {paginated.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td><td>{s.product.name}</td><td>{s.quantitySold}</td><td>{s.saleDate}</td>
                </tr>
              ))}
              {paginated.length === 0 && <tr><td colSpan={4}>No sales recorded.</td></tr>}
            </tbody>
          </table>
          <Pagination total={sales?.length ?? 0} page={page} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
