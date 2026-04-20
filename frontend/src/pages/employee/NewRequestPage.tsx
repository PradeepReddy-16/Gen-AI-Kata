import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { InventoryItem } from '../../types/models';

export default function EmployeeNewRequestPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [remarks, setRemarks] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/inventory').then((res) => setInventory(res.data));
  }, []);

  async function submit() {
    const items = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([itemId, quantity]) => ({ itemId, quantity }));

    if (!items.length) {
      setMessage('Select at least one item with quantity > 0');
      return;
    }

    await api.post('/requests', { remarks, items });
    setQuantities({});
    setRemarks('');
    setMessage('Request submitted successfully');
  }

  return (
    <section className="card">
      <h2>Submit Supply Request</h2>
      <textarea
        placeholder="Optional remarks"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />
      <table>
        <thead>
          <tr><th>Item</th><th>Available</th><th>Requested</th></tr>
        </thead>
        <tbody>
          {inventory.map((i) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.quantity}</td>
              <td>
                <input
                  type="number"
                  min={0}
                  value={quantities[i.id] ?? 0}
                  onChange={(e) => setQuantities((prev) => ({ ...prev, [i.id]: Number(e.target.value) }))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => void submit()}>Submit Request</button>
      {message ? <p className="hint">{message}</p> : null}
    </section>
  );
}
