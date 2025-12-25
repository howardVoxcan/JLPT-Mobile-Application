from django.core.management.base import BaseCommand
from django.db import transaction
from apps.reading.models import (
    ReadingLesson, ReadingText, ReadingQuestion, ReadingChoice, ReadingProgress
)


class Command(BaseCommand):
    help = "Populate reading lessons with rich data for N5, N4, N3"

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Clear existing data before populating')

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing reading data...')
            ReadingProgress.objects.all().delete()
            ReadingChoice.objects.all().delete()
            ReadingQuestion.objects.all().delete()
            ReadingText.objects.all().delete()
            ReadingLesson.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Data cleared'))

        self.stdout.write('Starting reading data population...')
        
        with transaction.atomic():
            # N5 LESSONS
            self.create_n5_lessons()
            # N4 LESSONS
            self.create_n4_lessons()
            # N3 LESSONS
            self.create_n3_lessons()

        self.stdout.write(self.style.SUCCESS('\nSuccessfully populated reading data!'))
        self.stdout.write(f'Total lessons: {ReadingLesson.objects.count()}')
        self.stdout.write(f'Total questions: {ReadingQuestion.objects.count()}')

    def create_n5_lessons(self):
        self.stdout.write('\nCreating N5 reading lessons...')
        
        # LESSON 1: Tự giới thiệu
        lesson1 = ReadingLesson.objects.create(
            level='N5',
            order=1,
            title='第1部 - 自己紹介',
            preview='はじめまして'
        )
        
        ReadingText.objects.create(
            lesson=lesson1,
            content_japanese='''はじめまして。私は山田太郎です。
日本人です。23歳です。
大学生です。東京大学で勉強しています。
専攻は経済学です。
趣味は音楽を聞くことと本を読むことです。
よろしくお願いします。''',
            content_vietnamese='''Xin chào lần đầu gặp mặt. Tôi là Yamada Taro.
Tôi là người Nhật. 23 tuổi.
Tôi là sinh viên đại học. Tôi đang học tại Đại học Tokyo.
Chuyên ngành của tôi là kinh tế học.
Sở thích của tôi là nghe nhạc và đọc sách.
Xin hãy giúp đỡ (rất vui được làm quen).''',
            order=1
        )
        
        q1 = ReadingQuestion.objects.create(
            lesson=lesson1,
            text='山田さんは何歳ですか。(Yamada bao nhiêu tuổi?)',
            order=1
        )
        ReadingChoice.objects.bulk_create([
            ReadingChoice(question=q1, text='23歳', is_correct=True),
            ReadingChoice(question=q1, text='22歳', is_correct=False),
            ReadingChoice(question=q1, text='24歳', is_correct=False),
            ReadingChoice(question=q1, text='25歳', is_correct=False),
        ])
        
        q2 = ReadingQuestion.objects.create(
            lesson=lesson1,
            text='山田さんの専攻は何ですか。(Chuyên ngành của Yamada là gì?)',
            order=2
        )
        ReadingChoice.objects.bulk_create([
            ReadingChoice(question=q2, text='経済学', is_correct=True),
            ReadingChoice(question=q2, text='文学', is_correct=False),
            ReadingChoice(question=q2, text='工学', is_correct=False),
            ReadingChoice(question=q2, text='医学', is_correct=False),
        ])
        
        q3 = ReadingQuestion.objects.create(
            lesson=lesson1,
            text='山田さんの趣味は何ですか。(Sở thích của Yamada là gì?)',
            order=3
        )
        ReadingChoice.objects.bulk_create([
            ReadingChoice(question=q3, text='音楽を聞くこと', is_correct=True),
            ReadingChoice(question=q3, text='スポーツをすること', is_correct=False),
            ReadingChoice(question=q3, text='映画を見ること', is_correct=False),
            ReadingChoice(question=q3, text='料理をすること', is_correct=False),
        ])

        # LESSON 2: Thời khóa biểu
        lesson2 = ReadingLesson.objects.create(
            level='N5',
            order=2,
            title='第2部 - 時間割',
            preview='学校の授業'
        )
        
        ReadingText.objects.create(
            lesson=lesson2,
            content_japanese='''私の時間割を紹介します。
月曜日は日本語と数学の授業があります。
火曜日は英語と歴史の授業があります。
水曜日は体育と音楽の授業があります。
木曜日と金曜日は科学と社会の授業があります。
土曜日と日曜日は学校が休みです。
私は月曜日の授業が好きです。''',
            content_vietnamese='''Tôi xin giới thiệu thời khóa biểu của tôi.
Thứ hai có tiết tiếng Nhật và toán.
Thứ ba có tiết tiếng Anh và lịch sử.
Thứ tư có tiết thể dục và âm nhạc.
Thứ năm và thứ sáu có tiết khoa học và xã hội.
Thứ bảy và chủ nhật trường nghỉ.
Tôi thích tiết học thứ hai.''',
            order=1
        )
        
        q1 = ReadingQuestion.objects.create(
            lesson=lesson2,
            text='月曜日は何の授業がありますか。(Thứ hai có tiết gì?)',
            order=1
        )
        ReadingChoice.objects.bulk_create([
            ReadingChoice(question=q1, text='日本語と数学', is_correct=True),
            ReadingChoice(question=q1, text='英語と歴史', is_correct=False),
            ReadingChoice(question=q1, text='体育と音楽', is_correct=False),
            ReadingChoice(question=q1, text='科学と社会', is_correct=False),
        ])
        
        q2 = ReadingQuestion.objects.create(
            lesson=lesson2,
            text='学校はいつ休みですか。(Trường nghỉ khi nào?)',
            order=2
        )
        ReadingChoice.objects.bulk_create([
            ReadingChoice(question=q2, text='土曜日と日曜日', is_correct=True),
            ReadingChoice(question=q2, text='月曜日と火曜日', is_correct=False),
            ReadingChoice(question=q2, text='水曜日と木曜日', is_correct=False),
            ReadingChoice(question=q2, text='金曜日', is_correct=False),
        ])

        # LESSON 3: Gia đình
        lesson3 = ReadingLesson.objects.create(
            level='N5',
            order=3,
            title='第3部 - 家族',
            preview='私の家族'
        )
        
        ReadingText.objects.create(
            lesson=lesson3,
            content_japanese='''私の家族は五人です。
父と母と兄と弟がいます。
父は会社員です。毎日働いています。
母は主婦です。料理が上手です。
兄は大学生です。東京に住んでいます。
弟は高校生です。スポーツが好きです。
私たちは仲がいい家族です。''',
            content_vietnamese='''Gia đình tôi có 5 người.
Có bố, mẹ, anh trai và em trai.
Bố là nhân viên công ty. Mỗi ngày đi làm.
Mẹ là nội trợ. Nấu ăn giỏi.
Anh trai là sinh viên đại học. Anh ấy sống ở Tokyo.
Em trai là học sinh trung học. Em ấy thích thể thao.
Chúng tôi là gia đình hòa thuận.''',
            order=1
        )
        
        q1 = ReadingQuestion.objects.create(
            lesson=lesson3,
            text='家族は何人ですか。(Gia đình có mấy người?)',
            order=1
        )
        ReadingChoice.objects.bulk_create([
            ReadingChoice(question=q1, text='五人', is_correct=True),
            ReadingChoice(question=q1, text='四人', is_correct=False),
            ReadingChoice(question=q1, text='六人', is_correct=False),
            ReadingChoice(question=q1, text='三人', is_correct=False),
        ])
        
        q2 = ReadingQuestion.objects.create(
            lesson=lesson3,
            text='お父さんは何をしていますか。(Bố đang làm gì?)',
            order=2
        )
        ReadingChoice.objects.bulk_create([
            ReadingChoice(question=q2, text='会社員', is_correct=True),
            ReadingChoice(question=q2, text='学生', is_correct=False),
            ReadingChoice(question=q2, text='先生', is_correct=False),
            ReadingChoice(question=q2, text='医者', is_correct=False),
        ])

        self.stdout.write('- Created 3 N5 lessons with 7 questions')

    def create_n4_lessons(self):
        self.stdout.write('\nCreating N4 reading lessons...')
        
        # LESSON 1: Email
        lesson1 = ReadingLesson.objects.create(
            level='N4',
            order=1,
            title='第1部 - メール',
            preview='友達へのメール'
        )
        
        ReadingText.objects.create(
            lesson=lesson1,
            content_japanese='''件名：週末の予定について

田中さんへ

お疲れ様です。
来週の土曜日、一緒に映画を見に行きませんか。
新しい映画館がオープンしたので、行ってみたいと思っています。
もし都合が悪ければ、日曜日でも大丈夫です。
返事を待っています。

山田より''',
            content_vietnamese='''Tiêu đề: Về kế hoạch cuối tuần

Gửi Tanaka

Cảm ơn vì công việc.
Thứ bảy tuần sau, đi xem phim cùng nhau không?
Rạp chiếu phim mới đã mở nên tôi muốn thử đi.
Nếu không thuận tiện, chủ nhật cũng được.
Đang chờ hồi âm.

Từ Yamada''',
            order=1
        )
        
        q1 = ReadingQuestion.objects.create(
            lesson=lesson1,
            text='山田さんは何をしたいですか。(Yamada muốn làm gì?)',
            order=1
        )
        ReadingChoice.objects.bulk_create([
            ReadingChoice(question=q1, text='映画を見に行く', is_correct=True),
            ReadingChoice(question=q1, text='買い物に行く', is_correct=False),
            ReadingChoice(question=q1, text='レストランに行く', is_correct=False),
            ReadingChoice(question=q1, text='旅行に行く', is_correct=False),
        ])
        
        q2 = ReadingQuestion.objects.create(
            lesson=lesson1,
            text='いつ映画を見に行きますか。(Khi nào đi xem phim?)',
            order=2
        )
        ReadingChoice.objects.bulk_create([
            ReadingChoice(question=q2, text='来週の土曜日', is_correct=True),
            ReadingChoice(question=q2, text='今週の土曜日', is_correct=False),
            ReadingChoice(question=q2, text='来週の金曜日', is_correct=False),
            ReadingChoice(question=q2, text='来月', is_correct=False),
        ])

        # LESSON 2: Thông báo
        lesson2 = ReadingLesson.objects.create(
            level='N4',
            order=2,
            title='第2部 - お知らせ',
            preview='学校からのお知らせ'
        )
        
        ReadingText.objects.create(
            lesson=lesson2,
            content_japanese='''図書館からのお知らせ

図書館は来週の月曜日から金曜日まで工事のため閉館します。
本を借りたい人は今週中に借りてください。
返却期限は来月の15日です。
ご不便をおかけしますが、ご協力をお願いします。

問い合わせ：図書館受付
電話：03-1234-5678''',
            content_vietnamese='''Thông báo từ thư viện

Thư viện sẽ đóng cửa từ thứ hai đến thứ sáu tuần sau do thi công.
Người muốn mượn sách vui lòng mượn trong tuần này.
Hạn trả là ngày 15 tháng sau.
Xin lỗi vì sự bất tiện, mong nhận được sự hợp tác.

Liên hệ: Quầy tiếp tân thư viện
Điện thoại: 03-1234-5678''',
            order=1
        )
        
        q1 = ReadingQuestion.objects.create(
            lesson=lesson2,
            text='図書館はいつ閉館しますか。(Thư viện đóng cửa khi nào?)',
            order=1
        )
        ReadingChoice.objects.bulk_create([
            ReadingChoice(question=q1, text='来週の月曜日から金曜日', is_correct=True),
            ReadingChoice(question=q1, text='今週の月曜日から金曜日', is_correct=False),
            ReadingChoice(question=q1, text='来週の土曜日と日曜日', is_correct=False),
            ReadingChoice(question=q1, text='来月', is_correct=False),
        ])

        self.stdout.write('- Created 2 N4 lessons with 3 questions')

    def create_n3_lessons(self):
        self.stdout.write('\nCreating N3 reading lessons...')
        
        # LESSON 1: Bài báo
        lesson1 = ReadingLesson.objects.create(
            level='N3',
            order=1,
            title='第1部 - 新聞記事',
            preview='環境問題について'
        )
        
        ReadingText.objects.create(
            lesson=lesson1,
            content_japanese='''地球温暖化が深刻な問題になっている。
気温の上昇によって、氷河が溶けたり、異常気象が起きたりしている。
この問題を解決するために、世界中で様々な取り組みが行われている。
例えば、再生可能エネルギーの利用を増やしたり、森林を保護したりしている。
しかし、まだまだ努力が必要だと専門家は指摘している。
一人一人が環境問題について考え、行動することが大切だ。''',
            content_vietnamese='''Sự nóng lên toàn cầu đang trở thành vấn đề nghiêm trọng.
Do nhiệt độ tăng, băng tan và khí hậu bất thường xảy ra.
Để giải quyết vấn đề này, nhiều nỗ lực đang được thực hiện trên toàn thế giới.
Ví dụ, tăng sử dụng năng lượng tái tạo, bảo vệ rừng.
Tuy nhiên, các chuyên gia chỉ ra rằng vẫn cần nỗ lực nhiều hơn nữa.
Điều quan trọng là mỗi người suy nghĩ về vấn đề môi trường và hành động.''',
            order=1
        )
        
        q1 = ReadingQuestion.objects.create(
            lesson=lesson1,
            text='地球温暖化によって何が起きていますか。(Điều gì đang xảy ra do sự nóng lên toàn cầu?)',
            order=1
        )
        ReadingChoice.objects.bulk_create([
            ReadingChoice(question=q1, text='氷河が溶ける', is_correct=True),
            ReadingChoice(question=q1, text='人口が増える', is_correct=False),
            ReadingChoice(question=q1, text='経済が発展する', is_correct=False),
            ReadingChoice(question=q1, text='技術が進歩する', is_correct=False),
        ])
        
        q2 = ReadingQuestion.objects.create(
            lesson=lesson1,
            text='環境問題を解決するために何をしていますか。(Đang làm gì để giải quyết vấn đề môi trường?)',
            order=2
        )
        ReadingChoice.objects.bulk_create([
            ReadingChoice(question=q2, text='再生可能エネルギーの利用を増やす', is_correct=True),
            ReadingChoice(question=q2, text='工場を増やす', is_correct=False),
            ReadingChoice(question=q2, text='車を増やす', is_correct=False),
            ReadingChoice(question=q2, text='電力を増やす', is_correct=False),
        ])

        self.stdout.write('- Created 1 N3 lesson with 2 questions')

