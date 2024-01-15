from .models import GameSession, GameSessionStatus, Player, PlayerTiming

import datetime
from typing import List, Dict


def save_players(gamesession: GameSession, players: List[str]):
    for index, player in enumerate(players):
        if index == 0:
            new_player = Player.objects.create(name=player, active=1)
        else:
            new_player = Player.objects.create(name=player)
        new_player.session.add(gamesession)


def save_player_timing(player_data: Dict, pk: str):
    current_player = Player.objects.get(id=player_data['player_id'])
    current_gamesession = GameSession.objects.get(id=int(pk))

    PlayerTiming.objects.create(
        player = current_player,
        game_session = current_gamesession,
        turn_duration=player_data['turn_duration']
        )


def get_players_stats(pk: str):
    current_gamesession = GameSession.objects.get(id=int(pk))
    session_players = Player.objects.filter(session=current_gamesession).order_by('id')
    
    players_data = []

    for player in session_players:
        last_moves = PlayerTiming.objects.filter(player=player, game_session=current_gamesession).order_by('turn_date')
        if not last_moves:
            continue
        moves_list = list(last_moves)
        last_move = moves_list[-1].turn_duration
        total_moves = sum(move.turn_duration for move in moves_list)
        last_move = str(datetime.timedelta(seconds=last_move))[2:]
        total_moves = str(datetime.timedelta(seconds=total_moves))

        players_data.append({
            str(player.id): {
                'last_move_duration': last_move,
                'total_moves_duration': total_moves,
            }
        })
    return players_data




def set_next_player(pk: str) -> str:
    current_gamesession = GameSession.objects.get(id=int(pk))
    session_players = Player.objects.filter(session=current_gamesession).order_by('id')
    for index, player in enumerate(session_players):
        if player.active:
            if index == len(session_players) - 1:
                session_players[0].active = 1
                session_players[0].save()
                next_player_id = session_players[0].id
            else:
                session_players[index + 1].active = 1
                session_players[index + 1].save()
                next_player_id = session_players[index + 1].id
            player.active = 0
            player.save()
            return str(next_player_id)
        

def finish_game(pk: str):
    status_finished = GameSessionStatus.objects.get(name='finished')
    session = GameSession.objects.get(id=pk)
    session.status_id = status_finished
    session.date_end = datetime.datetime.now()
    session.game_duration = session.date_end.timestamp() - session.date_start.timestamp()
    session.save()


def game_is_finished(pk: str):
    status_finished = GameSessionStatus.objects.get(name='finished')
    session = GameSession.objects.get(id=pk)
    if session.status_id == status_finished.id:
        return True
    return False


def get_gamesession_time_data(pk: str) -> Dict:
    gamesession = GameSession.objects.get(id=int(pk))
    session_data ={'game_duration': '00:00:00'}
    if gamesession.game_duration:
        session_data = {
            # 'game_started': gamesession.date_start.strftime("%y/%m/%d, %H:%M:%S"),
            # 'game_finished': gamesession.date_end.strftime("%y/%m/%d, %H:%M:%S"),
            'game_duration': str(datetime.timedelta(seconds=gamesession.game_duration)),
        }
    return session_data


def get_player_result(pk, player):

    timings = PlayerTiming.objects.filter(game_session=pk, player=player)
    data = {}
    moves = [time.turn_duration for time in timings]
    if moves:
        data['fastest'] = min(moves)
        data['slowest'] = max(moves)
        data['total'] = sum(moves)
        data['avg'] = round(data['total']/len(moves))
    else:
        data['fastest'] = 0
        data['slowest'] = 0
        data['total'] = 0
        data['avg'] = 0

    return data
