"""
Django Management Command để thêm dữ liệu từ điển
Chạy: python manage.py populate_dictionary
"""
from django.core.management.base import BaseCommand
from apps.dictionary.models import DictionaryEntry


class Command(BaseCommand):
    help = 'Thêm dữ liệu mẫu vào Dictionary'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Xóa tất cả dữ liệu cũ trước khi thêm mới',
        )

    def handle(self, *args, **options):
        self.stdout.write("=" * 60)
        self.stdout.write(self.style.SUCCESS("POPULATE DICTIONARY DATA"))
        self.stdout.write("=" * 60)
        
        # Xóa dữ liệu cũ nếu có flag --clear
        if options['clear']:
            count = DictionaryEntry.objects.count()
            if count > 0:
                DictionaryEntry.objects.all().delete()
                self.stdout.write(self.style.WARNING(f"Đã xóa {count} entries cũ"))
        
        self.stdout.write("\nĐang thêm dữ liệu mới...")
        
        # Thêm dữ liệu
        vocab_count = self.add_vocabulary_data()
        kanji_count = self.add_kanji_data()
        grammar_count = self.add_grammar_data()
        sentence_count = self.add_sentence_data()
        
        # Thống kê
        self.stdout.write("\n" + "=" * 60)
        self.stdout.write(self.style.SUCCESS("THỐNG KÊ"))
        self.stdout.write("=" * 60)
        
        total = DictionaryEntry.objects.count()
        self.stdout.write(f"Tổng số entries: {total}")
        self.stdout.write(f"   - Từ vựng: {vocab_count}")
        self.stdout.write(f"   - Kanji: {kanji_count}")
        self.stdout.write(f"   - Ngữ pháp: {grammar_count}")
        self.stdout.write(f"   - Mẫu câu: {sentence_count}")
        self.stdout.write("\n" + "=" * 60)
        self.stdout.write(self.style.SUCCESS("HOÀN THÀNH!"))
        self.stdout.write("=" * 60)

    def add_vocabulary_data(self):
        """Thêm từ vựng JLPT"""
        
        vocabulary_data = [
            # JLPT N5 - Cơ bản
            {
                "entry_type": "vocab",
                "keyword": "こんにちは",
                "reading": "こんにちは",
                "meaning": "Xin chào (ban ngày)",
                "extra": "例：こんにちは、田中さん。 - Xin chào Tanaka-san.",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "vocab",
                "keyword": "ありがとう",
                "reading": "ありがとう",
                "meaning": "Cảm ơn",
                "extra": "例：ありがとうございます。 - Cảm ơn rất nhiều (lịch sự).",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "vocab",
                "keyword": "食べる",
                "reading": "たべる",
                "meaning": "Ăn",
                "extra": "例：朝ごはんを食べます。 - Tôi ăn bữa sáng.\n動詞グループ II (ru-verb)",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "vocab",
                "keyword": "飲む",
                "reading": "のむ",
                "meaning": "Uống",
                "extra": "例：コーヒーを飲みます。 - Tôi uống cà phê.\n動詞グループ I (u-verb)",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "vocab",
                "keyword": "行く",
                "reading": "いく",
                "meaning": "Đi",
                "extra": "例：学校に行きます。 - Tôi đi đến trường.\n動詞グループ I",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "vocab",
                "keyword": "来る",
                "reading": "くる",
                "meaning": "Đến",
                "extra": "例：友達が来ます。 - Bạn tôi đến.\n動詞グループ III (bất quy tắc)",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "vocab",
                "keyword": "見る",
                "reading": "みる",
                "meaning": "Nhìn, xem",
                "extra": "例：テレビを見ます。 - Tôi xem tivi.\n例：映画を見ました。 - Tôi đã xem phim.",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "vocab",
                "keyword": "聞く",
                "reading": "きく",
                "meaning": "Nghe, hỏi",
                "extra": "例：音楽を聞きます。 - Tôi nghe nhạc.\n例：先生に聞きます。 - Tôi hỏi thầy giáo.",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "vocab",
                "keyword": "読む",
                "reading": "よむ",
                "meaning": "Đọc",
                "extra": "例：本を読みます。 - Tôi đọc sách.",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "vocab",
                "keyword": "書く",
                "reading": "かく",
                "meaning": "Viết",
                "extra": "例：手紙を書きます。 - Tôi viết thư.",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "vocab",
                "keyword": "話す",
                "reading": "はなす",
                "meaning": "Nói chuyện",
                "extra": "例：日本語を話します。 - Tôi nói tiếng Nhật.",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "vocab",
                "keyword": "勉強する",
                "reading": "べんきょうする",
                "meaning": "Học, học tập",
                "extra": "例：毎日勉強します。 - Tôi học mỗi ngày.\n動詞グループ III",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "vocab",
                "keyword": "働く",
                "reading": "はたらく",
                "meaning": "Làm việc",
                "extra": "例：会社で働きます。 - Tôi làm việc tại công ty.",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "vocab",
                "keyword": "買う",
                "reading": "かう",
                "meaning": "Mua",
                "extra": "例：パンを買います。 - Tôi mua bánh mì.",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "vocab",
                "keyword": "売る",
                "reading": "うる",
                "meaning": "Bán",
                "extra": "例：車を売ります。 - Tôi bán xe hơi.",
                "jlpt_level": "N5"
            },
            
            # JLPT N4
            {
                "entry_type": "vocab",
                "keyword": "覚える",
                "reading": "おぼえる",
                "meaning": "Nhớ, ghi nhớ",
                "extra": "例：単語を覚えます。 - Tôi ghi nhớ từ vựng.",
                "jlpt_level": "N4"
            },
            {
                "entry_type": "vocab",
                "keyword": "忘れる",
                "reading": "わすれる",
                "meaning": "Quên",
                "extra": "例：名前を忘れました。 - Tôi quên tên rồi.",
                "jlpt_level": "N4"
            },
            {
                "entry_type": "vocab",
                "keyword": "始める",
                "reading": "はじめる",
                "meaning": "Bắt đầu",
                "extra": "例：仕事を始めます。 - Tôi bắt đầu công việc.",
                "jlpt_level": "N4"
            },
            {
                "entry_type": "vocab",
                "keyword": "終わる",
                "reading": "おわる",
                "meaning": "Kết thúc",
                "extra": "例：授業が終わりました。 - Lớp học đã kết thúc.",
                "jlpt_level": "N4"
            },
            {
                "entry_type": "vocab",
                "keyword": "答える",
                "reading": "こたえる",
                "meaning": "Trả lời",
                "extra": "例：質問に答えます。 - Tôi trả lời câu hỏi.",
                "jlpt_level": "N4"
            },
            
            # JLPT N3
            {
                "entry_type": "vocab",
                "keyword": "頑張る",
                "reading": "がんばる",
                "meaning": "Cố gắng, nỗ lực",
                "extra": "例：試験のために頑張ります。 - Tôi cố gắng cho kỳ thi.",
                "jlpt_level": "N3"
            },
            {
                "entry_type": "vocab",
                "keyword": "諦める",
                "reading": "あきらめる",
                "meaning": "Từ bỏ",
                "extra": "例：夢を諦めないでください。 - Đừng từ bỏ ước mơ.",
                "jlpt_level": "N3"
            },
            {
                "entry_type": "vocab",
                "keyword": "相談する",
                "reading": "そうだんする",
                "meaning": "Bàn bạc, trao đổi",
                "extra": "例：友達に相談します。 - Tôi bàn bạc với bạn bè.",
                "jlpt_level": "N3"
            },
            {
                "entry_type": "vocab",
                "keyword": "説明する",
                "reading": "せつめいする",
                "meaning": "Giải thích",
                "extra": "例：もう一度説明してください。 - Hãy giải thích lại một lần nữa.",
                "jlpt_level": "N3"
            },
            {
                "entry_type": "vocab",
                "keyword": "約束する",
                "reading": "やくそくする",
                "meaning": "Hứa, hẹn",
                "extra": "例：友達と映画を見る約束をしました。 - Tôi đã hẹn xem phim với bạn.",
                "jlpt_level": "N3"
            },
        ]
        
        for data in vocabulary_data:
            DictionaryEntry.objects.get_or_create(
                keyword=data['keyword'],
                entry_type=data['entry_type'],
                defaults=data
            )
        
        self.stdout.write(self.style.SUCCESS(f"Đã thêm {len(vocabulary_data)} từ vựng"))
        return len(vocabulary_data)

    def add_kanji_data(self):
        """Thêm kanji JLPT"""
        
        kanji_data = [
            # JLPT N5 Kanji
            {
                "entry_type": "kanji",
                "keyword": "日",
                "reading": "ニチ、ジツ、ひ、か",
                "meaning": "Ngày, mặt trời",
                "extra": "音読み: ニチ、ジツ\n訓読み: ひ、か\n\n例：\n• 日本 (にほん) - Nhật Bản\n• 毎日 (まいにち) - mỗi ngày\n• 日曜日 (にちようび) - Chủ nhật\n• 誕生日 (たんじょうび) - sinh nhật",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "kanji",
                "keyword": "本",
                "reading": "ホン、もと",
                "meaning": "Sách, gốc, cái",
                "extra": "音読み: ホン\n訓読み: もと\n\n例：\n• 本 (ほん) - sách\n• 日本 (にほん) - Nhật Bản\n• 本当 (ほんとう) - thật sự\n• 三本 (さんぼん) - ba cái (đếm vật dài)",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "kanji",
                "keyword": "人",
                "reading": "ジン、ニン、ひと",
                "meaning": "Người",
                "extra": "音読み: ジン、ニン\n訓読み: ひと\n\n例：\n• 人 (ひと) - người\n• 日本人 (にほんじん) - người Nhật\n• 二人 (ふたり) - hai người\n• 一人 (ひとり) - một người",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "kanji",
                "keyword": "学",
                "reading": "ガク、まな-ぶ",
                "meaning": "Học",
                "extra": "音読み: ガク\n訓読み: まな-ぶ\n\n例：\n• 学生 (がくせい) - học sinh\n• 学校 (がっこう) - trường học\n• 大学 (だいがく) - đại học\n• 勉強 (べんきょう) - học tập",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "kanji",
                "keyword": "生",
                "reading": "セイ、ショウ、い-きる、う-まれる",
                "meaning": "Sinh, sống",
                "extra": "音読み: セイ、ショウ\n訓読み: い-きる、う-まれる、なま\n\n例：\n• 学生 (がくせい) - học sinh\n• 先生 (せんせい) - giáo viên\n• 誕生日 (たんじょうび) - sinh nhật\n• 人生 (じんせい) - cuộc đời",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "kanji",
                "keyword": "食",
                "reading": "ショク、た-べる",
                "meaning": "Ăn, thức ăn",
                "extra": "音読み: ショク\n訓読み: た-べる\n\n例：\n• 食べる (たべる) - ăn\n• 食事 (しょくじ) - bữa ăn\n• 朝食 (ちょうしょく) - bữa sáng\n• 食堂 (しょくどう) - nhà ăn",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "kanji",
                "keyword": "時",
                "reading": "ジ、とき",
                "meaning": "Thời gian, lúc",
                "extra": "音読み: ジ\n訓読み: とき\n\n例：\n• 時間 (じかん) - thời gian\n• 何時 (なんじ) - mấy giờ\n• 時々 (ときどき) - đôi khi\n• 時計 (とけい) - đồng hồ",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "kanji",
                "keyword": "間",
                "reading": "カン、ケン、あいだ、ま",
                "meaning": "Khoảng, giữa",
                "extra": "音読み: カン、ケン\n訓読み: あいだ、ま\n\n例：\n• 時間 (じかん) - thời gian\n• 間 (あいだ) - khoảng giữa\n• 人間 (にんげん) - con người\n• 一週間 (いっしゅうかん) - một tuần",
                "jlpt_level": "N5"
            },
            
            # JLPT N4 Kanji
            {
                "entry_type": "kanji",
                "keyword": "考",
                "reading": "コウ、かんが-える",
                "meaning": "Nghĩ, suy nghĩ",
                "extra": "音読み: コウ\n訓読み: かんが-える\n\n例：\n• 考える (かんがえる) - suy nghĩ\n• 考え (かんがえ) - ý kiến, ý nghĩ\n• 参考 (さんこう) - tham khảo",
                "jlpt_level": "N4"
            },
            {
                "entry_type": "kanji",
                "keyword": "意",
                "reading": "イ",
                "meaning": "Ý nghĩa, ý định",
                "extra": "音読み: イ\n\n例：\n• 意味 (いみ) - ý nghĩa\n• 意見 (いけん) - ý kiến\n• 注意 (ちゅうい) - chú ý\n• 意外 (いがい) - bất ngờ",
                "jlpt_level": "N4"
            },
        ]
        
        for data in kanji_data:
            DictionaryEntry.objects.get_or_create(
                keyword=data['keyword'],
                entry_type=data['entry_type'],
                defaults=data
            )
        
        self.stdout.write(self.style.SUCCESS(f"Đã thêm {len(kanji_data)} kanji"))
        return len(kanji_data)

    def add_grammar_data(self):
        """Thêm ngữ pháp JLPT"""
        
        grammar_data = [
            # JLPT N5 Grammar
            {
                "entry_type": "grammar",
                "keyword": "〜は〜です",
                "reading": "〜は〜です",
                "meaning": "~ là ~",
                "extra": "Cấu trúc: [Danh từ] は [Danh từ/Tính từ] です\n\n例：\n• 私は学生です。 - Tôi là học sinh.\n• これは本です。 - Đây là quyển sách.\n• 今日は月曜日です。 - Hôm nay là thứ hai.",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "grammar",
                "keyword": "〜ます",
                "reading": "〜ます",
                "meaning": "Thể lịch sự của động từ",
                "extra": "Cấu trúc: [Động từ-masu]\n\n例：\n• 食べます - ăn\n• 行きます - đi\n• 勉強します - học\n\nPhủ định: 〜ません\nQuá khứ: 〜ました",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "grammar",
                "keyword": "〜を〜ます",
                "reading": "〜を〜ます",
                "meaning": "Đánh dấu tân ngữ trực tiếp",
                "extra": "Cấu trúc: [Danh từ] を [Động từ]\n\n例：\n• 本を読みます。 - Đọc sách.\n• コーヒーを飲みます。 - Uống cà phê.\n• 日本語を勉強します。 - Học tiếng Nhật.",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "grammar",
                "keyword": "〜に行きます",
                "reading": "〜にいきます",
                "meaning": "Đi đến ~",
                "extra": "Cấu trúc: [Địa điểm] に 行きます\n\n例：\n• 学校に行きます。 - Đi đến trường.\n• 日本に行きたいです。 - Tôi muốn đi Nhật.\n• 図書館に行きました。 - Tôi đã đi thư viện.",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "grammar",
                "keyword": "〜たいです",
                "reading": "〜たいです",
                "meaning": "Muốn ~",
                "extra": "Cấu trúc: [Động từ-masu stem] たいです\n\n例：\n• 食べたいです。 - Muốn ăn.\n• 日本に行きたいです。 - Muốn đi Nhật.\n• 映画を見たいです。 - Muốn xem phim.\n\nPhủ định: 〜たくないです",
                "jlpt_level": "N5"
            },
            
            # JLPT N4 Grammar
            {
                "entry_type": "grammar",
                "keyword": "〜てはいけません",
                "reading": "〜てはいけません",
                "meaning": "Không được ~, cấm ~",
                "extra": "Cấu trúc: [Động từ-te] はいけません\n\n例：\n• ここで写真を撮ってはいけません。 - Không được chụp ảnh ở đây.\n• たばこを吸ってはいけません。 - Không được hút thuốc.\n• 遅刻してはいけません。 - Không được đi trễ.",
                "jlpt_level": "N4"
            },
            {
                "entry_type": "grammar",
                "keyword": "〜なければなりません",
                "reading": "〜なければなりません",
                "meaning": "Phải ~",
                "extra": "Cấu trúc: [Động từ-nai] なければなりません\n\n例：\n• 宿題をしなければなりません。 - Phải làm bài tập.\n• 早く起きなければなりません。 - Phải dậy sớm.\n• 薬を飲まなければなりません。 - Phải uống thuốc.",
                "jlpt_level": "N4"
            },
            {
                "entry_type": "grammar",
                "keyword": "〜たことがあります",
                "reading": "〜たことがあります",
                "meaning": "Đã từng ~",
                "extra": "Cấu trúc: [Động từ-ta] ことがあります\n\n例：\n• 日本に行ったことがあります。 - Tôi đã từng đi Nhật.\n• 寿司を食べたことがあります。 - Tôi đã từng ăn sushi.\n• 富士山を見たことがありますか。 - Bạn đã từng thấy núi Phú Sĩ chưa?",
                "jlpt_level": "N4"
            },
            
            # JLPT N3 Grammar
            {
                "entry_type": "grammar",
                "keyword": "〜によると",
                "reading": "〜によると",
                "meaning": "Theo ~",
                "extra": "Cấu trúc: [Danh từ] によると\n\n例：\n• 天気予報によると、明日は雨です。 - Theo dự báo thời tiết, ngày mai trời mưa.\n• ニュースによると、事故がありました。 - Theo tin tức, đã có tai nạn.\n• 先生によると、試験は難しいです。 - Theo thầy giáo, kỳ thi khó.",
                "jlpt_level": "N3"
            },
            {
                "entry_type": "grammar",
                "keyword": "〜ために",
                "reading": "〜ために",
                "meaning": "Để ~, vì ~",
                "extra": "Cấu trúc: [Động từ/Danh từ] ために\n\n例：\n• 試験に合格するために、毎日勉強します。 - Để đỗ kỳ thi, tôi học mỗi ngày.\n• 健康のために、運動します。 - Vì sức khỏe, tôi tập thể dục.\n• お金を貯めるために、働きます。 - Để tiết kiệm tiền, tôi làm việc.",
                "jlpt_level": "N3"
            },
        ]
        
        for data in grammar_data:
            DictionaryEntry.objects.get_or_create(
                keyword=data['keyword'],
                entry_type=data['entry_type'],
                defaults=data
            )
        
        self.stdout.write(self.style.SUCCESS(f"Đã thêm {len(grammar_data)} ngữ pháp"))
        return len(grammar_data)

    def add_sentence_data(self):
        """Thêm mẫu câu thông dụng"""
        
        sentence_data = [
            {
                "entry_type": "sentence",
                "keyword": "はじめまして",
                "reading": "はじめまして",
                "meaning": "Rất hân hạnh được gặp (lần đầu gặp)",
                "extra": "Sử dụng: Khi gặp ai đó lần đầu tiên\n\n会話例：\nA: はじめまして、田中です。\nB: はじめまして、山田です。どうぞよろしくお願いします。",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "sentence",
                "keyword": "お元気ですか",
                "reading": "おげんきですか",
                "meaning": "Bạn có khỏe không?",
                "extra": "Sử dụng: Hỏi thăm sức khỏe\n\n返事：\n• はい、元気です。 - Vâng, tôi khỏe.\n• おかげさまで。 - Nhờ bạn hỏi (tôi khỏe).",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "sentence",
                "keyword": "いただきます",
                "reading": "いただきます",
                "meaning": "Tôi xin phép dùng bữa",
                "extra": "Sử dụng: Trước khi ăn\n\n注意：\n• Nói trước khi bắt đầu ăn\n• Thể hiện lòng biết ơn với thức ăn",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "sentence",
                "keyword": "ごちそうさまでした",
                "reading": "ごちそうさまでした",
                "meaning": "Cảm ơn bữa ăn ngon",
                "extra": "Sử dụng: Sau khi ăn xong\n\n注意：\n• Nói sau khi ăn xong\n• Thể hiện lòng biết ơn",
                "jlpt_level": "N5"
            },
            {
                "entry_type": "sentence",
                "keyword": "お疲れ様でした",
                "reading": "おつかれさまでした",
                "meaning": "Bạn đã vất vả rồi (cảm ơn vì công sức)",
                "extra": "Sử dụng: Sau khi làm việc, tan làm\n\n場面：\n• Đồng nghiệp tan làm\n• Sau khi hoàn thành công việc chung",
                "jlpt_level": "N4"
            },
        ]
        
        for data in sentence_data:
            DictionaryEntry.objects.get_or_create(
                keyword=data['keyword'],
                entry_type=data['entry_type'],
                defaults=data
            )
        
        self.stdout.write(self.style.SUCCESS(f"Đã thêm {len(sentence_data)} mẫu câu"))
        return len(sentence_data)

