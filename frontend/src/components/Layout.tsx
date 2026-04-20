import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <header>
        <h1>Office Supply Management</h1>
        <div className="header-right">
          <span>{user?.name} ({user?.role})</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <nav>
        {user?.role === 'ADMIN' ? (
          <>
            <Link to="/admin/inventory">Inventory</Link>
            <Link to="/admin/requests">Requests</Link>
            <Link to="/admin/history">History</Link>
          </>
        ) : (
          <>
            <Link to="/employee/request">New Request</Link>
            <Link to="/employee/requests">My Requests</Link>
          </>
        )}
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
