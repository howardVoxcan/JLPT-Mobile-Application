from django.contrib import admin
from .models import (
    VocabularyLesson,
    VocabularyWord,
    VocabularyExample,
    VocabularyLessonProgress,
    VocabularyWordProgress,
    VocabularyFavorite,
)

class VocabularyExampleInline(admin.TabularInline):
    model = VocabularyExample
    extra = 1

@admin.register(VocabularyWord)
class VocabularyWordAdmin(admin.ModelAdmin):
    list_display = (
        "hiragana",
        "kanji",
        "vietnamese",
        "lesson",
        "order",
    )
    list_filter = ("lesson",)
    search_fields = ("hiragana", "kanji", "vietnamese")
    ordering = ("lesson", "order")
    inlines = [VocabularyExampleInline]

@admin.register(VocabularyLesson)
class VocabularyLessonAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "jlpt_level",
        "order",
        "word_count",
    )
    list_filter = ("jlpt_level",)
    ordering = ("jlpt_level", "order")

    def word_count(self, obj):
        return obj.words.count()

    word_count.short_description = "Số từ"

@admin.register(VocabularyLessonProgress)
class VocabularyLessonProgressAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "lesson",
        "completed_words",
        "is_completed",
        "last_studied_at",
    )
    list_filter = ("is_completed", "lesson")

@admin.register(VocabularyWordProgress)
class VocabularyWordProgressAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "word",
        "is_learned",
        "last_reviewed_at",
    )

@admin.register(VocabularyFavorite)
class VocabularyFavoriteAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "word",
        "created_at",
    )
