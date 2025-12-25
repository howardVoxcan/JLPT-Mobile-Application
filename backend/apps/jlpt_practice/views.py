# apps/jlpt_practice/views.py
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from collections import defaultdict

from .models import (
    JLPTTest,
    JLPTAttempt,
    JLPTAnswer,
    JLPTQuestion,
    JLPTChoice,
)
from .serializers import (
    JLPTTestListSerializer,
    JLPTTestDetailSerializer,
    SubmitAttemptSerializer,
    JLPTAttemptResultSerializer,
    JLPTSectionSerializer,
    JLPTQuestionWithAnswerSerializer,
    SectionResultSerializer,
    SubSectionResultSerializer,
)


class JLPTTestListAPIView(APIView):
    """
    GET /api/jlpt-practice/tests/?level=N5
    Lấy danh sách đề thi theo level
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        level = request.query_params.get('level', 'N5')
        tests = JLPTTest.objects.filter(level=level, is_published=True).prefetch_related('attempts')
        serializer = JLPTTestListSerializer(tests, many=True, context={'request': request})
        return Response(serializer.data)


class JLPTTestDetailAPIView(APIView):
    """
    GET /api/jlpt-practice/tests/<id>/
    Lấy chi tiết đề thi (với tất cả câu hỏi) để bắt đầu làm bài
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, test_id: int):
        try:
            test = JLPTTest.objects.prefetch_related(
                'sections__questions__choices'
            ).get(id=test_id, is_published=True)
            
            serializer = JLPTTestDetailSerializer(test, context={'request': request})
            return Response(serializer.data)
        except JLPTTest.DoesNotExist:
            return Response(
                {'error': 'Test not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class JLPTSubmitAttemptAPIView(APIView):
    """
    POST /api/jlpt-practice/tests/<id>/submit/
    Nộp bài và nhận kết quả
    Body: { "answers": [{ "question_id": 1, "choice_id": 3 }, ...] }
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, test_id: int):
        try:
            test = JLPTTest.objects.prefetch_related(
                'sections__questions__choices',
                'sections__subsections'
            ).get(id=test_id, is_published=True)
        except JLPTTest.DoesNotExist:
            return Response(
                {'error': 'Test not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Validate input
        serializer = SubmitAttemptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        answers_data = serializer.validated_data['answers']
        
        # Create attempt
        attempt = JLPTAttempt.objects.create(
            user=request.user,
            test=test,
            status='submitted',
            total_score=test.total_score,
            submitted_at=timezone.now()
        )
        
        # Process answers
        incoming_answers = {item['question_id']: item.get('choice_id') for item in answers_data}
        
        # Get all questions with correct answers
        all_questions = JLPTQuestion.objects.filter(
            section__test=test
        ).prefetch_related('choices')
        
        correct_choice_map = {}
        for q in all_questions:
            correct_choice = q.choices.filter(is_correct=True).first()
            correct_choice_map[q.id] = correct_choice.id if correct_choice else None
        
        # Calculate results by section and subsection
        section_results = defaultdict(lambda: {
            'correct': 0,
            'total': 0,
            'subsections': defaultdict(lambda: {'correct': 0, 'total': 0})
        })
        
        total_correct = 0
        total_questions = len(all_questions)
        
        # Grade each question
        for question in all_questions:
            selected_choice_id = incoming_answers.get(question.id)
            selected_choice = None
            is_correct = False
            
            if selected_choice_id:
                selected_choice = JLPTChoice.objects.filter(
                    id=selected_choice_id,
                    question=question
                ).first()
            
            correct_choice_id = correct_choice_map.get(question.id)
            if correct_choice_id and selected_choice and selected_choice.id == correct_choice_id:
                is_correct = True
                total_correct += 1
            
            # Save answer
            JLPTAnswer.objects.create(
                attempt=attempt,
                question=question,
                selected_choice=selected_choice,
                is_correct=is_correct
            )
            
            # Update section stats
            section = question.section
            section_results[section.id]['section'] = section
            section_results[section.id]['total'] += 1
            if is_correct:
                section_results[section.id]['correct'] += 1
            
            # Update subsection stats if exists
            if question.subsection:
                subsec_id = question.subsection.id
                section_results[section.id]['subsections'][subsec_id]['subsection'] = question.subsection
                section_results[section.id]['subsections'][subsec_id]['total'] += 1
                if is_correct:
                    section_results[section.id]['subsections'][subsec_id]['correct'] += 1
        
        # Calculate score (proportional)
        score = int((total_correct / total_questions) * test.total_score) if total_questions > 0 else 0
        attempt.score = score
        attempt.save(update_fields=['score'])
        
        # Format response
        sections_data = []
        for section_id, data in section_results.items():
            section = data['section']
            correct = data['correct']
            total = data['total']
            percentage = int((correct / total) * 100) if total > 0 else 0
            
            # Format subsections
            subsections_data = []
            for subsec_id, subsec_data in data['subsections'].items():
                subsec = subsec_data['subsection']
                subsections_data.append({
                    'name': subsec.name,
                    'correct': subsec_data['correct'],
                    'total': subsec_data['total']
                })
            
            sections_data.append({
                'section_type': section.section_type,
                'title_vn': section.title_vn,
                'correct': correct,
                'total': total,
                'percentage': percentage,
                'subsections': subsections_data
            })
        
        result_data = {
            'attempt_id': attempt.id,
            'score': score,
            'total_score': test.total_score,
            'percentage': int((score / test.total_score) * 100) if test.total_score > 0 else 0,
            'sections': sections_data
        }
        
        return Response(JLPTAttemptResultSerializer(result_data).data, status=status.HTTP_200_OK)


class JLPTAttemptDetailAPIView(APIView):
    """
    GET /api/jlpt-practice/attempts/<id>/
    Xem chi tiết kết quả một lần thi (từng câu hỏi đúng/sai)
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, attempt_id: int):
        try:
            attempt = JLPTAttempt.objects.select_related('test').prefetch_related(
                'answers__question__choices',
                'answers__selected_choice'
            ).get(id=attempt_id, user=request.user)
        except JLPTAttempt.DoesNotExist:
            return Response(
                {'error': 'Attempt not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Build answer map
        answer_map = {answer.question_id: answer for answer in attempt.answers.all()}
        
        # Get sections with questions
        sections = attempt.test.sections.prefetch_related(
            'questions__choices'
        ).all()
        
        sections_data = []
        for section in sections:
            questions = section.questions.all()
            questions_serializer = JLPTQuestionWithAnswerSerializer(
                questions,
                many=True,
                context={'request': request, 'answer_map': answer_map}
            )
            
            sections_data.append({
                'id': section.id,
                'section_type': section.section_type,
                'title_jp': section.title_jp,
                'title_vn': section.title_vn,
                'order': section.order,
                'questions': questions_serializer.data
            })
        
        return Response({
            'attempt_id': attempt.id,
            'test_id': attempt.test.id,
            'test_title': attempt.test.title,
            'test_level': attempt.test.level,
            'score': attempt.score,
            'total_score': attempt.total_score,
            'submitted_at': attempt.submitted_at,
            'sections': sections_data
        })

