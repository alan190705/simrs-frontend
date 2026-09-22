import { Card } from '@/shared/components/ui';
import {
  HeroCard,
  StatCard,
  QuickActions,
  VisitChart,
  TodayScheduleCard,
  ActivityFeed,
  SystemStatusCard,
} from './components';
import type {
  DashboardStat,
  QuickAction,
  TodaySchedule,
  VisitPoint,
  Activity,
} from './dashboard.types';

// ============================================================
// DATA DUMMY — nanti ganti dengan API
// ============================================================

const STATS: DashboardStat[] = [
  {
    label: 'Total Pasien',
    value: '1.247',
    hint: 'Terdaftar di sistem',
    icon: 'users',
    tone: 'primary',
    trend: { value: 12, direction: 'up' },
  },
  {
    label: 'Kunjungan Hari Ini',
    value: 23,
    hint: 'dari 40 slot',
    icon: 'calendar',
    tone: 'sky',
    trend: { value: 8, direction: 'up' },
  },
  {
    label: 'Bed Tersedia',
    value: 8,
    hint: 'dari 20 bed',
    icon: 'bed',
    tone: 'amber',
  },
  {
    label: 'Dokter Aktif',
    value: 12,
    hint: 'praktek hari ini',
    icon: 'plus',
    tone: 'emerald',
  },
];

const WEEKLY_VISITS: VisitPoint[] = [
  { day: 'Sen', visits: 18 },
  { day: 'Sel', visits: 23 },
  { day: 'Rab', visits: 15 },
  { day: 'Kam', visits: 28 },
  { day: 'Jum', visits: 22 },
  { day: 'Sab', visits: 12 },
  { day: 'Min', visits: 5 },
];

const TODAY_SCHEDULES: TodaySchedule[] = [
  {
    id: '1',
    time: '08:00',
    doctorName: 'dr. Andi Wijaya',
    polyclinic: 'Poli Umum',
    booked: 12,
    capacity: 15,
    status: 'done',
  },
  {
    id: '2',
    time: '09:00',
    doctorName: 'dr. Siti Nurhaliza',
    polyclinic: 'Poli Anak',
    booked: 8,
    capacity: 10,
    status: 'done',
  },
  {
    id: '3',
    time: '10:00',
    doctorName: 'dr. Budi Santoso',
    polyclinic: 'Poli Gigi',
    booked: 5,
    capacity: 8,
    status: 'ongoing',
  },
  {
    id: '4',
    time: '13:00',
    doctorName: 'dr. Maya Sari',
    polyclinic: 'Poli Kandungan',
    booked: 7,
    capacity: 12,
    status: 'upcoming',
  },
];

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Daftarkan',
    description: 'Pasien baru',
    icon: 'plus',
    href: '/registration',
    tone: 'primary',
  },
  {
    label: 'Cari Pasien',
    description: 'Berdasarkan nama/RM',
    icon: 'search',
    href: '/patients',
    tone: 'sky',
  },
  {
    label: 'Resep',
    description: 'Lihat & siapkan',
    icon: 'pill',
    href: '/pharmacy',
    tone: 'amber',
  },
  {
    label: 'Tagihan',
    description: 'Proses pembayaran',
    icon: 'wallet',
    href: '/billing',
    tone: 'emerald',
  },
];

const ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'patient',
    title: 'Pasien baru terdaftar',
    description: 'Ahmad Fauzi — Poli Umum',
    timestamp: '5 mnt lalu',
    tone: 'primary',
  },
  {
    id: '2',
    type: 'prescription',
    title: 'Resep dibuat',
    description: 'Siti Aminah — 3 obat',
    timestamp: '12 mnt lalu',
    tone: 'amber',
  },
  {
    id: '3',
    type: 'payment',
    title: 'Pembayaran diterima',
    description: 'Budi Hartono — Rp 150.000',
    timestamp: '20 mnt lalu',
    tone: 'emerald',
  },
  {
    id: '4',
    type: 'registration',
    title: 'Pendaftaran selesai',
    description: 'Dewi Lestari — Poli Anak',
    timestamp: '35 mnt lalu',
    tone: 'sky',
  },
];

// ============================================================

export function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Hero */}
      <HeroCard />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Chart + Schedule */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card
            title="Kunjungan Pasien"
            description="Tren jumlah pasien yang berkunjung."
          >
            <VisitChart data={WEEKLY_VISITS} />
          </Card>
        </div>

        <div>
          <Card
            title="Jadwal Hari Ini"
            description="Dokter yang praktek hari ini."
          >
            <TodayScheduleCard schedules={TODAY_SCHEDULES} />
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-base font-semibold tracking-tight text-slate-900">
          Akses Cepat
        </h2>
        <QuickActions actions={QUICK_ACTIONS} />
      </div>

      {/* Activity + System */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card
            title="Aktivitas Terbaru"
            description="Kegiatan terkini di sistem."
          >
            <ActivityFeed activities={ACTIVITIES} />
          </Card>
        </div>

        <div>
          <SystemStatusCard />
        </div>
      </div>
    </div>
  );
}