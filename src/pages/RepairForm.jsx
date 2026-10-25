
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function RepairForm({ mode = 'create' }) {
  const { repairId } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === 'edit';

  const [title, setTitle] = useState('');
  const [device, setDevice] = useState('');
  const [category, setCategory] = useState('Лаптоп');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [ownerId, setOwnerId] = useState(null);

  useEffect(() => {
    if (!isEdit) return;

    let active = true;

    async function loadRepair() {
      setFetching(true);
      setMessage('');

      try {
        const {
          data: { user },
          error: authError
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) {
          throw new Error('Трябва да влезеш в профила си.');
        }

        const { data, error } = await supabase
          .from('repairs')
          .select('*')
          .eq('id', repairId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (!data) {
          throw new Error('Заявката не е намерена.');
        }

        const savedDescription = data.description || '';
        const match = savedDescription.match(
          /^Устройство:[ \t]*([^\r\n]*)(?:\r?\n){2}/
        );

        if (active) {
          setTitle(data.title || '');
          setCategory(data.device_type || 'Лаптоп');
          setOwnerId(data.user_id);
          setIsPublic(data.is_public === true);

          if (match) {
            setDevice(match[1].trim());
            setDescription(
              savedDescription.slice(match[0].length)
            );
          } else {
            setDevice('');
            setDescription(savedDescription);
          }
        }
      } catch (err) {
        if (active) {
          setMessage(
            err.message || 'Грешка при зареждане.'
          );
        }
      } finally {
        if (active) setFetching(false);
      }
    }

    loadRepair();

    return () => {
      active = false;
    };
  }, [isEdit, repairId]);

  async function getCurrentUser() {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error) throw error;

    if (!user) {
      throw new Error('Трябва да влезеш в профила си.');
    }

    return user;
  }

  async function submit(e) {
    e.preventDefault();

    if (loading || fetching) return;

    setMessage('');

    if (
      title.trim().length < 5 ||
      device.trim().length < 2 ||
      description.trim().length < 15
    ) {
      setMessage('Попълни всички полета коректно.');
      return;
    }

    setLoading(true);

    try {
      const user = await getCurrentUser();

      if (isEdit && ownerId !== user.id) {
        throw new Error(
          'Нямаш право да редактираш тази заявка.'
        );
      }

      const repairData = {
        title: title.trim(),
        device_type: category,
        description:
          `Устройство: ${device.trim()}\n\n${description.trim()}`,
        is_public: isPublic
      };

      if (isEdit) {
        const { data, error } = await supabase
          .from('repairs')
          .update(repairData)
          .eq('id', repairId)
          .eq('user_id', user.id)
          .select('id');

        if (error) throw error;

        if (!data?.length) {
          throw new Error(
            'Заявката не е актуализирана.'
          );
        }
      } else {
        const { error } = await supabase
          .from('repairs')
          .insert([
            {
              ...repairData,
              user_id: user.id
            }
          ]);

        if (error) throw error;
      }

      navigate('/my-repairs');

    } catch (err) {
      setMessage(
        'Грешка при запис: ' + err.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteRepair() {
    if (!isEdit || loading || fetching) return;

    const confirmed = window.confirm(
      'Сигурен ли си, че искаш да изтриеш тази заявка?'
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage('');

    try {
      const user = await getCurrentUser();

      if (ownerId !== user.id) {
        throw new Error(
          'Нямаш право да изтриеш тази заявка.'
        );
      }

      const { data, error } = await supabase
        .from('repairs')
        .delete()
        .eq('id', repairId)
        .eq('user_id', user.id)
        .select('id');

      if (error) throw error;

      if (!data?.length) {
        throw new Error('Заявката не е изтрита.');
      }

      navigate('/my-repairs');

    } catch (err) {
      setMessage(
        'Грешка при изтриване: ' + err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section">
      <div className="container form-width">

        <div className="page-intro">
          <span className="eyebrow">
            {isEdit ? 'РЕДАКТИРАНЕ' : 'НОВА ЗАЯВКА'}
          </span>

          <h1>
            {isEdit
              ? 'Редактиране на заявка'
              : 'Добави ремонт'}
          </h1>

          <p>
            Попълни данните за устройството и проблема.
          </p>
        </div>

        {fetching ? (
          <p>Зареждане на заявката...</p>
        ) : isEdit && !ownerId ? (
          <div className="form-panel">
            <p className="notice" role="alert">
              {message || 'Заявката не е достъпна.'}
            </p>

            <Link to="/my-repairs">
              Към моите заявки
            </Link>
          </div>
        ) : (
          <form
            className="form-panel"
            onSubmit={submit}
          >

            <label>
              Заглавие
              <input
                required
                minLength={5}
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Напр. Компютърът не стартира"
              />
            </label>

            <label>
              Устройство
              <input
                required
                minLength={2}
                value={device}
                onChange={(e) =>
                  setDevice(e.target.value)
                }
                placeholder="Марка и модел"
              />
            </label>

            <label>
              Категория
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                <option>Лаптоп</option>
                <option>Настолен компютър</option>
                <option>Мрежа</option>
                <option>Периферия</option>
                <option>Друго</option>
              </select>
            </label>

            <label>
              Описание
              <textarea
                required
                minLength={15}
                rows={6}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Опиши проблема подробно..."
              />
            </label>

            <label htmlFor="repair-visibility">
              Видимост на заявката
            </label>

            <select
              id="repair-visibility"
              name="visibility"
              value={isPublic ? 'public' : 'private'}
              onChange={(e) =>
                setIsPublic(
                  e.target.value === 'public'
                )
              }
            >
              <option value="private">
                Частна
              </option>

              <option value="public">
                Публична
              </option>
            </select>

            <p className="form-switch">
              {isPublic
                ? 'Публичната заявка ще се вижда в каталога.'
                : 'Частната заявка е видима само за собственика.'}
            </p>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Обработване...'
                : isEdit
                  ? 'Запази промените'
                  : 'Създай заявка'}
            </button>

            {isEdit && (
              <button
                type="button"
                className="btn btn-outline-dark"
                disabled={loading}
                onClick={deleteRepair}
                style={{ marginLeft: '10px' }}
              >
                Изтрий заявката
              </button>
            )}

            {message && (
              <p
                className="notice"
                role="alert"
              >
                {message}
              </p>
            )}

            <p className="form-switch">
              <Link to="/my-repairs">
                Моите заявки
              </Link>
            </p>

          </form>
        )}
      </div>
    </main>
  );
}
