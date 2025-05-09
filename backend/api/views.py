from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, CustomRecipeSerializer, FavoriteRecipeSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import CustomRecipe, FavoriteRecipe

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

class CustomRecipeDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CustomRecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return CustomRecipe.objects.filter(user=user)


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

class FavoriteRecipeDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FavoriteRecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return FavoriteRecipe.objects.filter(user=user)

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

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]