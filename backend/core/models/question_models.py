from django.db import models
from .skill_lesson_models import ListeningLesson, ReadingLesson, GrammarLesson
from .mocktest_models import MockTest

class Question(models.Model):
    question_id = models.AutoField(primary_key=True)
    listening_lesson = models.ForeignKey(ListeningLesson, on_delete=models.CASCADE, null=True, blank=True)
    reading_lesson = models.ForeignKey(ReadingLesson, on_delete=models.CASCADE, null=True, blank=True)
    grammar_lesson = models.ForeignKey(GrammarLesson, on_delete=models.CASCADE, null=True, blank=True)
    mock_test = models.ForeignKey(MockTest, on_delete=models.CASCADE, null=True, blank=True)
    section_title = models.CharField(max_length=255, blank=True, null=True)
    order_index = models.IntegerField(default=0)
    question_type = models.CharField(max_length=50)
    question_text = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=10)
    points = models.FloatField(default=1)
    media_url = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'questions'

    def __str__(self):
        return f"Q{self.question_id}: {self.question_text[:30]}"
