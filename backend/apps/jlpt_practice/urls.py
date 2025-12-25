# apps/jlpt_practice/urls.py
from django.urls import path
from .views import (
    JLPTTestListAPIView,
    JLPTTestDetailAPIView,
    JLPTSubmitAttemptAPIView,
    JLPTAttemptDetailAPIView,
)

urlpatterns = [
    # Test list & detail
    path('tests/', JLPTTestListAPIView.as_view(), name='jlpt-test-list'),
    path('tests/<int:test_id>/', JLPTTestDetailAPIView.as_view(), name='jlpt-test-detail'),
    
    # Submit test
    path('tests/<int:test_id>/submit/', JLPTSubmitAttemptAPIView.as_view(), name='jlpt-submit'),
    
    # View attempt details
    path('attempts/<int:attempt_id>/', JLPTAttemptDetailAPIView.as_view(), name='jlpt-attempt-detail'),
]

