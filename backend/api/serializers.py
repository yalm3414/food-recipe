from django.contrib.auth.models import User
from rest_framework import serializers
from .models import CustomRecipe, FavoriteRecipe

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model =User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}


    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class CustomRecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomRecipe
        fields = ["id","user", "title", "ingredients", "instructions", "created_at"]
        extra_kwargs = {"user": {"read_only": True}}

class FavoriteRecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteRecipe
        fields = ['id', 'user', 'label', 'source', 'url', "uri", 'image', 'ingredients', 'favorited_at']
        extra_kwargs = {"user": {"read_only": True}}


