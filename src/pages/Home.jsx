import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowRight, ShieldCheck, ClipboardList, Wrench, Monitor, CheckCircle2 } from 'lucide-react';
import RepairCard from '../components/RepairCard';

export default function Home(){
const [recent, setRecent] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
useEffect(() => {
  let active = true;
  async function load() {
    const {data, error: dbError} = await supabase.from('repairs')
      .select('id,title,description,device_type,status,created_at')
      .eq('is_public', true).order('created_at', {ascending:false}).limit(3);
    if (!active) return;
    if (dbError) setError('Неуспешно зареждане на последните заявки.');
    else setRecent(data || []);
    setLoading(false);
  }
  load();
  return () => {active = false;};
}, []);
return <><section className="hero"><div className="container hero-grid"><div><span className="hero-label">● ПЛАТФОРМА ЗА КОМПЮТЪРНИ РЕМОНТИ</span><h1>Всеки проблем има <em>решение.</em></h1><p>Организирай заявки за ремонт, следи състоянието им и намери правилното решение за своята техника.</p><div className="hero-actions"><Link className="btn btn-primary" to="/repairs">Разгледай заявките <ArrowRight size={18}/></Link><Link className="btn btn-outline" to="/repairs/create">Нова заявка</Link></div><div className="hero-facts"><span><CheckCircle2 size={17}/> Ясен процес</span><span><CheckCircle2 size={17}/> Лесно управление</span></div></div><div className="hero-visual"><div className="visual-glow"/><div className="monitor-illustration"><div className="monitor-top"><span/><span/><span/></div><div className="monitor-body"><div className="monitor-sidebar"><span/><span/><span/><span/></div><div className="monitor-main"><div className="mock-heading"/><div className="mock-row"><Monitor/><div><i/><i/></div><b/></div><div className="mock-row"><Wrench/><div><i/><i/></div><b/></div><div className="mock-row"><ShieldCheck/><div><i/><i/></div><b/></div></div></div></div><div className="floating-tag"><CheckCircle2 size={19}/> Организирани ремонти</div></div></div></section>
<section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">КАК РАБОТИ</span><h2>Всичко на едно място</h2></div></div><div className="features"><div className="feature"><span><ClipboardList/></span><h3>Създай заявка</h3><p>Опиши проблема и устройството, за което търсиш решение.</p></div><div className="feature"><span><Wrench/></span><h3>Управлявай ремонта</h3><p>Преглеждай заявките и следи състоянието на всяка от тях.</p></div><div className="feature"><span><ShieldCheck/></span><h3>Контрол и сигурност</h3><p>Авторите могат да управляват собствените си заявки и коментари.</p></div></div></div></section>
<section className="section section-muted"><div className="container"><div className="section-head"><div><span className="eyebrow">ПОСЛЕДНИ ЗАЯВКИ</span><h2>Актуални ремонти</h2></div><Link className="text-link" to="/repairs">Всички заявки <ArrowRight size={18}/></Link></div>{loading && <p>Зареждане на последните заявки...</p>}{error && <p role="alert">{error}</p>}{!loading && !error && (recent.length ? <div className="cards-grid">{recent.map(r=><RepairCard key={r.id} repair={r}/>)}</div> : <p>Все още няма публични заявки.</p>)}</div></section></>}
