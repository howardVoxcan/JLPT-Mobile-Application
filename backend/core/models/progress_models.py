from django.db import models
from .user_models import User
from .skill_lesson_models import Skill, ListeningLesson, ReadingLesson, GrammarLesson, VocabLesson

class UserSkillProgress(models.Model):
    user_skill_progress_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    jlpt_level = models.CharField(max_length=5)
    completion_percent = models.FloatField(default=0)
    average_score = models.FloatField(default=0)
    current_level = models.CharField(max_length=5, blank=True, null=True)
    last_activity = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_skill_progress'
        unique_together = ('user', 'skill', 'jlpt_level')

    def __str__(self):
        return f"{self.user.full_name} - {self.skill.skill_name} ({self.jlpt_level})"


class UserLessonProgress(models.Model):
    user_lesson_progress_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listening_lesson = models.ForeignKey(ListeningLesson, on_delete=models.CASCADE, null=True, blank=True)
    reading_lesson = models.ForeignKey(ReadingLesson, on_delete=models.CASCADE, null=True, blank=True)
    grammar_lesson = models.ForeignKey(GrammarLesson, on_delete=models.CASCADE, null=True, blank=True)
    vocab_lesson = models.ForeignKey(VocabLesson, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=20, default='in_progress')
    completion_percent = models.FloatField(default=0)
    score = models.FloatField(default=0)
    last_accessed = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_lesson_progress'

    def __str__(self):
        return f"{self.user.full_name} - Progress {self.status}"


class JLPTProgress(models.Model):
    jlpt_progress_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    jlpt_level = models.CharField(max_length=5)
    total_tests_taken = models.IntegerField(default=0)
    average_score = models.FloatField(default=0)
    best_score = models.FloatField(default=0)
    last_test_date = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'jlpt_progress'
        unique_together = ('user', 'jlpt_level')

    def __str__(self):
        return f"{self.user.full_name} - {self.jlpt_level}"
