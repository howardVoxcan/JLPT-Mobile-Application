from rest_framework import serializers
from .models import Voice, ShadowingSession


class VoiceSerializer(serializers.ModelSerializer):
    """Serializer cho Voice model"""
    
    class Meta:
        model = Voice
        fields = ['id', 'name', 'display_name', 'gender', 'language', 'description']


class ShadowingSessionCreateSerializer(serializers.ModelSerializer):
    """Serializer để tạo session mới"""
    
    class Meta:
        model = ShadowingSession
        fields = [
            'input_type', 'text_input', 'image', 
            'voice', 'speed', 'pitch'
        ]
    
    def validate_speed(self, value):
        """Validate speed trong khoảng 0.5 - 2.0"""
        if value < 0.5 or value > 2.0:
            raise serializers.ValidationError("Tốc độ phải trong khoảng 0.5 - 2.0")
        return value
    
    def validate_pitch(self, value):
        """Validate pitch trong khoảng -10 đến +10"""
        if value < -10 or value > 10:
            raise serializers.ValidationError("Cao thấp phải trong khoảng -10 đến +10")
        return value
    
    def validate(self, data):
        """Validate text_input hoặc image phải có ít nhất 1 cái"""
        if data.get('input_type') == 'text' and not data.get('text_input'):
            raise serializers.ValidationError("Vui lòng nhập văn bản")
        if data.get('input_type') == 'image' and not data.get('image'):
            raise serializers.ValidationError("Vui lòng tải lên hình ảnh")
        return data


class ShadowingSessionSerializer(serializers.ModelSerializer):
    """Serializer cho session detail"""
    voice_name = serializers.ReadOnlyField(source='voice.name')
    voice_display_name = serializers.ReadOnlyField(source='voice.display_name')
    audio_url = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ShadowingSession
        fields = [
            'id', 'input_type', 'text_input', 'image_url',
            'voice', 'voice_name', 'voice_display_name',
            'speed', 'pitch',
            'audio_file', 'audio_url', 'audio_duration',
            'character_count', 'created_at', 'updated_at'
        ]
    
    def get_audio_url(self, obj):
        """Trả về URL đầy đủ của audio file"""
        if obj.audio_file:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.audio_file.url) if request else obj.audio_file.url
        return None
    
    def get_image_url(self, obj):
        """Trả về URL đầy đủ của image"""
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class ShadowingSessionListSerializer(serializers.ModelSerializer):
    """Serializer cho danh sách sessions (lite version)"""
    voice_name = serializers.ReadOnlyField(source='voice.name')
    audio_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ShadowingSession
        fields = [
            'id', 'input_type', 'voice_name',
            'audio_url', 'audio_duration', 'character_count', 'created_at'
        ]
    
    def get_audio_url(self, obj):
        if obj.audio_file:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.audio_file.url) if request else obj.audio_file.url
        return None

