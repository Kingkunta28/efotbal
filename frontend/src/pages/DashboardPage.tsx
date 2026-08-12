import { useTournamentList } from '../hooks/useTournament'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const tournamentsQuery = useTournamentList()
  const { user, logout } = useAuth()

  return (
    <main className="min-h-screen bg-transparent text-slate-100">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Welcome back</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Tournament control center</h1>
            <p className="mt-2 text-slate-400">Manage events, players, fixtures, standings, and bracket progression.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-full border border-slate-800 bg-slate-900 px-5 py-3 text-sm text-slate-200">{user?.username}</div>
            <button
              onClick={logout}
              className="rounded-full border border-slate-800 bg-slate-900 px-5 py-3 text-sm text-slate-100 transition hover:border-slate-600"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Tournaments" value={tournamentsQuery.data?.data?.length ?? 0} />
          <StatCard label="Active" value={tournamentsQuery.data?.data?.filter((item: any) => item.status === 'GROUP_STAGE').length ?? 0} />
          <StatCard label="Completed" value={tournamentsQuery.data?.data?.filter((item: any) => item.status === 'COMPLETED').length ?? 0} />
          <StatCard label="Players" value="—" />
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950/35 bg-clip-padding backdrop-blur-xl p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent tournaments</h2>
              <p className="text-sm text-slate-400">A quick view of your latest eFootball competitions.</p>
            </div>
            <Link
              to="/tournaments"
              className="inline-flex items-center rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Browse tournaments
            </Link>
          </div>
          <div className="mt-6">
            {tournamentsQuery.isLoading ? (
              <div className="rounded-3xl border border-white/10 bg-slate-950/30 bg-clip-padding backdrop-blur-xl p-8 text-center text-slate-400">Loading tournaments…</div>
            ) : tournamentsQuery.isError ? (
              <div className="rounded-3xl border border-rose-500 bg-rose-500/10 p-8 text-center text-rose-200">Unable to load tournaments.</div>
            ) : !tournamentsQuery.data?.data?.length ? (
              <div className="rounded-3xl border border-white/10 bg-slate-950/30 bg-clip-padding backdrop-blur-xl p-8 text-center text-slate-400">No tournaments found. Create one to get started.</div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {tournamentsQuery.data.data.slice(0, 3).map((tournament: any) => (
                  <Link
                    key={tournament.id}
                    to={`/tournaments/${tournament.slug}`}
                    className="rounded-3xl border border-white/10 bg-slate-950/35 bg-clip-padding backdrop-blur-xl p-5 transition hover:border-cyan-400"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-base font-semibold text-white">{tournament.name}</p>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-400">{tournament.status.replace('_', ' ')}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">{tournament.description || 'No description provided.'}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/35 bg-clip-padding backdrop-blur-xl p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
    </div>
  )
}
