import { StatCard } from './StatCard';

const STATS = [
  { label: 'Pasien Terdaftar', value: '—', hint: 'Modul Pasien belum aktif' },
  { label: 'Kunjungan Hari Ini', value: '—', hint: 'Modul Pendaftaran belum aktif' },
  { label: 'Bed Tersedia', value: '—', hint: 'Modul Rawat Inap belum aktif' },
  { label: 'Dokter Aktif', value: '—', hint: 'Modul Jadwal belum aktif' },
];

export function StatGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}