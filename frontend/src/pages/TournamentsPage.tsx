import { useState } from 'react'
import { useTournamentList } from '../hooks/useTournament'
import { Link } from 'react-router-dom'

export default function TournamentsPage() {
  const tournamentsQuery = useTournamentList()
  const [filter, setFilter] = useState('ALL')

  const tournaments = tournamentsQuery.data?.data ?? []
  const filtered = tournaments.filter((tournament: any) => {
    if (filter === 'ALL') return true
    return tournament.status === filter
  })

  return (
    <main className="min-h-screen bg-transparent text-slate-100">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Tournament library</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">All tournaments</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {['ALL', 'GROUP_STAGE', 'COMPLETED', 'DRAFT'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === status ? 'bg-cyan-500 text-slate-950' : 'border border-slate-800 text-slate-300 hover:border-cyan-400'}`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {tournamentsQuery.isLoading ? (
            <div className="rounded-3xl border border-white/10 bg-slate-950/30 bg-clip-padding backdrop-blur-xl p-8 text-center text-slate-400">Loading tournaments…</div>
          ) : tournamentsQuery.isError ? (
            <div className="rounded-3xl border border-rose-500 bg-rose-500/10 p-8 text-center text-rose-200">Failed to load tournaments.</div>
          ) : !filtered.length ? (
            <div className="rounded-3xl border border-white/10 bg-slate-950/30 bg-clip-padding backdrop-blur-xl p-8 text-center text-slate-400">No tournaments match this filter.</div>
          ) : (
            filtered.map((tournament: any) => (
              <Link
                key={tournament.id}
                to={`/tournaments/${tournament.slug}`}
                className="block rounded-3xl border border-white/10 bg-slate-950/35 bg-clip-padding backdrop-blur-xl p-6 transition hover:border-cyan-400"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xl font-semibold text-white">{tournament.name}</p>
                    <p className="mt-2 text-sm text-slate-400">{tournament.description || 'No description provided.'}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                    <span>{tournament.max_players} players</span>
                    <span>{tournament.number_of_groups} groups</span>
                    <span>{tournament.organizer}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">{tournament.status.replace('_', ' ')}</span>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">{tournament.draw_mode}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
