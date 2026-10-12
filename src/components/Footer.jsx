import { Link } from 'react-router-dom';
export default function Footer(){return <footer className="site-footer"><div className="container footer-content"><span>© {new Date().getFullYear()} TechFix · ReactJS изпитен проект</span><Link to="/repairs">Разгледай заявките →</Link></div></footer>}
