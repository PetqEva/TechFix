
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthPage({ mode = 'login' }) {
  const register = mode === 'register';
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (loading) return;

    setMessage('');

    if (register && password !== confirmPassword) {
      setMessage('Паролите не съвпадат.');
      return;
    }

    setLoading(true);

    try {
      if (register) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() }
          }
        });

        if (error) throw error;

        if (data.session) {
          navigate('/profile');
        } else {
          setMessage(
            'Регистрацията е приета. Провери имейла си за потвърждение, ако е необходимо.'
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) throw error;

        navigate('/profile');
      }
    } catch (error) {
      setMessage(error.message || 'Възникна грешка.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section auth-background">
      <div className="container form-width">
        <div className="page-intro centered">
          <span className="eyebrow">TECHFIX ПРОФИЛ</span>
          <h1>
            {register ? 'Създай профил' : 'Добре дошъл отново'}
          </h1>
          <p>
            {register
              ? 'Регистрирай се, за да управляваш своите заявки.'
              : 'Влез в профила си, за да продължиш.'}
          </p>
        </div>

        <form className="form-panel" onSubmit={submit}>
          {register && (
            <label>
              Име
              <input
                type="text"
                autoComplete="name"
                required
                minLength={2}
                placeholder="Твоето име"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}

          <label>
            Имейл
            <input
              type="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Парола
            <input
              type="password"
              autoComplete={register ? 'new-password' : 'current-password'}
              required
              minLength={6}
              placeholder="Минимум 6 символа"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {register && (
            <label>
              Повтори паролата
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                placeholder="Повтори паролата"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
          )}

          <button
            className="btn btn-primary full"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Моля, изчакай...'
              : register ? 'Регистрация' : 'Вход'}
          </button>

          {message && (
            <p className="notice" role="status">
              {message}
            </p>
          )}

          <p className="form-switch">
            {register ? 'Вече имаш профил?' : 'Нямаш профил?'}{' '}
            <Link to={register ? '/login' : '/register'}>
              {register ? 'Влез' : 'Регистрирай се'}
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
