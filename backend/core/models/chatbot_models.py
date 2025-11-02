from django.db import models
from .user_models import User

class ChatbotMessage(models.Model):
    chatbot_message_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    conversation_id = models.CharField(max_length=255)
    sender = models.CharField(max_length=20)  # 'user' | 'bot'
    message_text = models.TextField(blank=True, null=True)
    message_type = models.CharField(max_length=50, default='text')
    attachment_url = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chatbot_messages'

    def __str__(self):
        return f"{self.sender}: {self.message_text[:30]}"
