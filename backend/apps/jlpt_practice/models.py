# apps/jlpt_practice/models.py
from django.conf import settings
from django.db import models


class JLPTTest(models.Model):
    """
    Đề thi JLPT (mỗi đề gồm nhiều sections: vocabulary, grammar, reading, listening)
    """
    LEVEL_CHOICES = [
        ('N5', 'N5'),
        ('N4', 'N4'),
        ('N3', 'N3'),
        ('N2', 'N2'),
        ('N1', 'N1'),
    ]
    
    level = models.CharField(max_length=2, choices=LEVEL_CHOICES, db_index=True)
    order = models.PositiveIntegerField(help_text="Thứ tự đề thi (Test 1, Test 2...)")
    title = models.CharField(max_length=255, help_text="Tên đề thi (ví dụ: Test 1)")
    description = models.TextField(blank=True, help_text="Mô tả về đề thi")
    duration_minutes = models.PositiveIntegerField(default=140, help_text="Thời gian làm bài (phút)")
    total_score = models.PositiveIntegerField(default=180, help_text="Tổng điểm tối đa")
    is_published = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['level', 'order']
        unique_together = ('level', 'order')
        verbose_name = "JLPT Test"
        verbose_name_plural = "JLPT Tests"
    
    def __str__(self):
        return f"{self.level} - {self.title}"


class JLPTSection(models.Model):
    """
    Phần thi trong đề JLPT (Từ vựng, Ngữ pháp, Đọc hiểu, Nghe hiểu)
    """
    SECTION_TYPE_CHOICES = [
        ('vocabulary', 'Vocabulary'),
        ('grammar', 'Grammar'),
        ('reading', 'Reading'),
        ('listening', 'Listening'),
    ]
    
    test = models.ForeignKey(JLPTTest, on_delete=models.CASCADE, related_name='sections')
    section_type = models.CharField(max_length=20, choices=SECTION_TYPE_CHOICES)
    title_jp = models.CharField(max_length=255, help_text="Tiêu đề tiếng Nhật (ví dụ: 文字・語彙)")
    title_vn = models.CharField(max_length=255, help_text="Tiêu đề tiếng Việt (ví dụ: Từ vựng)")
    order = models.PositiveIntegerField(help_text="Thứ tự section trong test")
    max_score = models.PositiveIntegerField(default=60, help_text="Điểm tối đa cho section này")
    
    class Meta:
        ordering = ['test', 'order']
        unique_together = ('test', 'section_type')
        verbose_name = "JLPT Section"
        verbose_name_plural = "JLPT Sections"
    
    def __str__(self):
        return f"{self.test} - {self.title_vn}"


class JLPTSubSection(models.Model):
    """
    Sub-category trong mỗi section (ví dụ: Cách đọc kanji, Cách đọc Hiragana...)
    """
    section = models.ForeignKey(JLPTSection, on_delete=models.CASCADE, related_name='subsections')
    name = models.CharField(max_length=255, help_text="Tên sub-category (ví dụ: Cách đọc kanji)")
    order = models.PositiveIntegerField(help_text="Thứ tự")
    
    class Meta:
        ordering = ['section', 'order']
        verbose_name = "JLPT SubSection"
        verbose_name_plural = "JLPT SubSections"
    
    def __str__(self):
        return f"{self.section} - {self.name}"


class JLPTQuestion(models.Model):
    """
    Câu hỏi trong đề thi JLPT
    """
    section = models.ForeignKey(JLPTSection, on_delete=models.CASCADE, related_name='questions')
    subsection = models.ForeignKey(JLPTSubSection, on_delete=models.SET_NULL, null=True, blank=True, related_name='questions')
    question_number = models.PositiveIntegerField(help_text="Số thứ tự câu hỏi (1, 2, 3...)")
    
    # Instruction cho nhóm câu hỏi (có thể null nếu không có)
    instruction = models.TextField(blank=True, help_text="Hướng dẫn cho câu hỏi (tiếng Nhật)")
    
    # Nội dung câu hỏi
    sentence = models.TextField(blank=True, help_text="Câu hỏi (câu văn tiếng Nhật)")
    underlined_word = models.CharField(max_length=255, blank=True, help_text="Từ được gạch chân")
    
    # Media
    image = models.ImageField(upload_to='jlpt_practice/images/', blank=True, null=True)
    audio_file = models.FileField(upload_to='jlpt_practice/audio/', blank=True, null=True)
    duration_seconds = models.PositiveIntegerField(blank=True, null=True, help_text="Độ dài audio (giây)")
    
    # Explanation
    explanation = models.TextField(blank=True, help_text="Giải thích đáp án")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['section', 'question_number']
        unique_together = ('section', 'question_number')
        verbose_name = "JLPT Question"
        verbose_name_plural = "JLPT Questions"
    
    def __str__(self):
        return f"{self.section.test} - Q{self.question_number}"


class JLPTChoice(models.Model):
    """
    Lựa chọn cho mỗi câu hỏi
    """
    question = models.ForeignKey(JLPTQuestion, on_delete=models.CASCADE, related_name='choices')
    text = models.CharField(max_length=255, help_text="Nội dung lựa chọn")
    order = models.PositiveIntegerField(help_text="Thứ tự (1, 2, 3, 4)")
    is_correct = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['question', 'order']
        verbose_name = "JLPT Choice"
        verbose_name_plural = "JLPT Choices"
    
    def __str__(self):
        return f"{self.question} - Choice {self.order}"


class JLPTAttempt(models.Model):
    """
    Lượt thi của user
    """
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('submitted', 'Submitted'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='jlpt_attempts')
    test = models.ForeignKey(JLPTTest, on_delete=models.CASCADE, related_name='attempts')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    score = models.PositiveIntegerField(default=0, help_text="Tổng điểm đạt được")
    total_score = models.PositiveIntegerField(default=180, help_text="Tổng điểm tối đa")
    
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-started_at']
        verbose_name = "JLPT Attempt"
        verbose_name_plural = "JLPT Attempts"
    
    def __str__(self):
        return f"{self.user.email} - {self.test} - {self.score}/{self.total_score}"


class JLPTAnswer(models.Model):
    """
    Câu trả lời của user cho từng câu hỏi
    """
    attempt = models.ForeignKey(JLPTAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(JLPTQuestion, on_delete=models.CASCADE)
    selected_choice = models.ForeignKey(JLPTChoice, on_delete=models.SET_NULL, null=True, blank=True)
    is_correct = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('attempt', 'question')
        verbose_name = "JLPT Answer"
        verbose_name_plural = "JLPT Answers"
    
    def __str__(self):
        return f"{self.attempt} - Q{self.question.question_number}"

