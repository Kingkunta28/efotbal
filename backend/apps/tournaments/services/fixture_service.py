from django.db import transaction
from apps.matches.models import Match
from apps.tournaments.models import TournamentGroup
from django.core.exceptions import ValidationError


def build_group_matches(players):
    pairs = []
    for i in range(len(players)):
        for j in range(i + 1, len(players)):
            pairs.append((players[i], players[j]))
    return pairs


class FixtureService:
    def __init__(self, tournament):
        self.tournament = tournament

    def validate(self):
        if self.tournament.status not in ['GROUP_STAGE', 'KNOCKOUT']:
            raise ValidationError('The tournament is not in a state to generate fixtures.')
        return True

    @transaction.atomic
    def generate_group_fixtures(self):
        self.validate()
        matches_created = []
        for group in self.tournament.groups.all().prefetch_related('players__player'):
            players = [entry.player for entry in group.players.order_by('seed', 'joined_at')]
            matchups = build_group_matches(players)
            for idx, (home, away) in enumerate(matchups, start=1):
                match = Match.objects.create(
                    tournament=self.tournament,
                    group=group,
                    home_player=home,
                    away_player=away,
                    match_number=idx,
                    round_name='Group',
                    status='SCHEDULED',
                )
                matches_created.append(match)
        return matches_created
