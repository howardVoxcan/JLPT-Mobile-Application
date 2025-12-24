from django.db import models
from django.conf import settings
from apps.study.models import JlptLevel

class VocabularyLesson(models.Model):
    """
    Bài học từ vựng (Unit + Lesson gộp làm một)
    VD:
    - JLPT N5 - Bài 1: Giới thiệu bản thân
    """

    jlpt_level = models.CharField(
        max_length=2,
        choices=JlptLevel.choices
    )

    order = models.PositiveIntegerField(
        help_text="Thứ tự bài trong level (1,2,3,...)"
    )

    title = models.CharField(
        max_length=200,
        help_text="VD: Bài 1: Giới thiệu bản thân"
    )

    description = models.TextField(
        blank=True
    )

    class Meta:
        ordering = ["jlpt_level", "order"]
        unique_together = ("jlpt_level", "order")

    def __str__(self):
        return f"{self.jlpt_level} - {self.title}"

class VocabularyWord(models.Model):
    lesson = models.ForeignKey(
        VocabularyLesson,
        on_delete=models.CASCADE,
        related_name="words"
    )

    kanji = models.CharField(
        max_length=50,
        blank=True
    )

    hiragana = models.CharField(
        max_length=100
    )

    vietnamese = models.CharField(
        max_length=100,
        help_text="Từ Hán–Việt / viết hoa trong UI"
    )

    meaning = models.TextField(
        help_text="Nghĩa tiếng Việt"
    )

    audio = models.FileField(
        upload_to="vocabulary/audio/",
        blank=True,
        null=True
    )

    order = models.PositiveIntegerField(
        help_text="Thứ tự hiển thị flashcard trong bài"
    )

    class Meta:
        ordering = ["order"]
        unique_together = ("lesson", "order")

    def __str__(self):
        return self.hiragana

class VocabularyExample(models.Model):
    word = models.ForeignKey(
        VocabularyWord,
        on_delete=models.CASCADE,
        related_name="examples"
    )

    sentence_jp = models.TextField()
    sentence_vi = models.TextField()

    def __str__(self):
        return self.sentence_jp

class VocabularyLessonProgress(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    lesson = models.ForeignKey(
        VocabularyLesson,
        on_delete=models.CASCADE
    )

    completed_words = models.PositiveIntegerField(
        default=0,
        help_text="Số từ đã học xong trong bài"
    )

    is_completed = models.BooleanField(
        default=False
    )

    last_studied_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        unique_together = ("user", "lesson")

class VocabularyWordProgress(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    word = models.ForeignKey(
        VocabularyWord,
        on_delete=models.CASCADE
    )

    is_learned = models.BooleanField(
        default=False
    )

    last_reviewed_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        unique_together = ("user", "word")

class VocabularyFavorite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    word = models.ForeignKey(
        VocabularyWord,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = ("user", "word")

