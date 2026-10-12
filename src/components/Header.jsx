import { NavLink, Link } from 'react-router-dom';
import { Wrench, Menu, X } from 'lucide-react';
import { useState } from 'react';
export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="site-header"><div className="container nav-wrap">
    <Link className="brand" to="/" onClick={close}><span className="brand-mark"><Wrench size={22}/></span>Tech<span>Fix</span></Link>
    <button className="mobile-toggle" type="button" aria-label={open ? 'Затвори менюто' : 'Отвори менюто'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    <nav className={open ? 'navigation open' : 'navigation'} aria-label="Основна навигация">
      <NavLink onClick={close} to="/" end>Начало</NavLink><NavLink onClick={close} to="/repairs">Каталог</NavLink><NavLink onClick={close} to="/my-repairs">Моите заявки</NavLink><NavLink onClick={close} to="/login">Вход</NavLink><NavLink onClick={close} className="nav-button" to="/register">Регистрация</NavLink>
    </nav>
  </div></header>;
}
