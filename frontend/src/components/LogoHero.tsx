import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

export function LogoHero() {
  const shouldReduceMotion = useReducedMotion()
  const animationProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.55, ease: 'easeOut' },
      }

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-slate-100">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/background.jpeg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-slate-950/70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_45%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          className="relative flex w-full flex-col items-center gap-10 overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/10 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.28)] backdrop-blur-[24px]"
          {...animationProps}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex flex-col items-center gap-8 text-center">
            <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-slate-950/35 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:h-52 sm:w-52">
              <motion.img
                className="logo-circle"
                src="/logo.jpg"
                alt="eFootball logo"
                {...(shouldReduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, scale: 0.96 },
                      animate: { opacity: 1, scale: 1 },
                      transition: { duration: 0.6, ease: 'easeOut', delay: 0.1 },
                    })}
              />
            </div>
            <div className="max-w-3xl space-y-5 px-2 sm:px-0">
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">eFootball tournament platform</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Run your eFootball tournament. Without the chaos.
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Organize groups, fixtures, standings, and knockout brackets in a premium esports experience built for competitive organizers.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/tournaments"
                className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                View tournaments
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-slate-950/90 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/25"
              >
                Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
