from django.db import models
from django.utils import timezone
from django.conf import settings


class PlayerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='player_profile')
    display_name = models.CharField(max_length=150)
    efootball_id = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=32, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    preferred_team = models.CharField(max_length=150, blank=True, null=True)
    rating = models.PositiveIntegerField(default=1200)
    avatar = models.URLField(blank=True, null=True)
    wins = models.PositiveIntegerField(default=0)
    draws = models.PositiveIntegerField(default=0)
    losses = models.PositiveIntegerField(default=0)
    goals_for = models.PositiveIntegerField(default=0)
    goals_against = models.PositiveIntegerField(default=0)
    tournaments_played = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Player Profile'
        verbose_name_plural = 'Player Profiles'

    def __str__(self):
        return self.display_name or self.user.username
