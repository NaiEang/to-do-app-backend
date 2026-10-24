import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate('/todos', { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, username, password, confirmPassword);
      }
      navigate('/todos');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="todo-app-wrapper">
      <div className="todo-card" style={{ maxWidth: '440px' }}>
        <header className="todo-header" style={{ marginBottom: '1.25rem' }}>
          <div className="todo-title-row">
            <div className="notepad-logo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 className="todo-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          </div>
        </header>

        <p className="todo-subtitle" style={{ marginBottom: '1.5rem' }}>
          {isLogin ? 'Sign in to access your saved todos' : 'Sign up to start tracking your tasks in the cloud'}
        </p>

        {error && (
          <div className="todo-error-banner" style={{ marginBottom: '1.25rem' }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              className="todo-input"
              style={{ width: '100%', boxSizing: 'border-box' }}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Username
              </label>
              <input
                type="text"
                required
                className="todo-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="todo-input"
              style={{ width: '100%', boxSizing: 'border-box' }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Confirm Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                className="todo-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          <button
            type="submit"
            className="add-btn"
            disabled={submitting}
            style={{ width: '100%', marginTop: '8px', padding: '14px', fontSize: '15px' }}
          >
            {submitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '14px' }}>
          {isLogin ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
