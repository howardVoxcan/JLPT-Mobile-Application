from django.urls import path
from .views import (
    KanjiUnitListAPIView,
    KanjiUnitDetailAPIView,
    KanjiLessonDetailAPIView,
    KanjiDetailAPIView,
    KanjiSearchAPIView,
    KanjiProgressListAPIView,
    KanjiProgressDetailAPIView,
    KanjiFavoriteListAPIView,
    KanjiFavoriteDetailAPIView,
)

urlpatterns = [
    # Units
    path('units/', KanjiUnitListAPIView.as_view(), name='kanji-unit-list'),
    path('units/<int:unit_id>/', KanjiUnitDetailAPIView.as_view(), name='kanji-unit-detail'),
    
    # Lessons
    path('lessons/<int:lesson_id>/', KanjiLessonDetailAPIView.as_view(), name='kanji-lesson-detail'),
    
    # Kanji
    path('<int:kanji_id>/', KanjiDetailAPIView.as_view(), name='kanji-detail'),
    path('search/', KanjiSearchAPIView.as_view(), name='kanji-search'),
    
    # Progress
    path('progress/', KanjiProgressListAPIView.as_view(), name='kanji-progress-list'),
    path('progress/<int:progress_id>/', KanjiProgressDetailAPIView.as_view(), name='kanji-progress-detail'),
    
    # Favorites
    path('favorites/', KanjiFavoriteListAPIView.as_view(), name='kanji-favorite-list'),
    path('favorites/<int:favorite_id>/', KanjiFavoriteDetailAPIView.as_view(), name='kanji-favorite-detail'),
]

