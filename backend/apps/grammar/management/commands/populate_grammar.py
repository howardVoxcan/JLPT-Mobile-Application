from django.core.management.base import BaseCommand
from django.db import transaction
from apps.grammar.models import GrammarLesson, GrammarProgress
from apps.study.models import Question, Choice


class Command(BaseCommand):
    help = "Populate grammar lessons with rich data for N5, N4, N3"

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Clear existing data before populating')

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing grammar data...')
            GrammarProgress.objects.all().delete()
            GrammarLesson.objects.all().delete()
            Question.objects.filter(grammarlesson__isnull=False).delete()
            self.stdout.write(self.style.SUCCESS('Data cleared'))

        self.stdout.write('Starting grammar data population...')
        
        with transaction.atomic():
            # N5 LESSONS
            self.create_n5_lessons()
            # N4 LESSONS
            self.create_n4_lessons()
            # N3 LESSONS
            self.create_n3_lessons()

        self.stdout.write(self.style.SUCCESS('\nSuccessfully populated grammar data!'))
        self.stdout.write(f'Total lessons: {GrammarLesson.objects.count()}')

    def create_n5_lessons(self):
        self.stdout.write('\nCreating N5 grammar lessons...')
        
        # LESSON 1: です/だ
        lesson1 = GrammarLesson.objects.create(
            level='N5',
            order=1,
            title='です・だ - Động từ liên kết',
            grammar_point_count=2,
            content='''
【です (desu)】
- Sử dụng: Thể lịch sự của động từ liên kết
- Cấu trúc: [Danh từ] + です
- Ý nghĩa: "là", "thì"
- Ví dụ:
  • 私は学生です。(Watashi wa gakusei desu.) - Tôi là học sinh.
  • これは本です。(Kore wa hon desu.) - Đây là quyển sách.

【だ (da)】
- Sử dụng: Thể thường của động từ liên kết
- Cấu trúc: [Danh từ] + だ
- Ví dụ:
  • 田中さんは先生だ。(Tanaka-san wa sensei da.) - Anh Tanaka là giáo viên.
'''
        )
        
        q1 = Question.objects.create(prompt='私___学生です。')
        Choice.objects.bulk_create([
            Choice(question=q1, text='は', is_correct=True),
            Choice(question=q1, text='が', is_correct=False),
            Choice(question=q1, text='を', is_correct=False),
            Choice(question=q1, text='に', is_correct=False),
        ])
        
        q2 = Question.objects.create(prompt='これ___本です。')
        Choice.objects.bulk_create([
            Choice(question=q2, text='は', is_correct=True),
            Choice(question=q2, text='も', is_correct=False),
            Choice(question=q2, text='が', is_correct=False),
            Choice(question=q2, text='で', is_correct=False),
        ])
        
        q3 = Question.objects.create(prompt='山田さん___日本人です。')
        Choice.objects.bulk_create([
            Choice(question=q3, text='は', is_correct=True),
            Choice(question=q3, text='の', is_correct=False),
            Choice(question=q3, text='を', is_correct=False),
            Choice(question=q3, text='へ', is_correct=False),
        ])
        
        lesson1.questions.add(q1, q2, q3)

        # LESSON 2: の
        lesson2 = GrammarLesson.objects.create(
            level='N5',
            order=2,
            title='の - Trợ từ sở hữu',
            grammar_point_count=1,
            content='''
【の (no)】
- Sử dụng: Biểu thị quan hệ sở hữu, liên kết danh từ
- Cấu trúc: [Danh từ 1] + の + [Danh từ 2]
- Ý nghĩa: "của", quan hệ thuộc về
- Ví dụ:
  • 私の本 (watashi no hon) - Sách của tôi
  • 日本の車 (Nihon no kuruma) - Xe hơi của Nhật Bản
  • 先生の鞄 (sensei no kaban) - Cặp của giáo viên
  • 田中さんのペン (Tanaka-san no pen) - Bút của anh Tanaka

【Lưu ý】
- の có thể thay thế danh từ (dùng như đại từ)
- Ví dụ: これは私のです。(Đây là của tôi.)
'''
        )
        
        q1 = Question.objects.create(prompt='これは田中さん___本です。')
        Choice.objects.bulk_create([
            Choice(question=q1, text='の', is_correct=True),
            Choice(question=q1, text='は', is_correct=False),
            Choice(question=q1, text='が', is_correct=False),
            Choice(question=q1, text='を', is_correct=False),
        ])
        
        q2 = Question.objects.create(prompt='日本___料理が好きです。')
        Choice.objects.bulk_create([
            Choice(question=q2, text='の', is_correct=True),
            Choice(question=q2, text='で', is_correct=False),
            Choice(question=q2, text='に', is_correct=False),
            Choice(question=q2, text='と', is_correct=False),
        ])
        
        q3 = Question.objects.create(prompt='私___車は白いです。')
        Choice.objects.bulk_create([
            Choice(question=q3, text='の', is_correct=True),
            Choice(question=q3, text='は', is_correct=False),
            Choice(question=q3, text='が', is_correct=False),
            Choice(question=q3, text='も', is_correct=False),
        ])
        
        lesson2.questions.add(q1, q2, q3)

        # LESSON 3: ます形
        lesson3 = GrammarLesson.objects.create(
            level='N5',
            order=3,
            title='ます形 - Thể lịch sự động từ',
            grammar_point_count=3,
            content='''
【ます (masu) - Hiện tại/Tương lai khẳng định】
- Cấu trúc: [Động từ gốc] + ます
- Ví dụ:
  • 食べます (tabemasu) - Ăn
  • 行きます (ikimasu) - Đi
  • 見ます (mimasu) - Nhìn

【ません (masen) - Hiện tại/Tương lai phủ định】
- Cấu trúc: [Động từ gốc] + ません
- Ví dụ:
  • 食べません (tabemasen) - Không ăn
  • 行きません (ikimasen) - Không đi

【ました (mashita) - Quá khứ khẳng định】
- Cấu trúc: [Động từ gốc] + ました
- Ví dụ:
  • 食べました (tabemashita) - Đã ăn
  • 行きました (ikimashita) - Đã đi

【ませんでした (masen deshita) - Quá khứ phủ định】
- Cấu trúc: [Động từ gốc] + ませんでした
- Ví dụ:
  • 食べませんでした (tabemasen deshita) - Đã không ăn
'''
        )
        
        q1 = Question.objects.create(prompt='毎日学校へ___。(Hằng ngày đi đến trường)')
        Choice.objects.bulk_create([
            Choice(question=q1, text='行きます', is_correct=True),
            Choice(question=q1, text='行きました', is_correct=False),
            Choice(question=q1, text='行きません', is_correct=False),
            Choice(question=q1, text='行く', is_correct=False),
        ])
        
        q2 = Question.objects.create(prompt='昨日映画を___。(Hôm qua đã xem phim)')
        Choice.objects.bulk_create([
            Choice(question=q2, text='見ました', is_correct=True),
            Choice(question=q2, text='見ます', is_correct=False),
            Choice(question=q2, text='見る', is_correct=False),
            Choice(question=q2, text='見て', is_correct=False),
        ])
        
        q3 = Question.objects.create(prompt='今日は朝ごはんを___。(Hôm nay không ăn sáng)')
        Choice.objects.bulk_create([
            Choice(question=q3, text='食べませんでした', is_correct=True),
            Choice(question=q3, text='食べません', is_correct=False),
            Choice(question=q3, text='食べました', is_correct=False),
            Choice(question=q3, text='食べます', is_correct=False),
        ])
        
        q4 = Question.objects.create(prompt='明日友達に___。(Ngày mai sẽ gặp bạn)')
        Choice.objects.bulk_create([
            Choice(question=q4, text='会います', is_correct=True),
            Choice(question=q4, text='会いました', is_correct=False),
            Choice(question=q4, text='会う', is_correct=False),
            Choice(question=q4, text='会って', is_correct=False),
        ])
        
        lesson3.questions.add(q1, q2, q3, q4)

        # LESSON 4: て形
        lesson4 = GrammarLesson.objects.create(
            level='N5',
            order=4,
            title='て形 - Thể て',
            grammar_point_count=2,
            content='''
【て形 (te-kei)】
- Sử dụng: Kết nối câu, yêu cầu, cho phép, trạng thái
- Quy tắc biến đổi:
  • Nhóm 1: う→って、つ→って、る→って、ぶ→んで、む→んで、ぬ→んで、く→いて、ぐ→いで、す→して
  • Nhóm 2: る → て
  • Nhóm 3: する→して、くる→きて

【Sử dụng て形】
1. Kết nối câu (làm A rồi làm B):
  • 朝起きて、顔を洗います。(Sáng dậy rồi rửa mặt.)

2. Yêu cầu (~てください):
  • ちょっと待ってください。(Xin hãy đợi một chút.)
  • 静かにしてください。(Xin hãy yên lặng.)

3. Đang làm (~ています):
  • 今、勉強しています。(Bây giờ đang học.)
  • 母は料理をしています。(Mẹ đang nấu ăn.)

4. Cho phép (~てもいいです):
  • ここで写真を撮ってもいいですか。(Chụp ảnh ở đây được không?)
'''
        )
        
        q1 = Question.objects.create(prompt='ちょっと___ください。(Xin hãy chờ một chút)')
        Choice.objects.bulk_create([
            Choice(question=q1, text='待って', is_correct=True),
            Choice(question=q1, text='待ち', is_correct=False),
            Choice(question=q1, text='待つ', is_correct=False),
            Choice(question=q1, text='待った', is_correct=False),
        ])
        
        q2 = Question.objects.create(prompt='今、勉強___います。(Bây giờ đang học)')
        Choice.objects.bulk_create([
            Choice(question=q2, text='して', is_correct=True),
            Choice(question=q2, text='する', is_correct=False),
            Choice(question=q2, text='した', is_correct=False),
            Choice(question=q2, text='し', is_correct=False),
        ])
        
        q3 = Question.objects.create(prompt='朝起きて、顔を___。(Sáng dậy rồi rửa mặt)')
        Choice.objects.bulk_create([
            Choice(question=q3, text='洗います', is_correct=True),
            Choice(question=q3, text='洗う', is_correct=False),
            Choice(question=q3, text='洗いました', is_correct=False),
            Choice(question=q3, text='洗って', is_correct=False),
        ])
        
        lesson4.questions.add(q1, q2, q3)

        # LESSON 5: い形容詞・な形容詞
        lesson5 = GrammarLesson.objects.create(
            level='N5',
            order=5,
            title='形容詞 - Tính từ',
            grammar_point_count=2,
            content='''
【い形容詞 (I-keiyoushi)】
- Đặc điểm: Kết thúc bằng い
- Hiện tại khẳng định: ~いです
  • 大きいです (ookii desu) - Lớn
  • 高いです (takai desu) - Cao, đắt
- Hiện tại phủ định: ~くないです/~くありません
  • 大きくないです - Không lớn
  • 高くありません - Không cao/đắt
- Quá khứ khẳng định: ~かったです
  • 大きかったです - Đã lớn
- Quá khứ phủ định: ~くなかったです/~くありませんでした
  • 大きくなかったです - Đã không lớn

【な形容詞 (Na-keiyoushi)】
- Đặc điểm: Kết nối danh từ bằng な
- Hiện tại khẳng định: ~です
  • 静かです (shizuka desu) - Yên tĩnh
  • きれいです (kirei desu) - Đẹp
- Hiện tại phủ định: ~じゃないです/~ではありません
  • 静かじゃないです - Không yên tĩnh
- Quá khứ khẳng định: ~でした
  • 静かでした - Đã yên tĩnh
- Quá khứ phủ định: ~じゃなかったです/~ではありませんでした
  • 静かじゃなかったです - Đã không yên tĩnh

【Bổ nghĩa cho danh từ】
- い形容詞: 大きい車 (xe lớn)
- な形容詞: 静かな部屋 (phòng yên tĩnh)
'''
        )
        
        q1 = Question.objects.create(prompt='この部屋は___です。(Phòng này yên tĩnh)')
        Choice.objects.bulk_create([
            Choice(question=q1, text='静か', is_correct=True),
            Choice(question=q1, text='静かい', is_correct=False),
            Choice(question=q1, text='静かな', is_correct=False),
            Choice(question=q1, text='静かに', is_correct=False),
        ])
        
        q2 = Question.objects.create(prompt='昨日の試験は___かったです。(Bài kiểm tra hôm qua khó)')
        Choice.objects.bulk_create([
            Choice(question=q2, text='難し', is_correct=True),
            Choice(question=q2, text='難しい', is_correct=False),
            Choice(question=q2, text='難しく', is_correct=False),
            Choice(question=q2, text='難しくない', is_correct=False),
        ])
        
        q3 = Question.objects.create(prompt='あの人は___人です。(Người đó là người tử tế)')
        Choice.objects.bulk_create([
            Choice(question=q3, text='親切な', is_correct=True),
            Choice(question=q3, text='親切', is_correct=False),
            Choice(question=q3, text='親切い', is_correct=False),
            Choice(question=q3, text='親切に', is_correct=False),
        ])
        
        lesson5.questions.add(q1, q2, q3)

        self.stdout.write('- Created 5 N5 lessons')

    def create_n4_lessons(self):
        self.stdout.write('\nCreating N4 grammar lessons...')
        
        # LESSON 1: ~ている (trạng thái)
        lesson1 = GrammarLesson.objects.create(
            level='N4',
            order=1,
            title='~ている - Trạng thái tiếp diễn',
            grammar_point_count=2,
            content='''
【~ている】
- Sử dụng 1: Hành động đang diễn ra
  • 今、勉強しています。(Bây giờ đang học.)
  • 母は料理をしています。(Mẹ đang nấu ăn.)

- Sử dụng 2: Trạng thái kết quả
  • 窓が開いています。(Cửa sổ đang mở - đã mở và vẫn mở.)
  • 結婚しています。(Đã kết hôn - và vẫn trong trạng thái đó.)
  • 知っています。(Biết - đã biết và vẫn biết.)

- Sử dụng 3: Nghề nghiệp/nơi ở
  • 会社で働いています。(Đang làm việc ở công ty.)
  • 東京に住んでいます。(Đang sống ở Tokyo.)

【Phân biệt】
- している vs した:
  • 宿題をしています。(Đang làm bài tập.)
  • 宿題をしました。(Đã làm bài tập xong.)
'''
        )
        
        q1 = Question.objects.create(prompt='田中さんは東京に___います。(Anh Tanaka đang sống ở Tokyo)')
        Choice.objects.bulk_create([
            Choice(question=q1, text='住んで', is_correct=True),
            Choice(question=q1, text='住む', is_correct=False),
            Choice(question=q1, text='住み', is_correct=False),
            Choice(question=q1, text='住んだ', is_correct=False),
        ])
        
        q2 = Question.objects.create(prompt='窓が___います。(Cửa sổ đang mở)')
        Choice.objects.bulk_create([
            Choice(question=q2, text='開いて', is_correct=True),
            Choice(question=q2, text='開く', is_correct=False),
            Choice(question=q2, text='開けて', is_correct=False),
            Choice(question=q2, text='開き', is_correct=False),
        ])
        
        q3 = Question.objects.create(prompt='あの人を___いますか。(Bạn có biết người đó không?)')
        Choice.objects.bulk_create([
            Choice(question=q3, text='知って', is_correct=True),
            Choice(question=q3, text='知る', is_correct=False),
            Choice(question=q3, text='知り', is_correct=False),
            Choice(question=q3, text='知った', is_correct=False),
        ])
        
        lesson1.questions.add(q1, q2, q3)

        # LESSON 2: ~たことがある
        lesson2 = GrammarLesson.objects.create(
            level='N4',
            order=2,
            title='~たことがある - Đã từng',
            grammar_point_count=1,
            content='''
【~たことがある】
- Ý nghĩa: Đã từng làm gì (kinh nghiệm trong quá khứ)
- Cấu trúc: [Động từ た形] + ことがある
- Ví dụ:
  • 富士山に登ったことがあります。(Tôi đã từng leo núi Phú Sĩ.)
  • 納豆を食べたことがありますか。(Bạn đã từng ăn natto chưa?)
  • 京都へ行ったことがあります。(Tôi đã từng đi Kyoto.)

【Phủ định: ~たことがない】
- Ý nghĩa: Chưa từng làm gì
- Ví dụ:
  • 日本に行ったことがありません。(Tôi chưa từng đi Nhật Bản.)
  • この映画を見たことがないです。(Tôi chưa từng xem bộ phim này.)

【Lưu ý】
- Dùng cho kinh nghiệm cá nhân, không dùng cho việc vừa mới xảy ra
- So sánh:
  • 昨日寿司を食べました。(Hôm qua tôi đã ăn sushi.) → Sự việc cụ thể
  • 寿司を食べたことがあります。(Tôi đã từng ăn sushi.) → Kinh nghiệm
'''
        )
        
        q1 = Question.objects.create(prompt='日本へ___ことがありますか。(Bạn đã từng đi Nhật Bản chưa?)')
        Choice.objects.bulk_create([
            Choice(question=q1, text='行った', is_correct=True),
            Choice(question=q1, text='行く', is_correct=False),
            Choice(question=q1, text='行って', is_correct=False),
            Choice(question=q1, text='行き', is_correct=False),
        ])
        
        q2 = Question.objects.create(prompt='この本を___ことがありません。(Tôi chưa từng đọc cuốn sách này)')
        Choice.objects.bulk_create([
            Choice(question=q2, text='読んだ', is_correct=True),
            Choice(question=q2, text='読む', is_correct=False),
            Choice(question=q2, text='読んで', is_correct=False),
            Choice(question=q2, text='読み', is_correct=False),
        ])
        
        lesson2.questions.add(q1, q2)

        # LESSON 3: ~てしまう
        lesson3 = GrammarLesson.objects.create(
            level='N4',
            order=3,
            title='~てしまう - Hoàn thành/Hối tiếc',
            grammar_point_count=2,
            content='''
【~てしまう】
- Sử dụng 1: Hoàn thành hành động (làm xong)
  • 宿題をしてしまいました。(Đã làm xong bài tập.)
  • 全部食べてしまった。(Đã ăn hết rồi.)

- Sử dụng 2: Hối tiếc, không như ý muốn
  • 財布を忘れてしまいました。(Đã quên ví mất rồi.)
  • 約束を忘れてしまった。(Đã quên lời hứa mất rồi.)

【Rút gọn: ~ちゃう/~じゃう】
- Trong hội thoại thường dùng dạng rút gọn:
  • してしまう → しちゃう
  • 食べてしまう → 食べちゃう
  • 読んでしまう → 読んじゃう

【Ví dụ】
- もう終わってしまいましたか。(Đã kết thúc rồi à?)
- ケーキを食べちゃった。(Đã ăn mất cái bánh rồi.)
- 電車に乗り遅れてしまいました。(Đã lỡ tàu mất rồi.)
'''
        )
        
        q1 = Question.objects.create(prompt='宿題を___しまいました。(Đã làm xong bài tập)')
        Choice.objects.bulk_create([
            Choice(question=q1, text='して', is_correct=True),
            Choice(question=q1, text='する', is_correct=False),
            Choice(question=q1, text='した', is_correct=False),
            Choice(question=q1, text='し', is_correct=False),
        ])
        
        q2 = Question.objects.create(prompt='財布を___しまいました。(Đã quên ví mất rồi)')
        Choice.objects.bulk_create([
            Choice(question=q2, text='忘れて', is_correct=True),
            Choice(question=q2, text='忘れる', is_correct=False),
            Choice(question=q2, text='忘れた', is_correct=False),
            Choice(question=q2, text='忘れ', is_correct=False),
        ])
        
        lesson3.questions.add(q1, q2)

        self.stdout.write('- Created 3 N4 lessons')

    def create_n3_lessons(self):
        self.stdout.write('\nCreating N3 grammar lessons...')
        
        # LESSON 1: ~ておく
        lesson1 = GrammarLesson.objects.create(
            level='N3',
            order=1,
            title='~ておく - Chuẩn bị trước',
            grammar_point_count=2,
            content='''
【~ておく】
- Ý nghĩa: Làm gì đó để chuẩn bị cho tương lai
- Cấu trúc: [Động từ て形] + おく
- Ví dụ:
  • 会議の前に資料を読んでおきます。(Đọc tài liệu trước cuộc họp.)
  • 明日のために準備しておきました。(Đã chuẩn bị cho ngày mai.)
  • 旅行の前に切符を買っておきます。(Mua vé trước chuyến du lịch.)

【Rút gọn: ~とく】
- Trong hội thoại thường dùng: ~とく
  • 読んでおく → 読んどく
  • しておく → しとく

【So sánh】
- 資料を読みます。(Đọc tài liệu.) → Hành động thông thường
- 資料を読んでおきます。(Đọc tài liệu trước.) → Chuẩn bị cho mục đích nào đó

【Lưu ý】
- Có thể dùng để nhờ vả: ~ておいてください
  • ドアを開けておいてください。(Hãy để cửa mở.)
'''
        )
        
        q1 = Question.objects.create(prompt='会議の前に資料を___おきます。(Đọc tài liệu trước cuộc họp)')
        Choice.objects.bulk_create([
            Choice(question=q1, text='読んで', is_correct=True),
            Choice(question=q1, text='読む', is_correct=False),
            Choice(question=q1, text='読み', is_correct=False),
            Choice(question=q1, text='読んだ', is_correct=False),
        ])
        
        q2 = Question.objects.create(prompt='旅行の前に切符を___おきました。(Đã mua vé trước chuyến du lịch)')
        Choice.objects.bulk_create([
            Choice(question=q2, text='買って', is_correct=True),
            Choice(question=q2, text='買う', is_correct=False),
            Choice(question=q2, text='買い', is_correct=False),
            Choice(question=q2, text='買った', is_correct=False),
        ])
        
        lesson1.questions.add(q1, q2)

        # LESSON 2: ~によって
        lesson2 = GrammarLesson.objects.create(
            level='N3',
            order=2,
            title='~によって - Tùy thuộc/Do',
            grammar_point_count=3,
            content='''
【~によって】
- Sử dụng 1: Tùy thuộc vào (khác nhau theo)
  • 人によって考え方が違います。(Cách suy nghĩ khác nhau tùy người.)
  • 国によって習慣が違います。(Phong tục khác nhau tùy quốc gia.)

- Sử dụng 2: Phương tiện/Phương pháp
  • インターネットによって情報を得ます。(Lấy thông tin bằng Internet.)
  • この薬によって病気が治ります。(Nhờ thuốc này bệnh được chữa khỏi.)

- Sử dụng 3: Bị động (do ai làm)
  • この小説は夏目漱石によって書かれました。(Tiểu thuyết này được viết bởi Natsume Soseki.)
  • この建物は有名な建築家によって設計されました。(Tòa nhà này được thiết kế bởi kiến trúc sư nổi tiếng.)

【Tương đương】
- ~によって = ~によっては (trong một số trường hợp)
- ~によって = ~による (bổ nghĩa cho danh từ)
  • この病気による死亡率 (tỷ lệ tử vong do bệnh này)
'''
        )
        
        q1 = Question.objects.create(prompt='人___考え方が違います。(Cách suy nghĩ khác nhau tùy người)')
        Choice.objects.bulk_create([
            Choice(question=q1, text='によって', is_correct=True),
            Choice(question=q1, text='について', is_correct=False),
            Choice(question=q1, text='にとって', is_correct=False),
            Choice(question=q1, text='において', is_correct=False),
        ])
        
        q2 = Question.objects.create(prompt='この小説は夏目漱石___書かれました。(Tiểu thuyết này được viết bởi Natsume Soseki)')
        Choice.objects.bulk_create([
            Choice(question=q2, text='によって', is_correct=True),
            Choice(question=q2, text='について', is_correct=False),
            Choice(question=q2, text='にとって', is_correct=False),
            Choice(question=q2, text='に対して', is_correct=False),
        ])
        
        lesson2.questions.add(q1, q2)

        self.stdout.write('- Created 2 N3 lessons')

