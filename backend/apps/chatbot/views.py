from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ChatSession, ChatMessage
from .services import get_gemini_response


class ChatbotAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user_message = request.data.get("message")
        session_id = request.data.get("session_id")

        if not user_message:
            return Response({"error": "Message is required"}, status=400)

        # Lấy hoặc tạo session
        if session_id:
            session = ChatSession.objects.get(id=session_id, user=user)
        else:
            session = ChatSession.objects.create(user=user)

        # Lưu message user
        ChatMessage.objects.create(
            session=session,
            role="user",
            content=user_message
        )

        # Lấy lịch sử chat
        messages = [
            {"role": msg.role, "content": msg.content}
            for msg in session.messages.all()
        ]

        # Gọi AI
        ai_reply = get_gemini_response(messages)

        # Lưu reply
        ChatMessage.objects.create(
            session=session,
            role="assistant",
            content=ai_reply
        )

        return Response({
            "session_id": session.id,
            "reply": ai_reply
        })
