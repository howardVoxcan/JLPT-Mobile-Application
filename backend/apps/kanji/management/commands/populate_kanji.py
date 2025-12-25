"""
Django Management Command để thêm dữ liệu kanji
Chạy: python manage.py populate_kanji
"""
from django.core.management.base import BaseCommand
from apps.kanji.models import KanjiUnit, KanjiLesson, Kanji, KanjiVocabulary


class Command(BaseCommand):
    help = 'Thêm dữ liệu mẫu vào Kanji'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Xóa tất cả dữ liệu cũ trước khi thêm mới',
        )

    def handle(self, *args, **options):
        self.stdout.write("=" * 60)
        self.stdout.write(self.style.SUCCESS("POPULATE KANJI DATA"))
        self.stdout.write("=" * 60)
        
        # Xóa dữ liệu cũ nếu có flag --clear
        if options['clear']:
            count_kanji = Kanji.objects.count()
            count_vocab = KanjiVocabulary.objects.count()
            if count_kanji > 0 or count_vocab > 0:
                KanjiVocabulary.objects.all().delete()
                Kanji.objects.all().delete()
                KanjiLesson.objects.all().delete()
                KanjiUnit.objects.all().delete()
                self.stdout.write(self.style.WARNING(f"Đã xóa {count_kanji} kanjis và {count_vocab} vocabularies cũ"))
        
        self.stdout.write("\nĐang thêm dữ liệu mới...")
        
        # Thêm dữ liệu
        self.add_n5_data()
        self.add_n4_data()
        
        # Thống kê
        self.stdout.write("\n" + "=" * 60)
        self.stdout.write(self.style.SUCCESS("THỐNG KÊ"))
        self.stdout.write("=" * 60)
        
        total_units = KanjiUnit.objects.count()
        total_lessons = KanjiLesson.objects.count()
        total_kanjis = Kanji.objects.count()
        total_vocabs = KanjiVocabulary.objects.count()
        
        self.stdout.write(f"Units: {total_units}")
        self.stdout.write(f"Lessons: {total_lessons}")
        self.stdout.write(f"Kanjis: {total_kanjis}")
        self.stdout.write(f"Vocabularies: {total_vocabs}")
        self.stdout.write("\n" + "=" * 60)
        self.stdout.write(self.style.SUCCESS("HOÀN THÀNH!"))
        self.stdout.write("=" * 60)

    def add_n5_data(self):
        """Thêm dữ liệu kanji N5"""
        
        # ===== UNIT 1: 第1週 =====
        unit1, _ = KanjiUnit.objects.get_or_create(
            level='N5',
            unit_number=1,
            defaults={
                'unit_name': '第1週',
                'description': 'Tuần 1 - Kanji cơ bản về giao thông và nơi chốn',
                'order': 1
            }
        )
        
        # Lesson 1: 駐車場
        lesson1, _ = KanjiLesson.objects.get_or_create(
            unit=unit1,
            lesson_number=1,
            defaults={
                'lesson_name': '駐車場',
                'order': 1
            }
        )
        
        # Kanji cho lesson 1
        kanji_data_lesson1 = [
            {
                'kanji': '駐',
                'hiragana': 'ちゅう',
                'vietnamese': 'TRÚ',
                'stroke_count': 15,
                'kunyomi': '',
                'onyomi': 'ちゅう',
                'meaning': 'Đóng. Lưu ở lại chỗ nào cũng gọi là trú.',
                'vocabulary': {
                    'kanji_word': '駐車',
                    'hiragana': 'ちゅうしゃ',
                    'reading': 'TRÚ XA',
                    'meaning': 'đỗ xe'
                }
            },
            {
                'kanji': '車',
                'hiragana': 'しゃ',
                'vietnamese': 'XA',
                'stroke_count': 7,
                'kunyomi': 'くるま',
                'onyomi': 'シャ',
                'meaning': 'xe, xe cộ',
                'vocabulary': {
                    'kanji_word': '自動車',
                    'hiragana': 'じどうしゃ',
                    'reading': 'TỰ ĐỘNG XA',
                    'meaning': 'ô tô'
                }
            },
            {
                'kanji': '場',
                'hiragana': 'ば',
                'vietnamese': 'TRƯỜNG',
                'stroke_count': 12,
                'kunyomi': '',
                'onyomi': 'ジョウ',
                'meaning': 'nơi, chỗ, địa điểm',
                'vocabulary': {
                    'kanji_word': '場所',
                    'hiragana': 'ばしょ',
                    'reading': 'TRƯỜNG SỞ',
                    'meaning': 'địa điểm'
                }
            },
        ]
        
        for order, data in enumerate(kanji_data_lesson1, 1):
            vocab_data = data.pop('vocabulary')
            kanji, _ = Kanji.objects.get_or_create(
                lesson=lesson1,
                kanji=data['kanji'],
                defaults={**data, 'order': order}
            )
            
            # Thêm vocabulary
            KanjiVocabulary.objects.get_or_create(
                kanji=kanji,
                kanji_word=vocab_data['kanji_word'],
                defaults={
                    'hiragana': vocab_data['hiragana'],
                    'reading': vocab_data['reading'],
                    'meaning': vocab_data['meaning'],
                    'order': 1
                }
            )
        
        # Lesson 2: 宿泊
        lesson2, _ = KanjiLesson.objects.get_or_create(
            unit=unit1,
            lesson_number=2,
            defaults={
                'lesson_name': '宿泊',
                'order': 2
            }
        )
        
        # Kanji cho lesson 2
        kanji_data_lesson2 = [
            {
                'kanji': '宿',
                'hiragana': 'やど',
                'vietnamese': 'TÚC',
                'stroke_count': 11,
                'kunyomi': 'やど',
                'onyomi': 'シュク',
                'meaning': 'chỗ nghỉ, nhà trọ',
                'vocabulary': {
                    'kanji_word': '宿泊',
                    'hiragana': 'しゅくはく',
                    'reading': 'TÚC BẠC',
                    'meaning': 'lưu trú'
                }
            },
            {
                'kanji': '泊',
                'hiragana': 'はく',
                'vietnamese': 'BẠC',
                'stroke_count': 8,
                'kunyomi': 'と-まる',
                'onyomi': 'ハク',
                'meaning': 'nghỉ đêm, ở qua đêm',
                'vocabulary': {
                    'kanji_word': '一泊',
                    'hiragana': 'いっぱく',
                    'reading': 'NHẤT BẠC',
                    'meaning': 'nghỉ một đêm'
                }
            },
        ]
        
        for order, data in enumerate(kanji_data_lesson2, 1):
            vocab_data = data.pop('vocabulary')
            kanji, _ = Kanji.objects.get_or_create(
                lesson=lesson2,
                kanji=data['kanji'],
                defaults={**data, 'order': order}
            )
            
            # Thêm vocabulary
            KanjiVocabulary.objects.get_or_create(
                kanji=kanji,
                kanji_word=vocab_data['kanji_word'],
                defaults={
                    'hiragana': vocab_data['hiragana'],
                    'reading': vocab_data['reading'],
                    'meaning': vocab_data['meaning'],
                    'order': 1
                }
            )
        
        # ===== UNIT 2: 第2週 =====
        unit2, _ = KanjiUnit.objects.get_or_create(
            level='N5',
            unit_number=2,
            defaults={
                'unit_name': '第2週',
                'description': 'Tuần 2 - Kanji về thời gian và số đếm',
                'order': 2
            }
        )
        
        # Lesson 1: 時間
        lesson3, _ = KanjiLesson.objects.get_or_create(
            unit=unit2,
            lesson_number=1,
            defaults={
                'lesson_name': '時間',
                'order': 1
            }
        )
        
        kanji_data_lesson3 = [
            {
                'kanji': '時',
                'hiragana': 'とき',
                'vietnamese': 'THÌ',
                'stroke_count': 10,
                'kunyomi': 'とき',
                'onyomi': 'ジ',
                'meaning': 'thời gian, lúc',
                'vocabulary': {
                    'kanji_word': '時間',
                    'hiragana': 'じかん',
                    'reading': 'THÌ GIAN',
                    'meaning': 'thời gian'
                }
            },
            {
                'kanji': '間',
                'hiragana': 'あいだ',
                'vietnamese': 'GIAN',
                'stroke_count': 12,
                'kunyomi': 'あいだ、ま',
                'onyomi': 'カン、ケン',
                'meaning': 'khoảng, giữa',
                'vocabulary': {
                    'kanji_word': '時間',
                    'hiragana': 'じかん',
                    'reading': 'THÌ GIAN',
                    'meaning': 'thời gian'
                }
            },
        ]
        
        for order, data in enumerate(kanji_data_lesson3, 1):
            vocab_data = data.pop('vocabulary')
            kanji, _ = Kanji.objects.get_or_create(
                lesson=lesson3,
                kanji=data['kanji'],
                defaults={**data, 'order': order}
            )
            
            KanjiVocabulary.objects.get_or_create(
                kanji=kanji,
                kanji_word=vocab_data['kanji_word'],
                defaults={
                    'hiragana': vocab_data['hiragana'],
                    'reading': vocab_data['reading'],
                    'meaning': vocab_data['meaning'],
                    'order': 1
                }
            )
        
        # Lesson 2: 日本
        lesson4, _ = KanjiLesson.objects.get_or_create(
            unit=unit2,
            lesson_number=2,
            defaults={
                'lesson_name': '日本',
                'order': 2
            }
        )
        
        kanji_data_lesson4 = [
            {
                'kanji': '日',
                'hiragana': 'ひ',
                'vietnamese': 'NHẬT',
                'stroke_count': 4,
                'kunyomi': 'ひ、か',
                'onyomi': 'ニチ、ジツ',
                'meaning': 'ngày, mặt trời',
                'vocabulary': {
                    'kanji_word': '日本',
                    'hiragana': 'にほん',
                    'reading': 'NHẬT BẢN',
                    'meaning': 'Nhật Bản'
                }
            },
            {
                'kanji': '本',
                'hiragana': 'ほん',
                'vietnamese': 'BẢN',
                'stroke_count': 5,
                'kunyomi': 'もと',
                'onyomi': 'ホン',
                'meaning': 'sách, gốc, cái',
                'vocabulary': {
                    'kanji_word': '日本',
                    'hiragana': 'にほん',
                    'reading': 'NHẬT BẢN',
                    'meaning': 'Nhật Bản'
                }
            },
        ]
        
        for order, data in enumerate(kanji_data_lesson4, 1):
            vocab_data = data.pop('vocabulary')
            kanji, _ = Kanji.objects.get_or_create(
                lesson=lesson4,
                kanji=data['kanji'],
                defaults={**data, 'order': order}
            )
            
            KanjiVocabulary.objects.get_or_create(
                kanji=kanji,
                kanji_word=vocab_data['kanji_word'],
                defaults={
                    'hiragana': vocab_data['hiragana'],
                    'reading': vocab_data['reading'],
                    'meaning': vocab_data['meaning'],
                    'order': 1
                }
            )
        
        # ===== UNIT 3: 第3週 =====
        unit3, _ = KanjiUnit.objects.get_or_create(
            level='N5',
            unit_number=3,
            defaults={
                'unit_name': '第3週',
                'description': 'Tuần 3 - Kanji về con người và gia đình',
                'order': 3
            }
        )
        
        # Lesson 1: 人生
        lesson5, _ = KanjiLesson.objects.get_or_create(
            unit=unit3,
            lesson_number=1,
            defaults={
                'lesson_name': '人生',
                'order': 1
            }
        )
        
        kanji_data_lesson5 = [
            {
                'kanji': '人',
                'hiragana': 'ひと',
                'vietnamese': 'NHÂN',
                'stroke_count': 2,
                'kunyomi': 'ひと',
                'onyomi': 'ジン、ニン',
                'meaning': 'người, con người',
                'vocabulary': {
                    'kanji_word': '人',
                    'hiragana': 'ひと',
                    'reading': 'NHÂN',
                    'meaning': 'người'
                }
            },
            {
                'kanji': '生',
                'hiragana': 'せい',
                'vietnamese': 'SINH',
                'stroke_count': 5,
                'kunyomi': 'い-きる、う-まれる、なま',
                'onyomi': 'セイ、ショウ',
                'meaning': 'sinh, sống, đời',
                'vocabulary': {
                    'kanji_word': '学生',
                    'hiragana': 'がくせい',
                    'reading': 'HỌC SINH',
                    'meaning': 'học sinh'
                }
            },
        ]
        
        for order, data in enumerate(kanji_data_lesson5, 1):
            vocab_data = data.pop('vocabulary')
            kanji, _ = Kanji.objects.get_or_create(
                lesson=lesson5,
                kanji=data['kanji'],
                defaults={**data, 'order': order}
            )
            
            KanjiVocabulary.objects.get_or_create(
                kanji=kanji,
                kanji_word=vocab_data['kanji_word'],
                defaults={
                    'hiragana': vocab_data['hiragana'],
                    'reading': vocab_data['reading'],
                    'meaning': vocab_data['meaning'],
                    'order': 1
                }
            )
        
        # Lesson 2: 家族
        lesson6, _ = KanjiLesson.objects.get_or_create(
            unit=unit3,
            lesson_number=2,
            defaults={
                'lesson_name': '家族',
                'order': 2
            }
        )
        
        kanji_data_lesson6 = [
            {
                'kanji': '家',
                'hiragana': 'いえ',
                'vietnamese': 'GIA',
                'stroke_count': 10,
                'kunyomi': 'いえ、や',
                'onyomi': 'カ、ケ',
                'meaning': 'nhà, gia đình',
                'vocabulary': {
                    'kanji_word': '家',
                    'hiragana': 'いえ',
                    'reading': 'GIA',
                    'meaning': 'nhà'
                }
            },
            {
                'kanji': '族',
                'hiragana': 'ぞく',
                'vietnamese': 'TỘC',
                'stroke_count': 11,
                'kunyomi': '',
                'onyomi': 'ゾク',
                'meaning': 'tộc, dòng họ',
                'vocabulary': {
                    'kanji_word': '家族',
                    'hiragana': 'かぞく',
                    'reading': 'GIA TỘC',
                    'meaning': 'gia đình'
                }
            },
        ]
        
        for order, data in enumerate(kanji_data_lesson6, 1):
            vocab_data = data.pop('vocabulary')
            kanji, _ = Kanji.objects.get_or_create(
                lesson=lesson6,
                kanji=data['kanji'],
                defaults={**data, 'order': order}
            )
            
            KanjiVocabulary.objects.get_or_create(
                kanji=kanji,
                kanji_word=vocab_data['kanji_word'],
                defaults={
                    'hiragana': vocab_data['hiragana'],
                    'reading': vocab_data['reading'],
                    'meaning': vocab_data['meaning'],
                    'order': 1
                }
            )
        
        self.stdout.write(self.style.SUCCESS("Đã thêm dữ liệu N5"))
    
    def add_n4_data(self):
        """Thêm dữ liệu kanji N4"""
        
        # ===== UNIT 1: 第1週 =====
        unit1, _ = KanjiUnit.objects.get_or_create(
            level='N4',
            unit_number=1,
            defaults={
                'unit_name': '第1週',
                'description': 'Tuần 1 - Kanji N4 về giáo dục và học tập',
                'order': 1
            }
        )
        
        # Lesson 1: 学校
        lesson1, _ = KanjiLesson.objects.get_or_create(
            unit=unit1,
            lesson_number=1,
            defaults={
                'lesson_name': '学校',
                'order': 1
            }
        )
        
        kanji_data_lesson1 = [
            {
                'kanji': '学',
                'hiragana': 'がく',
                'vietnamese': 'HỌC',
                'stroke_count': 8,
                'kunyomi': 'まな-ぶ',
                'onyomi': 'ガク',
                'meaning': 'học, học hành',
                'vocabulary': {
                    'kanji_word': '学校',
                    'hiragana': 'がっこう',
                    'reading': 'HỌC HIỆU',
                    'meaning': 'trường học'
                }
            },
            {
                'kanji': '校',
                'hiragana': 'こう',
                'vietnamese': 'HIỆU',
                'stroke_count': 10,
                'kunyomi': '',
                'onyomi': 'コウ',
                'meaning': 'trường, kiểm tra',
                'vocabulary': {
                    'kanji_word': '学校',
                    'hiragana': 'がっこう',
                    'reading': 'HỌC HIỆU',
                    'meaning': 'trường học'
                }
            },
        ]
        
        for order, data in enumerate(kanji_data_lesson1, 1):
            vocab_data = data.pop('vocabulary')
            kanji, _ = Kanji.objects.get_or_create(
                lesson=lesson1,
                kanji=data['kanji'],
                defaults={**data, 'order': order}
            )
            
            KanjiVocabulary.objects.get_or_create(
                kanji=kanji,
                kanji_word=vocab_data['kanji_word'],
                defaults={
                    'hiragana': vocab_data['hiragana'],
                    'reading': vocab_data['reading'],
                    'meaning': vocab_data['meaning'],
                    'order': 1
                }
            )
        
        # Lesson 2: 勉強
        lesson2, _ = KanjiLesson.objects.get_or_create(
            unit=unit1,
            lesson_number=2,
            defaults={
                'lesson_name': '勉強',
                'order': 2
            }
        )
        
        kanji_data_lesson2 = [
            {
                'kanji': '勉',
                'hiragana': 'べん',
                'vietnamese': 'MIỄN',
                'stroke_count': 10,
                'kunyomi': '',
                'onyomi': 'ベン',
                'meaning': 'cố gắng, siêng năng',
                'vocabulary': {
                    'kanji_word': '勉強',
                    'hiragana': 'べんきょう',
                    'reading': 'MIỄN CƯỜNG',
                    'meaning': 'học tập'
                }
            },
            {
                'kanji': '強',
                'hiragana': 'きょう',
                'vietnamese': 'CƯỜNG',
                'stroke_count': 11,
                'kunyomi': 'つよ-い',
                'onyomi': 'キョウ、ゴウ',
                'meaning': 'mạnh, cố gắng',
                'vocabulary': {
                    'kanji_word': '勉強',
                    'hiragana': 'べんきょう',
                    'reading': 'MIỄN CƯỜNG',
                    'meaning': 'học tập'
                }
            },
        ]
        
        for order, data in enumerate(kanji_data_lesson2, 1):
            vocab_data = data.pop('vocabulary')
            kanji, _ = Kanji.objects.get_or_create(
                lesson=lesson2,
                kanji=data['kanji'],
                defaults={**data, 'order': order}
            )
            
            KanjiVocabulary.objects.get_or_create(
                kanji=kanji,
                kanji_word=vocab_data['kanji_word'],
                defaults={
                    'hiragana': vocab_data['hiragana'],
                    'reading': vocab_data['reading'],
                    'meaning': vocab_data['meaning'],
                    'order': 1
                }
            )
        
        # ===== UNIT 2: 第2週 =====
        unit2, _ = KanjiUnit.objects.get_or_create(
            level='N4',
            unit_number=2,
            defaults={
                'unit_name': '第2週',
                'description': 'Tuần 2 - Kanji N4 về công việc',
                'order': 2
            }
        )
        
        # Lesson 1: 会社
        lesson3, _ = KanjiLesson.objects.get_or_create(
            unit=unit2,
            lesson_number=1,
            defaults={
                'lesson_name': '会社',
                'order': 1
            }
        )
        
        kanji_data_lesson3 = [
            {
                'kanji': '会',
                'hiragana': 'かい',
                'vietnamese': 'HỘI',
                'stroke_count': 6,
                'kunyomi': 'あ-う',
                'onyomi': 'カイ、エ',
                'meaning': 'gặp, họp',
                'vocabulary': {
                    'kanji_word': '会社',
                    'hiragana': 'かいしゃ',
                    'reading': 'HỘI XÃ',
                    'meaning': 'công ty'
                }
            },
            {
                'kanji': '社',
                'hiragana': 'しゃ',
                'vietnamese': 'XÃ',
                'stroke_count': 7,
                'kunyomi': 'やしろ',
                'onyomi': 'シャ、ジャ',
                'meaning': 'công ty, xã hội',
                'vocabulary': {
                    'kanji_word': '会社',
                    'hiragana': 'かいしゃ',
                    'reading': 'HỘI XÃ',
                    'meaning': 'công ty'
                }
            },
        ]
        
        for order, data in enumerate(kanji_data_lesson3, 1):
            vocab_data = data.pop('vocabulary')
            kanji, _ = Kanji.objects.get_or_create(
                lesson=lesson3,
                kanji=data['kanji'],
                defaults={**data, 'order': order}
            )
            
            KanjiVocabulary.objects.get_or_create(
                kanji=kanji,
                kanji_word=vocab_data['kanji_word'],
                defaults={
                    'hiragana': vocab_data['hiragana'],
                    'reading': vocab_data['reading'],
                    'meaning': vocab_data['meaning'],
                    'order': 1
                }
            )
        
        self.stdout.write(self.style.SUCCESS("Đã thêm dữ liệu N4"))

