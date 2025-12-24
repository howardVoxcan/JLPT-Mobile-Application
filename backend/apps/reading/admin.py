from django.contrib import admin
from .models import (
    ReadingLesson,
    ReadingText,
    ReadingQuestion,
    ReadingChoice,
    ReadingProgress
)


class ReadingTextInline(admin.TabularInline):
    model = ReadingText
    extra = 1


class ReadingQuestionInline(admin.TabularInline):
    model = ReadingQuestion
    extra = 1


@admin.register(ReadingLesson)
class ReadingLessonAdmin(admin.ModelAdmin):
    list_display = ("id", "level", "order", "title")
    list_filter = ("level",)
    inlines = [ReadingTextInline, ReadingQuestionInline]


@admin.register(ReadingChoice)
class ReadingChoiceAdmin(admin.ModelAdmin):
    list_display = ("id", "question", "text", "is_correct")
    list_filter = ("is_correct",)


@admin.register(ReadingProgress)
class ReadingProgressAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "lesson",
        "status",
        "progress",
        "correct_count",
        "total_questions",
        "updated_at"
    )
    list_filter = ("status",)
