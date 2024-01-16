from django.forms import ModelForm, TextInput, NumberInput
from .models import GameSession, Player

class GameSessionForm(ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # self.fields['game'].label = "Игра"
        self.fields['turn_duration'].label = "Длительность хода (сек)"

    class Meta:
        model = GameSession
        fields = ['turn_duration']
        # fields = ['game', 'turn_duration']
        widgets = {
            # 'game': Select(attrs={'class': 'create-game-form game-form'}),
            'turn_duration': NumberInput(attrs={'class': 'create-game-form duration-form'}),
        }


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
        # widgets = {
        #     'name': TextInput(attrs={'placeholder': 'Введите имя игрока', 'style': 'color: #2ea44f'}),
        # }