from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction

from .models import (
    ReadingLesson,
    ReadingProgress,
    ReadingChoice
)
from .serializers import (
    ReadingLessonListSerializer,
    ReadingLessonDetailSerializer
)


# =========================
# LIST LESSONS (ReadingLevelScreen)
# =========================
class ReadingLessonListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        level = request.query_params.get("level", "N5")
        user = request.user

        lessons = ReadingLesson.objects.filter(level=level)

        progresses = ReadingProgress.objects.filter(
            user=user,
            lesson__in=lessons
        )

        progress_map = {p.lesson_id: p for p in progresses}

        serializer = ReadingLessonListSerializer(
            lessons,
            many=True,
            context={"progress_map": progress_map}
        )

        # tổng tiến độ
        total = lessons.count()
        completed = sum(
            1 for p in progress_map.values()
            if p.status == "completed"
        )

        total_progress = int((completed / total) * 100) if total else 0

        return Response({
            "total_progress": total_progress,
            "lessons": serializer.data
        })


# =========================
# LESSON DETAIL (ReadingLessonScreen)
# =========================
class ReadingLessonDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_id):
        lesson = get_object_or_404(ReadingLesson, id=lesson_id)
        serializer = ReadingLessonDetailSerializer(lesson)
        return Response(serializer.data)


# =========================
# SUBMIT ANSWER
# =========================
class SubmitReadingAnswerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        user = request.user
        question_id = request.data.get("question_id")
        choice_id = request.data.get("choice_id")

        choice = get_object_or_404(
            ReadingChoice,
            id=choice_id,
            question_id=question_id
        )

        question = choice.question
        lesson = question.lesson

        progress, _ = ReadingProgress.objects.get_or_create(
            user=user,
            lesson=lesson,
            defaults={
                "total_questions": lesson.questions.count()
            }
        )

        is_correct = choice.is_correct

        if is_correct:
            progress.correct_count += 1

        # cập nhật tiến độ
        progress.progress = int(
            (progress.correct_count / progress.total_questions) * 100
        )

        if progress.progress == 100:
            progress.status = "completed"
        else:
            progress.status = "in-progress"

        progress.save()

        correct_choice = question.choices.filter(is_correct=True).first()

        return Response({
            "is_correct": is_correct,
            "correct_choice_id": correct_choice.id if correct_choice else None,
            "lesson_progress": progress.progress,
            "lesson_status": progress.status
        })
