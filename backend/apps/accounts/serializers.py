from rest_framework import serializers
from .models import User


# ==================================================
# READ serializer – dùng cho Profile / Me API
# ==================================================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "avatar",
            "vocab_level",
            "kanji_level",
            "grammar_level",
            "reading_level",
            "listening_level",
            "exam_level",
        ]

# ==================================================
# WRITE serializer – dùng cho Update Profile
# ==================================================
class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "full_name",
            "avatar",
        ]

# ==================================================
# WRITE serializer – dùng cho Register
# ==================================================
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={"input_type": "password"}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = (
            "full_name",
            "email",
            "password",
            "confirm_password",
        )

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email đã được sử dụng")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "Mật khẩu xác nhận không khớp"
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")

        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            full_name=validated_data.get("full_name", "")
        )
        return user

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=password
        )

        if not user:
            raise serializers.ValidationError("Email hoặc mật khẩu không đúng")

        data = super().validate({
            "email": user.email,
            "password": password,
        })

        return data

