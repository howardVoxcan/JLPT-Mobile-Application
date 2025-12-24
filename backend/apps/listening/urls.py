# apps/listening/urls.py
from django.urls import path
from .views import (
    ListeningLessonListAPIView,
    ListeningLessonDetailAPIView,
    ListeningSubmitAttemptAPIView,
)

urlpatterns = [
    path("lessons/", ListeningLessonListAPIView.as_view(), name="listening-lessons"),
    path("lessons/<int:lesson_id>/", ListeningLessonDetailAPIView.as_view(), name="listening-lesson-detail"),
    path("lessons/<int:lesson_id>/submit/", ListeningSubmitAttemptAPIView.as_view(), name="listening-submit"),
]
