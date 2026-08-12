from django.contrib import admin
from .models import Tournament, TournamentPlayer, TournamentGroup


@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'status', 'organizer', 'start_date', 'end_date')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'slug', 'description')
    list_filter = ('status', 'tournament_type', 'draw_mode')


@admin.register(TournamentPlayer)
class TournamentPlayerAdmin(admin.ModelAdmin):
    list_display = ('tournament', 'player', 'seed', 'group', 'registration_status')
    search_fields = ('player__username', 'tournament__name')
    list_filter = ('registration_status',)


@admin.register(TournamentGroup)
class TournamentGroupAdmin(admin.ModelAdmin):
    list_display = ('tournament', 'name', 'group_number', 'max_players')
    search_fields = ('tournament__name', 'name')
