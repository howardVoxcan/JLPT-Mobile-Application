from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import KanjiUnit, KanjiLesson, Kanji, KanjiProgress, KanjiFavorite
from .serializers import (
    KanjiUnitSerializer,
    KanjiUnitListSerializer,
    KanjiLessonSerializer,
    KanjiSerializer,
    KanjiDetailSerializer,
    KanjiProgressSerializer,
    KanjiFavoriteSerializer
)


class KanjiUnitListAPIView(APIView):
    """
    GET /api/kanji/units/?level=N5
    Lấy danh sách units theo level (bao gồm lessons)
    """
    
    def get(self, request):
        level = request.query_params.get('level', 'N5')
        
        units = KanjiUnit.objects.filter(level=level).prefetch_related('lessons__kanjis__vocabularies')
        serializer = KanjiUnitSerializer(units, many=True)
        
        return Response(serializer.data)


class KanjiUnitDetailAPIView(APIView):
    """
    GET /api/kanji/units/{unit_id}/
    Lấy chi tiết unit bao gồm tất cả lessons và kanjis
    """
    
    def get(self, request, unit_id):
        unit = get_object_or_404(
            KanjiUnit.objects.prefetch_related('lessons__kanjis__vocabularies'),
            id=unit_id
        )
        serializer = KanjiUnitSerializer(unit)
        
        return Response(serializer.data)


class KanjiLessonDetailAPIView(APIView):
    """
    GET /api/kanji/lessons/{lesson_id}/
    Lấy chi tiết lesson bao gồm tất cả kanjis
    """
    
    def get(self, request, lesson_id):
        lesson = get_object_or_404(
            KanjiLesson.objects.prefetch_related('kanjis__vocabularies'),
            id=lesson_id
        )
        serializer = KanjiLessonSerializer(lesson)
        
        return Response(serializer.data)


class KanjiDetailAPIView(APIView):
    """
    GET /api/kanji/{kanji_id}/
    Lấy chi tiết kanji bao gồm tất cả từ vựng
    """
    
    def get(self, request, kanji_id):
        kanji = get_object_or_404(
            Kanji.objects.prefetch_related('vocabularies'),
            id=kanji_id
        )
        serializer = KanjiDetailSerializer(kanji)
        
        return Response(serializer.data)


class KanjiSearchAPIView(APIView):
    """
    GET /api/kanji/search/?q=日&level=N5
    Tìm kiếm kanji
    """
    
    def get(self, request):
        query = request.query_params.get('q', '')
        level = request.query_params.get('level')
        
        if not query:
            return Response([], status=status.HTTP_200_OK)
        
        kanjis = Kanji.objects.all()
        
        # Tìm kiếm theo kanji hoặc vietnamese hoặc meaning
        kanjis = kanjis.filter(
            models.Q(kanji__icontains=query) |
            models.Q(vietnamese__icontains=query) |
            models.Q(meaning__icontains=query)
        )
        
        # Lọc theo level nếu có
        if level:
            kanjis = kanjis.filter(lesson__unit__level=level)
        
        kanjis = kanjis.prefetch_related('vocabularies')[:20]
        
        serializer = KanjiSerializer(kanjis, many=True)
        return Response(serializer.data)


class KanjiProgressListAPIView(APIView):
    """
    GET /api/kanji/progress/
    POST /api/kanji/progress/
    Quản lý tiến độ học kanji của user
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Lấy tiến độ học của user"""
        level = request.query_params.get('level')
        
        progress = KanjiProgress.objects.filter(user=request.user)
        
        if level:
            progress = progress.filter(kanji__lesson__unit__level=level)
        
        progress = progress.select_related('kanji').prefetch_related('kanji__vocabularies')
        
        serializer = KanjiProgressSerializer(progress, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Tạo/cập nhật tiến độ học"""
        serializer = KanjiProgressSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            kanji_id = serializer.validated_data['kanji_id']
            
            # Kiểm tra nếu đã tồn tại thì update, không thì create
            progress, created = KanjiProgress.objects.get_or_create(
                user=request.user,
                kanji_id=kanji_id,
                defaults={
                    'is_learned': serializer.validated_data.get('is_learned', False),
                    'is_mastered': serializer.validated_data.get('is_mastered', False),
                    'review_count': serializer.validated_data.get('review_count', 0)
                }
            )
            
            if not created:
                # Update nếu đã tồn tại
                progress.is_learned = serializer.validated_data.get('is_learned', progress.is_learned)
                progress.is_mastered = serializer.validated_data.get('is_mastered', progress.is_mastered)
                progress.review_count = serializer.validated_data.get('review_count', progress.review_count)
                progress.save()
            
            return Response(
                KanjiProgressSerializer(progress).data,
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class KanjiProgressDetailAPIView(APIView):
    """
    PUT /api/kanji/progress/{progress_id}/
    DELETE /api/kanji/progress/{progress_id}/
    Cập nhật/xóa tiến độ học kanji
    """
    permission_classes = [IsAuthenticated]
    
    def put(self, request, progress_id):
        progress = get_object_or_404(
            KanjiProgress,
            id=progress_id,
            user=request.user
        )
        
        serializer = KanjiProgressSerializer(
            progress,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, progress_id):
        progress = get_object_or_404(
            KanjiProgress,
            id=progress_id,
            user=request.user
        )
        progress.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)


class KanjiFavoriteListAPIView(APIView):
    """
    GET /api/kanji/favorites/
    POST /api/kanji/favorites/
    Quản lý kanji yêu thích
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Lấy danh sách kanji yêu thích"""
        favorites = KanjiFavorite.objects.filter(user=request.user).select_related('kanji').prefetch_related('kanji__vocabularies')
        serializer = KanjiFavoriteSerializer(favorites, many=True)
        
        return Response(serializer.data)
    
    def post(self, request):
        """Thêm kanji vào yêu thích"""
        serializer = KanjiFavoriteSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            kanji_id = serializer.validated_data['kanji_id']
            
            # Kiểm tra đã tồn tại chưa
            favorite, created = KanjiFavorite.objects.get_or_create(
                user=request.user,
                kanji_id=kanji_id
            )
            
            return Response(
                KanjiFavoriteSerializer(favorite).data,
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class KanjiFavoriteDetailAPIView(APIView):
    """
    DELETE /api/kanji/favorites/{favorite_id}/
    Xóa kanji khỏi yêu thích
    """
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, favorite_id):
        favorite = get_object_or_404(
            KanjiFavorite,
            id=favorite_id,
            user=request.user
        )
        favorite.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)


# Import models để sử dụng Q
from django.db import models
