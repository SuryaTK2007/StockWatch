import { useState } from 'react';
import { runAllPredictions } from '../api/predictions';

export default function Predictions() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRun = () => {
    setLoading(true);
    setError('');
    runAllPredictions()
      .then(setPredictions)
      .catch(() => setError('Failed to run predictions. Make sure you have products with inventory.'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Predictions</h2>
        <button className="btn-primary" onClick={handleRun} disabled={loading}>
          {loading ? 'Running...' : 'Run Predictions'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {!loading && predictions.length === 0 && !error && <p>Click "Run Predictions" to generate predictions.</p>}
      {predictions.length > 0 && (
        <table>
          <thead><tr><th>Product</th><th>Daily Demand</th><th>Days Until Stockout</th><th>Stockout Date</th></tr></thead>
          <tbody>
            {predictions.map(p => (
              <tr key={p.id}>
                <td>{p.product.name}</td>
                <td>{p.predictedDailyDemand} {p.product.unit}/day</td>
                <td>
                  <span className={`badge ${p.daysUntilStockout <= 3 ? 'badge-high' : p.daysUntilStockout <= 7 ? 'badge-medium' : 'badge-low'}`}>
                    {p.daysUntilStockout} days
                  </span>
                </td>
                <td>{p.predictedStockoutDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
