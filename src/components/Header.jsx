
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Wrench, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const close = () => setOpen(false);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert('Грешка при изход: ' + error.message);
      return;
    }

    close();
    navigate('/login');
  }

  return (
    <header className="site-header">
      <div className="container nav-wrap">

        <Link className="brand" to="/" onClick={close}>
          <span className="brand-mark">
            <Wrench size={22} />
          </span>
          Tech<span>Fix</span>
        </Link>

        <button
          className="mobile-toggle"
          type="button"
          aria-label={open ? 'Затвори менюто' : 'Отвори менюто'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>

        <nav
          className={open ? 'navigation open' : 'navigation'}
          aria-label="Основна навигация"
        >
          <NavLink onClick={close} to="/" end>
            Начало
          </NavLink>

          <NavLink onClick={close} to="/repairs">
            Каталог
          </NavLink>

          <NavLink onClick={close} to="/my-repairs">
            Моите заявки
          </NavLink>

          {!loading && (
            user ? (
              <>
                <NavLink onClick={close} to="/profile">
                  Моят профил
                </NavLink>

                <button
                  className="nav-button"
                  type="button"
                  onClick={handleLogout}
                >
                  Изход
                </button>
              </>
            ) : (
              <>
                <NavLink onClick={close} to="/login">
                  Вход
                </NavLink>

                <NavLink
                  onClick={close}
                  className="nav-button"
                  to="/register"
                >
                  Регистрация
                </NavLink>
              </>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
