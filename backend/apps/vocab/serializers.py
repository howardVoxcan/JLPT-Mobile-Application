from rest_framework import serializers
from .models import (
    VocabularyLesson,
    VocabularyWord,
    VocabularyExample,
    VocabularyLessonProgress,
    VocabularyFavorite,
)

class VocabularyExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = VocabularyExample
        fields = [
            "sentence_jp",
            "sentence_vi",
        ]

class VocabularyWordSerializer(serializers.ModelSerializer):
    examples = VocabularyExampleSerializer(many=True, read_only=True)

    class Meta:
        model = VocabularyWord
        fields = [
            "id",
            "kanji",
            "hiragana",
            "vietnamese",
            "meaning",
            "audio",
            "examples",
            "order",
        ]

class VocabularyLessonListSerializer(serializers.ModelSerializer):
    wordCount = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = VocabularyLesson
        fields = [
            "id",
            "jlpt_level",
            "order",
            "title",
            "wordCount",
            "status",
            "progress",
        ]

    def get_wordCount(self, obj):
        return obj.words.count()

    def get_status(self, obj):
        user = self.context["request"].user
        progress = VocabularyLessonProgress.objects.filter(
            user=user,
            lesson=obj
        ).first()

        if not progress:
            return "not-started"

        if progress.is_completed:
            return "completed"

        return "in-progress"

    def get_progress(self, obj):
        user = self.context["request"].user
        progress = VocabularyLessonProgress.objects.filter(
            user=user,
            lesson=obj
        ).first()

        total = obj.words.count()

        if not progress or total == 0:
            return 0

        return round(progress.completed_words / total * 100)

class VocabularyLessonDetailSerializer(serializers.ModelSerializer):
    words = VocabularyWordSerializer(many=True, read_only=True)

    class Meta:
        model = VocabularyLesson
        fields = [
            "id",
            "jlpt_level",
            "title",
            "words",
        ]
