import { useState, useEffect } from 'react';

const API = 'http://localhost:3000/api/todos';

export function AddTodo({ onAdd, disabled }) {
  const [inputVal, setInputVal] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed || disabled) return;
    await onAdd(trimmed);
    setInputVal('');
  }

  return (
    <form className="todo-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-input"
        placeholder="Add a new task..."
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        disabled={disabled}
      />
      <button type="submit" className="add-btn" disabled={!inputVal.trim() || disabled}>
        Add
      </button>
    </form>
  );
}

export function TodoItem({ title, done, onToggle, onDelete }) {
  return (
    <li className={`todo-item ${done ? 'completed' : ''}`}>
      <label className="todo-label">
        <input
          type="checkbox"
          checked={done}
          onChange={onToggle}
          className="todo-checkbox"
        />
        <span className="todo-text">{title}</span>
      </label>
      <button
        type="button"
        onClick={onDelete}
        className="delete-btn"
        aria-label={`Delete ${title}`}
      >
        ✕
      </button>
    </li>
  );
}

export function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">✨</span>
        <p className="empty-title">All caught up!</p>
        <p className="empty-desc">No tasks match this view.</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((t) => {
        const isDone = t.status === 'DONE' || t.done === true;
        return (
          <TodoItem
            key={t.id}
            title={t.title || t.text}
            done={isDone}
            onToggle={() => onToggle(t.id, isDone)}
            onDelete={() => onDelete(t.id)}
          />
        );
      })}
    </ul>
  );
}

export function FilterBar({ filter, onFilterChange, onClearCompleted, hasCompleted }) {
  const filters = ['all', 'active', 'completed'];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #eee' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onFilterChange(f)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: filter === f ? '#333' : '#fff',
              color: filter === f ? '#fff' : '#333',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontSize: '0.85rem'
            }}
          >
            {f}
          </button>
        ))}
      </div>
      {hasCompleted && (
        <button
          type="button"
          onClick={onClearCompleted}
          style={{ background: 'none', border: 'none', color: '#c00', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
        >
          Clear completed
        </button>
      )}
    </div>
  );
}

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchTodos() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API);
      if (!res.ok) {
        throw new Error(`Failed to load todos (HTTP ${res.status})`);
      }
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err.message || 'Could not connect to backend');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  async function handleAdd(title) {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status: 'TODO' }),
      });
      if (!res.ok) {
        throw new Error(`Failed to add task (HTTP ${res.status})`);
      }
      const newTodo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      setError(err.message || 'Failed to add task');
    }
  }

  async function handleToggle(id, currentDone) {
    const nextStatus = currentDone ? 'TODO' : 'DONE';
    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus, done: !currentDone } : t))
    );

    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        throw new Error(`Failed to update status (HTTP ${res.status})`);
      }
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message || 'Failed to update task');
      fetchTodos();
    }
  }

  async function handleDelete(id) {
    const previousTodos = todos;
    // Optimistic UI update
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(`Failed to delete task (HTTP ${res.status})`);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete task');
      setTodos(previousTodos);
    }
  }

  async function handleClearCompleted() {
    const completed = todos.filter((t) => t.status === 'DONE' || t.done === true);
    if (completed.length === 0) return;

    const previousTodos = todos;
    // Optimistic UI update
    setTodos((prev) => prev.filter((t) => !(t.status === 'DONE' || t.done === true)));

    try {
      await Promise.all(
        completed.map((t) =>
          fetch(`${API}/${t.id}`, { method: 'DELETE' }).then((res) => {
            if (!res.ok) throw new Error(`Failed to delete task #${t.id}`);
          })
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to clear completed tasks');
      setTodos(previousTodos);
    }
  }

  const isDoneTodo = (t) => t.status === 'DONE' || t.done === true;

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !isDoneTodo(todo);
    if (filter === 'completed') return isDoneTodo(todo);
    return true;
  });

  const completedCount = todos.filter(isDoneTodo).length;

  return (
    <div className="todo-card">
      <header className="todo-header">
        <div className="todo-header-left">
          <div className="todo-title-row">
            <div className="notepad-logo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="M9 12h6" />
                <path d="M9 16h6" />
              </svg>
            </div>
            <h1 className="todo-title">Task Manager</h1>
          </div>
          <div className="api-connection-status">
            <span className={`status-dot ${error ? 'offline' : ''}`} />
            <span>{error ? 'Backend disconnected' : 'Connected to NestJS API'}</span>
          </div>
        </div>
        {todos.length > 0 && (
          <span className="todo-badge">
            {completedCount} / {todos.length} done
          </span>
        )}
      </header>

      {error && (
        <div className="todo-error-banner">
          <span>{error}</span>
          <button type="button" className="retry-btn" onClick={fetchTodos}>
            Retry
          </button>
        </div>
      )}

      <AddTodo onAdd={handleAdd} disabled={loading} />

      <main className="todo-main">
        {loading ? (
          <div className="todo-loading-state">
            <div className="loading-spinner" />
            <p>Loading tasks from API...</p>
          </div>
        ) : (
          <TodoList
            todos={filteredTodos}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
      </main>

      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        onClearCompleted={handleClearCompleted}
        hasCompleted={todos.some(isDoneTodo)}
      />
    </div>
  );
}