from rest_framework import generics, permissions, response, status
from django.shortcuts import get_object_or_404
from .models import Match
from .serializers import MatchSerializer, ResultSerializer


class TournamentMatchesListView(generics.ListAPIView):
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tournament_id = self.kwargs['pk']
        return Match.objects.filter(tournament_id=tournament_id).select_related('home_player', 'away_player', 'winner')

    def list(self, request, *args, **kwargs):
        response_data = super().list(request, *args, **kwargs)
        return response.Response({'success': True, 'message': 'Matches retrieved successfully', 'data': response_data.data})


class SubmitMatchResultView(generics.GenericAPIView):
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        match = get_object_or_404(Match, pk=kwargs['pk'])
        if match.status == 'COMPLETED':
            return response.Response({'success': False, 'message': 'Match result has already been submitted', 'errors': {}}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        match.home_score = serializer.validated_data['home_score']
        match.away_score = serializer.validated_data['away_score']
        if match.home_score > match.away_score:
            match.winner = match.home_player
        elif match.away_score > match.home_score:
            match.winner = match.away_player
        else:
            match.winner = None
        match.status = 'COMPLETED'
        match.submitted_by = request.user
        match.save()
        return response.Response({'success': True, 'message': 'Match result submitted successfully', 'data': MatchSerializer(match).data})
