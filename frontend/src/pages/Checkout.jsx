import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api, { errorMessage, money } from '../services/api';
import { ErrorBox } from '../components/AsyncContent';
export default function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    const shippingAddress = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await api.post('/orders', {
        shippingAddress,
        orderItems: items.map((i) => ({ product: i._id, quantity: i.quantity })),
      });
      clear();
      navigate('/orders', { state: { placed: true }, replace: true });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  if (!items.length)
    return (
      <div className="empty">
        <h1>Your bag is empty.</h1>
        <Link to="/products" className="button">
          Explore products
        </Link>
      </div>
    );
  return (
    <section className="section page">
      <p className="eyebrow">ONE LAST LITTLE STEP</p>
      <h1>Checkout</h1>
      <ErrorBox message={error} />
      <form onSubmit={submit} className="checkout-layout">
        <div className="panel">
          <h2>Where should we send it?</h2>
          <div className="form-grid">
            {[
              ['fullName', 'Full name', 'name'],
              ['phone', 'Phone number', 'tel'],
              ['address', 'Street address', 'street-address'],
              ['city', 'City', 'address-level2'],
              ['state', 'State', 'address-level1'],
              ['postalCode', 'Postal code', 'postal-code'],
            ].map(([name, label, auto]) => (
              <label key={name}>
                {label}
                <input
                  name={name}
                  required
                  maxLength={name === 'phone' ? 20 : 200}
                  type={name === 'phone' ? 'tel' : 'text'}
                  autoComplete={auto}
                  defaultValue={name === 'fullName' ? user.name : ''}
                />
              </label>
            ))}
          </div>
        </div>
        <aside className="summary">
          <h2>Your order</h2>
          {items.map((i) => (
            <div key={i._id}>
              <span>
                {i.name} × {i.quantity}
              </span>
              <span>{money(i.price * i.quantity)}</span>
            </div>
          ))}
          <div>
            <span>Delivery</span>
            <span>Free</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>
          <p>◉ Cash on Delivery</p>
          <p className="muted">
            Pay when your order arrives. Final prices and stock are verified when you place your
            order.
          </p>
          <button className="button" disabled={busy}>
            {busy ? 'Placing your order…' : 'Place order →'}
          </button>
        </aside>
      </form>
    </section>
  );
}
