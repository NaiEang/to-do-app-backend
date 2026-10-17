import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function UserDirectory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        if (!isCancelled) {
          setUsers(data);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="todo-card">
      <h2 style={{ margin: '0 0 1rem 0' }}>User Directory</h2>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              style={{
                height: '42px',
                background: '#f0f0f0',
                borderRadius: '8px',
                opacity: 0.7
              }}
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div style={{ padding: '0.85rem', background: '#ffebee', color: '#c62828', borderRadius: '6px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="empty-state">
          <p className="empty-title">No users found</p>
          <p className="empty-desc">The directory is currently empty.</p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {users.map((u) => (
            <li
              key={u.id}
              style={{
                padding: '0.75rem 0',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Link
                to={`/users/${u.id}`}
                style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 500 }}
              >
                {u.name}
              </Link>
              <span style={{ color: '#777', fontSize: '0.85rem' }}>{u.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}