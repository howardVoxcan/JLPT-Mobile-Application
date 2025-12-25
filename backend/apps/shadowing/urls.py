from django.urls import path
from .views import (
    VoiceListAPIView,
    ShadowingSessionCreateAPIView,
    ShadowingSessionListAPIView,
    ShadowingSessionDetailAPIView,
    ShadowingSessionDownloadAPIView,
)

urlpatterns = [
    # Voices
    path('voices/', VoiceListAPIView.as_view(), name='voice-list'),
    
    # Sessions
    path('create/', ShadowingSessionCreateAPIView.as_view(), name='shadowing-create'),
    path('sessions/', ShadowingSessionListAPIView.as_view(), name='shadowing-session-list'),
    path('sessions/<int:pk>/', ShadowingSessionDetailAPIView.as_view(), name='shadowing-session-detail'),
    path('sessions/<int:pk>/download/', ShadowingSessionDownloadAPIView.as_view(), name='shadowing-session-download'),
]

