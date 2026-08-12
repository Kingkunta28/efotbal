import secrets
from django.db import transaction
from apps.tournaments.models import Tournament, TournamentPlayer, TournamentGroup
from apps.audit.models import AuditLog
from django.core.exceptions import ValidationError


class DrawService:
    def __init__(self, tournament: Tournament):
        self.tournament = tournament

    def validate(self):
        if self.tournament.draw_locked:
            raise ValidationError('Tournament draw is already locked.')
        if self.tournament.status not in ['REGISTRATION', 'DRAWING']:
            raise ValidationError('Tournament is not in a state that allows a draw.')
        players = list(self.tournament.registrations.select_related('player'))
        if len(players) < self.tournament.players_per_group:
            raise ValidationError('Not enough players to perform a draw.')
        if len(players) > self.tournament.max_players:
            raise ValidationError('Tournament has exceeded maximum player capacity.')
        if self.tournament.number_of_groups <= 0:
            raise ValidationError('Number of groups must be configured.')
        total_capacity = self.tournament.number_of_groups * self.tournament.players_per_group
        if len(players) > total_capacity:
            raise ValidationError('There are more registered players than tournament capacity.')
        return players

    def generate_seed(self):
        return secrets.token_urlsafe(16)

    def distribute_players(self, players):
        players_list = players[:]
        if self.tournament.draw_mode == 'SEEDED':
            seeded = [p for p in players_list if p.seed is not None]
            unseeded = [p for p in players_list if p.seed is None]
            seeded.sort(key=lambda item: item.seed)
            players_list = seeded + unseeded
        elif self.tournament.draw_mode == 'BALANCED':
            players_list.sort(key=lambda item: getattr(item.player, 'player_profile', None).rating if getattr(item.player, 'player_profile', None) else 1200, reverse=True)
        else:
            secrets.SystemRandom().shuffle(players_list)

        group_sizes = self._calculate_group_sizes(len(players_list))
        groups = list(self.tournament.groups.order_by('group_number'))
        if not groups or len(groups) != self.tournament.number_of_groups:
            self._ensure_groups()
            groups = list(self.tournament.groups.order_by('group_number'))

        assignment = []
        index = 0
        for group_index, size in enumerate(group_sizes):
            group = groups[group_index]
            for _ in range(size):
                assignment.append((group, players_list[index]))
                index += 1
        return assignment

    def _calculate_group_sizes(self, player_count):
        base_size = player_count // self.tournament.number_of_groups
        remainder = player_count % self.tournament.number_of_groups
        sizes = [base_size + (1 if i < remainder else 0) for i in range(self.tournament.number_of_groups)]
        return sizes

    def _ensure_groups(self):
        for idx in range(self.tournament.number_of_groups):
            group_name = f'GROUP {chr(65 + idx)}'
            TournamentGroup.objects.get_or_create(
                tournament=self.tournament,
                group_number=idx + 1,
                defaults={'name': group_name, 'max_players': self.tournament.players_per_group},
            )

    @transaction.atomic
    def execute(self):
        players = self.validate()
        seed = self.generate_seed()
        self.tournament.randomization_seed = seed
        self.tournament.status = 'DRAWING'
        self.tournament.save(update_fields=['randomization_seed', 'status'])

        assignment = self.distribute_players(players)
        for group, entry in assignment:
            entry.group = group
            entry.save(update_fields=['group'])

        self.tournament.draw_locked = True
        self.tournament.status = 'GROUP_STAGE'
        self.tournament.save(update_fields=['draw_locked', 'status'])

        AuditLog.objects.create(
            user=self.tournament.organizer,
            action='DRAW_COMPLETED',
            object_type='Tournament',
            object_id=str(self.tournament.id),
            metadata={'seed': seed, 'draw_mode': self.tournament.draw_mode},
        )
        return assignment
