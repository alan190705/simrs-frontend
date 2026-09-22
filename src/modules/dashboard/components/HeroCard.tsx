import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/modules/auth';

export function HeroCard() {
  const { user } = useAuth();

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 19 ? 'Selamat sore' : 'Selamat malam';

  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const timeStr = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900 via-brand-800 to-primary-900 p-6 shadow-lg lg:p-8">
      {/* Dekorasi blob */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl" />

      <div className="relative flex flex-wrap items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary-300">{dateStr}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white lg:text-3xl">
            {greeting}, {user?.fullName ?? 'Pengguna'} 👋
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Ada <span className="font-semibold text-primary-300">23 kunjungan</span> hari ini,
            8 bed tersedia, dan 12 dokter praktek.
          </p>
          <p className="mt-1 text-xs text-white/50">
            Sekarang pukul {timeStr} WIB
          </p>
        </div>

        {/* Aksi cepat */}
        <div className="flex flex-wrap gap-2">
          <Link
            to="/registration"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-400"
          >
            <Plus className="h-4 w-4" />
            Daftarkan Pasien
          </Link>
          <Link
            to="/patients"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <Search className="h-4 w-4" />
            Cari Pasien
          </Link>
        </div>
      </div>
    </div>
  );
}