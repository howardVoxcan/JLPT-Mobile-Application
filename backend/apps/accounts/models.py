from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


# =========================
# User Manager
# =========================
class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self._create_user(email, password, **extra_fields)


# =========================
# JLPT Level Choices
# =========================
class JLPTLevel(models.TextChoices):
    N5 = "N5", "N5"
    N4 = "N4", "N4"
    N3 = "N3", "N3"
    N2 = "N2", "N2"
    N1 = "N1", "N1"


# =========================
# Custom User Model
# =========================
class User(AbstractUser):
    """
    User model cho app học JLPT
    Khớp màn hình Profile người học
    """

    # ---- AUTH ----
    username=None

    full_name = models.CharField(
        max_length=255,
        help_text="Tên hiển thị trên profile"
    )
    
    email = models.EmailField(
        unique=True,
        db_index=True
    )

    avatar = models.ImageField(
        upload_to="avatars/",
        null=True,
        blank=True
    )

    # ---- LEVEL / PROGRESS SUMMARY (hiển thị UI) ----
    vocab_level = models.CharField(
        max_length=2,
        choices=JLPTLevel.choices,
        default=JLPTLevel.N5
    )

    kanji_level = models.CharField(
        max_length=2,
        choices=JLPTLevel.choices,
        default=JLPTLevel.N5
    )

    grammar_level = models.CharField(
        max_length=2,
        choices=JLPTLevel.choices,
        default=JLPTLevel.N5
    )

    reading_level = models.CharField(
        max_length=2,
        choices=JLPTLevel.choices,
        default=JLPTLevel.N5
    )

    listening_level = models.CharField(
        max_length=2,
        choices=JLPTLevel.choices,
        default=JLPTLevel.N5
    )

    exam_level = models.CharField(
        max_length=2,
        choices=JLPTLevel.choices,
        default=JLPTLevel.N5
    )

    # ---- SYSTEM ----
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ---- LOGIN CONFIG ----
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    objects = UserManager()

    def __str__(self):
        return self.email
