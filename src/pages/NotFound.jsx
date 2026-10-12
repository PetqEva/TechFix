import {Link} from 'react-router-dom';
export default function NotFound(){return <main className="section container centered"><span className="eyebrow">404</span><h1>Страницата не е намерена</h1><p>Проверете адреса или се върнете на началната страница.</p><Link className="btn btn-primary" to="/">Към началото</Link></main>}
