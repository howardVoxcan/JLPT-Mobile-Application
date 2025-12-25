from django.contrib import admin
from .models import KanjiUnit, KanjiLesson, Kanji, KanjiVocabulary, KanjiProgress, KanjiFavorite


class KanjiLessonInline(admin.TabularInline):
    model = KanjiLesson
    extra = 1
    fields = ('lesson_number', 'lesson_name', 'order')


@admin.register(KanjiUnit)
class KanjiUnitAdmin(admin.ModelAdmin):
    list_display = ('unit_name', 'level', 'unit_number', 'order')
    list_filter = ('level',)
    search_fields = ('unit_name', 'description')
    ordering = ('level', 'order')
    inlines = [KanjiLessonInline]


class KanjiInline(admin.TabularInline):
    model = Kanji
    extra = 1
    fields = ('kanji', 'vietnamese', 'stroke_count', 'order')


@admin.register(KanjiLesson)
class KanjiLessonAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'unit', 'lesson_number', 'lesson_name')
    list_filter = ('unit__level', 'unit')
    search_fields = ('lesson_name',)
    ordering = ('unit', 'order')
    inlines = [KanjiInline]


class KanjiVocabularyInline(admin.TabularInline):
    model = KanjiVocabulary
    extra = 1
    fields = ('kanji_word', 'hiragana', 'reading', 'meaning', 'order')


@admin.register(Kanji)
class KanjiAdmin(admin.ModelAdmin):
    list_display = ('kanji', 'vietnamese', 'stroke_count', 'lesson', 'get_level')
    list_filter = ('lesson__unit__level', 'lesson__unit')
    search_fields = ('kanji', 'vietnamese', 'meaning')
    ordering = ('lesson', 'order')
    inlines = [KanjiVocabularyInline]
    
    def get_level(self, obj):
        return obj.lesson.unit.level
    get_level.short_description = 'Level'
    get_level.admin_order_field = 'lesson__unit__level'


@admin.register(KanjiVocabulary)
class KanjiVocabularyAdmin(admin.ModelAdmin):
    list_display = ('kanji_word', 'hiragana', 'reading', 'meaning', 'kanji')
    list_filter = ('kanji__lesson__unit__level',)
    search_fields = ('kanji_word', 'hiragana', 'meaning')


@admin.register(KanjiProgress)
class KanjiProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'kanji', 'is_learned', 'is_mastered', 'review_count', 'last_reviewed_at')
    list_filter = ('is_learned', 'is_mastered', 'kanji__lesson__unit__level')
    search_fields = ('user__email', 'kanji__kanji')
    readonly_fields = ('last_reviewed_at',)


@admin.register(KanjiFavorite)
class KanjiFavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'kanji', 'created_at')
    list_filter = ('kanji__lesson__unit__level', 'created_at')
    search_fields = ('user__email', 'kanji__kanji')
    readonly_fields = ('created_at',)
