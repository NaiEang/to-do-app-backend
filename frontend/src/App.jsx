import { Routes, Route, Navigate, Link } from 'react-router-dom';
import TodoApp from './components/ToDoApp';
import AuthPage from './components/AuthPage';
import UserDirectory from './components/UserDirectory';
import UserDetail from './components/UserDetail';
import './App.css';

export default function App() {
  return (
    <div className="todo-app-wrapper">
      <Routes>
        <Route path="/" element={<Navigate to="/todos" replace />} />
        <Route path="/todos" element={<TodoApp />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/users" element={<UserDirectory />} />
        <Route path="/users/:id" element={<UserDetail />} />

        <Route
          path="*"
          element={
            <div className="todo-card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <h2>404 - Page Not Found</h2>
              <p style={{ color: '#666', marginBottom: '1rem' }}>The page you are looking for does not exist.</p>
              <Link to="/todos" style={{ color: '#0066cc', textDecoration: 'none' }}>
                ← Back to Todos
              </Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}