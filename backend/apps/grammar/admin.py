from django.contrib import admin
from .models import GrammarLesson, GrammarProgress


@admin.register(GrammarLesson)
class GrammarLessonAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "level",
        "order",
        "title",
        "grammar_point_count",
    )
    list_filter = ("level",)
    ordering = ("level", "order")
    search_fields = ("title",)


@admin.register(GrammarProgress)
class GrammarProgressAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "lesson",
        "correct_count",
        "updated_at",
    )
    list_filter = ("lesson__level",)
