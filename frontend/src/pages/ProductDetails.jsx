import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useApi, ErrorBox } from '../components/AsyncContent';
import { useCart } from '../context/CartContext';
import { money } from '../services/api';
import Loader from '../components/Loader';
export default function ProductDetails() {
  const { id } = useParams();
  const { data: p, loading, error } = useApi(`/products/${id}`);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { add } = useCart();
  if (loading) return <Loader />;
  if (error)
    return (
      <section className="section">
        <ErrorBox message={error} />
      </section>
    );
  return (
    <section className="section page">
      <Link className="text-link" to="/products">
        ← Back to collection
      </Link>
      <div className="details">
        <img className="detail-image" src={p.image} alt={p.name} />
        <div>
          <p className="eyebrow">{p.category}</p>
          <h1>{p.name}</h1>
          <p className="rating">★ {p.rating.toFixed(1)} / 5</p>
          <h2>{money(p.price)}</h2>
          <p className="description">{p.description}</p>
          <p>
            {p.stock ? `${p.stock} available · Ready for your everyday` : 'Currently out of stock'}
          </p>
          <div className="purchase">
            <label>
              Quantity
              <input
                type="number"
                min="1"
                max={p.stock || 1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>
            <button
              className="button"
              disabled={
                !p.stock || !Number.isInteger(quantity) || quantity < 1 || quantity > p.stock
              }
              onClick={() => {
                try {
                  add(p, quantity);
                  setMessage('Added to your bag.');
                } catch (e) {
                  setMessage(e.message);
                }
              }}
            >
              Add to cart
            </button>
          </div>
          <p role="status">{message}</p>
          <div className="detail-perks">Free delivery · Cash on delivery · Secure checkout</div>
        </div>
      </div>
    </section>
  );
}
