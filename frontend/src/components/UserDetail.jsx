import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error('User not found');
          throw new Error(`Failed to load profile (HTTP ${res.status})`);
        }
        const data = await res.json();
        
        if (!isCancelled) {
          setUser(data);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  return (
    <div className="todo-card">
      <Link to="/users" style={{ color: '#0066cc', textDecoration: 'none', fontSize: '0.9rem' }}>
        ← Back to Directory
      </Link>

      {loading && <p style={{ marginTop: '1rem', color: '#666' }}>Loading user details...</p>}

      {!loading && error && (
        <div style={{ marginTop: '1rem', padding: '0.85rem', background: '#ffebee', color: '#c62828', borderRadius: '6px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && user && (
        <div style={{ marginTop: '1.25rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0' }}>{user.name}</h2>
          <p style={{ margin: '0.25rem 0', color: '#555' }}><strong>Username:</strong> {user.username}</p>
          <p style={{ margin: '0.25rem 0', color: '#555' }}><strong>Email:</strong> {user.email}</p>
          <p style={{ margin: '0.25rem 0', color: '#555' }}><strong>Phone:</strong> {user.phone}</p>
          <p style={{ margin: '0.25rem 0', color: '#555' }}><strong>Website:</strong> {user.website}</p>
          <p style={{ margin: '0.25rem 0', color: '#555' }}><strong>Company:</strong> {user.company?.name}</p>
        </div>
      )}
    </div>
  );
}