import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getInventory } from '../api/inventory';
import { getUnresolvedAlerts, resolveAlert } from '../api/alerts';
import { runAllPredictions } from '../api/predictions';

export default function Dashboard() {
  const { data: inventory, loading: invLoading, error: invError, reload: reloadInv } = useFetch<any[]>(getInventory);
  const { data: alerts, loading: alertLoading, error: alertError, reload: reloadAlerts } = useFetch<any[]>(getUnresolvedAlerts);
  const [predError, setPredError] = useState('');
  const [predLoading, setPredLoading] = useState(false);

  const handleRunPredictions = () => {
    setPredLoading(true);
    setPredError('');
    runAllPredictions()
      .then(() => { reloadInv(); reloadAlerts(); })
      .catch(() => setPredError('Failed to run predictions.'))
      .finally(() => setPredLoading(false));
  };

  const handleResolve = (id: number) => resolveAlert(id).then(reloadAlerts);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <button className="btn-primary" onClick={handleRunPredictions} disabled={predLoading}>
          {predLoading ? 'Running...' : 'Run Predictions'}
        </button>
      </div>
      {predError && <p className="error">{predError}</p>}

      <div className="cards">
        <div className="card">
          <h3>Total Products</h3>
          <p className="card-value">{inventory?.length ?? '-'}</p>
        </div>
        <div className="card">
          <h3>Active Alerts</h3>
          <p className="card-value">{alerts?.length ?? '-'}</p>
        </div>
        <div className="card">
          <h3>Low Stock</h3>
          <p className="card-value">{inventory?.filter(i => i.quantity <= i.reorderThreshold).length ?? '-'}</p>
        </div>
      </div>

      <h3>Inventory Overview</h3>
      {invLoading && <p className="loading">Loading...</p>}
      {invError && <p className="error">{invError}</p>}
      {!invLoading && !invError && (
        <table>
          <thead><tr><th>Product</th><th>Category</th><th>Quantity</th><th>Reorder At</th><th>Status</th></tr></thead>
          <tbody>
            {(inventory ?? []).map(i => (
              <tr key={i.id}>
                <td>{i.product.name}</td>
                <td>{i.product.category}</td>
                <td>{i.quantity} {i.product.unit}</td>
                <td>{i.reorderThreshold}</td>
                <td><span className={`badge ${i.quantity <= i.reorderThreshold ? 'badge-high' : 'badge-ok'}`}>{i.quantity <= i.reorderThreshold ? 'Low' : 'OK'}</span></td>
              </tr>
            ))}
            {(inventory ?? []).length === 0 && <tr><td colSpan={5}>No inventory records.</td></tr>}
          </tbody>
        </table>
      )}

      <h3>Unresolved Alerts</h3>
      {alertLoading && <p className="loading">Loading...</p>}
      {alertError && <p className="error">{alertError}</p>}
      {!alertLoading && !alertError && (
        <table>
          <thead><tr><th>Product</th><th>Message</th><th>Severity</th><th>Action</th></tr></thead>
          <tbody>
            {(alerts ?? []).map(a => (
              <tr key={a.id}>
                <td>{a.product.name}</td>
                <td>{a.message}</td>
                <td><span className={`badge badge-${a.severity.toLowerCase()}`}>{a.severity}</span></td>
                <td><button className="btn-sm" onClick={() => handleResolve(a.id)}>Resolve</button></td>
              </tr>
            ))}
            {(alerts ?? []).length === 0 && <tr><td colSpan={4}>No active alerts.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
