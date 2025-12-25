from django.db import models
from django.conf import settings

# Notebook app không cần models riêng
# Nó sẽ aggregate data từ các app khác:
# - vocab, kanji, grammar, reading, listening, jlpt_practice
