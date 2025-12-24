from django.urls import path
from .views import (
    VocabularyLessonListAPIView,
    VocabularyLessonDetailAPIView,
    VocabularyLessonProgressAPIView,
    VocabularyFavoriteToggleAPIView,
)

urlpatterns = [
    path(
        "lessons/",
        VocabularyLessonListAPIView.as_view(),
        name="vocabulary-lesson-list"
    ),

    path(
        "lessons/<int:lesson_id>/",
        VocabularyLessonDetailAPIView.as_view(),
        name="vocabulary-lesson-detail"
    ),

    path(
        "lessons/<int:lesson_id>/progress/",
        VocabularyLessonProgressAPIView.as_view(),
        name="vocabulary-lesson-progress"
    ),

    path(
        "words/<int:word_id>/favorite/",
        VocabularyFavoriteToggleAPIView.as_view(),
        name="vocabulary-word-favorite"
    ),
]
