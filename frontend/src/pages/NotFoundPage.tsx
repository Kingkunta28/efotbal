import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-transparent text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
        <div className="rounded-3xl border border-white/10 bg-slate-950/35 bg-clip-padding backdrop-blur-xl p-10 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Page not found</p>
          <h1 className="mt-4 text-5xl font-semibold text-white">404</h1>
          <p className="mt-4 text-base text-slate-400">We couldn't find the page you were looking for.</p>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Return home
          </Link>
        </div>
      </section>
    </main>
  )
}
