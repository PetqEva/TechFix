
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Plus, Pencil, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function MyRepairs() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadRepairs() {
      try {
        const {
          data: { user },
          error: authError
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          throw new Error('Трябва да влезеш в профила си.');
        }

        const { data, error: dbError } = await supabase
          .from('repairs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (dbError) throw dbError;

        if (active) setRepairs(data || []);
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

  return (
    <main className="section">
      <div className="container">

        <div className="page-intro">
          <span className="eyebrow">ЛИЧЕН ПАНЕЛ</span>
          <h1>Моите заявки</h1>
          <p>
            Управлявай собствените си заявки
            за компютърни ремонти.
          </p>

          <Link
            className="btn btn-primary"
            to="/repairs/create"
          >
            <Plus size={18} />
            Създай нова заявка
          </Link>
        </div>

        {loading && <p>Зареждане на заявките...</p>}

        {error && (
          <p className="notice" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && repairs.length === 0 && (
          <div className="empty-state">
            <ClipboardList size={42} />
            <h2>Все още няма лични заявки</h2>
            <p>Създай първата си заявка за ремонт.</p>
          </div>
        )}

        {!loading && !error && repairs.length > 0 && (
          <>
            <p className="results-count">
              Общо мои заявки: {repairs.length}
            </p>

            <div className="repairs-list">
              {repairs.map(repair => (
                <div className="form-panel" key={repair.id}>

                  <h2>{repair.title}</h2>

                  <p>
                    <strong>Категория:</strong>{' '}
                    {repair.device_type || 'Не е посочена'}
                  </p>

                  <p>
                    <strong>Статус:</strong>{' '}
                    {repair.status || 'Нова'}
                  </p>

                  <p style={{ whiteSpace: 'pre-wrap' }}>
                    {repair.description}
                  </p>

                  <p>
                    <strong>Дата:</strong>{' '}
                    {repair.created_at
                      ? new Date(
                          repair.created_at
                        ).toLocaleDateString('bg-BG')
                      : 'Няма дата'}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      flexWrap: 'wrap',
                      marginTop: '20px'
                    }}
                  >
                    <Link
                      className="btn btn-outline-dark"
                      to={`/repairs/${repair.id}`}
                    >
                      <Eye size={17} />
                      Преглед
                    </Link>

                    <Link
                      className="btn btn-primary"
                      to={`/repairs/${repair.id}/edit`}
                    >
                      <Pencil size={17} />
                      Редактирай
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </main>
  );
}
