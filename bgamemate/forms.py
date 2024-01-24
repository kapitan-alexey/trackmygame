from django.forms import ModelForm, TextInput, NumberInput, ChoiceField, Select
from django.utils.translation import gettext_lazy as _
from .models import GameSession, Player

class GameSessionForm(ModelForm):

    DURATION_CHOICES = [
    (15, '00:15'),
    (30, '00:30'),
    (45, '00:45'),
    (60, '01:00'),
    (90, '01:30'),
    (120, '02:00'),
    (150, '02:30'),
    (180, '03:00'),
    (300, '05:00'),
    ]
    turn_duration = ChoiceField(choices=DURATION_CHOICES, widget=Select(attrs={'class': 'duration-form create-game-form'}), initial='mm:ss')
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # self.fields['game'].label = "Игра"
        self.fields['turn_duration'].label = _("Длительность хода")

    class Meta:
        model = GameSession
        fields = ['turn_duration']
        # fields = ['game', 'turn_duration']
        widgets = {
            # 'game': Select(attrs={'class': 'create-game-form game-form'}),
            # 'turn_duration': NumberInput(attrs={'class': 'create-game-form duration-form'}),
        }


class PlayerForm(ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['name'].label = ""
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'player'
            visible.field.widget.attrs['placeholder'] = _('Введите имя игрока')

    class Meta:
        model= Player
        fields = ['name']
        # widgets = {
        #     'name': TextInput(attrs={'placeholder': 'Введите имя игрока', 'style': 'color: #2ea44f'}),
        # }