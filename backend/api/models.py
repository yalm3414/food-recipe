from django.db import models
from django.contrib.auth.models import User

class CustomRecipe(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="custom_recipes")
    title = models.CharField(max_length=255)
    ingredients = models.TextField()
    instructions = models.TextField()
    # add image upload
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.user.username}"

class FavoriteRecipe(models.Model):
    # All of this is from Edamam API

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorite_recipes")
    label = models.CharField(max_length=255)
    source = models.CharField(max_length=255)   
    url = models.CharField(max_length=255)       
    uri = models.CharField(max_length=255)                       
    image = models.CharField(max_length=2500)   
    ingredients = models.JSONField(blank=True, null=True)  
    favorited_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} favorited by {self.user.username}"

