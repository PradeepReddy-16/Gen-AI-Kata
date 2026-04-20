import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { SupplyRequest } from '../../types/models';

export default function EmployeeMyRequestsPage() {
  const [requests, setRequests] = useState<SupplyRequest[]>([]);

  useEffect(() => {
    api.get('/requests').then((res) => setRequests(res.data));
  }, []);

  return (
    <section className="card">
      <h2>My Request History</h2>
      {requests.map((r) => (
        <div key={r.id} className="request-box">
          <p><b>Status:</b> {r.status}</p>
          <p><b>Created:</b> {new Date(r.createdAt).toLocaleString()}</p>
          {r.remarks ? <p><b>Remarks:</b> {r.remarks}</p> : null}
          <ul>
            {r.items.map((it) => <li key={it.id}>{it.item.name} x {it.quantity}</li>)}
          </ul>
          {r.rejectionReason ? <p className="error">Rejected: {r.rejectionReason}</p> : null}
        </div>
      ))}
    </section>
  );
}
