# apps/jlpt_practice/serializers.py
from rest_framework import serializers
from .models import (
    JLPTTest,
    JLPTSection,
    JLPTSubSection,
    JLPTQuestion,
    JLPTChoice,
    JLPTAttempt,
    JLPTAnswer,
)


class JLPTChoiceSerializer(serializers.ModelSerializer):
    """Serializer for choices - hide is_correct when not showing results"""
    class Meta:
        model = JLPTChoice
        fields = ['id', 'text', 'order']


class JLPTChoiceWithAnswerSerializer(serializers.ModelSerializer):
    """Serializer for choices with answer (for results screen)"""
    class Meta:
        model = JLPTChoice
        fields = ['id', 'text', 'order', 'is_correct']


class JLPTQuestionSerializer(serializers.ModelSerializer):
    """Serializer for questions during test"""
    choices = JLPTChoiceSerializer(many=True, read_only=True)
    audio_url = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = JLPTQuestion
        fields = [
            'id',
            'question_number',
            'instruction',
            'sentence',
            'underlined_word',
            'audio_url',
            'duration_seconds',
            'image_url',
            'choices',
        ]
    
    def get_audio_url(self, obj):
        if not obj.audio_file:
            return None
        request = self.context.get('request')
        url = obj.audio_file.url
        return request.build_absolute_uri(url) if request else url
    
    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url


class JLPTQuestionWithAnswerSerializer(serializers.ModelSerializer):
    """Serializer for questions with answers (for results detail screen)"""
    choices = JLPTChoiceWithAnswerSerializer(many=True, read_only=True)
    audio_url = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    user_answer_id = serializers.SerializerMethodField()
    is_correct = serializers.SerializerMethodField()
    
    class Meta:
        model = JLPTQuestion
        fields = [
            'id',
            'question_number',
            'instruction',
            'sentence',
            'underlined_word',
            'audio_url',
            'duration_seconds',
            'image_url',
            'choices',
            'explanation',
            'user_answer_id',
            'is_correct',
        ]
    
    def get_audio_url(self, obj):
        if not obj.audio_file:
            return None
        request = self.context.get('request')
        url = obj.audio_file.url
        return request.build_absolute_uri(url) if request else url
    
    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url
    
    def get_user_answer_id(self, obj):
        answer_map = self.context.get('answer_map', {})
        answer = answer_map.get(obj.id)
        return answer.selected_choice_id if answer and answer.selected_choice else None
    
    def get_is_correct(self, obj):
        answer_map = self.context.get('answer_map', {})
        answer = answer_map.get(obj.id)
        return answer.is_correct if answer else False


class JLPTSectionSerializer(serializers.ModelSerializer):
    """Serializer for sections with questions"""
    questions = JLPTQuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = JLPTSection
        fields = [
            'id',
            'section_type',
            'title_jp',
            'title_vn',
            'order',
            'max_score',
            'questions',
        ]


class JLPTTestListSerializer(serializers.ModelSerializer):
    """Serializer for test list (without questions)"""
    user_best_score = serializers.SerializerMethodField()
    has_attempted = serializers.SerializerMethodField()
    last_attempt_id = serializers.SerializerMethodField()
    
    class Meta:
        model = JLPTTest
        fields = [
            'id',
            'level',
            'order',
            'title',
            'description',
            'duration_minutes',
            'total_score',
            'user_best_score',
            'has_attempted',
            'last_attempt_id',
        ]
    
    def get_user_best_score(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return None
        
        best_attempt = obj.attempts.filter(user=user, status='submitted').order_by('-score').first()
        return best_attempt.score if best_attempt else None
    
    def get_has_attempted(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return False
        
        return obj.attempts.filter(user=user, status='submitted').exists()
    
    def get_last_attempt_id(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return None
        
        last_attempt = obj.attempts.filter(user=user, status='submitted').order_by('-submitted_at').first()
        return last_attempt.id if last_attempt else None


class JLPTTestDetailSerializer(serializers.ModelSerializer):
    """Serializer for test detail (with all questions)"""
    sections = JLPTSectionSerializer(many=True, read_only=True)
    
    class Meta:
        model = JLPTTest
        fields = [
            'id',
            'level',
            'order',
            'title',
            'description',
            'duration_minutes',
            'total_score',
            'sections',
        ]


class SubmitAnswerItemSerializer(serializers.Serializer):
    """Serializer for individual answer submission"""
    question_id = serializers.IntegerField()
    choice_id = serializers.IntegerField(allow_null=True, required=False)


class SubmitAttemptSerializer(serializers.Serializer):
    """Serializer for submitting test attempt"""
    answers = SubmitAnswerItemSerializer(many=True)


class SubSectionResultSerializer(serializers.Serializer):
    """Serializer for subsection results"""
    name = serializers.CharField()
    correct = serializers.IntegerField()
    total = serializers.IntegerField()


class SectionResultSerializer(serializers.Serializer):
    """Serializer for section results"""
    section_type = serializers.CharField()
    title_vn = serializers.CharField()
    correct = serializers.IntegerField()
    total = serializers.IntegerField()
    percentage = serializers.IntegerField()
    subsections = SubSectionResultSerializer(many=True)


class JLPTAttemptResultSerializer(serializers.Serializer):
    """Serializer for attempt result summary"""
    attempt_id = serializers.IntegerField()
    score = serializers.IntegerField()
    total_score = serializers.IntegerField()
    percentage = serializers.IntegerField()
    sections = SectionResultSerializer(many=True)


class JLPTAttemptDetailSerializer(serializers.ModelSerializer):
    """Serializer for attempt detail (for viewing results)"""
    test_title = serializers.CharField(source='test.title', read_only=True)
    test_level = serializers.CharField(source='test.level', read_only=True)
    
    class Meta:
        model = JLPTAttempt
        fields = [
            'id',
            'test_title',
            'test_level',
            'status',
            'score',
            'total_score',
            'started_at',
            'submitted_at',
        ]

