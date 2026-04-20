import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { SupplyRequest } from '../../types/models';

export default function AdminHistoryPage() {
  const [history, setHistory] = useState<SupplyRequest[]>([]);

  useEffect(() => {
    api.get('/history').then((res) => setHistory(res.data));
  }, []);

  return (
    <section className="card">
      <h2>Request History</h2>
      {history.map((r) => (
        <div key={r.id} className="request-box">
          <p><b>ID:</b> {r.id}</p>
          <p><b>Status:</b> {r.status}</p>
          <p><b>Created:</b> {new Date(r.createdAt).toLocaleString()}</p>
          {r.reviewedAt ? <p><b>Reviewed:</b> {new Date(r.reviewedAt).toLocaleString()}</p> : null}
          <ul>
            {r.items.map((it) => <li key={it.id}>{it.item.name} x {it.quantity}</li>)}
          </ul>
          {r.rejectionReason ? <p><b>Reason:</b> {r.rejectionReason}</p> : null}
        </div>
      ))}
    </section>
  );
}
