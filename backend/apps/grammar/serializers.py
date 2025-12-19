from .models import GrammarLesson, GrammarProgress
from apps.study.serializers import QuestionSerializer
from rest_framework import serializers

class GrammarLessonListSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()

    class Meta:
        model = GrammarLesson
        fields = [
            "id",
            "level",
            "order",
            "title",
            "grammar_point_count",
            "progress",
        ]

    def get_progress(self, lesson):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return None

        progress = GrammarProgress.objects.filter(
            user=request.user,
            lesson=lesson
        ).first()

        total = lesson.questions.count()

        if not progress:
            return {
                "correct_count": 0,
                "total_questions": total,
                "percent": 0,
            }

        return {
            "correct_count": progress.correct_count,
            "total_questions": total,
            "percent": round(progress.correct_count / total * 100) if total else 0,
        }

class GrammarLessonDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)
    progress = serializers.SerializerMethodField()

    class Meta:
        model = GrammarLesson
        fields = [
            "id",
            "level",
            "order",
            "title",
            "grammar_point_count",
            "content",
            "questions",
            "progress",
        ]

    def get_progress(self, lesson):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return None

        progress = GrammarProgress.objects.filter(
            user=request.user,
            lesson=lesson
        ).first()

        total = lesson.questions.count()

        if not progress:
            return {
                "correct_count": 0,
                "total_questions": total,
                "percent": 0,
            }

        return {
            "correct_count": progress.correct_count,
            "total_questions": total,
            "percent": round(progress.correct_count / total * 100) if total else 0,
        }

class GrammarProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrammarProgress
        fields = ["lesson", "correct_count"]
