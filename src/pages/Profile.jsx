import {useParams,Link} from 'react-router-dom';
import {UserRound} from 'lucide-react';
export default function Profile(){const {userId}=useParams();return <main className="section"><div className="container narrow"><div className="detail-panel centered"><span className="profile-avatar"><UserRound size={36}/></span><span className="eyebrow">ПОТРЕБИТЕЛСКИ ПРОФИЛ</span><h1>Профил</h1><p>Идентификатор от URL: <code>{userId}</code></p><p>Потребителските данни ще се зареждат от Supabase в Етап 2.</p><Link className="btn btn-outline-dark" to="/repairs">Каталог</Link></div></div></main>}
