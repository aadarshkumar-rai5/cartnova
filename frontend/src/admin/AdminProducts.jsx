import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi, ErrorBox } from '../components/AsyncContent';
import Loader from '../components/Loader';
import api, { errorMessage, money } from '../services/api';
export default function AdminProducts() {
  const { data, error, loading, reload } = useApi('/products');
  const [actionError, setActionError] = useState('');
  const [deleting, setDeleting] = useState('');
  async function remove(product) {
    if (!window.confirm(`Delete ${product.name}? Existing orders will keep their product details.`))
      return;
    setDeleting(product._id);
    setActionError('');
    try {
      await api.delete(`/products/${product._id}`, { data: {} });
      reload();
    } catch (e) {
      setActionError(errorMessage(e));
    } finally {
      setDeleting('');
    }
  }
  return (
    <>
      <div className="section-heading">
        <h2>Products</h2>
        <Link className="button" to="/admin/products/new">
          + Add product
        </Link>
      </div>
      <ErrorBox message={error || actionError} />
      {loading ? (
        <Loader />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="table-product">
                      <img src={p.image} alt="" />
                      {p.name}
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{money(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/admin/products/${p._id}/edit`}>Edit</Link>
                      <button disabled={!!deleting} onClick={() => remove(p)}>
                        {deleting === p._id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data?.length === 0 && <p className="empty">No products yet. Add your first product.</p>}
        </div>
      )}
    </>
  );
}
