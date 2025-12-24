from rest_framework import serializers
from .models import DictionaryEntry


class DictionaryEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DictionaryEntry
        fields = [
            "id",
            "entry_type",
            "keyword",
            "reading",
            "meaning",
            "extra",
            "jlpt_level",
        ]
