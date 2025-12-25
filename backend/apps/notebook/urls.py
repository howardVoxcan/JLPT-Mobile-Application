from django.urls import path
from .views import (
    NotebookCategoriesAPIView,
    NotebookCategoryDetailAPIView,
)

urlpatterns = [
    path('categories/', NotebookCategoriesAPIView.as_view(), name='notebook-categories'),
    path('categories/<str:category>/', NotebookCategoryDetailAPIView.as_view(), name='notebook-category-detail'),
]

