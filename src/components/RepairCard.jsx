import { Link } from 'react-router-dom';
import { Laptop, Monitor, HardDrive, Wifi, ArrowUpRight, CalendarDays } from 'lucide-react';
const icons = { laptop: Laptop, desktop: Monitor, 'hard-drive': HardDrive, wifi: Wifi };
export default function RepairCard({repair}) { const Icon = icons[repair.icon] || Monitor;
 return <article className="repair-card"><div className="card-top"><span className="device-icon"><Icon size={23}/></span><span className={'status '+(repair.status==='Завършена'?'done':repair.status==='В процес'?'progress':'new')}>{repair.status}</span></div><span className="eyebrow">{repair.category}</span><h3>{repair.title}</h3><p>{repair.device}</p><div className="card-bottom"><span><CalendarDays size={15}/> {repair.date}</span><Link to={`/repairs/${repair.id}`} aria-label={`Детайли: ${repair.title}`}><ArrowUpRight size={20}/></Link></div></article>;
}
