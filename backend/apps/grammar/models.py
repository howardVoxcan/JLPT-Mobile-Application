from django.db import models
from django.conf import settings
from apps.study.models import JlptLevel, Question


class GrammarLesson(models.Model):
    level = models.CharField(max_length=2, choices=JlptLevel.choices)
    order = models.PositiveIntegerField()
    title = models.CharField(max_length=255)

    grammar_point_count = models.PositiveIntegerField()
    content = models.TextField()

    questions = models.ManyToManyField(Question)

    class Meta:
        ordering = ["level", "order"]

    def __str__(self):
        return f"{self.level} - {self.title}"


class GrammarProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lesson = models.ForeignKey(GrammarLesson, on_delete=models.CASCADE)

    correct_count = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "lesson")
