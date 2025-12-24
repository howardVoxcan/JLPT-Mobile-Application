from django.urls import path
from .views import DictionarySearchAPIView

urlpatterns = [
    path("search/", DictionarySearchAPIView.as_view()),
]
