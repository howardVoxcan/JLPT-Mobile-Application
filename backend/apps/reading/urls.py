from django.urls import path
from .views import (
    ReadingLessonListAPIView,
    ReadingLessonDetailAPIView,
    SubmitReadingAnswerAPIView
)

urlpatterns = [
    path("lessons/", ReadingLessonListAPIView.as_view()),
    path("lessons/<int:lesson_id>/", ReadingLessonDetailAPIView.as_view()),
    path("answer/", SubmitReadingAnswerAPIView.as_view()),
]
