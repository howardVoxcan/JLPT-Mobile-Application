from rest_framework import generics, permissions
from .models import GrammarLesson, GrammarProgress
from .serializers import (
    GrammarLessonListSerializer,
    GrammarLessonDetailSerializer,
    GrammarProgressSerializer,
)
from rest_framework.exceptions import ValidationError
from apps.study.models import JlptLevel
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from apps.study.models import Choice

class GrammarLessonListView(generics.ListAPIView):
    serializer_class = GrammarLessonListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        level = self.request.query_params.get("level")
        qs = GrammarLesson.objects.all()

        if level:
            if level not in JlptLevel.values:
                raise ValidationError({
                    "level": f"Invalid JLPT level. Allowed: {JlptLevel.values}"
                })
            qs = qs.filter(level=level)

        return qs


class GrammarLessonDetailView(RetrieveAPIView):
    queryset = GrammarLesson.objects.prefetch_related(
        "questions__choices"
    )
    serializer_class = GrammarLessonDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class GrammarProgressCreateUpdateView(generics.CreateAPIView):
    serializer_class = GrammarProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        lesson = serializer.validated_data["lesson"]
        progress, _ = GrammarProgress.objects.update_or_create(
            user=request.user,
            lesson=lesson,
            defaults={
                "correct_count": serializer.validated_data["correct_count"],
                "total_questions": serializer.validated_data["total_questions"],
            },
        )

        return Response(
            GrammarProgressSerializer(progress).data,
            status=status.HTTP_200_OK,
        )

class SubmitGrammarAnswerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        lesson_id = request.data.get("lesson_id")
        answers = request.data.get("answers")  
        # answers = { question_id: choice_id }

        lesson = get_object_or_404(GrammarLesson, id=lesson_id)

        correct = 0
        for question_id, choice_id in answers.items():
            try:
                choice = Choice.objects.get(
                    id=choice_id,
                    question_id=question_id,
                    is_correct=True
                )
                correct += 1
            except Choice.DoesNotExist:
                pass

        progress, _ = GrammarProgress.objects.get_or_create(
            user=request.user,
            lesson=lesson,
            defaults={"correct_count": 0},
        )

        progress.correct_count = max(progress.correct_count, correct)
        progress.save()

        total = lesson.questions.count()

        return Response({
            "correct_count": progress.correct_count,
            "total_questions": total,
            "percent": round(progress.correct_count / total * 100) if total else 0,
        })

