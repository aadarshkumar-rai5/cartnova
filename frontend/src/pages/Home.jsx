import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Truck,
  ShieldCheck,
  PackageCheck,
  Headphones,
} from 'lucide-react';
import { useApi, ErrorBox } from '../components/AsyncContent';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
const categories = [
  ['Electronics', 'Plug into possibility', 'photo-1505740420928-5e560c06d30e'],
  ['Fashion', 'Find your everyday fit', 'photo-1521572163474-6864f9cf17ab'],
  ['Accessories', 'The finishing touches', 'photo-1523275335684-37898b6baf30'],
  ['Home', 'Make room for good things', 'photo-1603006905003-be475563bc59'],
];
export default function Home() {
  const { data, loading, error } = useApi('/products');
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> THE EVERYDAY COLLECTION
          </p>
          <h1>
            Everyday,
            <br />
            <em>upgraded.</em>
          </h1>
          <p className="hero-description">
            Discover little things that make a big difference.
            <br className="desktop" /> Thoughtfully picked essentials for the way you live.
          </p>
          <Link to="/products" className="button">
            Explore the collection <ArrowUpRight size={18} />
          </Link>
          <div className="hero-note">
            <span className="mini-stars">★★★★★</span>
            <span>Good design. Great value. All you.</span>
          </div>
        </div>
        <div className="hero-photo">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85"
            alt="Minimal over-ear headphones on a warm yellow background"
          />
          <div className="photo-label">
            <span>LESS NOISE. MORE YOU.</span>
            <strong>Your next everyday favorite.</strong>
            <Link to="/products?category=Electronics" aria-label="Shop electronics">
              <ArrowUpRight size={24} />
            </Link>
          </div>
          <span className="edition">CURATED ESSENTIALS / VOL. 01</span>
        </div>
      </section>
      <section className="benefits-strip">
        <span>
          <Truck /> Free delivery on every order
        </span>
        <span>
          <ShieldCheck /> Secure account & checkout
        </span>
        <span>
          <PackageCheck /> Pay when it arrives
        </span>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FIND YOUR KIND OF GOOD</p>
            <h2>Shop by category</h2>
          </div>
          <Link to="/products" className="text-link">
            View all products <ArrowRight size={16} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map(([name, description, photo]) => (
            <Link className="category-card" key={name} to={`/products?category=${name}`}>
              <img
                src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=500&q=80`}
                alt={name}
              />
              <div>
                <h3>{name}</h3>
                <p>{description}</p>
              </div>
              <ArrowUpRight size={19} />
            </Link>
          ))}
        </div>
      </section>
      <section className="section featured">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WORTH A SPOT IN YOUR EVERYDAY</p>
            <h2>A few favorites</h2>
          </div>
          <Link to="/products" className="text-link">
            Shop the collection <ArrowRight size={16} />
          </Link>
        </div>
        <ErrorBox message={error} />
        {loading ? (
          <Loader />
        ) : (
          <div className="product-grid">
            {data?.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        {!loading && data?.length === 0 && <p className="empty">Our collection is coming soon.</p>}
      </section>
      <section className="editorial">
        <div>
          <p className="eyebrow">A LITTLE MORE INTENTIONAL</p>
          <h2>
            Good things.
            <br />
            Without the guesswork.
          </h2>
          <p>
            From your morning routine to your favorite downtime,
            <br />
            find considered essentials that fit right in.
          </p>
          <Link to="/products" className="button light">
            Find your next favorite <ArrowUpRight size={18} />
          </Link>
        </div>
        <span className="editorial-mark">
          c<span>n</span>.
        </span>
      </section>
      <section className="section why">
        <p className="eyebrow">THE CARTNOVA WAY</p>
        <h2>Simple shopping. Thoughtful details.</h2>
        <div className="why-grid">
          {[
            [
              PackageCheck,
              'Carefully selected',
              'Useful, well-designed finds across four everyday categories.',
            ],
            [
              ShieldCheck,
              'Shop with confidence',
              'Clear pricing and a secure, straightforward checkout.',
            ],
            [
              Headphones,
              'Easy from start to finish',
              'Track your orders and pay cash when your package arrives.',
            ],
          ].map(([Icon, title, copy]) => (
            <div key={title}>
              <Icon size={26} />
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
