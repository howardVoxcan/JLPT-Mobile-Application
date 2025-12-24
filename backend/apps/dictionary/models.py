from django.db import models


class DictionaryEntry(models.Model):
    ENTRY_TYPE_CHOICES = [
        ("vocab", "Vocabulary"),
        ("kanji", "Kanji"),
        ("grammar", "Grammar"),
        ("sentence", "Sentence"),
    ]

    entry_type = models.CharField(
        max_length=10,
        choices=ENTRY_TYPE_CHOICES
    )

    keyword = models.CharField(
        max_length=255,
        db_index=True,
        help_text="Từ khóa tìm kiếm (kanji / kana / câu)"
    )

    reading = models.CharField(
        max_length=255,
        blank=True,
        help_text="Cách đọc (hiragana / katakana)"
    )

    meaning = models.TextField(
        help_text="Nghĩa tiếng Việt"
    )

    extra = models.TextField(
        blank=True,
        help_text="Ví dụ / cấu trúc / on-kun..."
    )

    jlpt_level = models.CharField(
        max_length=2,
        blank=True,
        help_text="N5–N1 (optional)"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.entry_type}] {self.keyword}"
