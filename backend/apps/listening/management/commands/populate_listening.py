from django.core.management.base import BaseCommand
from apps.listening.models import (
    ListeningLesson, ListeningVocabulary, ListeningQuestion, ListeningChoice
)


class Command(BaseCommand):
    help = 'Populate listening lessons với sample data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Xóa tất cả data listening trước khi populate',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Đang xóa data listening cũ...')
            ListeningLesson.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Đã xóa xong!'))

        self.stdout.write('Bắt đầu populate listening data...')

        # N5 Lessons
        self.create_n5_lessons()
        
        # N4 Lessons
        self.create_n4_lessons()

        self.stdout.write(self.style.SUCCESS('Hoàn thành populate listening data!'))

    def create_n5_lessons(self):
        self.stdout.write('Tạo N5 lessons...')

        # Lesson 1: Giới thiệu bản thân
        lesson1 = ListeningLesson.objects.create(
            level='N5',
            order=1,
            title='Giới thiệu bản thân',
            description='Bài nghe về tự giới thiệu trong tiếng Nhật',
            duration_seconds=120,
            script_jp='はじめまして。わたしはたなかです。にほんじんです。よろしくおねがいします。',
            script_vn='Xin chào. Tôi là Tanaka. Tôi là người Nhật. Rất vui được làm quen.',
        )

        # Vocabularies
        vocabs1 = [
            {'word': 'はじめまして', 'reading': '', 'meaning': 'Xin chào (lần đầu gặp)', 'order': 1},
            {'word': 'わたし', 'reading': '', 'meaning': 'tôi', 'order': 2},
            {'word': 'にほんじん', 'reading': '日本人', 'meaning': 'người Nhật', 'order': 3},
            {'word': 'よろしく', 'reading': '', 'meaning': 'rất vui', 'order': 4},
        ]
        for v in vocabs1:
            ListeningVocabulary.objects.create(lesson=lesson1, **v)

        # Questions
        q1 = ListeningQuestion.objects.create(
            lesson=lesson1,
            question_number=1,
            sentence='たなかさんは＿＿です。',
            underlined_word='＿＿',
            explanation='Tanaka giới thiệu mình là người Nhật',
        )
        ListeningChoice.objects.create(question=q1, text='ちゅうごくじん', is_correct=False)
        ListeningChoice.objects.create(question=q1, text='にほんじん', is_correct=True)
        ListeningChoice.objects.create(question=q1, text='かんこくじん', is_correct=False)
        ListeningChoice.objects.create(question=q1, text='あめりかじん', is_correct=False)

        q2 = ListeningQuestion.objects.create(
            lesson=lesson1,
            question_number=2,
            sentence='たなかさんは＿＿と言いました。',
            underlined_word='＿＿',
            explanation='Câu chào lần đầu gặp mặt',
        )
        ListeningChoice.objects.create(question=q2, text='こんにちは', is_correct=False)
        ListeningChoice.objects.create(question=q2, text='はじめまして', is_correct=True)
        ListeningChoice.objects.create(question=q2, text='おはよう', is_correct=False)
        ListeningChoice.objects.create(question=q2, text='こんばんは', is_correct=False)

        # Lesson 2: Ở nhà hàng
        lesson2 = ListeningLesson.objects.create(
            level='N5',
            order=2,
            title='Ở nhà hàng',
            description='Hội thoại đặt món ăn tại nhà hàng',
            duration_seconds=90,
            script_jp='すみません。これをください。おちゃもください。',
            script_vn='Xin lỗi. Cho tôi cái này. Cho tôi trà nữa.',
        )

        vocabs2 = [
            {'word': 'すみません', 'reading': '', 'meaning': 'xin lỗi/làm ơn', 'order': 1},
            {'word': 'これ', 'reading': '', 'meaning': 'cái này', 'order': 2},
            {'word': 'ください', 'reading': '下さい', 'meaning': 'cho tôi', 'order': 3},
            {'word': 'おちゃ', 'reading': 'お茶', 'meaning': 'trà', 'order': 4},
        ]
        for v in vocabs2:
            ListeningVocabulary.objects.create(lesson=lesson2, **v)

        q1 = ListeningQuestion.objects.create(
            lesson=lesson2,
            question_number=1,
            sentence='お客さんは何を注文しましたか。',
            underlined_word='',
            explanation='Khách đặt "これ" (cái này)',
        )
        ListeningChoice.objects.create(question=q1, text='それ', is_correct=False)
        ListeningChoice.objects.create(question=q1, text='あれ', is_correct=False)
        ListeningChoice.objects.create(question=q1, text='これ', is_correct=True)
        ListeningChoice.objects.create(question=q1, text='どれ', is_correct=False)

        q2 = ListeningQuestion.objects.create(
            lesson=lesson2,
            question_number=2,
            sentence='お客さんは飲み物も頼みましたか。',
            underlined_word='',
            explanation='Khách cũng gọi trà (おちゃ)',
        )
        ListeningChoice.objects.create(question=q2, text='はい、おちゃをください', is_correct=True)
        ListeningChoice.objects.create(question=q2, text='はい、みずをください', is_correct=False)
        ListeningChoice.objects.create(question=q2, text='いいえ', is_correct=False)
        ListeningChoice.objects.create(question=q2, text='はい、コーヒーをください', is_correct=False)

        # Lesson 3: Hỏi đường
        lesson3 = ListeningLesson.objects.create(
            level='N5',
            order=3,
            title='Hỏi đường',
            description='Cách hỏi đường và chỉ đường',
            duration_seconds=100,
            script_jp='すみません。えきはどこですか。まっすぐいってください。ひだりです。',
            script_vn='Xin lỗi. Nhà ga ở đâu? Đi thẳng. Bên trái.',
        )

        vocabs3 = [
            {'word': 'えき', 'reading': '駅', 'meaning': 'nhà ga', 'order': 1},
            {'word': 'どこ', 'reading': '', 'meaning': 'đâu', 'order': 2},
            {'word': 'まっすぐ', 'reading': '', 'meaning': 'thẳng', 'order': 3},
            {'word': 'ひだり', 'reading': '左', 'meaning': 'trái', 'order': 4},
        ]
        for v in vocabs3:
            ListeningVocabulary.objects.create(lesson=lesson3, **v)

        q1 = ListeningQuestion.objects.create(
            lesson=lesson3,
            question_number=1,
            sentence='人は何を探していますか。',
            underlined_word='',
            explanation='Người đang tìm nhà ga (えき)',
        )
        ListeningChoice.objects.create(question=q1, text='ぎんこう', is_correct=False)
        ListeningChoice.objects.create(question=q1, text='えき', is_correct=True)
        ListeningChoice.objects.create(question=q1, text='がっこう', is_correct=False)
        ListeningChoice.objects.create(question=q1, text='びょういん', is_correct=False)

        q2 = ListeningQuestion.objects.create(
            lesson=lesson3,
            question_number=2,
            sentence='駅はどちらですか。',
            underlined_word='',
            explanation='Đi thẳng rồi rẽ trái',
        )
        ListeningChoice.objects.create(question=q2, text='みぎ', is_correct=False)
        ListeningChoice.objects.create(question=q2, text='ひだり', is_correct=True)
        ListeningChoice.objects.create(question=q2, text='うしろ', is_correct=False)
        ListeningChoice.objects.create(question=q2, text='まえ', is_correct=False)

        self.stdout.write(self.style.SUCCESS('- Đã tạo 3 lessons N5'))

    def create_n4_lessons(self):
        self.stdout.write('Tạo N4 lessons...')

        # Lesson 1: Kế hoạch cuối tuần
        lesson1 = ListeningLesson.objects.create(
            level='N4',
            order=1,
            title='Kế hoạch cuối tuần',
            description='Hội thoại về kế hoạch cuối tuần',
            duration_seconds=150,
            script_jp='週末、何をしますか。映画を見に行きます。友達と一緒に行きます。',
            script_vn='Cuối tuần làm gì? Tôi đi xem phim. Đi cùng bạn bè.',
        )

        vocabs1 = [
            {'word': '週末', 'reading': 'しゅうまつ', 'meaning': 'cuối tuần', 'order': 1},
            {'word': '映画', 'reading': 'えいが', 'meaning': 'phim', 'order': 2},
            {'word': '友達', 'reading': 'ともだち', 'meaning': 'bạn bè', 'order': 3},
            {'word': '一緒に', 'reading': 'いっしょに', 'meaning': 'cùng nhau', 'order': 4},
        ]
        for v in vocabs1:
            ListeningVocabulary.objects.create(lesson=lesson1, **v)

        q1 = ListeningQuestion.objects.create(
            lesson=lesson1,
            question_number=1,
            sentence='週末、何をしますか。',
            underlined_word='',
            explanation='Đi xem phim',
        )
        ListeningChoice.objects.create(question=q1, text='買い物に行きます', is_correct=False)
        ListeningChoice.objects.create(question=q1, text='映画を見に行きます', is_correct=True)
        ListeningChoice.objects.create(question=q1, text='旅行します', is_correct=False)
        ListeningChoice.objects.create(question=q1, text='勉強します', is_correct=False)

        q2 = ListeningQuestion.objects.create(
            lesson=lesson1,
            question_number=2,
            sentence='誰と行きますか。',
            underlined_word='',
            explanation='Đi cùng bạn bè',
        )
        ListeningChoice.objects.create(question=q2, text='家族', is_correct=False)
        ListeningChoice.objects.create(question=q2, text='友達', is_correct=True)
        ListeningChoice.objects.create(question=q2, text='一人で', is_correct=False)
        ListeningChoice.objects.create(question=q2, text='先生', is_correct=False)

        # Lesson 2: Ở công ty
        lesson2 = ListeningLesson.objects.create(
            level='N4',
            order=2,
            title='Ở công ty',
            description='Hội thoại trong môi trường công sở',
            duration_seconds=130,
            script_jp='会議は何時からですか。午後2時からです。資料を準備してください。',
            script_vn='Cuộc họp từ mấy giờ? Từ 2 giờ chiều. Hãy chuẩn bị tài liệu.',
        )

        vocabs2 = [
            {'word': '会議', 'reading': 'かいぎ', 'meaning': 'cuộc họp', 'order': 1},
            {'word': '午後', 'reading': 'ごご', 'meaning': 'buổi chiều', 'order': 2},
            {'word': '資料', 'reading': 'しりょう', 'meaning': 'tài liệu', 'order': 3},
            {'word': '準備', 'reading': 'じゅんび', 'meaning': 'chuẩn bị', 'order': 4},
        ]
        for v in vocabs2:
            ListeningVocabulary.objects.create(lesson=lesson2, **v)

        q1 = ListeningQuestion.objects.create(
            lesson=lesson2,
            question_number=1,
            sentence='会議は何時からですか。',
            underlined_word='',
            explanation='2 giờ chiều',
        )
        ListeningChoice.objects.create(question=q1, text='午前10時', is_correct=False)
        ListeningChoice.objects.create(question=q1, text='午後2時', is_correct=True)
        ListeningChoice.objects.create(question=q1, text='午後3時', is_correct=False)
        ListeningChoice.objects.create(question=q1, text='午前9時', is_correct=False)

        q2 = ListeningQuestion.objects.create(
            lesson=lesson2,
            question_number=2,
            sentence='何を準備しますか。',
            underlined_word='',
            explanation='Chuẩn bị tài liệu',
        )
        ListeningChoice.objects.create(question=q2, text='コーヒー', is_correct=False)
        ListeningChoice.objects.create(question=q2, text='資料', is_correct=True)
        ListeningChoice.objects.create(question=q2, text='お弁当', is_correct=False)
        ListeningChoice.objects.create(question=q2, text='パソコン', is_correct=False)

        self.stdout.write(self.style.SUCCESS('- Đã tạo 2 lessons N4'))

