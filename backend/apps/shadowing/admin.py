from django.contrib import admin
from .models import Voice, ShadowingSession


@admin.register(Voice)
class VoiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'display_name', 'gender', 'language', 'is_active', 'created_at']
    list_filter = ['gender', 'language', 'is_active']
    search_fields = ['name', 'display_name', 'description']
    list_editable = ['is_active']
    ordering = ['name']


@admin.register(ShadowingSession)
class ShadowingSessionAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'input_type', 'voice', 'speed', 'pitch', 'created_at']
    list_filter = ['input_type', 'voice', 'created_at']
    search_fields = ['user__email', 'text_input']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('User Info', {
            'fields': ('user',)
        }),
        ('Input', {
            'fields': ('input_type', 'text_input', 'image')
        }),
        ('TTS Settings', {
            'fields': ('voice', 'speed', 'pitch')
        }),
        ('Generated Audio', {
            'fields': ('audio_file', 'audio_duration')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
