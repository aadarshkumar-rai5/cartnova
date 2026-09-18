import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../services/api';
import { ErrorBox } from '../components/AsyncContent';
export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  return (
    <section className="section page">
      <p className="eyebrow">YOUR CORNER OF CARTNOVA</p>
      <h1>Hello, {user.name}.</h1>
      <div className="panel profile">
        <h2>Account details</h2>
        <p>{user.email}</p>
        <p className="muted">Account type: {user.role}</p>
        <Link className="text-link" to="/orders">
          View my orders →
        </Link>
        <ErrorBox message={error} />
        <button
          className="button secondary"
          onClick={async () => {
            try {
              await logout();
              navigate('/');
            } catch (e) {
              setError(errorMessage(e));
            }
          }}
        >
          Sign out
        </button>
      </div>
    </section>
  );
}
