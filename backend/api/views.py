from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, CustomRecipeSerializer, FavoriteRecipeSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import CustomRecipe, FavoriteRecipe

#This view is for creating custom recipes and listing all custom recipes
class CustomRecipeListCreate(generics.ListCreateAPIView):
    serializer_class = CustomRecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return CustomRecipe.objects.filter(user=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

#This view is for retrieving, updating, and deleting specific recipes based off id
class CustomRecipeDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CustomRecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return CustomRecipe.objects.filter(user=user)

#This view is for listing all favorited recipes (Favorited from Edamam API)
class FavoriteRecipeListCreate(generics.ListCreateAPIView):
    serializer_class = FavoriteRecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return FavoriteRecipe.objects.filter(user=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

# This View is for adding favorited recipes to database  
# Also for retrieving and deleting specific favorited recipes off the favorite model

class FavoriteRecipeDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FavoriteRecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return FavoriteRecipe.objects.filter(user=user)

# This view searchs for favorite recipe by uri (edamam API ID)
# This is for when checking if a certain recipe is already favorited

class FavoriteRecipeByUriView(APIView):
    serializer_class = FavoriteRecipeSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        uri = request.GET.get('uri')
        if not uri:
            return Response({'error': 'Missing uri parameter'}, status=400)

        try:
            favorite = FavoriteRecipe.objects.get(user=request.user, uri=uri)
            serializer = FavoriteRecipeSerializer(favorite)
            return Response(serializer.data)
        except FavoriteRecipe.DoesNotExist:
            return Response({'error': 'Favorite not found'}, status=404)

# This is to create/register a user
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]