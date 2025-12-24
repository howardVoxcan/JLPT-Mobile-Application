from rest_framework.views import APIView
from rest_framework.response import Response
from .models import DictionaryEntry
from .serializers import DictionaryEntrySerializer


class DictionarySearchAPIView(APIView):
    """
    /api/dictionary/search/?q=xxx&type=vocab
    """

    def get(self, request):
        keyword = request.query_params.get("q", "")
        entry_type = request.query_params.get("type")

        qs = DictionaryEntry.objects.all()

        if keyword:
            qs = qs.filter(keyword__icontains=keyword)

        if entry_type:
            qs = qs.filter(entry_type=entry_type)

        qs = qs.order_by("keyword")[:20]

        serializer = DictionaryEntrySerializer(qs, many=True)
        return Response(serializer.data)
