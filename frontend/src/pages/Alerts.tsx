import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getAlerts, resolveAlert } from '../api/alerts';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 8;

export default function Alerts() {
  const { data: alerts, loading, error, reload } = useFetch<any[]>(getAlerts);
  const [page, setPage] = useState(1);

  const paginated = (alerts ?? []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page">
      <h2>Alerts</h2>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <>
          <table>
            <thead><tr><th>Product</th><th>Message</th><th>Severity</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {paginated.map(a => (
                <tr key={a.id}>
                  <td>{a.product.name}</td>
                  <td>{a.message}</td>
                  <td><span className={`badge badge-${a.severity.toLowerCase()}`}>{a.severity}</span></td>
                  <td>{a.isResolved ? '✅ Resolved' : '⚠️ Open'}</td>
                  <td>{!a.isResolved && <button className="btn-sm" onClick={() => resolveAlert(a.id).then(reload)}>Resolve</button>}</td>
                </tr>
              ))}
              {paginated.length === 0 && <tr><td colSpan={5}>No alerts.</td></tr>}
            </tbody>
          </table>
          <Pagination total={alerts?.length ?? 0} page={page} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
