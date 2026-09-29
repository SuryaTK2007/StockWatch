import { useEffect, useState } from 'react';
import { getInventory } from '../api/inventory';
import { getUnresolvedAlerts, resolveAlert } from '../api/alerts';
import { runAllPredictions } from '../api/predictions';

export default function Dashboard() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  const load = () => {
    getInventory().then(setInventory);
    getUnresolvedAlerts().then(setAlerts);
  };

  useEffect(() => { load(); }, []);

  const handleRunPredictions = () => runAllPredictions().then(() => load());
  const handleResolve = (id: number) => resolveAlert(id).then(() => load());

  return (
    <div className="page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <button className="btn-primary" onClick={handleRunPredictions}>Run Predictions</button>
      </div>

      <div className="cards">
        <div className="card">
          <h3>Total Products</h3>
          <p className="card-value">{inventory.length}</p>
        </div>
        <div className="card">
          <h3>Active Alerts</h3>
          <p className="card-value">{alerts.length}</p>
        </div>
        <div className="card">
          <h3>Low Stock</h3>
          <p className="card-value">{inventory.filter(i => i.quantity <= i.reorderThreshold).length}</p>
        </div>
      </div>

      <h3>Inventory Overview</h3>
      <table>
        <thead>
          <tr><th>Product</th><th>Category</th><th>Quantity</th><th>Reorder At</th><th>Status</th></tr>
        </thead>
        <tbody>
          {inventory.map(i => (
            <tr key={i.id}>
              <td>{i.product.name}</td>
              <td>{i.product.category}</td>
              <td>{i.quantity} {i.product.unit}</td>
              <td>{i.reorderThreshold}</td>
              <td><span className={`badge ${i.quantity <= i.reorderThreshold ? 'badge-high' : 'badge-ok'}`}>{i.quantity <= i.reorderThreshold ? 'Low' : 'OK'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Unresolved Alerts</h3>
      <table>
        <thead>
          <tr><th>Product</th><th>Message</th><th>Severity</th><th>Action</th></tr>
        </thead>
        <tbody>
          {alerts.map(a => (
            <tr key={a.id}>
              <td>{a.product.name}</td>
              <td>{a.message}</td>
              <td><span className={`badge badge-${a.severity.toLowerCase()}`}>{a.severity}</span></td>
              <td><button className="btn-sm" onClick={() => handleResolve(a.id)}>Resolve</button></td>
            </tr>
          ))}
          {alerts.length === 0 && <tr><td colSpan={4}>No active alerts</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
