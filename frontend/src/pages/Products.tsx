import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getProducts, createProduct, deleteProduct } from '../api/products';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 5;

export default function Products() {
  const { data: products, loading, error, reload } = useFetch<any[]>(getProducts);
  const [form, setForm] = useState({ name: '', category: '', unit: '' });
  const [formError, setFormError] = useState('');
  const [page, setPage] = useState(1);

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.category.trim()) return 'Category is required.';
    if (!form.unit.trim()) return 'Unit is required.';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setFormError(err); return; }
    setFormError('');
    createProduct(form)
      .then(() => { setForm({ name: '', category: '', unit: '' }); reload(); })
      .catch(() => setFormError('Failed to add product.'));
  };

  const paginated = (products ?? []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page">
      <h2>Products</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <input placeholder="Unit (e.g. kg)" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
        <button className="btn-primary" type="submit">Add Product</button>
      </form>
      {formError && <p className="error">{formError}</p>}
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <>
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Unit</th><th>Action</th></tr></thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td><td>{p.name}</td><td>{p.category}</td><td>{p.unit}</td>
                  <td><button className="btn-danger" onClick={() => deleteProduct(p.id).then(reload)}>Delete</button></td>
                </tr>
              ))}
              {paginated.length === 0 && <tr><td colSpan={5}>No products found.</td></tr>}
            </tbody>
          </table>
          <Pagination total={products?.length ?? 0} page={page} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
