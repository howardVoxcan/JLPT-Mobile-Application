# apps/jlpt_practice/admin.py
from django.contrib import admin
from .models import (
    JLPTTest,
    JLPTSection,
    JLPTSubSection,
    JLPTQuestion,
    JLPTChoice,
    JLPTAttempt,
    JLPTAnswer,
)


class JLPTChoiceInline(admin.TabularInline):
    model = JLPTChoice
    extra = 4
    fields = ('order', 'text', 'is_correct')


class JLPTQuestionInline(admin.TabularInline):
    model = JLPTQuestion
    extra = 0
    fields = ('question_number', 'sentence', 'underlined_word')
    show_change_link = True


class JLPTSubSectionInline(admin.TabularInline):
    model = JLPTSubSection
    extra = 0
    fields = ('name', 'order')


class JLPTSectionInline(admin.TabularInline):
    model = JLPTSection
    extra = 0
    fields = ('section_type', 'title_jp', 'title_vn', 'order', 'max_score')
    show_change_link = True


@admin.register(JLPTTest)
class JLPTTestAdmin(admin.ModelAdmin):
    list_display = ('title', 'level', 'order', 'duration_minutes', 'total_score', 'is_published', 'created_at')
    list_filter = ('level', 'is_published')
    search_fields = ('title', 'description')
    inlines = [JLPTSectionInline]
    ordering = ['level', 'order']


@admin.register(JLPTSection)
class JLPTSectionAdmin(admin.ModelAdmin):
    list_display = ('test', 'section_type', 'title_vn', 'order', 'max_score')
    list_filter = ('section_type', 'test__level')
    search_fields = ('title_jp', 'title_vn')
    inlines = [JLPTSubSectionInline, JLPTQuestionInline]
    ordering = ['test', 'order']


@admin.register(JLPTSubSection)
class JLPTSubSectionAdmin(admin.ModelAdmin):
    list_display = ('section', 'name', 'order')
    list_filter = ('section__section_type', 'section__test__level')
    search_fields = ('name',)


@admin.register(JLPTQuestion)
class JLPTQuestionAdmin(admin.ModelAdmin):
    list_display = ('section', 'question_number', 'sentence_preview', 'has_audio', 'has_image')
    list_filter = ('section__section_type', 'section__test__level')
    search_fields = ('sentence', 'instruction')
    inlines = [JLPTChoiceInline]
    ordering = ['section', 'question_number']
    
    def sentence_preview(self, obj):
        return obj.sentence[:50] + '...' if len(obj.sentence) > 50 else obj.sentence
    sentence_preview.short_description = 'Sentence'
    
    def has_audio(self, obj):
        return bool(obj.audio_file)
    has_audio.boolean = True
    has_audio.short_description = 'Audio'
    
    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = 'Image'


@admin.register(JLPTChoice)
class JLPTChoiceAdmin(admin.ModelAdmin):
    list_display = ('question', 'order', 'text', 'is_correct')
    list_filter = ('is_correct',)
    search_fields = ('text',)


@admin.register(JLPTAttempt)
class JLPTAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'test', 'status', 'score', 'total_score', 'started_at', 'submitted_at')
    list_filter = ('status', 'test__level')
    search_fields = ('user__email', 'user__full_name')
    readonly_fields = ('started_at', 'updated_at')
    ordering = ['-started_at']


@admin.register(JLPTAnswer)
class JLPTAnswerAdmin(admin.ModelAdmin):
    list_display = ('attempt', 'question', 'selected_choice', 'is_correct', 'created_at')
    list_filter = ('is_correct', 'attempt__test__level')
    search_fields = ('attempt__user__email',)
    ordering = ['-created_at']

