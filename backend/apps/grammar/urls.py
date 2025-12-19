from django.urls import path
from .views import (
    GrammarLessonListView,
    GrammarLessonDetailView,
    GrammarProgressCreateUpdateView,
    SubmitGrammarAnswerView,
)

urlpatterns = [
    path("lessons/", GrammarLessonListView.as_view()),
    path("lessons/<int:pk>/", GrammarLessonDetailView.as_view()),
    path("progress/", GrammarProgressCreateUpdateView.as_view()),
    path("submit/", SubmitGrammarAnswerView.as_view()),
]
