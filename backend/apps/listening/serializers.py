# apps/listening/serializers.py
from rest_framework import serializers
from .models import (
    ListeningLesson, ListeningVocabulary, ListeningQuestion, ListeningChoice,
    ListeningProgress, ListeningAttempt, ListeningAttemptAnswer
)


class ListeningLessonListSerializer(serializers.ModelSerializer):
    # trả đúng FE cần: duration text -> FE tự format, backend trả seconds
    duration = serializers.IntegerField(source="duration_seconds", read_only=True)

    # progress fields map đúng FE
    status = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = ListeningLesson
        fields = [
            "id", "level", "order",
            "title", "description",
            "duration",  # seconds
            "status", "progress",
        ]

    def _get_progress_obj(self, obj):
        progress_map = self.context.get("progress_map") or {}
        return progress_map.get(obj.id)

    def get_status(self, obj):
        p = self._get_progress_obj(obj)
        return p.status if p else "not-started"

    def get_progress(self, obj):
        p = self._get_progress_obj(obj)
        return p.progress_percent if p else 0


class ListeningVocabularySerializer(serializers.ModelSerializer):
    class Meta:
        model = ListeningVocabulary
        fields = ["id", "word", "reading", "meaning", "order"]


class ListeningChoiceSerializer(serializers.ModelSerializer):
    # FE đang dùng optionNum 1..4 (theo index). Ta vẫn trả id thật để submit chính xác.
    class Meta:
        model = ListeningChoice
        fields = ["id", "text"]


class ListeningQuestionSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = ListeningQuestion
        fields = [
            "id",
            "question_number",
            "sentence",
            "underlined_word",
            "options",
            "image",
        ]

    def get_options(self, obj):
        return ListeningChoiceSerializer(obj.choices.all(), many=True).data

    def get_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url


class ListeningLessonDetailSerializer(serializers.ModelSerializer):
    audio_url = serializers.SerializerMethodField()
    vocabularies = ListeningVocabularySerializer(many=True, read_only=True)
    questions = ListeningQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = ListeningLesson
        fields = [
            "id", "level", "order",
            "title", "description",
            "duration_seconds",
            "audio_url",
            "script_jp", "script_vn",
            "vocabularies",
            "questions",
        ]

    def get_audio_url(self, obj):
        if not obj.audio_file:
            return None
        request = self.context.get("request")
        url = obj.audio_file.url
        return request.build_absolute_uri(url) if request else url


class SubmitAnswerItemSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    choice_id = serializers.IntegerField(allow_null=True, required=False)


class SubmitAttemptSerializer(serializers.Serializer):
    answers = SubmitAnswerItemSerializer(many=True)


class AttemptResultQuestionSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    is_correct = serializers.BooleanField()
    correct_choice_id = serializers.IntegerField()
    selected_choice_id = serializers.IntegerField(allow_null=True)
    explanation = serializers.CharField(allow_blank=True)


class SubmitResultSerializer(serializers.Serializer):
    score = serializers.IntegerField()
    total = serializers.IntegerField()
    status = serializers.CharField()
    progress_percent = serializers.IntegerField()
    detail = AttemptResultQuestionSerializer(many=True)
