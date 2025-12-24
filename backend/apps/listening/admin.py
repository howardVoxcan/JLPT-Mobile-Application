# apps/listening/admin.py
from django.contrib import admin
from .models import (
    ListeningLesson, ListeningVocabulary, ListeningQuestion, ListeningChoice,
    ListeningProgress, ListeningAttempt, ListeningAttemptAnswer
)

class ListeningVocabularyInline(admin.TabularInline):
    model = ListeningVocabulary
    extra = 1

class ListeningChoiceInline(admin.TabularInline):
    model = ListeningChoice
    extra = 4

class ListeningQuestionInline(admin.StackedInline):
    model = ListeningQuestion
    extra = 1
    show_change_link = True

@admin.register(ListeningLesson)
class ListeningLessonAdmin(admin.ModelAdmin):
    list_display = ("id", "level", "order", "title", "duration_seconds", "is_published")
    list_filter = ("level", "is_published")
    search_fields = ("title", "description")
    inlines = [ListeningVocabularyInline, ListeningQuestionInline]

@admin.register(ListeningQuestion)
class ListeningQuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "lesson", "question_number", "underlined_word")
    list_filter = ("lesson__level",)
    inlines = [ListeningChoiceInline]

@admin.register(ListeningProgress)
class ListeningProgressAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "lesson", "status", "progress_percent", "correct_count", "total_questions", "updated_at")
    list_filter = ("status", "lesson__level")

@admin.register(ListeningAttempt)
class ListeningAttemptAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "lesson", "score", "total", "created_at")
    list_filter = ("lesson__level",)

@admin.register(ListeningAttemptAnswer)
class ListeningAttemptAnswerAdmin(admin.ModelAdmin):
    list_display = ("id", "attempt", "question", "selected_choice", "is_correct")
    list_filter = ("is_correct",)
