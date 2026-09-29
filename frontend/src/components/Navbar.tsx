import { getUsername } from '../api/token';

type Page = 'dashboard' | 'products' | 'inventory' | 'sales' | 'suppliers' | 'predictions' | 'alerts';

interface Props {
  current: Page;
  onChange: (page: Page) => void;
  onLogout: () => void;
}

export default function Navbar({ current, onChange, onLogout }: Props) {
  const links: Page[] = ['dashboard', 'products', 'inventory', 'sales', 'suppliers', 'predictions', 'alerts'];
  return (
    <nav className="navbar">
      <span className="navbar-brand">📦 StockWatch</span>
      <div className="navbar-links">
        {links.map(link => (
          <button key={link} className={current === link ? 'active' : ''} onClick={() => onChange(link)}>
            {link.charAt(0).toUpperCase() + link.slice(1)}
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
