import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { removeToken } from '../api/token';

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <main className="main">
        <Outlet />
      </main>
    </>
  );
}
