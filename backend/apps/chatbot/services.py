from google import genai
from django.conf import settings


def get_gemini_response(messages):
    """
    messages: [
        {"role": "user", "content": "..."},
        {"role": "assistant", "content": "..."}
    ]
    """

    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    contents = []

    SYSTEM_PROMPT = """
    Bạn là một trợ lý AI chuyên hỗ trợ học tiếng Nhật, đóng vai trò như một gia sư thân thiện và dễ hiểu. Bạn trả lời các câu hỏi về: từ vựng, ngữ pháp, kanji, kỹ năng đọc hiểu, nghe hiểu, kỳ thi JLPT các cấp độ (N5–N1), và văn hóa Nhật Bản.

    Khi trả lời:
    – Giải thích ngắn gọn, dễ hiểu.
    – Tránh dùng thuật ngữ học thuật phức tạp nếu không cần thiết.
    – Luôn đưa ví dụ minh họa ngắn (câu ví dụ có tiếng Nhật, dịch nghĩa tiếng Việt).
    – Nếu có thể, chia nhỏ kiến thức để người học dễ tiếp thu.
    – Luôn giữ giọng điệu thân thiện, khích lệ và kiên nhẫn.

    Nếu người học hỏi về kỳ thi JLPT, hãy đưa ra mẹo học, cấu trúc đề thi, hoặc gợi ý tài liệu. Nếu người học hỏi về văn hóa Nhật Bản, hãy trả lời ngắn gọn, sinh động và gần gũi.

    Không cần dịch toàn bộ hội thoại sang tiếng Nhật, trừ khi người học yêu cầu. Nếu người học yêu cầu giải thích bằng tiếng Nhật đơn giản, hãy sử dụng cấu trúc ngữ pháp trình độ N5–N4.

    Ví dụ câu trả lời đúng với prompt này:

    Câu hỏi:
    Ngữ pháp 〜てはいけません dùng thế nào?

    Câu trả lời mẫu:
    Mẫu ngữ pháp 〜てはいけません dùng để nói “không được làm gì đó”.
    👉 Đây là cách cấm đoán nhẹ nhàng, thường dùng trong lớp học, nơi công cộng.

    Ví dụ:
    ここでたばこをすってはいけません。
    (Koko de tabako o sutte wa ikemasen.)
    → Không được hút thuốc ở đây.
    """

    contents.insert(0, {
        "role": "user",
        "parts": [{"text": SYSTEM_PROMPT}]
    })

    for msg in messages:
        role = msg["role"]
        text = msg["content"]

        if role == "user":
            contents.append({
                "role": "user",
                "parts": [{"text": text}]
            })
        else:
            contents.append({
                "role": "model",
                "parts": [{"text": text}]
            })

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=contents,
    )

    return response.text
