import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Link className="logo" to="/">
            CartNova.
          </Link>
          <p>Thoughtfully selected. Simply better.</p>
        </div>
        <div>
          <Link to="/products">Explore the collection ↗</Link>
          <p>Electronics · Fashion · Accessories · Home</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} CartNova</span>
        <span>Modern MERN E-Commerce Platform</span>
        <span>Made for your everyday.</span>
      </div>
    </footer>
  );
}
