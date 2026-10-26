
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Monitor,
  Pencil,
  Trash2,
  MessageSquare
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Details() {
  const { repairId } = useParams();
  const navigate = useNavigate();

  const [repair, setRepair] = useState(null);
  const [userId, setUserId] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingRepair, setDeletingRepair] = useState(false);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setCommentsLoading(true);
      setError('');
      setCommentError('');
      setRepair(null);
      setComments([]);
      setUserId(null);

      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (authError) throw authError;

        const user = authData.user;

        const { data, error: dbError } = await supabase
          .from('repairs')
          .select(
            'id,user_id,title,description,device_type,status,created_at,is_public'
          )
          .eq('id', repairId)
          .maybeSingle();

        if (dbError) throw dbError;

        if (
          !data ||
          (!data.is_public && data.user_id !== user?.id)
        ) {
          throw new Error(
            'Заявката не е намерена или нямаш достъп.'
          );
        }

        if (!active) return;

        setUserId(user?.id || null);
        setRepair(data);
        setLoading(false);

        const { data: rows, error: commentsError } =
          await supabase
            .from('comments')
            .select('id,repair_id,user_id,content,created_at')
            .eq('repair_id', repairId)
            .order('created_at', { ascending: true });

        if (commentsError) throw commentsError;

        if (active) setComments(rows || []);
      } catch (err) {
        if (active) {
          if (!repair) {
            setError(err.message || 'Грешка при зареждане.');
          }
          setCommentError(err.message || 'Грешка при коментарите.');
        }
      } finally {
        if (active) {
          setLoading(false);
          setCommentsLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [repairId]);

  const isOwner = repair?.user_id === userId && !!userId;

  async function refreshComments() {
    const { data, error } = await supabase
      .from('comments')
      .select('id,repair_id,user_id,content,created_at')
      .eq('repair_id', repairId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    setComments(data || []);
  }

  async function addComment(e) {
    e.preventDefault();
    const text = content.trim();

    if (!userId || !repair) {
      setCommentError('Трябва да влезеш в профила си.');
      return;
    }

    if (!text || saving) return;

    setSaving(true);
    setCommentError('');

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          repair_id: repairId,
          user_id: userId,
          content: text
        });

      if (error) throw error;

      setContent('');
      await refreshComments();
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateComment(id) {
    const text = editingText.trim();
    if (!text || saving) return;

    setSaving(true);
    setCommentError('');

    try {
      const { data, error } = await supabase
        .from('comments')
        .update({ content: text })
        .eq('id', id)
        .eq('repair_id', repairId)
        .eq('user_id', userId)
        .select('id');

      if (error) throw error;
      if (!data?.length) {
        throw new Error('Коментарът не е актуализиран.');
      }

      setEditingId(null);
      setEditingText('');
      await refreshComments();
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteComment(id) {
    if (saving) return;
    if (!window.confirm('Да изтрия ли коментара?')) return;

    setSaving(true);
    setCommentError('');

    try {
      const { data, error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)
        .eq('repair_id', repairId)
        .eq('user_id', userId)
        .select('id');

      if (error) throw error;
      if (!data?.length) {
        throw new Error('Коментарът не е изтрит.');
      }

      await refreshComments();
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteRepair() {
    if (!isOwner || deletingRepair) return;
    if (!window.confirm('Сигурни ли сте, че искате да изтриете тази заявка? Действието е необратимо.')) return;

    setDeletingRepair(true);
    setError('');
    try {
      const { data, error: deleteError } = await supabase
        .from('repairs')
        .delete()
        .eq('id', repairId)
        .eq('user_id', userId)
        .select('id');

      if (deleteError) throw deleteError;
      if (!data?.length) {
        throw new Error('Заявката не е изтрита. Проверете правата за изтриване (RLS).');
      }
      navigate('/my-repairs', { replace: true });
    } catch (err) {
      setError(err.message || 'Грешка при изтриване на заявката.');
    } finally {
      setDeletingRepair(false);
    }
  }

  if (loading) {
    return (
      <main className="section container">
        <p>Зареждане на заявката...</p>
      </main>
    );
  }

  if (!repair) {
    return (
      <main className="section container">
        <h1>Заявката не е достъпна</h1>
        <p>{error || 'Няма намерена заявка.'}</p>
        <Link className="btn btn-primary" to="/repairs">
          Към каталога
        </Link>
      </main>
    );
  }

  const description = repair.description || '';
  const match = description.match(
    /^Устройство:\s*(.*?)(?:\r?\n|$)/
  );

  const device = match ? match[1].trim() : '';
  const cleanDescription = match
    ? description.slice(match[0].length).trim()
    : description;

  const date = repair.created_at
    ? new Date(repair.created_at).toLocaleDateString('bg-BG')
    : 'Няма дата';

  const statusClass =
    repair.status === 'Завършена'
      ? 'done'
      : repair.status === 'В процес'
      ? 'progress'
      : 'new';

  return (
    <main className="section">
      <div className="container narrow">
        <Link
          className="back-link"
          to={isOwner ? '/my-repairs' : '/repairs'}
        >
          <ArrowLeft size={18} />
          {isOwner ? 'Моите заявки' : 'Обратно към каталога'}
        </Link>

        <article className="detail-panel">
          <div className="detail-header">
            <span className="eyebrow">
              {repair.device_type}
            </span>
            <span className={'status ' + statusClass}>
              {repair.status || 'Нова'}
            </span>
          </div>

          <h1>{repair.title}</h1>

          <div className="detail-meta">
            {device && (
              <span>
                <Monitor size={18} />
                {device}
              </span>
            )}
            <span>
              <CalendarDays size={18} />
              {date}
            </span>
          </div>

          <hr />

          <h2>Описание на проблема</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>
            {cleanDescription}
          </p>

          <p>
            <strong>Видимост:</strong>{' '}
            {repair.is_public ? 'Публична' : 'Частна'}
          </p>

          {isOwner && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link
                className="btn btn-outline-dark"
                to={`/repairs/${repair.id}/edit`}
              >
                <Pencil size={18} />
                Редактирай заявката
              </Link>
              <button
                type="button"
                className="btn btn-outline-dark"
                style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
                disabled={deletingRepair}
                onClick={deleteRepair}
              >
                <Trash2 size={18} />
                {deletingRepair ? 'Изтриване...' : 'Изтрий заявката'}
              </button>
            </div>
          )}
          {error && <p className="notice" role="alert" style={{ marginTop: 12 }}>{error}</p>}
        </article>

        <section
          className="detail-panel"
          style={{ marginTop: 24 }}
        >
          <h2>
            <MessageSquare size={22} style={{
              display: 'inline',
              verticalAlign: 'middle',
              marginRight: 8
            }} />
            Коментари ({comments.length})
          </h2>

          {commentsLoading && <p>Зареждане на коментарите...</p>}

          {commentError && (
            <p className="notice" role="alert">
              {commentError}
            </p>
          )}

          {!commentsLoading && comments.length === 0 && (
            <p>Все още няма коментари.</p>
          )}

          {comments.map(comment => {
            const own = !!userId && comment.user_id === userId;

            return (
              <div
                key={comment.id}
                style={{
                  padding: '18px 0',
                  borderBottom: '1px solid #e2e8f0'
                }}
              >
                <p style={{ fontSize: 13, color: '#64748b' }}>
                  {own ? 'Вие' : 'Потребител'}
                  {' · '}
                  {comment.created_at
                    ? new Date(comment.created_at)
                        .toLocaleString('bg-BG')
                    : ''}
                </p>

                {editingId === comment.id ? (
                  <div>
                    <textarea
                      rows={3}
                      value={editingText}
                      onChange={e => setEditingText(e.target.value)}
                      style={{ width: '100%' }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={saving || !editingText.trim()}
                      onClick={() => updateComment(comment.id)}
                    >
                      Запази
                    </button>
                    {' '}
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() => setEditingId(null)}
                      disabled={saving}
                    >
                      Отказ
                    </button>
                  </div>
                ) : (
                  <p style={{ whiteSpace: 'pre-wrap' }}>
                    {comment.content}
                  </p>
                )}

                {own && editingId !== comment.id && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      disabled={saving}
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditingText(comment.content);
                      }}
                    >
                      <Pencil size={16} />
                      Редактирай
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      disabled={saving}
                      onClick={() => deleteComment(comment.id)}
                    >
                      <Trash2 size={16} />
                      Изтрий
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {userId ? (
            <form onSubmit={addComment} style={{ marginTop: 24 }}>
              <label htmlFor="new-comment">
                <strong>Напиши коментар</strong>
              </label>
              <textarea
                id="new-comment"
                rows={4}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Напиши своя коментар..."
                required
                style={{ width: '100%', marginTop: 10 }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving || !content.trim()}
                style={{ marginTop: 12 }}
              >
                {saving ? 'Записване...' : 'Публикувай коментар'}
              </button>
            </form>
          ) : (
            <p style={{ marginTop: 24 }}>
              За да публикуваш коментар, трябва да{' '}
              <Link to="/login">влезеш в профила си</Link>.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
