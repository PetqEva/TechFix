
import { Link } from 'react-router-dom';
import {
  Laptop,
  Monitor,
  HardDrive,
  Wifi,
  Keyboard,
  ArrowUpRight,
  CalendarDays
} from 'lucide-react';

const icons = {
  laptop: Laptop,
  desktop: Monitor,
  'hard-drive': HardDrive,
  wifi: Wifi,
  keyboard: Keyboard
};

export default function RepairCard({ repair }) {
  const category = repair.category || repair.device_type || '';

  const device =
    repair.device ||
    repair.device_name ||
    repair.device_model ||
    (repair.description || '').match(/^Устройство:[ \t]*([^\r\n]*)/)?.[1]?.trim() ||
    '';

  const rawDate = repair.date || repair.created_at;

  const date = rawDate
    ? new Date(rawDate).toLocaleDateString('bg-BG')
    : '';

  const status = repair.status || 'Нова';

  let Icon = icons[repair.icon] || Monitor;

  if (!repair.icon) {
    if (category === 'Лаптоп') Icon = Laptop;
    if (category === 'Периферия') Icon = Keyboard;
    if (category === 'Мрежа') Icon = Wifi;
    if (category === 'Настолен компютър') Icon = Monitor;
  }

  return (
    <article className="repair-card">
      <div className="card-top">
        <span className="device-icon">
          <Icon size={23} />
        </span>

        <span
          className={
            'status ' +
            (status === 'Завършена'
              ? 'done'
              : status === 'В процес'
                ? 'progress'
                : 'new')
          }
        >
          {status}
        </span>
      </div>

      <span className="eyebrow">{category}</span>

      <h3>{repair.title}</h3>

      <p>{device}</p>

      <div className="card-bottom">
        <span>
          <CalendarDays size={15} />
          {date}
        </span>

        <Link
          to={`/repairs/${repair.id}`}
          aria-label={`Детайли: ${repair.title}`}
        >
          <ArrowUpRight size={20} />
        </Link>
      </div>
    </article>
  );
}
