import { NavLink, Link } from 'react-router-dom';
import { ShoppingBag, ArrowUpRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
export default function Navbar() {
  const { user } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="announcement">
        Good things. Fair prices. A little everyday joy. <ArrowUpRight size={13} />
      </div>
      <header className="header">
        <Link to="/" className="logo">
          <span className="logo-icon">
            <ShoppingBag size={20} />
          </span>
          CartNova<span className="logo-dot">.</span>
        </Link>
        <button
          className="mobile-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? 'nav open' : 'nav'} onClick={() => setOpen(false)}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/orders">My orders</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-actions">
          <Link to={user ? '/profile' : '/login'}>
            {user ? user.name.split(' ')[0] : 'Sign in'}
          </Link>
          <Link to="/cart" className="cart-link" aria-label={`Cart, ${count} items`}>
            <ShoppingBag size={19} />
            <span className="cart-count">{count}</span>
          </Link>
        </div>
      </header>
    </>
  );
}
