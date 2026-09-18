import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { money } from '../services/api';
export default function Cart() {
  const { items, update, remove, total, count } = useCart();
  return (
    <section className="section page">
      <p className="eyebrow">YOUR GOOD FINDS</p>
      <h1>
        Shopping bag <span className="muted">({count})</span>
      </h1>
      {!items.length ? (
        <div className="empty">
          <h2>A little room for something good.</h2>
          <p>Your bag is empty. Let's find your next favorite.</p>
          <Link className="button" to="/products">
            Explore products →
          </Link>
        </div>
      ) : (
        <div className="checkout-layout">
          <div>
            {items.map((item) => (
              <div className="cart-row" key={item._id}>
                <img src={item.image} alt={item.name} />
                <div className="grow">
                  <Link to={`/products/${item._id}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  <p className="muted">
                    {item.category} · {money(item.price)}
                  </p>
                  <div className="quantity">
                    <button
                      aria-label={`Decrease ${item.name}`}
                      disabled={item.quantity <= 1}
                      onClick={() => update(item._id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      aria-label={`Increase ${item.name}`}
                      disabled={item.quantity >= item.stock}
                      onClick={() => update(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <strong>{money(item.price * item.quantity)}</strong>
                  <button
                    className="remove"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => remove(item._id)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <aside className="summary">
            <h2>Order summary</h2>
            <div>
              <span>Subtotal ({count} items)</span>
              <span>{money(total)}</span>
            </div>
            <div>
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>{money(total)}</strong>
            </div>
            <Link to="/checkout" className="button">
              Proceed to checkout →
            </Link>
            <p className="muted">Cash on delivery. No online payment needed.</p>
          </aside>
        </div>
      )}
    </section>
  );
}
