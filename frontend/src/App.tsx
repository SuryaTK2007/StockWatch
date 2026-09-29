import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Suppliers from './pages/Suppliers';
import Predictions from './pages/Predictions';
import Alerts from './pages/Alerts';
import Login from './pages/Login';
import Register from './pages/Register';
import { getToken, removeToken } from './api/token';
import './App.css';

type Page = 'dashboard' | 'products' | 'inventory' | 'sales' | 'suppliers' | 'predictions' | 'alerts';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => { removeToken(); setIsLoggedIn(false); };

  if (!isLoggedIn) {
    return showRegister
      ? <Register onSuccess={() => setIsLoggedIn(true)} onSwitch={() => setShowRegister(false)} />
      : <Login onSuccess={() => setIsLoggedIn(true)} onSwitch={() => setShowRegister(true)} />;
  }

  const pages: Record<Page, JSX.Element> = {
    dashboard: <Dashboard />,
    products: <Products />,
    inventory: <Inventory />,
    sales: <Sales />,
    suppliers: <Suppliers />,
    predictions: <Predictions />,
    alerts: <Alerts />,
  };

  return (
    <>
      <Navbar current={page} onChange={setPage} onLogout={handleLogout} />
      <main className="main">{pages[page]}</main>
    </>
  );
}
