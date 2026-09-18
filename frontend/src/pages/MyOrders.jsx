import { Link, useLocation } from 'react-router-dom';
import { useApi, ErrorBox } from '../components/AsyncContent';
import Loader from '../components/Loader';
import OrderCard from '../components/OrderCard';
export default function MyOrders() {
  const { data, error, loading } = useApi('/orders/my');
  const location = useLocation();
  return (
    <section className="section page">
      <p className="eyebrow">ON THEIR WAY TO YOUR EVERYDAY</p>
      <h1>My orders</h1>
      {location.state?.placed && (
        <div className="success" role="status">
          Your order is placed. Good things are on their way!
        </div>
      )}
      <ErrorBox message={error} />
      {loading ? (
        <Loader />
      ) : data?.length ? (
        data.map((order) => <OrderCard key={order._id} order={order} />)
      ) : (
        !error && (
          <div className="empty">
            <h2>Your next favorite is waiting.</h2>
            <p>You haven't placed an order yet.</p>
            <Link to="/products" className="button">
              Start exploring →
            </Link>
          </div>
        )
      )}
    </section>
  );
}
