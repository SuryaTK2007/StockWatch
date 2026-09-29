import { useEffect, useState } from 'react';
import { getAlerts, resolveAlert } from '../api/alerts';

export default function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([]);

  const load = () => getAlerts().then(setAlerts);
  useEffect(() => { load(); }, []);

  return (
    <div className="page">
      <h2>Alerts</h2>
      <table>
        <thead>
          <tr><th>Product</th><th>Message</th><th>Severity</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          {alerts.map(a => (
            <tr key={a.id}>
              <td>{a.product.name}</td>
              <td>{a.message}</td>
              <td><span className={`badge badge-${a.severity.toLowerCase()}`}>{a.severity}</span></td>
              <td>{a.isResolved ? '✅ Resolved' : '⚠️ Open'}</td>
              <td>{!a.isResolved && <button className="btn-sm" onClick={() => resolveAlert(a.id).then(load)}>Resolve</button>}</td>
            </tr>
          ))}
          {alerts.length === 0 && <tr><td colSpan={5}>No alerts</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
