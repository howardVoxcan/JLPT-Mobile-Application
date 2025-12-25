from django.db import models
from django.conf import settings

class JlptLevel(models.TextChoices):
    N5 = "N5", "N5"
    N4 = "N4", "N4"
    N3 = "N3", "N3"
    N2 = "N2", "N2"
    N1 = "N1", "N1"

class Question(models.Model):
    prompt = models.TextField()

    audio = models.FileField(upload_to="audio/", null=True, blank=True)

    def __str__(self):
        return self.prompt[:50]

class Choice(models.Model):
    question = models.ForeignKey(
        Question,
        related_name="choices",
        on_delete=models.CASCADE
    )
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

