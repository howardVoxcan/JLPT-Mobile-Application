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

class UserQuestionProgress(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    question = models.ForeignKey(
        "study.Question",
        on_delete=models.CASCADE
    )

    is_correct = models.BooleanField(default=False)
    answered_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "question")

    def __str__(self):
        return f"{self.user_id} - Q{self.question_id}"
