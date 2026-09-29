import { useNavigate, useLocation } from 'react-router-dom';
import { getUsername } from '../api/token';

interface Props {
  onLogout: () => void;
}

const links = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Products', path: '/products' },
  { label: 'Inventory', path: '/inventory' },
  { label: 'Sales', path: '/sales' },
  { label: 'Suppliers', path: '/suppliers' },
  { label: 'Predictions', path: '/predictions' },
  { label: 'Alerts', path: '/alerts' },
];

export default function Navbar({ onLogout }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar">
      <span className="navbar-brand">📦 StockWatch</span>
      <div className="navbar-links">
        {links.map(link => (
          <button key={link.path} className={location.pathname === link.path ? 'active' : ''} onClick={() => navigate(link.path)}>
            {link.label}
          </button>
        ))}
      </div>
      <div className="navbar-user">
        <span>👤 {getUsername()}</span>
        <button className="btn-logout" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}
