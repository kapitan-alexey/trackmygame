from django.db import models

# Create your models here.

class Games(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Games"


class GameSessionStatus(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Game Session Statuses"


class Player(models.Model):
    name = models.CharField(max_length=30)
    session = models.ManyToManyField('GameSession')
    active = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Players"


class GameSession(models.Model):
    game = models.ForeignKey(Games, on_delete=models.CASCADE)
    date_start = models.DateTimeField(auto_now_add=True)
    date_end = models.DateTimeField(blank=True, null=True)
    status = models.ForeignKey(GameSessionStatus, on_delete=models.CASCADE, default=3)
    game_duration = models.IntegerField(blank=True, null=True)
    turn_duration = models.IntegerField()
    winner = models.ForeignKey(Player, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return str(self.id)
    
    class Meta:
        verbose_name_plural = "Game Sessions"


class PlayerTiming(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    game_session = models.ForeignKey(GameSession, on_delete=models.CASCADE)
    turn_duration = models.IntegerField()
    turn_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return str(self.id)
    
    class Meta:
        verbose_name_plural = "Player Timings"


class GameResults(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    game_session = models.ForeignKey(GameSession, on_delete=models.CASCADE)
    total_duration = models.IntegerField()
    avg_duration = models.IntegerField()
    slowest_duration = models.IntegerField()
    fastest_duration = models.IntegerField()

    def __str__(self):
        return str(self.id)
    
    class Meta:
        verbose_name_plural = "Game Results"
