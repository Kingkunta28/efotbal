from django.urls import path
from .views import (
    TournamentListCreateView,
    TournamentDetailView,
    TournamentPlayerCreateView,
    TournamentGroupListView,
    TournamentDrawView,
    TournamentFixtureView,
    GroupStandingsView,
    KnockoutBracketView,
)

urlpatterns = [
    path('tournaments/', TournamentListCreateView.as_view(), name='tournament-list-create'),
    path('tournaments/<slug:slug>/', TournamentDetailView.as_view(), name='tournament-detail'),
    path('tournaments/<int:pk>/players/', TournamentPlayerCreateView.as_view(), name='tournament-player-add'),
    path('tournaments/<int:pk>/groups/', TournamentGroupListView.as_view(), name='tournament-groups'),
    path('tournaments/<int:pk>/draw/', TournamentDrawView.as_view(), name='tournament-draw'),
    path('tournaments/<int:pk>/fixtures/', TournamentFixtureView.as_view(), name='tournament-fixtures'),
    path('tournaments/<int:pk>/standings/', GroupStandingsView.as_view(), name='tournament-standings'),
    path('tournaments/<int:pk>/bracket/', KnockoutBracketView.as_view(), name='tournament-bracket'),
]
