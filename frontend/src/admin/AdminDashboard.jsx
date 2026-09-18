import { useApi, ErrorBox } from '../components/AsyncContent';
import Loader from '../components/Loader';
import { money } from '../services/api';
export default function AdminDashboard() {
  const { data, error, loading } = useApi('/users/stats');
  return (
    <>
      <ErrorBox message={error} />
      {loading ? (
        <Loader />
      ) : (
        data && (
          <>
            <div className="stats-grid">
              {[
                ['Total products', data.products],
                ['Total orders', data.orders],
                ['Total users', data.users],
                ['Total revenue', money(data.revenue)],
              ].map(([label, value]) => (
                <div className="panel" key={label}>
                  <p className="muted">{label}</p>
                  <h2>{value}</h2>
                </div>
              ))}
            </div>
            <p className="muted">
              Revenue includes delivered orders only. Cash on delivery orders are counted once
              delivered.
            </p>
          </>
        )
      )}
    </>
  );
}
