import { Link } from 'react-router-dom';
import { Plus, Star, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { money } from '../services/api';
export default function ProductCard({ product }) {
  const { add } = useCart();
  const [message, setMessage] = useState('');
  function addItem() {
    try {
      add(product);
      setMessage('Added to your bag');
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="product-tag">{product.stock ? product.category : 'Out of stock'}</span>
        <span className="image-arrow">
          <ArrowUpRight size={18} />
        </span>
      </Link>
      <div className="product-meta">
        <span>{product.category}</span>
        <span className="rating">
          <Star size={12} fill="currentColor" />
          {product.rating.toFixed(1)}
        </span>
      </div>
      <Link className="product-name" to={`/products/${product._id}`}>
        {product.name}
      </Link>
      <div className="product-bottom">
        <div>
          <strong>{money(product.price)}</strong>
          <small>
            {product.stock ? 'In stock' : 'Sold out'} ·{' '}
            <Link to={`/products/${product._id}`}>View details</Link>
          </small>
        </div>
        <button
          className="add-button"
          disabled={!product.stock}
          onClick={addItem}
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus size={19} />
        </button>
      </div>
      {message && (
        <p className="card-message" role="status">
          {message}
        </p>
      )}
    </article>
  );
}
