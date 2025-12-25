from rest_framework import serializers


class NotebookCategorySummarySerializer(serializers.Serializer):
    """Serializer for notebook category summary"""
    category = serializers.CharField()
    completed_levels = serializers.IntegerField()
    in_progress_levels = serializers.IntegerField()
    total_levels = serializers.IntegerField()


class NotebookLevelDetailSerializer(serializers.Serializer):
    """Serializer for level detail in notebook"""
    level = serializers.CharField()
    status = serializers.CharField()  # 'completed', 'in-progress', 'not-started', 'locked'
    lessons_completed = serializers.IntegerField()
    total_lessons = serializers.IntegerField()
    mastered_items = serializers.IntegerField()  # Từ/Kanji/Ngữ pháp đã thành thạo
    total_items = serializers.IntegerField()
    completion_percent = serializers.IntegerField()
    reviewed_items = serializers.IntegerField()
    review_total = serializers.IntegerField()
    locked = serializers.BooleanField()

