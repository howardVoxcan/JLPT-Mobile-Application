# apps/listening/views.py
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    ListeningLesson, ListeningProgress, ListeningQuestion, ListeningChoice,
    ListeningAttempt, ListeningAttemptAnswer
)
from .serializers import (
    ListeningLessonListSerializer,
    ListeningLessonDetailSerializer,
    SubmitAttemptSerializer,
    SubmitResultSerializer,
)


class ListeningLessonListAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # GET /api/listening/lessons/?level=N5
    def get(self, request):
        level = request.query_params.get("level", "N5")
        lessons = ListeningLesson.objects.filter(level=level, is_published=True).order_by("order")

        progress_qs = ListeningProgress.objects.filter(user=request.user, lesson__in=lessons)
        progress_map = {p.lesson_id: p for p in progress_qs}

        serializer = ListeningLessonListSerializer(
            lessons,
            many=True,
            context={"progress_map": progress_map},
        )
        return Response(serializer.data)

class ListeningLessonDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # GET /api/listening/lessons/<id>/
    def get(self, request, lesson_id: int):
        lesson = ListeningLesson.objects.get(id=lesson_id, is_published=True)
        serializer = ListeningLessonDetailSerializer(lesson, context={"request": request})
        return Response(serializer.data)

class ListeningSubmitAttemptAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # POST /api/listening/lessons/<id>/submit/
    # body: { "answers": [{ "question_id": 1, "choice_id": 10 }, ...] }
    def post(self, request, lesson_id: int):
        lesson = ListeningLesson.objects.get(id=lesson_id, is_published=True)

        ser = SubmitAttemptSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        answers = ser.validated_data["answers"]

        questions = list(lesson.questions.all().prefetch_related("choices"))
        q_map = {q.id: q for q in questions}

        attempt = ListeningAttempt.objects.create(user=request.user, lesson=lesson)

        total = len(questions)
        score = 0
        detail = []

        # Để lookup correct choice nhanh
        correct_choice_by_q = {}
        for q in questions:
            correct = next((c for c in q.choices.all() if c.is_correct), None)
            correct_choice_by_q[q.id] = correct

        # Chấm theo payload; nếu thiếu câu nào coi như bỏ trống
        incoming_map = {a["question_id"]: a.get("choice_id") for a in answers}

        for q in questions:
            selected_choice_id = incoming_map.get(q.id)
            correct_choice = correct_choice_by_q.get(q.id)

            is_correct = False
            selected_choice = None

            if selected_choice_id:
                selected_choice = ListeningChoice.objects.filter(id=selected_choice_id, question=q).first()

            if correct_choice and selected_choice and selected_choice.id == correct_choice.id:
                is_correct = True
                score += 1

            ListeningAttemptAnswer.objects.create(
                attempt=attempt,
                question=q,
                selected_choice=selected_choice,
                is_correct=is_correct,
            )

            detail.append({
                "question_id": q.id,
                "is_correct": is_correct,
                "correct_choice_id": correct_choice.id if correct_choice else None,
                "selected_choice_id": selected_choice.id if selected_choice else None,
                "explanation": q.explanation or "",
            })

        attempt.score = score
        attempt.total = total
        attempt.save(update_fields=["score", "total"])

        # Update progress để FE render status/progress
        progress_obj, _ = ListeningProgress.objects.get_or_create(user=request.user, lesson=lesson)

        progress_obj.total_questions = total
        progress_obj.correct_count = score
        progress_obj.last_attempt_at = timezone.now()

        percent = int(round((score / total) * 100)) if total else 0
        progress_obj.progress_percent = percent

        if percent == 100:
            progress_obj.status = ListeningProgress.STATUS_COMPLETED
        else:
            # đã submit => in-progress (có thể tùy bạn: muốn 0% vẫn là not-started thì set rule khác)
            progress_obj.status = ListeningProgress.STATUS_IN_PROGRESS

        progress_obj.save()

        result_data = {
            "score": score,
            "total": total,
            "status": progress_obj.status,
            "progress_percent": progress_obj.progress_percent,
            "detail": detail,
        }
        return Response(SubmitResultSerializer(result_data).data, status=status.HTTP_200_OK)
