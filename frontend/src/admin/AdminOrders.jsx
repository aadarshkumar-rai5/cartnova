import { useState } from 'react';
import { useApi, ErrorBox } from '../components/AsyncContent';
import Loader from '../components/Loader';
import OrderCard from '../components/OrderCard';
import api, { errorMessage } from '../services/api';
export default function AdminOrders() {
  const { data, loading, error, reload } = useApi('/orders');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState('');
  async function change(id, status) {
    setBusy(id);
    setActionError('');
    try {
      await api.put(`/orders/${id}/status`, { status });
      reload();
    } catch (e) {
      setActionError(errorMessage(e));
    } finally {
      setBusy('');
    }
  }
  return (
    <>
      <h2>Customer orders</h2>
      <ErrorBox message={error || actionError} />
      {loading ? (
        <Loader />
      ) : (
        data?.map((order) => (
          <OrderCard key={order._id} order={order}>
            <div className="order-heading">
              <p>
                {order.user?.email || 'Customer account unavailable'} ·{' '}
                {order.shippingAddress.phone}
              </p>
              <div className="table-actions">
                {{
                  Processing: ['Shipped', 'Cancelled'],
                  Shipped: ['Delivered'],
                  Delivered: [],
                  Cancelled: [],
                }[order.status].map((status) => (
                  <button
                    key={status}
                    className="button secondary"
                    disabled={!!busy}
                    onClick={() => change(order._id, status)}
                  >
                    {busy === order._id ? 'Updating…' : `Mark ${status.toLowerCase()}`}
                  </button>
                ))}
              </div>
            </div>
          </OrderCard>
        ))
      )}
      {data?.length === 0 && <p className="empty">New orders will appear here.</p>}
    </>
  );
}
