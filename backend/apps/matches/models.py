from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.conf import settings


def match_attachment_upload_path(instance, filename):
    return f'tournaments/{instance.tournament.slug}/matches/{instance.id}/{filename}'


class Match(models.Model):
    STATUS_CHOICES = [
        ('SCHEDULED', 'Scheduled'),
        ('LIVE', 'Live'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
        ('DISPUTED', 'Disputed'),
    ]

    tournament = models.ForeignKey('tournaments.Tournament', on_delete=models.CASCADE, related_name='matches')
    group = models.ForeignKey('tournaments.TournamentGroup', on_delete=models.SET_NULL, blank=True, null=True, related_name='matches')
    home_player = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='home_matches')
    away_player = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='away_matches')
    match_number = models.PositiveIntegerField()
    round_name = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')
    scheduled_time = models.DateTimeField(blank=True, null=True)
    home_score = models.PositiveIntegerField(blank=True, null=True)
    away_score = models.PositiveIntegerField(blank=True, null=True)
    winner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True, related_name='won_matches')
    submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True, related_name='submitted_match_results')
    verified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True, related_name='verified_match_results')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [('tournament', 'match_number')]
        ordering = ['tournament', 'round_name', 'match_number']

    def __str__(self):
        return f'{self.tournament.name} - {self.home_player} vs {self.away_player}'

    def clean(self):
        if self.home_player == self.away_player:
            raise ValidationError('Home and away players must be different')
