from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Count, Q, Sum
from collections import defaultdict

from apps.vocab.models import VocabularyLesson, VocabularyWordProgress
from apps.kanji.models import KanjiLesson, KanjiProgress
from apps.grammar.models import GrammarLesson, GrammarProgress
from apps.reading.models import ReadingLesson, ReadingProgress
from apps.listening.models import ListeningLesson, ListeningProgress
from apps.jlpt_practice.models import JLPTTest, JLPTAttempt

from .serializers import (
    NotebookCategorySummarySerializer,
    NotebookLevelDetailSerializer,
)


JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']


class NotebookCategoriesAPIView(APIView):
    """
    GET /api/notebook/categories/
    Lấy tổng quan các category trong notebook
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        categories = []
        
        # 1. Từ vựng (Vocabulary)
        vocab_summary = self._get_vocab_summary(user)
        categories.append({
            'category': 'Từ vựng',
            'completed_levels': vocab_summary['completed'],
            'in_progress_levels': vocab_summary['in_progress'],
            'total_levels': 5
        })
        
        # 2. Kanji
        kanji_summary = self._get_kanji_summary(user)
        categories.append({
            'category': 'Kanji',
            'completed_levels': kanji_summary['completed'],
            'in_progress_levels': kanji_summary['in_progress'],
            'total_levels': 5
        })
        
        # 3. Ngữ pháp (Grammar)
        grammar_summary = self._get_grammar_summary(user)
        categories.append({
            'category': 'Ngữ pháp',
            'completed_levels': grammar_summary['completed'],
            'in_progress_levels': grammar_summary['in_progress'],
            'total_levels': 5
        })
        
        # 4. Đọc hiểu (Reading)
        reading_summary = self._get_reading_summary(user)
        categories.append({
            'category': 'Đọc hiểu',
            'completed_levels': reading_summary['completed'],
            'in_progress_levels': reading_summary['in_progress'],
            'total_levels': 5
        })
        
        # 5. Nghe hiểu (Listening)
        listening_summary = self._get_listening_summary(user)
        categories.append({
            'category': 'Nghe hiểu',
            'completed_levels': listening_summary['completed'],
            'in_progress_levels': listening_summary['in_progress'],
            'total_levels': 5
        })
        
        # 6. Thi JLPT
        jlpt_summary = self._get_jlpt_summary(user)
        categories.append({
            'category': 'Thi JLPT',
            'completed_levels': jlpt_summary['completed'],
            'in_progress_levels': jlpt_summary['in_progress'],
            'total_levels': 5
        })
        
        serializer = NotebookCategorySummarySerializer(categories, many=True)
        return Response(serializer.data)
    
    def _get_vocab_summary(self, user):
        """Calculate vocabulary progress summary"""
        completed = 0
        in_progress = 0
        
        for level in JLPT_LEVELS:
            lessons = VocabularyLesson.objects.filter(jlpt_level=level)
            total_lessons = lessons.count()
            
            if total_lessons == 0:
                continue
            
            # Count words per lesson and user progress
            total_words = 0
            mastered_words = 0
            
            for lesson in lessons:
                words = lesson.words.all()
                total_words += words.count()
                
                for word in words:
                    progress = VocabularyWordProgress.objects.filter(
                        user=user,
                        word=word,
                        is_learned=True
                    ).first()
                    if progress:
                        mastered_words += 1
            
            if total_words == 0:
                continue
            
            completion_rate = (mastered_words / total_words) * 100
            
            if completion_rate >= 100:
                completed += 1
            elif completion_rate > 0:
                in_progress += 1
        
        return {'completed': completed, 'in_progress': in_progress}
    
    def _get_kanji_summary(self, user):
        """Calculate kanji progress summary"""
        completed = 0
        in_progress = 0
        
        for level in JLPT_LEVELS:
            lessons = KanjiLesson.objects.filter(unit__level=level)
            total_lessons = lessons.count()
            
            if total_lessons == 0:
                continue
            
            # Count total kanji and mastered kanji
            total_kanji = 0
            mastered_kanji = 0
            
            for lesson in lessons:
                kanjis = lesson.kanjis.all()
                total_kanji += kanjis.count()
                
                for kanji in kanjis:
                    progress = KanjiProgress.objects.filter(
                        user=user,
                        kanji=kanji,
                        is_mastered=True
                    ).first()
                    if progress:
                        mastered_kanji += 1
            
            if total_kanji == 0:
                continue
            
            completion_rate = (mastered_kanji / total_kanji) * 100
            
            if completion_rate >= 100:
                completed += 1
            elif completion_rate > 0:
                in_progress += 1
        
        return {'completed': completed, 'in_progress': in_progress}
    
    def _get_grammar_summary(self, user):
        """Calculate grammar progress summary"""
        completed = 0
        in_progress = 0
        
        for level in JLPT_LEVELS:
            lessons = GrammarLesson.objects.filter(level=level)
            total_lessons = lessons.count()
            
            if total_lessons == 0:
                continue
            
            completed_lessons = 0
            started_lessons = 0
            
            for lesson in lessons:
                progress = GrammarProgress.objects.filter(
                    user=user,
                    lesson=lesson
                ).first()
                
                if progress:
                    total_questions = lesson.questions.count()
                    if total_questions > 0:
                        completion_rate = (progress.correct_count / total_questions) * 100
                        if completion_rate >= 80:  # Consider 80% as completed
                            completed_lessons += 1
                        else:
                            started_lessons += 1
            
            if completed_lessons == total_lessons and total_lessons > 0:
                completed += 1
            elif completed_lessons > 0 or started_lessons > 0:
                in_progress += 1
        
        return {'completed': completed, 'in_progress': in_progress}
    
    def _get_reading_summary(self, user):
        """Calculate reading progress summary"""
        completed = 0
        in_progress = 0
        
        for level in JLPT_LEVELS:
            lessons = ReadingLesson.objects.filter(level=level)
            total_lessons = lessons.count()
            
            if total_lessons == 0:
                continue
            
            completed_lessons = 0
            started_lessons = 0
            
            for lesson in lessons:
                progress = ReadingProgress.objects.filter(
                    user=user,
                    lesson=lesson
                ).first()
                
                if progress:
                    if progress.status == 'completed':
                        completed_lessons += 1
                    elif progress.status == 'in-progress':
                        started_lessons += 1
            
            if completed_lessons == total_lessons and total_lessons > 0:
                completed += 1
            elif completed_lessons > 0 or started_lessons > 0:
                in_progress += 1
        
        return {'completed': completed, 'in_progress': in_progress}
    
    def _get_listening_summary(self, user):
        """Calculate listening progress summary"""
        completed = 0
        in_progress = 0
        
        for level in JLPT_LEVELS:
            lessons = ListeningLesson.objects.filter(level=level)
            total_lessons = lessons.count()
            
            if total_lessons == 0:
                continue
            
            completed_lessons = 0
            started_lessons = 0
            
            for lesson in lessons:
                progress = ListeningProgress.objects.filter(
                    user=user,
                    lesson=lesson
                ).first()
                
                if progress:
                    if progress.status == 'completed':
                        completed_lessons += 1
                    elif progress.status == 'in-progress':
                        started_lessons += 1
            
            if completed_lessons == total_lessons and total_lessons > 0:
                completed += 1
            elif completed_lessons > 0 or started_lessons > 0:
                in_progress += 1
        
        return {'completed': completed, 'in_progress': in_progress}
    
    def _get_jlpt_summary(self, user):
        """Calculate JLPT practice test summary"""
        completed = 0
        in_progress = 0
        
        for level in JLPT_LEVELS:
            tests = JLPTTest.objects.filter(level=level)
            
            if tests.count() == 0:
                continue
            
            has_attempt = JLPTAttempt.objects.filter(
                user=user,
                test__level=level,
                status='submitted'
            ).exists()
            
            if has_attempt:
                # Check if passed (score >= 60% of total)
                best_attempt = JLPTAttempt.objects.filter(
                    user=user,
                    test__level=level,
                    status='submitted'
                ).order_by('-score').first()
                
                if best_attempt and best_attempt.test.total_score > 0:
                    pass_rate = (best_attempt.score / best_attempt.test.total_score) * 100
                    if pass_rate >= 60:
                        completed += 1
                    else:
                        in_progress += 1
        
        return {'completed': completed, 'in_progress': in_progress}


class NotebookCategoryDetailAPIView(APIView):
    """
    GET /api/notebook/categories/<category>/
    Lấy chi tiết từng level của một category
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, category):
        user = request.user
        
        # Map category name to function
        category_map = {
            'Từ vựng': self._get_vocab_detail,
            'Kanji': self._get_kanji_detail,
            'Ngữ pháp': self._get_grammar_detail,
            'Đọc hiểu': self._get_reading_detail,
            'Nghe hiểu': self._get_listening_detail,
            'Thi JLPT': self._get_jlpt_detail,
        }
        
        if category not in category_map:
            return Response(
                {'error': 'Invalid category'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        levels_data = category_map[category](user)
        serializer = NotebookLevelDetailSerializer(levels_data, many=True)
        return Response(serializer.data)
    
    def _get_vocab_detail(self, user):
        """Get vocabulary detail by level"""
        levels_data = []
        
        for level in JLPT_LEVELS:
            lessons = VocabularyLesson.objects.filter(jlpt_level=level).prefetch_related('words')
            total_lessons = lessons.count()
            
            if total_lessons == 0:
                levels_data.append({
                    'level': level,
                    'status': 'locked',
                    'lessons_completed': 0,
                    'total_lessons': 0,
                    'mastered_items': 0,
                    'total_items': 0,
                    'completion_percent': 0,
                    'reviewed_items': 0,
                    'review_total': 0,
                    'locked': True
                })
                continue
            
            total_words = 0
            mastered_words = 0
            reviewed_words = 0
            
            for lesson in lessons:
                words = lesson.words.all()
                total_words += words.count()
                
                for word in words:
                    progress = VocabularyWordProgress.objects.filter(
                        user=user,
                        word=word
                    ).first()
                    
                    if progress:
                        reviewed_words += 1
                        if progress.is_learned:
                            mastered_words += 1
            
            completion_percent = int((mastered_words / total_words) * 100) if total_words > 0 else 0
            
            if completion_percent >= 100:
                status_text = 'completed'
            elif completion_percent > 0:
                status_text = 'in-progress'
            else:
                status_text = 'not-started'
            
            levels_data.append({
                'level': level,
                'status': status_text,
                'lessons_completed': total_lessons if completion_percent >= 100 else int((completion_percent / 100) * total_lessons),
                'total_lessons': total_lessons,
                'mastered_items': mastered_words,
                'total_items': total_words,
                'completion_percent': completion_percent,
                'reviewed_items': reviewed_words,
                'review_total': total_words,
                'locked': False
            })
        
        return levels_data
    
    def _get_kanji_detail(self, user):
        """Get kanji detail by level"""
        levels_data = []
        
        for level in JLPT_LEVELS:
            lessons = KanjiLesson.objects.filter(unit__level=level).prefetch_related('kanjis')
            total_lessons = lessons.count()
            
            if total_lessons == 0:
                levels_data.append({
                    'level': level,
                    'status': 'locked',
                    'lessons_completed': 0,
                    'total_lessons': 0,
                    'mastered_items': 0,
                    'total_items': 0,
                    'completion_percent': 0,
                    'reviewed_items': 0,
                    'review_total': 0,
                    'locked': True
                })
                continue
            
            total_kanji = 0
            mastered_kanji = 0
            reviewed_kanji = 0
            
            for lesson in lessons:
                kanjis = lesson.kanjis.all()
                total_kanji += kanjis.count()
                
                for kanji in kanjis:
                    progress = KanjiProgress.objects.filter(
                        user=user,
                        kanji=kanji
                    ).first()
                    
                    if progress:
                        reviewed_kanji += 1
                        if progress.is_mastered:
                            mastered_kanji += 1
            
            completion_percent = int((mastered_kanji / total_kanji) * 100) if total_kanji > 0 else 0
            
            if completion_percent >= 100:
                status_text = 'completed'
            elif completion_percent > 0:
                status_text = 'in-progress'
            else:
                status_text = 'not-started'
            
            levels_data.append({
                'level': level,
                'status': status_text,
                'lessons_completed': total_lessons if completion_percent >= 100 else int((completion_percent / 100) * total_lessons),
                'total_lessons': total_lessons,
                'mastered_items': mastered_kanji,
                'total_items': total_kanji,
                'completion_percent': completion_percent,
                'reviewed_items': reviewed_kanji,
                'review_total': total_kanji,
                'locked': False
            })
        
        return levels_data
    
    def _get_grammar_detail(self, user):
        """Get grammar detail by level"""
        levels_data = []
        
        for level in JLPT_LEVELS:
            lessons = GrammarLesson.objects.filter(level=level).prefetch_related('questions')
            total_lessons = lessons.count()
            
            if total_lessons == 0:
                levels_data.append({
                    'level': level,
                    'status': 'locked',
                    'lessons_completed': 0,
                    'total_lessons': 0,
                    'mastered_items': 0,
                    'total_items': 0,
                    'completion_percent': 0,
                    'reviewed_items': 0,
                    'review_total': 0,
                    'locked': True
                })
                continue
            
            completed_lessons = 0
            total_grammar_points = 0
            
            for lesson in lessons:
                total_grammar_points += lesson.grammar_point_count
                
                progress = GrammarProgress.objects.filter(
                    user=user,
                    lesson=lesson
                ).first()
                
                if progress:
                    total_questions = lesson.questions.count()
                    if total_questions > 0:
                        completion_rate = (progress.correct_count / total_questions) * 100
                        if completion_rate >= 80:
                            completed_lessons += 1
            
            completion_percent = int((completed_lessons / total_lessons) * 100) if total_lessons > 0 else 0
            
            if completion_percent >= 100:
                status_text = 'completed'
            elif completion_percent > 0:
                status_text = 'in-progress'
            else:
                status_text = 'not-started'
            
            levels_data.append({
                'level': level,
                'status': status_text,
                'lessons_completed': completed_lessons,
                'total_lessons': total_lessons,
                'mastered_items': total_grammar_points if completion_percent >= 100 else int((completion_percent / 100) * total_grammar_points),
                'total_items': total_grammar_points,
                'completion_percent': completion_percent,
                'reviewed_items': completed_lessons,
                'review_total': total_lessons,
                'locked': False
            })
        
        return levels_data
    
    def _get_reading_detail(self, user):
        """Get reading detail by level"""
        levels_data = []
        
        for level in JLPT_LEVELS:
            lessons = ReadingLesson.objects.filter(level=level)
            total_lessons = lessons.count()
            
            if total_lessons == 0:
                levels_data.append({
                    'level': level,
                    'status': 'locked',
                    'lessons_completed': 0,
                    'total_lessons': 0,
                    'mastered_items': 0,
                    'total_items': 0,
                    'completion_percent': 0,
                    'reviewed_items': 0,
                    'review_total': 0,
                    'locked': True
                })
                continue
            
            completed_lessons = 0
            started_lessons = 0
            
            for lesson in lessons:
                progress = ReadingProgress.objects.filter(
                    user=user,
                    lesson=lesson
                ).first()
                
                if progress:
                    if progress.status == 'completed':
                        completed_lessons += 1
                    elif progress.status == 'in-progress':
                        started_lessons += 1
            
            completion_percent = int((completed_lessons / total_lessons) * 100) if total_lessons > 0 else 0
            
            if completion_percent >= 100:
                status_text = 'completed'
            elif completion_percent > 0 or started_lessons > 0:
                status_text = 'in-progress'
            else:
                status_text = 'not-started'
            
            levels_data.append({
                'level': level,
                'status': status_text,
                'lessons_completed': completed_lessons,
                'total_lessons': total_lessons,
                'mastered_items': completed_lessons,
                'total_items': total_lessons,
                'completion_percent': completion_percent,
                'reviewed_items': completed_lessons + started_lessons,
                'review_total': total_lessons,
                'locked': False
            })
        
        return levels_data
    
    def _get_listening_detail(self, user):
        """Get listening detail by level"""
        levels_data = []
        
        for level in JLPT_LEVELS:
            lessons = ListeningLesson.objects.filter(level=level)
            total_lessons = lessons.count()
            
            if total_lessons == 0:
                levels_data.append({
                    'level': level,
                    'status': 'locked',
                    'lessons_completed': 0,
                    'total_lessons': 0,
                    'mastered_items': 0,
                    'total_items': 0,
                    'completion_percent': 0,
                    'reviewed_items': 0,
                    'review_total': 0,
                    'locked': True
                })
                continue
            
            completed_lessons = 0
            started_lessons = 0
            
            for lesson in lessons:
                progress = ListeningProgress.objects.filter(
                    user=user,
                    lesson=lesson
                ).first()
                
                if progress:
                    if progress.status == 'completed':
                        completed_lessons += 1
                    elif progress.status == 'in-progress':
                        started_lessons += 1
            
            completion_percent = int((completed_lessons / total_lessons) * 100) if total_lessons > 0 else 0
            
            if completion_percent >= 100:
                status_text = 'completed'
            elif completion_percent > 0 or started_lessons > 0:
                status_text = 'in-progress'
            else:
                status_text = 'not-started'
            
            levels_data.append({
                'level': level,
                'status': status_text,
                'lessons_completed': completed_lessons,
                'total_lessons': total_lessons,
                'mastered_items': completed_lessons,
                'total_items': total_lessons,
                'completion_percent': completion_percent,
                'reviewed_items': completed_lessons + started_lessons,
                'review_total': total_lessons,
                'locked': False
            })
        
        return levels_data
    
    def _get_jlpt_detail(self, user):
        """Get JLPT practice detail by level"""
        levels_data = []
        
        for level in JLPT_LEVELS:
            tests = JLPTTest.objects.filter(level=level)
            total_tests = tests.count()
            
            if total_tests == 0:
                levels_data.append({
                    'level': level,
                    'status': 'locked',
                    'lessons_completed': 0,
                    'total_lessons': 0,
                    'mastered_items': 0,
                    'total_items': 0,
                    'completion_percent': 0,
                    'reviewed_items': 0,
                    'review_total': 0,
                    'locked': True
                })
                continue
            
            attempts = JLPTAttempt.objects.filter(
                user=user,
                test__level=level,
                status='submitted'
            )
            
            passed_tests = 0
            attempted_tests = set()
            
            for attempt in attempts:
                attempted_tests.add(attempt.test_id)
                if attempt.test.total_score > 0:
                    pass_rate = (attempt.score / attempt.test.total_score) * 100
                    if pass_rate >= 60:
                        passed_tests += 1
            
            completion_percent = int((passed_tests / total_tests) * 100) if total_tests > 0 else 0
            
            if passed_tests == total_tests and total_tests > 0:
                status_text = 'completed'
            elif passed_tests > 0 or len(attempted_tests) > 0:
                status_text = 'in-progress'
            else:
                status_text = 'not-started'
            
            levels_data.append({
                'level': level,
                'status': status_text,
                'lessons_completed': passed_tests,
                'total_lessons': total_tests,
                'mastered_items': passed_tests,
                'total_items': total_tests,
                'completion_percent': completion_percent,
                'reviewed_items': len(attempted_tests),
                'review_total': total_tests,
                'locked': False
            })
        
        return levels_data
