from django.db import models


class KanjiUnit(models.Model):
    """
    Đơn vị học kanji (tuần hoặc bài)
    Ví dụ: 第1週, 第2週
    """
    LEVEL_CHOICES = [
        ('N5', 'N5'),
        ('N4', 'N4'),
        ('N3', 'N3'),
        ('N2', 'N2'),
        ('N1', 'N1'),
    ]
    
    level = models.CharField(
        max_length=2,
        choices=LEVEL_CHOICES,
        help_text="Cấp độ JLPT"
    )
    
    unit_number = models.PositiveIntegerField(
        help_text="Số thứ tự unit (1, 2, 3...)"
    )
    
    unit_name = models.CharField(
        max_length=100,
        help_text="Tên unit (第1週, 第2週...)"
    )
    
    description = models.TextField(
        blank=True,
        help_text="Mô tả nội dung unit"
    )
    
    order = models.PositiveIntegerField(
        default=0,
        help_text="Thứ tự sắp xếp"
    )
    
    class Meta:
        ordering = ['level', 'order', 'unit_number']
        unique_together = ['level', 'unit_number']
        verbose_name = "Kanji Unit"
        verbose_name_plural = "Kanji Units"
    
    def __str__(self):
        return f"{self.level} - {self.unit_name}"


class KanjiLesson(models.Model):
    """
    Bài học trong unit
    Ví dụ: (1) 駐車場, (2) 宿泊
    """
    unit = models.ForeignKey(
        KanjiUnit,
        on_delete=models.CASCADE,
        related_name='lessons'
    )
    
    lesson_number = models.PositiveIntegerField(
        help_text="Số thứ tự bài học trong unit (1, 2, 3...)"
    )
    
    lesson_name = models.CharField(
        max_length=100,
        blank=True,
        help_text="Tên bài học (駐車場, 宿泊...)"
    )
    
    order = models.PositiveIntegerField(
        default=0,
        help_text="Thứ tự sắp xếp"
    )
    
    class Meta:
        ordering = ['unit', 'order', 'lesson_number']
        unique_together = ['unit', 'lesson_number']
        verbose_name = "Kanji Lesson"
        verbose_name_plural = "Kanji Lessons"
    
    def __str__(self):
        return f"{self.unit.unit_name} - ({self.lesson_number}) {self.lesson_name}"


class Kanji(models.Model):
    """
    Chữ Kanji
    """
    lesson = models.ForeignKey(
        KanjiLesson,
        on_delete=models.CASCADE,
        related_name='kanjis'
    )
    
    kanji = models.CharField(
        max_length=1,
        db_index=True,
        help_text="Chữ kanji"
    )
    
    hiragana = models.CharField(
        max_length=50,
        blank=True,
        help_text="Đọc hiragana chính"
    )
    
    vietnamese = models.CharField(
        max_length=50,
        help_text="Đọc Hán Việt (VD: NHẬT, HỌC...)"
    )
    
    stroke_count = models.PositiveIntegerField(
        help_text="Số nét"
    )
    
    kunyomi = models.CharField(
        max_length=100,
        blank=True,
        help_text="Âm Kun (訓読み)"
    )
    
    onyomi = models.CharField(
        max_length=100,
        blank=True,
        help_text="Âm On (音読み)"
    )
    
    meaning = models.TextField(
        help_text="Nghĩa tiếng Việt"
    )
    
    order = models.PositiveIntegerField(
        default=0,
        help_text="Thứ tự trong bài học"
    )
    
    class Meta:
        ordering = ['lesson', 'order']
        verbose_name = "Kanji"
        verbose_name_plural = "Kanjis"
    
    def __str__(self):
        return f"{self.kanji} ({self.vietnamese})"


class KanjiVocabulary(models.Model):
    """
    Từ vựng ví dụ cho kanji
    """
    kanji = models.ForeignKey(
        Kanji,
        on_delete=models.CASCADE,
        related_name='vocabularies'
    )
    
    kanji_word = models.CharField(
        max_length=50,
        help_text="Từ vựng có kanji (駐車, 日本...)"
    )
    
    hiragana = models.CharField(
        max_length=50,
        help_text="Đọc hiragana (ちゅうしゃ)"
    )
    
    reading = models.CharField(
        max_length=50,
        help_text="Đọc Hán Việt (TRÚ XA)"
    )
    
    meaning = models.CharField(
        max_length=200,
        help_text="Nghĩa tiếng Việt"
    )
    
    example_sentence = models.TextField(
        blank=True,
        help_text="Câu ví dụ (tùy chọn)"
    )
    
    order = models.PositiveIntegerField(
        default=0,
        help_text="Thứ tự từ vựng"
    )
    
    class Meta:
        ordering = ['order']
        verbose_name = "Kanji Vocabulary"
        verbose_name_plural = "Kanji Vocabularies"
    
    def __str__(self):
        return f"{self.kanji_word} ({self.meaning})"


class KanjiProgress(models.Model):
    """
    Tiến độ học kanji của user
    """
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='kanji_progress'
    )
    
    kanji = models.ForeignKey(
        Kanji,
        on_delete=models.CASCADE
    )
    
    is_learned = models.BooleanField(
        default=False,
        help_text="Đã học xong"
    )
    
    is_mastered = models.BooleanField(
        default=False,
        help_text="Đã thành thạo"
    )
    
    review_count = models.PositiveIntegerField(
        default=0,
        help_text="Số lần ôn tập"
    )
    
    last_reviewed_at = models.DateTimeField(
        auto_now=True
    )
    
    class Meta:
        unique_together = ['user', 'kanji']
        verbose_name = "Kanji Progress"
        verbose_name_plural = "Kanji Progress"
    
    def __str__(self):
        return f"{self.user.email} - {self.kanji.kanji}"


class KanjiFavorite(models.Model):
    """
    Kanji yêu thích của user
    """
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='kanji_favorites'
    )
    
    kanji = models.ForeignKey(
        Kanji,
        on_delete=models.CASCADE
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'kanji']
        ordering = ['-created_at']
        verbose_name = "Kanji Favorite"
        verbose_name_plural = "Kanji Favorites"
    
    def __str__(self):
        return f"{self.user.email} ❤️ {self.kanji.kanji}"
