from rest_framework import serializers
from .models import KanjiUnit, KanjiLesson, Kanji, KanjiVocabulary, KanjiProgress, KanjiFavorite


class KanjiVocabularySerializer(serializers.ModelSerializer):
    """Serializer cho từ vựng của kanji"""
    
    class Meta:
        model = KanjiVocabulary
        fields = ['id', 'kanji_word', 'hiragana', 'reading', 'meaning', 'example_sentence']


class KanjiSerializer(serializers.ModelSerializer):
    """Serializer cho kanji"""
    vocabulary = serializers.SerializerMethodField()
    
    class Meta:
        model = Kanji
        fields = [
            'id',
            'kanji',
            'hiragana',
            'vietnamese',
            'stroke_count',
            'kunyomi',
            'onyomi',
            'meaning',
            'vocabulary'
        ]
    
    def get_vocabulary(self, obj):
        """Lấy từ vựng đầu tiên của kanji"""
        first_vocab = obj.vocabularies.first()
        if first_vocab:
            return {
                'kanji': first_vocab.kanji_word,
                'hiragana': first_vocab.hiragana,
                'reading': first_vocab.reading,
                'meaning': first_vocab.meaning,
            }
        return None


class KanjiDetailSerializer(serializers.ModelSerializer):
    """Serializer chi tiết cho kanji (bao gồm tất cả từ vựng)"""
    vocabularies = KanjiVocabularySerializer(many=True, read_only=True)
    
    class Meta:
        model = Kanji
        fields = [
            'id',
            'kanji',
            'hiragana',
            'vietnamese',
            'stroke_count',
            'kunyomi',
            'onyomi',
            'meaning',
            'vocabularies'
        ]


class KanjiLessonSerializer(serializers.ModelSerializer):
    """Serializer cho bài học kanji"""
    kanjis = KanjiSerializer(many=True, read_only=True)
    kanji_count = serializers.SerializerMethodField()
    
    class Meta:
        model = KanjiLesson
        fields = ['id', 'lesson_number', 'lesson_name', 'kanji_count', 'kanjis']
    
    def get_kanji_count(self, obj):
        return obj.kanjis.count()


class KanjiUnitSerializer(serializers.ModelSerializer):
    """Serializer cho unit kanji"""
    lessons = KanjiLessonSerializer(many=True, read_only=True)
    lesson_count = serializers.SerializerMethodField()
    total_kanji_count = serializers.SerializerMethodField()
    
    class Meta:
        model = KanjiUnit
        fields = [
            'id',
            'level',
            'unit_number',
            'unit_name',
            'description',
            'lesson_count',
            'total_kanji_count',
            'lessons'
        ]
    
    def get_lesson_count(self, obj):
        return obj.lessons.count()
    
    def get_total_kanji_count(self, obj):
        return Kanji.objects.filter(lesson__unit=obj).count()


class KanjiUnitListSerializer(serializers.ModelSerializer):
    """Serializer cho danh sách unit (không bao gồm lessons)"""
    lesson_count = serializers.SerializerMethodField()
    total_kanji_count = serializers.SerializerMethodField()
    
    class Meta:
        model = KanjiUnit
        fields = [
            'id',
            'level',
            'unit_number',
            'unit_name',
            'description',
            'lesson_count',
            'total_kanji_count'
        ]
    
    def get_lesson_count(self, obj):
        return obj.lessons.count()
    
    def get_total_kanji_count(self, obj):
        return Kanji.objects.filter(lesson__unit=obj).count()


class KanjiProgressSerializer(serializers.ModelSerializer):
    """Serializer cho tiến độ học kanji"""
    kanji = KanjiSerializer(read_only=True)
    kanji_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = KanjiProgress
        fields = [
            'id',
            'kanji',
            'kanji_id',
            'is_learned',
            'is_mastered',
            'review_count',
            'last_reviewed_at'
        ]
        read_only_fields = ['last_reviewed_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class KanjiFavoriteSerializer(serializers.ModelSerializer):
    """Serializer cho kanji yêu thích"""
    kanji = KanjiSerializer(read_only=True)
    kanji_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = KanjiFavorite
        fields = ['id', 'kanji', 'kanji_id', 'created_at']
        read_only_fields = ['created_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

