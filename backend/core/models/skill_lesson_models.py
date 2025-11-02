from django.db import models
from .user_models import User

class Skill(models.Model):
    skill_id = models.AutoField(primary_key=True)
    skill_name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.skill_name
    
class ListeningLesson(models.Model):
    listening_lesson_id = models.CharField(primary_key=True, max_length=50)
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True, null=True)
    audio_url = models.URLField(blank=True, null=True)
    jlpt_level = models.CharField(max_length=10)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"[Listening] {self.title}"

class ReadingLesson(models.Model):
    reading_lesson_id = models.CharField(primary_key=True, max_length=50)
    title = models.CharField(max_length=255)
    passage = models.TextField()
    jlpt_level = models.CharField(max_length=10)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"[Reading] {self.title}"

class VocabLesson(models.Model):
    vocab_lesson_id = models.CharField(primary_key=True, max_length=50)
    title = models.CharField(max_length=255)
    jlpt_level = models.CharField(max_length=10)
    description = models.TextField(blank=True, null=True)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"[Vocabulary] {self.title}"

class GrammarLesson(models.Model):
    grammar_lesson_id = models.CharField(primary_key=True, max_length=50)
    title = models.CharField(max_length=255)
    explanation = models.TextField()
    jlpt_level = models.CharField(max_length=10)
    example_sentence = models.TextField(blank=True, null=True)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"[Grammar] {self.title}"
