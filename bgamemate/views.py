from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from .forms import GameSessionForm, PlayerForm
from .services import save_players, save_player_timing, set_next_player, finish_game, game_is_finished, get_gamesession_time_data, get_players_stats
from .models import Player, PlayerTiming, GameSession
import datetime
import json

# Create your views here.
def index(request):
    return render(request, 'bgamemate/index.html')

def game_start(request):
    form = GameSessionForm()
    player_form = PlayerForm()
    if request.method == 'POST':
        print(request.POST)
        form = GameSessionForm(request.POST)
        if form.is_valid():
            gamesession = form.save()
            players = request.POST.getlist('name')
            save_players(gamesession, players)
            url_to_redirect = f'game-page/{gamesession}'
            return redirect(url_to_redirect)
        
    context = {'form': form, 'player_form': player_form}
    return render(request, 'bgamemate/start-game.html', context)



def game_page(request, pk):

    if request.method == 'POST':
        request_data = json.loads(request.body)
        print('Got new request:', request_data)
        
        # check if game must be marked as finished
        if 'finish_the_game' in request_data:
            finish_game(pk)
            response = {
                'redirect': f'/game-results/{pk}'
                }
        elif 'player_id' in request_data:
            save_player_timing(request_data, pk)
            next_player = set_next_player(pk)
            
            players_stats = get_players_stats(pk)

            # [{84: {'last_move_duration': 1, 'total_moves_duration': 9}}, {85: {'last_move_duration': 1, 'total_moves_duration': 8}}, {86: {'last_move_duration': 3, 'total_moves_duration': 10}}, {87: {'last_move_duration': 4, 'total_moves_duration': 11}}]
            
            response = {
                'next_player': next_player,
                }

            if players_stats:
                for stats in players_stats:
                    response.update(**stats)

        return JsonResponse(response)

    # check if game is finished
    if game_is_finished(pk):
        return redirect(f'/game-results/{pk}')

    db_players = Player.objects.filter(session=pk).order_by('id')
    players = []
    for player in db_players:
        player_in_game = {
            'id': player.id,
            'name': player.name,
            'active': player.active,
        }
        players.append(player_in_game)
    
    turn_duration = GameSession.objects.get(id=pk).turn_duration

    context = {
        'players': players,
        'duration': turn_duration,
    }
    return render(request, 'bgamemate/game-page.html', context)


def game_results(request, pk):

    db_players = Player.objects.filter(session=pk).order_by('id')
    players = []
    for player in db_players:
        player_in_game = {
            'id': player.id,
            'name': player.name,
            'active': player.active,
        }
        players.append(player_in_game)
    gamesession_time = get_gamesession_time_data(pk)
    context = {
        'players': players,
        **gamesession_time,
    }
    return render(request, 'bgamemate/game-results.html', context)