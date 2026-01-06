from rest_framework import viewsets
from .models import Team, Player
from .serializers import TeamSerializer, PlayerSerializer

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

from rest_framework import filters

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'team__team_name']
