# Generated manually to remove unused UserQuestionProgress model

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('study', '0002_userquestionprogress'),
    ]

    operations = [
        migrations.DeleteModel(
            name='UserQuestionProgress',
        ),
    ]

