from rest_framework import serializers
from .models import Match
from django.contrib.auth import get_user_model

User = get_user_model()


class MatchSerializer(serializers.ModelSerializer):
    home_player = serializers.StringRelatedField(read_only=True)
    away_player = serializers.StringRelatedField(read_only=True)
    winner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Match
        fields = [
            'id', 'tournament', 'group', 'home_player', 'away_player', 'match_number',
            'round_name', 'status', 'scheduled_time', 'home_score', 'away_score',
            'winner', 'submitted_by', 'verified_by', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'tournament', 'group', 'home_player', 'away_player', 'match_number', 'round_name', 'winner', 'submitted_by', 'verified_by', 'created_at', 'updated_at']


class ResultSerializer(serializers.Serializer):
    home_score = serializers.IntegerField(min_value=0)
    away_score = serializers.IntegerField(min_value=0)
