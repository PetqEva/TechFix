
import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import RepairCard from '../components/RepairCard';
import { supabase } from '../lib/supabase';

export default function Catalog() {
  const [repairs, setRepairs] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Всички');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadRepairs() {
      try {
       
const { data, error: dbError } = await supabase
  .from('repairs')
  .select('*')
  .eq('is_public', true)
  .order('created_at', { ascending: false });

        if (dbError) throw dbError;

        if (active) {
          setRepairs(
            (data || []).map(r => ({
              ...r,
              device: r.device ?? r.device_name ?? '',
              category: r.category ?? r.device_type ?? '',
              status: r.status ?? 'Нова',
            }))
          );
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Грешка при зареждане.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRepairs();

    return () => {
      active = false;
    };
  }, []);

  const items = useMemo(() => {
    return repairs.filter(r => {
      const matchesStatus =
        status === 'Всички' || r.status === status;

      const content = [
        r.title,
        r.device,
        r.category,
        r.description
      ].filter(Boolean).join(' ').toLowerCase();

      return matchesStatus &&
        content.includes(search.toLowerCase().trim());
    });
  }, [repairs, search, status]);

  return (
    <main className="section">
      <div className="container">
        <div className="page-intro">
          <span className="eyebrow">КАТАЛОГ</span>
          <h1>Заявки за ремонт</h1>
          <p>
            Разгледай реалните заявки за компютърни
            ремонти, записани в базата данни.
          </p>
        </div>

        <div className="filters">
          <label className="search-box">
            <Search size={19} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Търси по проблем или устройство..."
              aria-label="Търси заявки"
            />
          </label>

          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            aria-label="Филтър по статус"
          >
            <option>Всички</option>
            <option>Нова</option>
            <option>В процес</option>
            <option>Завършена</option>
          </select>
        </div>

        {loading && <p>Зареждане на заявките...</p>}

        {error && (
          <div className="empty-state" role="alert">
            Грешка: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="results-count">
              Намерени заявки: {items.length}
            </p>

            {items.length > 0 ? (
              <div className="cards-grid">
                {items.map(r => (
                  <RepairCard key={r.id} repair={r} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                Няма заявки, които отговарят на търсенето.
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
