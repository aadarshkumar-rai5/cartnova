import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { errorMessage } from '../services/api';
import { ErrorBox } from '../components/AsyncContent';
export default function ProductForm({ product }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    try {
      product
        ? await api.put(`/products/${product._id}`, fields)
        : await api.post('/products', fields);
      navigate('/admin/products');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="panel product-form" onSubmit={submit}>
      <h2>{product ? 'Edit product' : 'A new everyday favorite'}</h2>
      <ErrorBox message={error} />
      <label>
        Name
        <input name="name" required maxLength="120" defaultValue={product?.name} />
      </label>
      <label>
        Description
        <textarea
          name="description"
          required
          maxLength="3000"
          rows="4"
          defaultValue={product?.description}
        />
      </label>
      <div className="form-grid">
        <label>
          Category
          <select name="category" defaultValue={product?.category || 'Electronics'}>
            {['Electronics', 'Fashion', 'Accessories', 'Home'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Price (₹)
          <input
            type="number"
            name="price"
            required
            min="0.01"
            max="10000000"
            step="0.01"
            defaultValue={product?.price}
          />
        </label>
        <label>
          Available stock
          <input
            type="number"
            name="stock"
            required
            min="0"
            step="1"
            defaultValue={product?.stock ?? 0}
          />
        </label>
        <label>
          Rating (0–5)
          <input
            type="number"
            name="rating"
            required
            min="0"
            max="5"
            step="0.1"
            defaultValue={product?.rating ?? 0}
          />
        </label>
      </div>
      <label>
        Image URL (HTTPS)
        <input
          type="url"
          name="image"
          pattern="https://.*"
          required
          defaultValue={product?.image}
        />
      </label>
      <div className="table-actions">
        <button className="button" disabled={busy}>
          {busy ? 'Saving…' : 'Save product'}
        </button>
        <Link to="/admin/products">Cancel</Link>
      </div>
    </form>
  );
}
