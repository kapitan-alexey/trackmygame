from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("start-game", views.game_start, name="start-game"),
    path("game-page/<str:pk>/", views.game_page, name="game-page"),
    path("game-results/<str:pk>/", views.game_results, name="game-page"),
]