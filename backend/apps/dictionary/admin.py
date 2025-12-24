from django.contrib import admin
from .models import DictionaryEntry


@admin.register(DictionaryEntry)
class DictionaryEntryAdmin(admin.ModelAdmin):
    list_display = ("keyword", "entry_type", "jlpt_level")
    list_filter = ("entry_type", "jlpt_level")
    search_fields = ("keyword", "reading", "meaning")
