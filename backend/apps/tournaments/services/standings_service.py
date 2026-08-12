from collections import defaultdict
from apps.matches.models import Match


class StandingsService:
    def __init__(self, tournament):
        self.tournament = tournament

    def calculate(self):
        standings = defaultdict(lambda: {
            'played': 0,
            'wins': 0,
            'draws': 0,
            'losses': 0,
            'goals_for': 0,
            'goals_against': 0,
            'goal_difference': 0,
            'points': 0,
        })

        matches = Match.objects.filter(tournament=self.tournament, status='COMPLETED')
        for match in matches:
            home = match.home_player_id
            away = match.away_player_id
            standings[home]['player_name'] = match.home_player.username
            standings[away]['player_name'] = match.away_player.username
            standings[home]['played'] += 1
            standings[away]['played'] += 1
            standings[home]['goals_for'] += match.home_score or 0
            standings[home]['goals_against'] += match.away_score or 0
            standings[away]['goals_for'] += match.away_score or 0
            standings[away]['goals_against'] += match.home_score or 0

            if match.home_score > match.away_score:
                standings[home]['wins'] += 1
                standings[away]['losses'] += 1
                standings[home]['points'] += 3
            elif match.home_score < match.away_score:
                standings[away]['wins'] += 1
                standings[home]['losses'] += 1
                standings[away]['points'] += 3
            else:
                standings[home]['draws'] += 1
                standings[away]['draws'] += 1
                standings[home]['points'] += 1
                standings[away]['points'] += 1

        for player_id, row in standings.items():
            row['goal_difference'] = row['goals_for'] - row['goals_against']

        ordered = sorted(
            standings.items(),
            key=lambda item: (
                -item[1]['points'],
                -item[1]['goal_difference'],
                -item[1]['goals_for'],
            ),
        )

        return [
            {
                'player_id': player_id,
                'player_name': row.get('player_name'),
                'played': row['played'],
                'wins': row['wins'],
                'draws': row['draws'],
                'losses': row['losses'],
                'goals_for': row['goals_for'],
                'goals_against': row['goals_against'],
                'goal_difference': row['goal_difference'],
                'points': row['points'],
            }
            for player_id, row in ordered
        ]
