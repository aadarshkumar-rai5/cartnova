import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../services/api';
import { ErrorBox } from './AsyncContent';
export default function AuthForm({ register = false }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { authenticate } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await authenticate(register ? 'register' : 'login', fields);
      navigate(location.state?.from || '/', { replace: true });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="auth-page">
      <div className="auth-intro">
        <p className="eyebrow">A LITTLE EVERYDAY JOY</p>
        <h1>
          Good things
          <br />
          start here.
        </h1>
        <p>Your favorites, your orders, your little corner of CartNova.</p>
      </div>
      <form className="form-card" onSubmit={submit}>
        <p className="eyebrow">WELCOME TO CARTNOVA</p>
        <h2>{register ? 'Make yourself at home.' : 'Welcome back.'}</h2>
        <p className="muted">
          {register
            ? 'Create your account to start exploring.'
            : 'Sign in to pick up where you left off.'}
        </p>
        <ErrorBox message={error} />
        {register && (
          <label>
            Full name
            <input name="name" required maxLength="80" autoComplete="name" />
          </label>
        )}
        <label>
          Email address
          <input name="email" type="email" required autoComplete="email" maxLength="254" />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            required
            minLength="8"
            autoComplete={register ? 'new-password' : 'current-password'}
          />
        </label>
        {register && (
          <label>
            Confirm password
            <input
              name="confirmPassword"
              type="password"
              required
              minLength="8"
              autoComplete="new-password"
            />
          </label>
        )}
        <button className="button" disabled={busy}>
          {busy ? 'Just a moment…' : register ? 'Create account →' : 'Sign in →'}
        </button>
        <p className="muted">
          {register ? 'Already part of the club?' : 'New around here?'}{' '}
          <Link to={register ? '/login' : '/register'} state={location.state}>
            {register ? 'Sign in' : 'Create an account'}
          </Link>
        </p>
      </form>
    </section>
  );
}
