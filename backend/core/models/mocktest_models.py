from django.db import models
from .user_models import User

class MockTest(models.Model):
    mock_test_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    jlpt_level = models.CharField(max_length=5)
    description = models.TextField(blank=True, null=True)
    duration_minutes = models.IntegerField(default=60)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'mock_tests'

    def __str__(self):
        return self.title


class MockTestAttempt(models.Model):
    mock_test_attempt_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mock_test = models.ForeignKey(MockTest, on_delete=models.CASCADE)
    jlpt_level = models.CharField(max_length=5)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    score = models.FloatField(default=0)
    status = models.CharField(max_length=20, default='in_progress')
    time_taken_seconds = models.IntegerField(default=0)
    responses = models.JSONField(default=dict)

    class Meta:
        db_table = 'mock_test_attempts'

    def __str__(self):
        return f"{self.user.full_name} - {self.mock_test.title}"
