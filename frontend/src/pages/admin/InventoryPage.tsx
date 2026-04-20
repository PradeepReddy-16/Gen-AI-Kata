import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { InventoryItem } from '../../types/models';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState('');

  async function load() {
    const res = await api.get('/inventory');
    setItems(res.data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function addItem() {
    setError('');
    if (!name.trim() || quantity < 0) {
      setError('Provide valid name and quantity');
      return;
    }
    try {
      await api.post('/inventory', { name, quantity });
      setName('');
      setQuantity(0);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || 'Failed to add item');
    }
  }

  async function remove(id: string) {
    await api.delete(`/inventory/${id}`);
    await load();
  }

  return (
    <section className="card">
      <h2>Inventory</h2>
      <div className="row">
        <input placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <button onClick={() => void addItem()}>Add</button>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <table>
        <thead>
          <tr><th>Item</th><th>Quantity</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.quantity}</td>
              <td><button onClick={() => void remove(i.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
