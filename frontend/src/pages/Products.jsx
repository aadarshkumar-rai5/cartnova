import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useApi, ErrorBox } from '../components/AsyncContent';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
export default function Products() {
  const [params, setParams] = useSearchParams();
  const { data, error, loading } = useApi(`/products?${params}`);
  function change(key, value) {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next, { replace: true });
  }
  return (
    <section className="section page">
      <p className="eyebrow">THE CARTNOVA COLLECTION</p>
      <h1>Find your everyday favorite.</h1>
      <p className="muted">Good design, useful details, and something just for you.</p>
      <div className="filters">
        <label className="search-field">
          <Search size={18} />
          <input
            aria-label="Search products"
            placeholder="Search the collection…"
            value={params.get('search') || ''}
            onChange={(e) => change('search', e.target.value)}
          />
        </label>
        <select
          aria-label="Category"
          value={params.get('category') || ''}
          onChange={(e) => change('category', e.target.value)}
        >
          <option value="">All categories</option>
          {['Electronics', 'Fashion', 'Accessories', 'Home'].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          aria-label="Maximum price"
          placeholder="Max price (₹)"
          value={params.get('maxPrice') || ''}
          onChange={(e) => change('maxPrice', e.target.value)}
        />
        <select
          aria-label="Sort products"
          value={params.get('sort') || ''}
          onChange={(e) => change('sort', e.target.value)}
        >
          <option value="">Latest arrivals</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
        <button className="text-link" onClick={() => setParams({})}>
          Reset
        </button>
      </div>
      <ErrorBox message={error} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <p className="result-count">{data?.length || 0} considered essentials</p>
          <div className="product-grid">
            {data?.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          {data?.length === 0 && (
            <div className="empty">
              <h2>No matches just yet.</h2>
              <p>Try a different search or reset your filters.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
