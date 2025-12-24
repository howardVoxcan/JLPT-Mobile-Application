from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import (
    VocabularyLesson,
    VocabularyLessonProgress,
    VocabularyFavorite,
)
from .serializers import (
    VocabularyLessonListSerializer,
    VocabularyLessonDetailSerializer,
)

class VocabularyLessonListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        level = request.query_params.get("level")

        qs = VocabularyLesson.objects.all()

        if level:
            qs = qs.filter(jlpt_level=level)

        serializer = VocabularyLessonListSerializer(
            qs,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data)

class VocabularyLessonDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_id):
        lesson = get_object_or_404(VocabularyLesson, id=lesson_id)

        serializer = VocabularyLessonDetailSerializer(lesson)
        return Response(serializer.data)

class VocabularyLessonProgressAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, lesson_id):
        lesson = get_object_or_404(VocabularyLesson, id=lesson_id)

        completed_words = request.data.get("completed_words", 0)

        progress, _ = VocabularyLessonProgress.objects.get_or_create(
            user=request.user,
            lesson=lesson
        )

        progress.completed_words = completed_words

        if completed_words >= lesson.words.count():
            progress.is_completed = True

        progress.save()

        return Response({
            "message": "Progress updated",
            "completed_words": progress.completed_words,
            "is_completed": progress.is_completed
        })

class VocabularyFavoriteToggleAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, word_id):
        favorite = VocabularyFavorite.objects.filter(
            user=request.user,
            word_id=word_id
        ).first()

        if favorite:
            favorite.delete()
            return Response({"favorite": False})

        VocabularyFavorite.objects.create(
            user=request.user,
            word_id=word_id
        )
        return Response({"favorite": True})

