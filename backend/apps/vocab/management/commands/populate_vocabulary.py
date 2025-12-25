from django.core.management.base import BaseCommand
from django.db import transaction
from apps.vocab.models import (
    VocabularyLesson, VocabularyWord, VocabularyExample,
    VocabularyLessonProgress, VocabularyWordProgress, VocabularyFavorite
)


class Command(BaseCommand):
    help = "Populate vocabulary lessons with rich data for N5, N4, N3"

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Clear existing data before populating')

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing vocabulary data...')
            VocabularyFavorite.objects.all().delete()
            VocabularyWordProgress.objects.all().delete()
            VocabularyLessonProgress.objects.all().delete()
            VocabularyExample.objects.all().delete()
            VocabularyWord.objects.all().delete()
            VocabularyLesson.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Data cleared'))

        self.stdout.write('Starting vocabulary data population...')
        
        with transaction.atomic():
            # N5 LESSONS
            self.create_n5_lessons()
            # N4 LESSONS
            self.create_n4_lessons()
            # N3 LESSONS
            self.create_n3_lessons()

        self.stdout.write(self.style.SUCCESS('\nSuccessfully populated vocabulary data!'))
        self.stdout.write(f'Total lessons: {VocabularyLesson.objects.count()}')
        self.stdout.write(f'Total words: {VocabularyWord.objects.count()}')

    def create_n5_lessons(self):
        self.stdout.write('\nCreating N5 vocabulary lessons...')
        
        # LESSON 1: Giới thiệu bản thân
        lesson1 = VocabularyLesson.objects.create(
            jlpt_level='N5',
            order=1,
            title='Bài 1: Giới thiệu bản thân',
            description='Từ vựng cơ bản để giới thiệu bản thân'
        )
        
        words_lesson1 = [
            ('私', 'わたし', 'TÔI', 'Tôi', 1),
            ('あなた', 'あなた', 'BẠN', 'Bạn', 2),
            ('彼', 'かれ', 'ANH ẤY', 'Anh ấy', 3),
            ('彼女', 'かのじょ', 'CÔ ẤY', 'Cô ấy', 4),
            ('私たち', 'わたしたち', 'CHÚNG TÔI', 'Chúng tôi', 5),
            ('名前', 'なまえ', 'TÊN', 'Tên', 6),
            ('学生', 'がくせい', 'HỌC SINH', 'Học sinh', 7),
            ('先生', 'せんせい', 'GIÁO VIÊN', 'Giáo viên', 8),
            ('会社員', 'かいしゃいん', 'NHÂN VIÊN CÔNG TY', 'Nhân viên công ty', 9),
            ('日本人', 'にほんじん', 'NGƯỜI NHẬT', 'Người Nhật', 10),
        ]
        
        examples_lesson1 = {
            '私': [
                ('私は学生です。', 'Tôi là học sinh.'),
                ('私の名前は田中です。', 'Tên tôi là Tanaka.')
            ],
            'あなた': [
                ('あなたは誰ですか。', 'Bạn là ai?'),
                ('あなたの国はどこですか。', 'Quốc gia của bạn là đâu?')
            ],
            '彼': [
                ('彼は私の友達です。', 'Anh ấy là bạn tôi.'),
                ('彼はとても親切です。', 'Anh ấy rất tốt bụng.')
            ],
            '彼女': [
                ('彼女は日本人です。', 'Cô ấy là người Nhật.'),
                ('彼女はきれいです。', 'Cô ấy xinh đẹp.')
            ],
            '名前': [
                ('あなたの名前は何ですか。', 'Tên bạn là gì?'),
                ('私の名前は山田です。', 'Tên tôi là Yamada.')
            ],
            '学生': [
                ('私は大学生です。', 'Tôi là sinh viên đại học.'),
                ('彼は高校生です。', 'Anh ấy là học sinh trung học.')
            ],
            '先生': [
                ('田中先生は優しいです。', 'Thầy Tanaka hiền lành.'),
                ('私の先生は日本人です。', 'Giáo viên của tôi là người Nhật.')
            ],
        }
        
        for kanji, hiragana, vietnamese, meaning, order in words_lesson1:
            word = VocabularyWord.objects.create(
                lesson=lesson1,
                kanji=kanji,
                hiragana=hiragana,
                vietnamese=vietnamese,
                meaning=meaning,
                order=order
            )
            
            if kanji in examples_lesson1:
                for idx, (sentence_jp, sentence_vi) in enumerate(examples_lesson1[kanji]):
                    VocabularyExample.objects.create(
                        word=word,
                        sentence_jp=sentence_jp,
                        sentence_vi=sentence_vi
                    )

        # LESSON 2: Gia đình
        lesson2 = VocabularyLesson.objects.create(
            jlpt_level='N5',
            order=2,
            title='Bài 2: Gia đình',
            description='Từ vựng về các thành viên trong gia đình'
        )
        
        words_lesson2 = [
            ('家族', 'かぞく', 'GIA ĐÌNH', 'Gia đình', 1),
            ('父', 'ちち', 'CHA (mình)', 'Cha (của mình)', 2),
            ('母', 'はは', 'MẸ (mình)', 'Mẹ (của mình)', 3),
            ('兄', 'あに', 'ANH TRAI (mình)', 'Anh trai (của mình)', 4),
            ('姉', 'あね', 'CHỊ GÁI (mình)', 'Chị gái (của mình)', 5),
            ('弟', 'おとうと', 'EM TRAI', 'Em trai', 6),
            ('妹', 'いもうと', 'EM GÁI', 'Em gái', 7),
            ('祖父', 'そふ', 'ÔNG (mình)', 'Ông (của mình)', 8),
            ('祖母', 'そぼ', 'BÀ (mình)', 'Bà (của mình)', 9),
            ('子供', 'こども', 'TRẺ CON', 'Trẻ con', 10),
        ]
        
        examples_lesson2 = {
            '家族': [
                ('私の家族は五人です。', 'Gia đình tôi có 5 người.'),
                ('家族と旅行に行きました。', 'Tôi đã đi du lịch với gia đình.')
            ],
            '父': [
                ('父は会社員です。', 'Cha tôi là nhân viên công ty.'),
                ('父は毎日働いています。', 'Cha tôi làm việc mỗi ngày.')
            ],
            '母': [
                ('母は料理が上手です。', 'Mẹ tôi nấu ăn giỏi.'),
                ('母は優しいです。', 'Mẹ tôi hiền lành.')
            ],
            '兄': [
                ('兄は大学生です。', 'Anh trai tôi là sinh viên đại học.'),
                ('兄は東京に住んでいます。', 'Anh trai tôi sống ở Tokyo.')
            ],
        }
        
        for kanji, hiragana, vietnamese, meaning, order in words_lesson2:
            word = VocabularyWord.objects.create(
                lesson=lesson2,
                kanji=kanji,
                hiragana=hiragana,
                vietnamese=vietnamese,
                meaning=meaning,
                order=order
            )
            
            if kanji in examples_lesson2:
                for idx, (sentence_jp, sentence_vi) in enumerate(examples_lesson2[kanji]):
                    VocabularyExample.objects.create(
                        word=word,
                        sentence_jp=sentence_jp,
                        sentence_vi=sentence_vi
                    )

        # LESSON 3: Thời gian
        lesson3 = VocabularyLesson.objects.create(
            jlpt_level='N5',
            order=3,
            title='Bài 3: Thời gian',
            description='Từ vựng về thời gian, ngày tháng'
        )
        
        words_lesson3 = [
            ('今', 'いま', 'BÂY GIỜ', 'Bây giờ', 1),
            ('今日', 'きょう', 'HÔM NAY', 'Hôm nay', 2),
            ('昨日', 'きのう', 'HÔM QUA', 'Hôm qua', 3),
            ('明日', 'あした', 'NGÀY MAI', 'Ngày mai', 4),
            ('毎日', 'まいにち', 'HẰNG NGÀY', 'Hằng ngày', 5),
            ('朝', 'あさ', 'BUỔI SÁNG', 'Buổi sáng', 6),
            ('昼', 'ひる', 'BUỔI TRƯA', 'Buổi trưa', 7),
            ('夜', 'よる', 'BUỔI TỐI', 'Buổi tối', 8),
            ('週', 'しゅう', 'TUẦN', 'Tuần', 9),
            ('月', 'つき', 'THÁNG', 'Tháng', 10),
        ]
        
        examples_lesson3 = {
            '今': [
                ('今、何時ですか。', 'Bây giờ là mấy giờ?'),
                ('今、勉強しています。', 'Bây giờ đang học.')
            ],
            '今日': [
                ('今日は暑いです。', 'Hôm nay nóng.'),
                ('今日は何曜日ですか。', 'Hôm nay là thứ mấy?')
            ],
            '昨日': [
                ('昨日は雨でした。', 'Hôm qua trời mưa.'),
                ('昨日、映画を見ました。', 'Hôm qua tôi đã xem phim.')
            ],
            '明日': [
                ('明日、学校へ行きます。', 'Ngày mai tôi sẽ đi học.'),
                ('明日は休みです。', 'Ngày mai nghỉ.')
            ],
        }
        
        for kanji, hiragana, vietnamese, meaning, order in words_lesson3:
            word = VocabularyWord.objects.create(
                lesson=lesson3,
                kanji=kanji,
                hiragana=hiragana,
                vietnamese=vietnamese,
                meaning=meaning,
                order=order
            )
            
            if kanji in examples_lesson3:
                for idx, (sentence_jp, sentence_vi) in enumerate(examples_lesson3[kanji]):
                    VocabularyExample.objects.create(
                        word=word,
                        sentence_jp=sentence_jp,
                        sentence_vi=sentence_vi
                    )

        self.stdout.write('- Created 3 N5 lessons with 30 words')

    def create_n4_lessons(self):
        self.stdout.write('\nCreating N4 vocabulary lessons...')
        
        # LESSON 1: Giao tiếp hàng ngày
        lesson1 = VocabularyLesson.objects.create(
            jlpt_level='N4',
            order=1,
            title='Bài 1: Giao tiếp hàng ngày',
            description='Từ vựng giao tiếp thường dùng'
        )
        
        words_lesson1 = [
            ('約束', 'やくそく', 'LỜI HỨA', 'Lời hứa, hẹn', 1),
            ('都合', 'つごう', 'THUẬN TIỆN', 'Sự thuận tiện, tình hình', 2),
            ('連絡', 'れんらく', 'LIÊN LẠC', 'Liên lạc', 3),
            ('相談', 'そうだん', 'BÀN BẠC', 'Bàn bạc, tham khảo ý kiến', 4),
            ('説明', 'せつめい', 'GIẢI THÍCH', 'Giải thích', 5),
            ('質問', 'しつもん', 'CÂU HỎI', 'Câu hỏi', 6),
            ('答え', 'こたえ', 'CÂU TRẢ LỜI', 'Câu trả lời', 7),
            ('意見', 'いけん', 'Ý KIẾN', 'Ý kiến', 8),
        ]
        
        examples_lesson1 = {
            '約束': [
                ('友達と約束があります。', 'Tôi có hẹn với bạn.'),
                ('約束の時間に遅れました。', 'Tôi đã đến muộn giờ hẹn.')
            ],
            '連絡': [
                ('メールで連絡してください。', 'Hãy liên lạc bằng email.'),
                ('明日連絡します。', 'Ngày mai tôi sẽ liên lạc.')
            ],
        }
        
        for kanji, hiragana, vietnamese, meaning, order in words_lesson1:
            word = VocabularyWord.objects.create(
                lesson=lesson1,
                kanji=kanji,
                hiragana=hiragana,
                vietnamese=vietnamese,
                meaning=meaning,
                order=order
            )
            
            if kanji in examples_lesson1:
                for idx, (sentence_jp, sentence_vi) in enumerate(examples_lesson1[kanji]):
                    VocabularyExample.objects.create(
                        word=word,
                        sentence_jp=sentence_jp,
                        sentence_vi=sentence_vi
                    )

        # LESSON 2: Tính cách
        lesson2 = VocabularyLesson.objects.create(
            jlpt_level='N4',
            order=2,
            title='Bài 2: Tính cách',
            description='Từ vựng mô tả tính cách con người'
        )
        
        words_lesson2 = [
            ('優しい', 'やさしい', 'HIỀN', 'Hiền lành, dễ tính', 1),
            ('厳しい', 'きびしい', 'NGHIÊM KHẮC', 'Nghiêm khắc', 2),
            ('真面目', 'まじめ', 'NGHIÊM CHỈNH', 'Nghiêm chỉnh, chăm chỉ', 3),
            ('明るい', 'あかるい', 'VUI VẺ', 'Vui vẻ, tươi sáng', 4),
            ('素直', 'すなお', 'THẲNG THẮN', 'Thẳng thắn, ngoan ngoãn', 5),
            ('頑固', 'がんこ', 'BƯỚNG BỈNH', 'Bướng bỉnh, cứng đầu', 6),
        ]
        
        for kanji, hiragana, vietnamese, meaning, order in words_lesson2:
            word = VocabularyWord.objects.create(
                lesson=lesson2,
                kanji=kanji,
                hiragana=hiragana,
                vietnamese=vietnamese,
                meaning=meaning,
                order=order
            )

        self.stdout.write('- Created 2 N4 lessons with 14 words')

    def create_n3_lessons(self):
        self.stdout.write('\nCreating N3 vocabulary lessons...')
        
        # LESSON 1: Công việc
        lesson1 = VocabularyLesson.objects.create(
            jlpt_level='N3',
            order=1,
            title='Bài 1: Công việc',
            description='Từ vựng về công việc và nghề nghiệp'
        )
        
        words_lesson1 = [
            ('就職', 'しゅうしょく', 'XIN VIỆC', 'Xin việc, có việc làm', 1),
            ('転職', 'てんしょく', 'CHUYỂN VIỆC', 'Chuyển việc', 2),
            ('退職', 'たいしょく', 'NGHỈ VIỆC', 'Nghỉ việc', 3),
            ('出張', 'しゅっちょう', 'CÔNG TÁC', 'Công tác, đi công tác', 4),
            ('会議', 'かいぎ', 'HỌP', 'Cuộc họp', 5),
            ('資料', 'しりょう', 'TÀI LIỆU', 'Tài liệu', 6),
            ('報告', 'ほうこく', 'BÁO CÁO', 'Báo cáo', 7),
            ('担当', 'たんとう', 'PHỤ TRÁCH', 'Phụ trách', 8),
        ]
        
        examples_lesson1 = {
            '会議': [
                ('午後から会議があります。', 'Từ chiều có cuộc họp.'),
                ('会議室で資料を準備します。', 'Chuẩn bị tài liệu ở phòng họp.')
            ],
        }
        
        for kanji, hiragana, vietnamese, meaning, order in words_lesson1:
            word = VocabularyWord.objects.create(
                lesson=lesson1,
                kanji=kanji,
                hiragana=hiragana,
                vietnamese=vietnamese,
                meaning=meaning,
                order=order
            )
            
            if kanji in examples_lesson1:
                for idx, (sentence_jp, sentence_vi) in enumerate(examples_lesson1[kanji]):
                    VocabularyExample.objects.create(
                        word=word,
                        sentence_jp=sentence_jp,
                        sentence_vi=sentence_vi
                    )

        self.stdout.write('- Created 1 N3 lesson with 8 words')

