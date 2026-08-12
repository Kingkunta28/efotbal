import { api } from './api'

export const tournamentService = {
  list: (params?: Record<string, unknown>) => api.get('/tournaments/', { params }),
  detail: (slug: string) => api.get(`/tournaments/${slug}/`),
  create: (payload: Record<string, unknown>) => api.post('/tournaments/', payload),
  addPlayer: (tournamentId: number, payload: Record<string, unknown>) => api.post(`/tournaments/${tournamentId}/players/`, payload),
  groups: (tournamentId: number) => api.get(`/tournaments/${tournamentId}/groups/`),
  draw: (tournamentId: number) => api.post(`/tournaments/${tournamentId}/draw/`),
  fixtures: (tournamentId: number) => api.post(`/tournaments/${tournamentId}/fixtures/`),
  standings: (tournamentId: number) => api.get(`/tournaments/${tournamentId}/standings/`),
  bracket: (tournamentId: number) => api.post(`/tournaments/${tournamentId}/bracket/`),
}
