from django.forms import ModelForm
from .models import GameSession, Player

class GameSessionForm(ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['game'].label = "Игра"
        self.fields['turn_duration'].label = "Длительность хода"
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'create-game-form'

    class Meta:
        model = GameSession
        fields = ['game', 'turn_duration']

class PlayerForm(ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['name'].label = ""
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'player'
            visible.field.widget.attrs['placeholder'] = 'Введите имя игрока'

    class Meta:
        model= Player
        fields = ['name']