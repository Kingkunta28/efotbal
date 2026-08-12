import { useParams } from 'react-router-dom'
import { useTournamentDetail } from '../hooks/useTournament'

export default function TournamentDetailsPage() {
  const { slug } = useParams()
  const tournamentQuery = useTournamentDetail(slug ?? '')

  return (
    <main className="min-h-screen bg-transparent text-slate-100">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {tournamentQuery.isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-slate-950/30 bg-clip-padding backdrop-blur-xl p-12 text-center text-slate-400">Loading tournament details…</div>
        ) : tournamentQuery.isError ? (
          <div className="rounded-3xl border border-rose-500 bg-rose-500/10 p-12 text-center text-rose-200">Unable to load tournament.</div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-slate-950/35 bg-clip-padding backdrop-blur-xl p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Tournament</p>
                <h1 className="mt-3 text-4xl font-semibold text-white">{tournamentQuery.data?.data?.name}</h1>
                <p className="mt-3 max-w-2xl text-slate-400">{tournamentQuery.data?.data?.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">{tournamentQuery.data?.data?.status.replace('_', ' ')}</span>
                <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">{tournamentQuery.data?.data?.tournament_type.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Players" value={tournamentQuery.data?.data?.max_players ?? 0} />
              <Stat label="Groups" value={tournamentQuery.data?.data?.number_of_groups ?? 0} />
              <Stat label="Qualification" value={tournamentQuery.data?.data?.qualification_count ?? 0} />
              <Stat label="Draw mode" value={tournamentQuery.data?.data?.draw_mode} />
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/35 bg-clip-padding backdrop-blur-xl p-5">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value ?? '—'}</p>
    </div>
  )
}
