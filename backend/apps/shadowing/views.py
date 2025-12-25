from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from .models import Voice, ShadowingSession
from .serializers import (
    VoiceSerializer,
    ShadowingSessionCreateSerializer,
    ShadowingSessionSerializer,
    ShadowingSessionListSerializer
)
import os


class VoiceListAPIView(APIView):
    """
    GET /api/shadowing/voices/
    Lấy danh sách tất cả giọng đọc
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        voices = Voice.objects.filter(is_active=True)
        serializer = VoiceSerializer(voices, many=True)
        return Response(serializer.data)


class ShadowingSessionCreateAPIView(APIView):
    """
    POST /api/shadowing/create/
    Tạo session mới và generate audio
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ShadowingSessionCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Tạo session và gán user
        session = serializer.save(user=request.user)
        
        # TODO: Implement actual TTS logic here
        # For now, we'll just save the session without generating audio
        # In production, you would:
        # 1. Use Google TTS, Azure TTS, or similar service
        # 2. Generate audio file from text_input
        # 3. Save audio_file and calculate audio_duration
        # 4. If input_type is 'image', use OCR to extract text first
        
        # Mock audio duration for demo
        if session.text_input:
            # Estimate duration based on character count (rough estimate)
            chars = len(session.text_input)
            estimated_seconds = chars * 0.15  # ~150ms per character
            minutes = int(estimated_seconds // 60)
            seconds = int(estimated_seconds % 60)
            session.audio_duration = f"{minutes}:{seconds:02d}"
            session.save()
        
        response_serializer = ShadowingSessionSerializer(
            session,
            context={'request': request}
        )
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class ShadowingSessionListAPIView(APIView):
    """
    GET /api/shadowing/sessions/
    Lấy danh sách sessions của user hiện tại
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        sessions = ShadowingSession.objects.filter(user=request.user)
        serializer = ShadowingSessionListSerializer(
            sessions,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)


class ShadowingSessionDetailAPIView(APIView):
    """
    GET /api/shadowing/sessions/{id}/
    Lấy chi tiết một session
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        session = get_object_or_404(
            ShadowingSession,
            pk=pk,
            user=request.user
        )
        serializer = ShadowingSessionSerializer(
            session,
            context={'request': request}
        )
        return Response(serializer.data)


class ShadowingSessionDownloadAPIView(APIView):
    """
    GET /api/shadowing/sessions/{id}/download/
    Download audio file của session
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        session = get_object_or_404(
            ShadowingSession,
            pk=pk,
            user=request.user
        )
        
        if not session.audio_file:
            return Response(
                {"error": "Audio file not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get the file path
        file_path = session.audio_file.path
        
        if not os.path.exists(file_path):
            return Response(
                {"error": "Audio file does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Return file as download
        response = FileResponse(
            open(file_path, 'rb'),
            content_type='audio/mpeg'
        )
        response['Content-Disposition'] = f'attachment; filename="shadowing_{session.id}.mp3"'
        return response
