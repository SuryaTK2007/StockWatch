import { useEffect, useState } from 'react';
import { getProducts, createProduct, deleteProduct } from '../api/products';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', category: '', unit: '' });

  const load = () => getProducts().then(setProducts);
  useEffect(() => { load(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct(form).then(() => { setForm({ name: '', category: '', unit: '' }); load(); });
  };

  return (
    <div className="page">
      <h2>Products</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
        <input placeholder="Unit (e.g. kg)" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} required />
        <button className="btn-primary" type="submit">Add Product</button>
      </form>
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Category</th><th>Unit</th><th>Action</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td><td>{p.name}</td><td>{p.category}</td><td>{p.unit}</td>
              <td><button className="btn-danger" onClick={() => deleteProduct(p.id).then(load)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
