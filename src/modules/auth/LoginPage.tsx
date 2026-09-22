import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

// ============================================================
// KONFIGURASI BACKGROUND
// Ganti dengan gambar rumah sakit kamu sendiri.
// Taruh di: simrs-frontend/public/images/
// ============================================================
const BACKGROUNDS = [
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1920&q=80',
];

const SLIDE_INTERVAL = 6000; // 6 detik

// ============================================================
// KOMPONEN
// ============================================================
export function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Preload gambar supaya tidak "pop-in" saat ganti
  useEffect(() => {
    BACKGROUNDS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % BACKGROUNDS.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(identifier, password);
      const from =
        (location.state as { from?: Location })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Login gagal. Periksa username/email dan password.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* ================= BACKGROUND LAYER ================= */}
      {BACKGROUNDS.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${src})`,
            opacity: index === currentBg ? 1 : 0,
          }}
        />
      ))}

      {/* Overlay gelap */}
      <div className="absolute inset-0 bg-slate-900/60" />

      {/* ================= KONTEN ================= */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* --- Header / Logo --- */}
        <header className="p-6 lg:p-8">
          <div className="flex items-center gap-2 text-white">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-white/15">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>
            <span className="text-lg font-semibold tracking-wide">SIMRS</span>
          </div>
        </header>

        {/* --- Area utama: tagline kiri + form kanan --- */}
        <main className="flex flex-1 items-center px-6 pb-6 lg:px-16">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Kiri: tagline (tersembunyi di mobile) */}
            <div className="hidden text-white lg:block">
              <h1 className="text-5xl font-bold leading-tight tracking-tight">
                Sistem Informasi
                <br />
                Manajemen Rumah Sakit
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/80">
                Kelola data pasien, jadwal dokter, rekam medis, dan operasional
                rumah sakit dalam satu platform terintegrasi.
              </p>
            </div>

            {/* Kanan: card login */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-sm rounded-xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Masuk ke akun Anda
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-500">
                    Silakan masukkan kredensial Anda
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Identifier */}
                  <div>
                    <label
                      htmlFor="identifier"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Username atau Email
                    </label>
                    <input
                      id="identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      autoFocus
                      autoComplete="username"
                      placeholder="Masukkan username atau email"
                      className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Password
                      </label>
                      <a
                        href="/forgot-password"
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        Lupa password?
                      </a>
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      placeholder="Masukkan password"
                      className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div
                      role="alert"
                      className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
                    >
                      {error}
                    </div>
                  )}

                  {/* Tombol submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Memproses…' : 'Masuk'}
                  </button>
                </form>

                <p className="mt-6 text-center text-xs text-slate-400">
                  &copy; {new Date().getFullYear()} SIMRS
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* --- Indikator slide --- */}
        <div className="flex justify-center gap-2 pb-6">
          {BACKGROUNDS.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Gambar ${index + 1}`}
              onClick={() => setCurrentBg(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentBg
                  ? 'w-8 bg-white'
                  : 'w-3 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;