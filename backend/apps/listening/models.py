# apps/listening/models.py
from django.conf import settings
from django.db import models
from apps.study.models import JlptLevel

class ListeningLesson(models.Model):
    level = models.CharField(max_length=2, choices=JlptLevel.choices, default=JlptLevel.N5)
    order = models.PositiveIntegerField(help_text="Bài số mấy trong level")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    # Audio
    audio_file = models.FileField(upload_to="listening/audio/", blank=True, null=True)
    duration_seconds = models.PositiveIntegerField(default=0)

    # Script
    script_jp = models.TextField(blank=True)
    script_vn = models.TextField(blank=True)

    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["level", "order"]
        unique_together = ("level", "order")

    def __str__(self):
        return f"{self.level} - {self.order}. {self.title}"


class ListeningVocabulary(models.Model):
    lesson = models.ForeignKey(ListeningLesson, related_name="vocabularies", on_delete=models.CASCADE)
    word = models.CharField(max_length=100)
    reading = models.CharField(max_length=100, blank=True)
    meaning = models.CharField(max_length=255)

    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["lesson", "order", "id"]

    def __str__(self):
        return f"{self.word} ({self.lesson})"


class ListeningQuestion(models.Model):
    lesson = models.ForeignKey(ListeningLesson, related_name="questions", on_delete=models.CASCADE)

    # FE: questionNumber / sentence / underlinedWord / explanation / image
    question_number = models.PositiveIntegerField(default=1)
    sentence = models.TextField()
    underlined_word = models.CharField(max_length=100, blank=True)
    explanation = models.TextField(blank=True)

    image = models.ImageField(upload_to="listening/questions/", blank=True, null=True)

    class Meta:
        ordering = ["lesson", "question_number", "id"]
        unique_together = ("lesson", "question_number")

    def __str__(self):
        return f"Q{self.question_number} - {self.lesson}"


class ListeningChoice(models.Model):
    question = models.ForeignKey(ListeningQuestion, related_name="choices", on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"Choice({self.question_id})"


class ListeningProgress(models.Model):
    """
    Để render list như FE:
    - status: not-started / in-progress / completed
    - progress: %
    """
    STATUS_NOT_STARTED = "not-started"
    STATUS_IN_PROGRESS = "in-progress"
    STATUS_COMPLETED = "completed"

    STATUS_CHOICES = [
        (STATUS_NOT_STARTED, "Not started"),
        (STATUS_IN_PROGRESS, "In progress"),
        (STATUS_COMPLETED, "Completed"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lesson = models.ForeignKey(ListeningLesson, on_delete=models.CASCADE)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_NOT_STARTED)

    correct_count = models.PositiveIntegerField(default=0)
    total_questions = models.PositiveIntegerField(default=0)

    # Lưu % để list nhanh (có thể tính động cũng được)
    progress_percent = models.PositiveIntegerField(default=0)

    last_attempt_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "lesson")

    def __str__(self):
        return f"{self.user_id} - {self.lesson_id} - {self.status}"


class ListeningAttempt(models.Model):
    """
    Lưu lịch sử “nộp bài / xem kết quả” (optional nhưng rất nên có).
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lesson = models.ForeignKey(ListeningLesson, on_delete=models.CASCADE)

    score = models.PositiveIntegerField(default=0)
    total = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)


class ListeningAttemptAnswer(models.Model):
    attempt = models.ForeignKey(ListeningAttempt, related_name="answers", on_delete=models.CASCADE)
    question = models.ForeignKey(ListeningQuestion, on_delete=models.CASCADE)
    selected_choice = models.ForeignKey(ListeningChoice, on_delete=models.SET_NULL, null=True, blank=True)
    is_correct = models.BooleanField(default=False)
