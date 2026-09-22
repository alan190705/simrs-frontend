import { FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// ============================================================
// BACKGROUND (foto rumah sakit, auto-slide)
// Ganti dengan foto kamu sendiri di public/images/
// ============================================================
const BACKGROUNDS = [
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1920&q=80',
];

const SLIDE_INTERVAL = 5000;

export function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const [mounted, setMounted] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Preload gambar + trigger animasi
  useEffect(() => {
    BACKGROUNDS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    setMounted(true);
  }, []);

  // Auto-slide background
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
    <div className="relative min-h-screen w-full overflow-hidden bg-brand-900">
      {/* ================= BACKGROUND LAYER ================= */}
      {BACKGROUNDS.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out"
          style={{
            backgroundImage: `url(${src})`,
            opacity: index === currentBg ? 1 : 0,
            transform: index === currentBg ? 'scale(1.05)' : 'scale(1)',
            transitionProperty: 'opacity, transform',
          }}
        />
      ))}

      {/* Overlay gelap tipis (bukan terlalu pekat, biar foto tetap kelihatan) */}
      <div className="absolute inset-0 bg-brand-900/40" />

      {/* ================= KONTEN ================= */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Logo */}
        <header className="p-6 lg:p-8">
          <div className="flex items-center gap-2.5 text-white">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-500 shadow-lg shadow-primary-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">SIMRS</span>
          </div>
        </header>

        {/* Main */}
        <main className="flex flex-1 items-center px-6 pb-6 lg:px-16">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Kiri: tagline */}
            <div
              className={`hidden text-white transition-all duration-700 lg:block ${
                mounted ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}
            >
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight drop-shadow-lg">
                Sistem Informasi
                <br />
                <span className="bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                  Manajemen Rumah Sakit
                </span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/80 drop-shadow">
                Kelola data pasien, jadwal dokter, rekam medis, dan operasional
                rumah sakit dalam satu platform terintegrasi.
              </p>

              {/* Feature bullets */}
              <ul className="mt-8 space-y-3 text-sm text-white/90">
                <li className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-primary-500/30 text-primary-300 backdrop-blur-sm">
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  Data pasien terpusat
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-primary-500/30 text-primary-300 backdrop-blur-sm">
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  Rekam medis elektronik
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-primary-500/30 text-primary-300 backdrop-blur-sm">
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  Laporan real-time
                </li>
              </ul>
            </div>

            {/* Kanan: card login TRANSPARAN */}
            <div className="flex justify-center lg:justify-end">
              <div
                className={`w-full max-w-md transition-all duration-700 ${
                  mounted
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-4 opacity-0'
                }`}
              >
                {/* ============ CARD TRANSPARAN GELAP ============ */}
                <div className="rounded-2xl border border-white/20 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                      Selamat datang kembali
                    </h2>
                    <p className="mt-1.5 text-sm text-white/70">
                      Masuk untuk melanjutkan ke dashboard
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div>
                      <label
                        htmlFor="identifier"
                        className="block text-sm font-medium text-white/90"
                      >
                        Username atau Email
                      </label>
                      <div className="relative mt-2">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </span>
                        <input
                          id="identifier"
                          type="text"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          required
                          autoFocus
                          autoComplete="username"
                          placeholder="Masukkan username atau email"
                          className="block w-full rounded-lg border border-white/20 bg-white/10 py-2.5 pl-10 pr-3 text-sm text-white placeholder-white/50 outline-none transition focus:border-primary-400 focus:bg-white/15 focus:ring-2 focus:ring-primary-500/30"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-white/90"
                        >
                          Password
                        </label>
                        <a
                          href="/forgot-password"
                          className="text-xs font-medium text-primary-300 hover:text-primary-200"
                        >
                          Lupa password?
                        </a>
                      </div>
                      <div className="relative mt-2">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </span>
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          autoComplete="current-password"
                          placeholder="Masukkan password"
                          className="block w-full rounded-lg border border-white/20 bg-white/10 py-2.5 pl-10 pr-10 text-sm text-white placeholder-white/50 outline-none transition focus:border-primary-400 focus:bg-white/15 focus:ring-2 focus:ring-primary-500/30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          tabIndex={-1}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/60 transition hover:text-white"
                          aria-label={
                            showPassword
                              ? 'Sembunyikan password'
                              : 'Tampilkan password'
                          }
                        >
                          {showPassword ? (
                            <svg
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div
                        role="alert"
                        className="flex items-start gap-2 rounded-lg border border-red-400/30 bg-red-500/20 px-3.5 py-2.5 text-sm text-red-200 backdrop-blur-sm animate-fadeIn"
                      >
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                          Memproses…
                        </>
                      ) : (
                        <>
                          Masuk
                          <svg
                            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>

                  <p className="mt-6 text-center text-xs text-white/40">
                    &copy; {new Date().getFullYear()} SIMRS · v1.0.0
                  </p>
                </div>

                {/* Info di bawah card */}
                <p className="mt-4 text-center text-xs text-white/60">
                  Hubungi admin jika Anda belum memiliki akun
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;