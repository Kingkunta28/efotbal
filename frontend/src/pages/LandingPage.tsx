import { ArrowRight, Sparkles, ShieldCheck, Trophy } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-transparent text-slate-100">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">eFootball tournament platform</p>
            <h2 className="mt-6 max-w-2xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Organize every stage of your tournament with precision.
            </h2>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Use a premium esports workflow to create groups, generate fixtures, manage standings, and deliver a polished tournament experience.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="/tournaments"
                className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                View tournaments
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
              >
                Login
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/35 bg-clip-padding backdrop-blur-xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-950/35 bg-clip-padding backdrop-blur-xl p-6">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Live draw preview</span>
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="mt-4 rounded-3xl bg-slate-950/30 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Next draw</p>
                  <p className="mt-3 text-2xl font-semibold text-white">GROUP C • 32 PLAYERS</p>
                  <p className="mt-2 text-sm text-slate-400">Random draw, groups, standings, knockout bracket.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-950/35 bg-clip-padding backdrop-blur-xl p-5">
                  <p className="text-sm text-slate-400">Tournament stages</p>
                  <p className="mt-3 text-xl font-semibold text-white">Draw • Groups • Fixtures</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/35 bg-clip-padding backdrop-blur-xl p-5">
                  <p className="text-sm text-slate-400">Status</p>
                  <p className="mt-3 text-xl font-semibold text-white">Fast, mobile-first, esports-ready</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <FeatureCard icon={Trophy} title="Knockout bracket" />
                <FeatureCard icon={ShieldCheck} title="Secure auth" />
                <FeatureCard icon={Sparkles} title="Pro standings" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

import type { LucideIcon } from 'lucide-react'

function FeatureCard({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/35 bg-clip-padding backdrop-blur-xl p-5 text-center text-slate-100 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-100">{title}</p>
    </div>
  )
}
