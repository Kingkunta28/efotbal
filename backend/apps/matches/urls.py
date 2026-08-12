from django.urls import path
from .views import TournamentMatchesListView, SubmitMatchResultView

urlpatterns = [
    path('tournaments/<int:pk>/matches/', TournamentMatchesListView.as_view(), name='tournament-matches'),
    path('matches/<int:pk>/result/', SubmitMatchResultView.as_view(), name='match-result-submit'),
]
