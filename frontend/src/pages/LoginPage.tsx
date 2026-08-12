import { FormEvent, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-transparent text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-slate-950/35 bg-clip-padding backdrop-blur-xl p-10 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Welcome back</p>
            <h1 className="mt-4 text-4xl font-semibold">Log in to manage tournaments</h1>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-slate-200" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-200" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                required
              />
            </div>
            {error && <div className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-full bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            New here?{' '}
            <Link to="/register" className="text-cyan-300 transition hover:text-cyan-200">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
