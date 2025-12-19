from django.contrib import admin
from .models import Question, Choice


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 4   # mặc định tạo 4 đáp án cho mỗi câu hỏi


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "prompt")
    search_fields = ("prompt",)
    inlines = [ChoiceInline]


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = ("id", "question", "text", "is_correct")
    list_filter = ("is_correct",)
    search_fields = ("text", "question__prompt")
