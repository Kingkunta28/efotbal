from rest_framework import serializers
from django.shortcuts import get_object_or_404
from .models import Tournament, TournamentPlayer, TournamentGroup
from django.contrib.auth import get_user_model

User = get_user_model()


class TournamentGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentGroup
        fields = ['id', 'name', 'group_number', 'max_players', 'created_at']


class TournamentSerializer(serializers.ModelSerializer):
    organizer = serializers.StringRelatedField(read_only=True)
    groups = TournamentGroupSerializer(many=True, read_only=True)

    class Meta:
        model = Tournament
        fields = [
            'id', 'name', 'slug', 'description', 'organizer', 'tournament_type',
            'status', 'max_players', 'number_of_groups', 'players_per_group',
            'qualification_count', 'start_date', 'end_date', 'logo', 'rules',
            'draw_mode', 'randomization_seed', 'draw_locked', 'created_at',
            'updated_at', 'groups',
        ]
        read_only_fields = ['id', 'organizer', 'randomization_seed', 'draw_locked', 'created_at', 'updated_at']

    def create(self, validated_data):
        request = self.context['request']
        validated_data['organizer'] = request.user
        return super().create(validated_data)


class TournamentPlayerSerializer(serializers.ModelSerializer):
    player = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role='PLAYER'))

    class Meta:
        model = TournamentPlayer
        fields = ['id', 'tournament', 'player', 'seed', 'group', 'registration_status', 'joined_at']
        read_only_fields = ['id', 'joined_at']

    def validate(self, attrs):
        tournament = attrs.get('tournament')
        player = attrs.get('player')
        if TournamentPlayer.objects.filter(tournament=tournament, player=player).exists():
            raise serializers.ValidationError('Player is already registered in this tournament.')
        if tournament.registrations.count() >= tournament.max_players:
            raise serializers.ValidationError('Tournament has reached maximum player capacity.')
        if tournament.status not in ['DRAFT', 'REGISTRATION']:
            raise serializers.ValidationError('Cannot register players once the tournament is locked or active.')
        return attrs
