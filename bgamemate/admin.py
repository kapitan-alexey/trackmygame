from django.contrib import admin

from .models import GameSession, GameSessionStatus, Games, Player, PlayerTiming

# Register your models here.
admin.site.register(GameSession)
admin.site.register(GameSessionStatus)
admin.site.register(Games)
admin.site.register(Player)
admin.site.register(PlayerTiming)