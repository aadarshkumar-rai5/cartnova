import { money } from '../services/api';
export default function OrderCard({ order, children }) {
  return (
    <article className="order-card">
      <div className="order-heading">
        <div>
          <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
          <p className="muted">
            {new Date(order.createdAt).toLocaleDateString()} · {order.paymentMethod}
          </p>
          <small className="muted">ID: {order._id}</small>
        </div>
        <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
      </div>
      {order.orderItems.map((i) => (
        <div className="order-item" key={i._id || i.product}>
          <img src={i.image} alt={i.name} />
          <span className="grow">
            {i.name}
            <small>Quantity: {i.quantity}</small>
          </span>
          <strong>{money(i.price * i.quantity)}</strong>
        </div>
      ))}
      <div className="order-heading">
        <p className="muted">
          {order.shippingAddress.fullName} · {order.shippingAddress.address},{' '}
          {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
          {order.shippingAddress.postalCode}
        </p>
        <strong>{money(order.totalAmount)}</strong>
      </div>
      {children}
    </article>
  );
}
