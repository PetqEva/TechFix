// Етап 1: само демонстрационни данни. Етап 2: замяна със Supabase.
export const demoRepairs = [
  { id: '1', title: 'Лаптопът прегрява и се изключва', device: 'Lenovo ThinkPad T480', category: 'Лаптоп', status: 'В процес', description: 'След около 20 минути работа лаптопът загрява силно и се изключва. Необходимо е почистване и диагностика на охлаждането.', author: 'Мария Георгиева', date: '2026-10-09', icon: 'laptop' },
  { id: '2', title: 'Настолен компютър не стартира', device: 'Desktop PC / Ryzen 5', category: 'Настолен компютър', status: 'Нова', description: 'При натискане на бутона за включване вентилаторите се завъртат, но няма изображение на монитора.', author: 'Иван Петров', date: '2026-10-10', icon: 'desktop' },
  { id: '3', title: 'Смяна на HDD със SSD', device: 'HP ProBook 450', category: 'Лаптоп', status: 'Завършена', description: 'Подмяна на стар HDD с SSD и прехвърляне на операционната система.', author: 'Елена Иванова', date: '2026-10-11', icon: 'hard-drive' },
  { id: '4', title: 'Нестабилна Wi-Fi връзка', device: 'ASUS VivoBook', category: 'Мрежа', status: 'Нова', description: 'Безжичната връзка прекъсва често. Нужна е проверка на драйверите и мрежовия адаптер.', author: 'Георги Стоянов', date: '2026-10-12', icon: 'wifi' },
];
export const findRepair = (id) => demoRepairs.find((item) => item.id === id);
