import { api } from './api'

export const matchService = {
  list: (tournamentId: number) => api.get(`/tournaments/${tournamentId}/matches/`),
  submitResult: (matchId: number, payload: { home_score: number; away_score: number }) => api.post(`/matches/${matchId}/result/`, payload),
}
