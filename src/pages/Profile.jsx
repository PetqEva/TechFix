
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !data.user) {
        setError('Необходимо е да влезеш в профила си.');
      } else if (userId && userId !== data.user.id) {
        setError('Нямаш достъп до този потребителски профил.');
      } else {
        setUser(data.user);
      }

      setLoading(false);
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [userId]);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      return;
    }

    navigate('/login');
  }

  if (loading) {
    return (
      <main className="section">
        <div className="container narrow">
          <p>Зареждане на профила...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container narrow">
        <div className="detail-panel centered">
          <span className="profile-avatar">
            <UserRound size={36} />
          </span>

          <span className="eyebrow">
            ПОТРЕБИТЕЛСКИ ПРОФИЛ
          </span>

          <h1>Моят профил</h1>

          {error ? (
            <>
              <p className="notice" role="alert">{error}</p>
              <Link className="btn btn-primary" to="/login">
                Вход
              </Link>
            </>
          ) : (
            <>
              <h2>
                {user.user_metadata?.full_name ||
                  user.user_metadata?.name ||
                  'Потребител'}
              </h2>

              <p><strong>Имейл:</strong> {user.email}</p>

              <p>
                <strong>Регистрация:</strong>{' '}
                {new Date(user.created_at).toLocaleDateString('bg-BG')}
              </p>

              <p>
                <strong>Статус:</strong>{' '}
                {user.email_confirmed_at
                  ? 'Потвърден имейл'
                  : 'Непотвърден имейл'}
              </p>

              <button
                className="btn btn-primary"
                type="button"
                onClick={handleLogout}
              >
                Изход от профила
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
