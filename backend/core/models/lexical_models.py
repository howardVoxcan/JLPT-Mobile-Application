from django.db import models

class Kanji(models.Model):
    kanji_id = models.CharField(primary_key=True, max_length=20)
    character = models.CharField(max_length=10)
    onyomi = models.CharField(max_length=100, blank=True, null=True)
    kunyomi = models.CharField(max_length=100, blank=True, null=True)
    meaning = models.TextField(blank=True, null=True)
    strokes = models.IntegerField(blank=True, null=True)
    jlpt_level = models.CharField(max_length=5, blank=True, null=True)
    example = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.character


class Word(models.Model):
    word_id = models.CharField(primary_key=True, max_length=50)
    word = models.CharField(max_length=255)
    reading = models.CharField(max_length=255, blank=True, null=True)
    meaning = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=50, blank=True, null=True)
    example = models.TextField(blank=True, null=True)
    jlpt_level = models.CharField(max_length=5, blank=True, null=True)
    pronunciation_url = models.URLField(blank=True, null=True)
    kanji = models.ForeignKey(Kanji, on_delete=models.SET_NULL, null=True, related_name='words')

    def __str__(self):
        return self.word
