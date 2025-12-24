from django.db import models
from django.conf import settings
from apps.study.models import JlptLevel

# =========================
# READING LESSON (Bài đọc)
# =========================
class ReadingLesson(models.Model):
    level = models.CharField(
        max_length=2,
        choices=JlptLevel.choices
    )

    order = models.PositiveIntegerField(
        help_text="Thứ tự bài trong level (1, 2, 3...)"
    )

    title = models.CharField(
        max_length=255,
        help_text="Ví dụ: 第1部 - 文体"
    )

    preview = models.CharField(
        max_length=255,
        help_text="Preview hiển thị ở danh sách: 文体, 文体, 文体"
    )

    def __str__(self):
        return f"{self.level} - {self.title}"

    class Meta:
        ordering = ["level", "order"]
        unique_together = ("level", "order")


# =========================
# READING TEXT (Nội dung đọc)
# =========================
class ReadingText(models.Model):
    lesson = models.ForeignKey(
        ReadingLesson,
        related_name="readings",
        on_delete=models.CASCADE
    )

    content_japanese = models.TextField(
        help_text="Nội dung tiếng Nhật"
    )

    content_vietnamese = models.TextField(
        help_text="Bản dịch tiếng Việt"
    )

    order = models.PositiveIntegerField(
        help_text="Thứ tự đoạn đọc trong bài"
    )

    def __str__(self):
        return f"Lesson {self.lesson_id} - Reading {self.order}"

    class Meta:
        ordering = ["order"]
        unique_together = ("lesson", "order")


# =========================
# READING QUESTION (Câu hỏi)
# =========================
class ReadingQuestion(models.Model):
    lesson = models.ForeignKey(
        ReadingLesson,
        related_name="questions",
        on_delete=models.CASCADE
    )

    text = models.TextField(
        help_text="Nội dung câu hỏi đọc hiểu"
    )

    order = models.PositiveIntegerField(
        help_text="Thứ tự câu hỏi"
    )

    def __str__(self):
        return self.text[:50]

    class Meta:
        ordering = ["order"]
        unique_together = ("lesson", "order")


# =========================
# READING CHOICE (Đáp án)
# =========================
class ReadingChoice(models.Model):
    question = models.ForeignKey(
        ReadingQuestion,
        related_name="choices",
        on_delete=models.CASCADE
    )

    text = models.CharField(
        max_length=255,
        help_text="Nội dung đáp án"
    )

    is_correct = models.BooleanField(
        default=False
    )

    def __str__(self):
        return self.text


# =========================
# USER READING PROGRESS
# =========================
class ReadingProgress(models.Model):
    STATUS_CHOICES = [
        ("not-started", "Not started"),
        ("in-progress", "In progress"),
        ("completed", "Completed"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    lesson = models.ForeignKey(
        ReadingLesson,
        on_delete=models.CASCADE
    )

    correct_count = models.PositiveIntegerField(
        default=0,
        help_text="Số câu trả lời đúng"
    )

    total_questions = models.PositiveIntegerField(
        help_text="Tổng số câu hỏi trong bài"
    )

    progress = models.PositiveIntegerField(
        default=0,
        help_text="Tiến độ % (0 - 100)"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="not-started"
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "lesson")

    def __str__(self):
        return f"{self.user_id} - Lesson {self.lesson_id} ({self.progress}%)"
