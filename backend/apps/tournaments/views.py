from rest_framework import generics, permissions, response, status
from django.shortcuts import get_object_or_404
from .models import Tournament, TournamentGroup, TournamentPlayer
from .serializers import TournamentSerializer, TournamentPlayerSerializer, TournamentGroupSerializer
from .services.draw_service import DrawService
from .services.fixture_service import FixtureService
from .services.standings_service import StandingsService
from .services.knockout_service import KnockoutService
from apps.accounts.permissions import IsAdminOrOrganizer


class TournamentListCreateView(generics.ListCreateAPIView):
    queryset = Tournament.objects.select_related('organizer').prefetch_related('groups')
    serializer_class = TournamentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    def list(self, request, *args, **kwargs):
        response_data = super().list(request, *args, **kwargs)
        return response.Response({'success': True, 'message': 'Tournaments retrieved successfully', 'data': response_data.data})

    def create(self, request, *args, **kwargs):
        response_data = super().create(request, *args, **kwargs)
        return response.Response({'success': True, 'message': 'Tournament created successfully', 'data': response_data.data}, status=status.HTTP_201_CREATED)


class TournamentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tournament.objects.select_related('organizer').prefetch_related('groups')
    serializer_class = TournamentSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        response_data = super().retrieve(request, *args, **kwargs)
        return response.Response({'success': True, 'message': 'Tournament retrieved successfully', 'data': response_data.data})

    def update(self, request, *args, **kwargs):
        response_data = super().update(request, *args, **kwargs)
        return response.Response({'success': True, 'message': 'Tournament updated successfully', 'data': response_data.data})

    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return response.Response({'success': True, 'message': 'Tournament deleted successfully', 'data': {}})


class TournamentPlayerCreateView(generics.CreateAPIView):
    serializer_class = TournamentPlayerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        tournament = get_object_or_404(Tournament, pk=kwargs['pk'])
        serializer = self.get_serializer(data={**request.data, 'tournament': tournament.id})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return response.Response({'success': True, 'message': 'Player added to tournament', 'data': serializer.data}, status=status.HTTP_201_CREATED)


class TournamentGroupListView(generics.ListAPIView):
    serializer_class = TournamentGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tournament = get_object_or_404(Tournament, pk=self.kwargs['pk'])
        return TournamentGroup.objects.filter(tournament=tournament).order_by('group_number')

    def list(self, request, *args, **kwargs):
        response_data = super().list(request, *args, **kwargs)
        return response.Response({'success': True, 'message': 'Groups retrieved successfully', 'data': response_data.data})


class TournamentDrawView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOrganizer]

    def post(self, request, *args, **kwargs):
        tournament = get_object_or_404(Tournament, pk=kwargs['pk'])
        self.check_object_permissions(request, tournament)
        service = DrawService(tournament)
        try:
            assignment = service.execute()
        except Exception as exc:
            return response.Response({'success': False, 'message': str(exc), 'errors': {}}, status=status.HTTP_400_BAD_REQUEST)
        return response.Response({'success': True, 'message': 'Draw completed successfully', 'data': [{'group': group.name, 'player': entry.player.username} for group, entry in assignment]})


class GroupStandingsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        tournament = get_object_or_404(Tournament, pk=kwargs['pk'])
        service = StandingsService(tournament)
        standings = service.calculate()
        return response.Response({'success': True, 'message': 'Standings calculated successfully', 'data': standings})


class TournamentFixtureView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOrganizer]

    def post(self, request, *args, **kwargs):
        tournament = get_object_or_404(Tournament, pk=kwargs['pk'])
        self.check_object_permissions(request, tournament)
        service = FixtureService(tournament)
        try:
            matches = service.generate_group_fixtures()
        except Exception as exc:
            return response.Response({'success': False, 'message': str(exc), 'errors': {}}, status=status.HTTP_400_BAD_REQUEST)
        return response.Response(
            {
                'success': True,
                'message': 'Group fixtures generated successfully',
                'data': [
                    {
                        'id': match.id,
                        'group': match.group.name if match.group else None,
                        'home': match.home_player.username,
                        'away': match.away_player.username,
                        'round': match.round_name,
                    }
                    for match in matches
                ],
            }
        )


class KnockoutBracketView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOrganizer]

    def post(self, request, *args, **kwargs):
        tournament = get_object_or_404(Tournament, pk=kwargs['pk'])
        self.check_object_permissions(request, tournament)
        service = KnockoutService(tournament)
        try:
            matches = service.generate_bracket()
        except Exception as exc:
            return response.Response({'success': False, 'message': str(exc), 'errors': {}}, status=status.HTTP_400_BAD_REQUEST)
        return response.Response({'success': True, 'message': 'Knockout bracket generated successfully', 'data': [{'id': match.id, 'home': match.home_player.username, 'away': match.away_player.username} for match in matches]})
