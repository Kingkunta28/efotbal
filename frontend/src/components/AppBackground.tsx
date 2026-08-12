import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function AppBackground() {
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-100">
      <video
        className="fixed inset-0 -z-50 h-full w-full object-cover"
        src="/background%20video.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <div className="fixed inset-0 -z-40 bg-slate-950/80" aria-hidden="true" />

      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-slate-950/30 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <img src="/logo.jpg" alt="eFootball logo" className="logo-circle" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">eFootball</p>
              <p className="text-xs text-slate-300">Tournament platform</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/" className="text-sm font-semibold text-slate-100 transition hover:text-white">
              Home
            </Link>
            <Link to="/tournaments" className="text-sm font-semibold text-slate-100 transition hover:text-white">
              Tournaments
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-sm font-semibold text-slate-100 transition hover:text-white">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100 md:inline-flex">
                  {user?.username}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-white/10 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <Link to="/login" className="text-sm font-semibold text-slate-100 transition hover:text-white">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full border border-white/10 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                >
                  Register
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 bg-slate-950/70 backdrop-blur-xl md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <Link
                to="/"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Home
              </Link>
              <Link
                to="/tournaments"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Tournaments
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-2xl border border-white/10 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-2xl border border-white/10 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <div className="relative z-10 pt-[90px]">
        <Outlet />
      </div>
    </div>
  )
}
