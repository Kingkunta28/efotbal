from django.db import models
from django.utils import timezone
from django.conf import settings


def tournament_logo_upload_path(instance, filename):
    return f'tournaments/{instance.slug}/{filename}'


class Tournament(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('REGISTRATION', 'Registration'),
        ('DRAWING', 'Drawing'),
        ('GROUP_STAGE', 'Group Stage'),
        ('KNOCKOUT', 'Knockout'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    TYPE_CHOICES = [
        ('GROUP_STAGE', 'Group Stage'),
        ('KNOCKOUT', 'Knockout'),
        ('GROUP_AND_KNOCKOUT', 'Group and Knockout'),
    ]

    DRAW_MODE_CHOICES = [
        ('RANDOM', 'Random'),
        ('SEEDED', 'Seeded'),
        ('BALANCED', 'Balanced'),
    ]

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organized_tournaments')
    tournament_type = models.CharField(max_length=32, choices=TYPE_CHOICES, default='GROUP_AND_KNOCKOUT')
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='DRAFT')
    max_players = models.PositiveIntegerField(default=32)
    number_of_groups = models.PositiveIntegerField(default=8)
    players_per_group = models.PositiveIntegerField(default=4)
    qualification_count = models.PositiveIntegerField(default=16)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    logo = models.URLField(blank=True, null=True)
    rules = models.TextField(blank=True)
    draw_mode = models.CharField(max_length=20, choices=DRAW_MODE_CHOICES, default='RANDOM')
    randomization_seed = models.CharField(max_length=255, blank=True, null=True)
    draw_locked = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class TournamentPlayer(models.Model):
    REGISTRATION_STATUS_CHOICES = [
        ('REGISTERED', 'Registered'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
    ]

    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='registrations')
    player = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tournament_entries')
    seed = models.PositiveIntegerField(blank=True, null=True)
    group = models.ForeignKey('TournamentGroup', on_delete=models.SET_NULL, blank=True, null=True, related_name='players')
    registration_status = models.CharField(max_length=20, choices=REGISTRATION_STATUS_CHOICES, default='REGISTERED')
    joined_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = [('tournament', 'player')]
        ordering = ['tournament', 'seed', 'joined_at']

    def __str__(self):
        return f'{self.player} in {self.tournament}'


class TournamentGroup(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='groups')
    name = models.CharField(max_length=50)
    group_number = models.PositiveIntegerField()
    max_players = models.PositiveIntegerField(default=4)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = [('tournament', 'group_number'), ('tournament', 'name')]
        ordering = ['group_number']

    def __str__(self):
        return f'{self.tournament.name} - {self.name}'
