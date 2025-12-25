from django.db import models
from apps.accounts.models import User


class Voice(models.Model):
    """Giọng đọc cho text-to-speech"""
    GENDER_CHOICES = [
        ('male', 'Nam'),
        ('female', 'Nữ'),
    ]
    
    name = models.CharField(max_length=50, unique=True, help_text="Tên giọng đọc (VD: あおい)")
    display_name = models.CharField(max_length=100, help_text="Tên hiển thị")
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    language = models.CharField(max_length=10, default='ja', help_text="Mã ngôn ngữ")
    description = models.TextField(blank=True, help_text="Mô tả về giọng đọc")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Voice"
        verbose_name_plural = "Voices"

    def __str__(self):
        return f"{self.name} ({self.get_gender_display()})"


class ShadowingSession(models.Model):
    """Session luyện phát âm của user"""
    INPUT_TYPE_CHOICES = [
        ('text', 'Text'),
        ('image', 'Image'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shadowing_sessions')
    input_type = models.CharField(max_length=10, choices=INPUT_TYPE_CHOICES, default='text')
    text_input = models.TextField(blank=True, help_text="Văn bản để chuyển thành giọng nói")
    image = models.ImageField(upload_to='shadowing/images/', blank=True, null=True, help_text="Hình ảnh để OCR")
    
    # TTS Settings
    voice = models.ForeignKey(Voice, on_delete=models.SET_NULL, null=True, related_name='sessions')
    speed = models.FloatField(default=1.0, help_text="Tốc độ đọc (0.5 - 2.0)")
    pitch = models.IntegerField(default=0, help_text="Cao thấp giọng nói (-10 đến +10)")
    
    # Generated Audio
    audio_file = models.FileField(upload_to='shadowing/audio/', blank=True, null=True, help_text="File âm thanh được tạo")
    audio_duration = models.CharField(max_length=10, blank=True, help_text="Độ dài audio (mm:ss)")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Shadowing Session"
        verbose_name_plural = "Shadowing Sessions"

    def __str__(self):
        return f"{self.user.email} - {self.input_type} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

    @property
    def character_count(self):
        """Đếm số ký tự của text_input"""
        return len(self.text_input) if self.text_input else 0
