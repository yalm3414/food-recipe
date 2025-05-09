from django.urls import path
from . import views

urlpatterns = [
    path("custom-recipes/", views.CustomRecipeListCreate.as_view(), name="custom-recipe-list"),
    path("custom-recipes/details/<int:pk>/", views.CustomRecipeDelete.as_view(), name="delete-custom-recipe"),

    path("favorite-recipes/",views.FavoriteRecipeListCreate.as_view(), name="favorite-recipe-list"),
    path("favorite-recipes/<int:pk>/", views.FavoriteRecipeDelete.as_view(), name="favorite-recipe-delete"),
     path("favorite-recipes/by-uri/", views.FavoriteRecipeByUriView.as_view(), name="favorite-recipe-by-uri"),
]

