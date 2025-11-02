from django.db import models
from .user_models import User
from .lexical_models import Word

class FlashcardSet(models.Model):
    flashcard_set_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='flashcard_sets')
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Flashcard(models.Model):
    flashcard_id = models.AutoField(primary_key=True)
    flashcard_set = models.ForeignKey(FlashcardSet, on_delete=models.CASCADE, related_name='flashcards')
    word = models.ForeignKey(Word, on_delete=models.SET_NULL, null=True, related_name='flashcards')
    created_at = models.DateTimeField(auto_now_add=True)
