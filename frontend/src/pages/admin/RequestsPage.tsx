import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { SupplyRequest } from '../../types/models';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<SupplyRequest[]>([]);
  const [reasons, setReasons] = useState<Record<string, string>>({});

  async function load() {
    const res = await api.get('/requests');
    setRequests(res.data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function approve(id: string) {
    await api.post(`/requests/${id}/approve`);
    await load();
  }

  async function reject(id: string) {
    await api.post(`/requests/${id}/reject`, { reason: reasons[id] || '' });
    await load();
  }

  return (
    <section className="card">
      <h2>Request Approvals</h2>
      {requests.map((r) => (
        <div key={r.id} className="request-box">
          <p><b>Status:</b> {r.status}</p>
          <p><b>Employee:</b> {r.employee?.name} ({r.employee?.email})</p>
          <ul>
            {r.items.map((it) => <li key={it.id}>{it.item.name} x {it.quantity}</li>)}
          </ul>
          {r.status === 'PENDING' ? (
            <>
              <textarea
                placeholder="Optional rejection reason"
                value={reasons[r.id] || ''}
                onChange={(e) => setReasons((prev) => ({ ...prev, [r.id]: e.target.value }))}
              />
              <div className="row">
                <button onClick={() => void approve(r.id)}>Approve</button>
                <button className="danger" onClick={() => void reject(r.id)}>Reject</button>
              </div>
            </>
          ) : null}
          {r.rejectionReason ? <p><b>Rejection reason:</b> {r.rejectionReason}</p> : null}
        </div>
      ))}
    </section>
  );
}
