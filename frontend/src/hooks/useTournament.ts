import { useQuery } from '@tanstack/react-query'
import { tournamentService } from '../services/tournamentService'

export function useTournamentList() {
  return useQuery(['tournaments'], () => tournamentService.list())
}

export function useTournamentDetail(slug: string) {
  return useQuery(['tournament', slug], () => tournamentService.detail(slug), {
    enabled: Boolean(slug),
  })
}
