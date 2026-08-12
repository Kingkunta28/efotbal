from django.db import transaction
from apps.tournaments.models import Tournament, TournamentGroup
from apps.matches.models import Match
from apps.audit.models import AuditLog
from django.core.exceptions import ValidationError


def build_knockout_pairs(qualifiers):
    return [(qualifiers[i], qualifiers[-i - 1]) for i in range(len(qualifiers) // 2)]


class KnockoutService:
    def __init__(self, tournament: Tournament):
        self.tournament = tournament

    def validate(self):
        if self.tournament.status != 'GROUP_STAGE':
            raise ValidationError('Knockout generation requires group stage completion.')
        qualifiers = self.tournament.registrations.filter(group__isnull=False)
        if qualifiers.count() < self.tournament.qualification_count:
            raise ValidationError('Insufficient qualifiers to generate knockout bracket.')
        return qualifiers

    @transaction.atomic
    def generate_bracket(self):
        qualifiers = self.validate()
        standings = sorted(qualifiers, key=lambda entry: (-entry.seed if entry.seed is not None else 0, entry.joined_at))
        qualifiers_ordered = [entry.player for entry in standings][:self.tournament.qualification_count]
        pairs = build_knockout_pairs(qualifiers_ordered)
        matches = []
        for idx, (home, away) in enumerate(pairs, start=1):
            match = Match.objects.create(
                tournament=self.tournament,
                home_player=home,
                away_player=away,
                match_number=idx,
                round_name='Round of 16',
                status='SCHEDULED',
            )
            matches.append(match)
        self.tournament.status = 'KNOCKOUT'
        self.tournament.save(update_fields=['status'])
        AuditLog.objects.create(
            user=self.tournament.organizer,
            action='KNOCKOUT_GENERATED',
            object_type='Tournament',
            object_id=str(self.tournament.id),
            metadata={'qualifiers': [player.id for player in qualifiers_ordered]},
        )
        return matches
