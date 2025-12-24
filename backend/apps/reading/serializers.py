from rest_framework import serializers
from .models import (
    ReadingLesson,
    ReadingText,
    ReadingQuestion,
    ReadingChoice,
    ReadingProgress
)


# =========================
# Reading Choice
# =========================
class ReadingChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingChoice
        fields = ["id", "text"]


# =========================
# Reading Question
# =========================
class ReadingQuestionSerializer(serializers.ModelSerializer):
    choices = ReadingChoiceSerializer(many=True)

    class Meta:
        model = ReadingQuestion
        fields = ["id", "text", "choices"]


# =========================
# Reading Text
# =========================
class ReadingTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingText
        fields = ["content_japanese", "content_vietnamese"]


# =========================
# Lesson Detail
# =========================
class ReadingLessonDetailSerializer(serializers.ModelSerializer):
    readings = ReadingTextSerializer(many=True)
    questions = ReadingQuestionSerializer(many=True)

    class Meta:
        model = ReadingLesson
        fields = ["id", "title", "readings", "questions"]


# =========================
# Lesson List (Level Screen)
# =========================
class ReadingLessonListSerializer(serializers.ModelSerializer):
    reading_count = serializers.SerializerMethodField()
    exercise_count = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = ReadingLesson
        fields = [
            "id",
            "title",
            "preview",
            "reading_count",
            "exercise_count",
            "status",
            "progress",
        ]

    def get_reading_count(self, obj):
        return obj.readings.count()

    def get_exercise_count(self, obj):
        return obj.questions.count()

    def get_status(self, obj):
        progress = self.context.get("progress_map", {}).get(obj.id)
        return progress.status if progress else "not-started"

    def get_progress(self, obj):
        progress = self.context.get("progress_map", {}).get(obj.id)
        return progress.progress if progress else 0
