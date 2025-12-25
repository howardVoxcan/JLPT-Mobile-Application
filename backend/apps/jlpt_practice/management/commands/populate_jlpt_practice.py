# apps/jlpt_practice/management/commands/populate_jlpt_practice.py
from django.core.management.base import BaseCommand
from apps.jlpt_practice.models import (
    JLPTTest,
    JLPTSection,
    JLPTSubSection,
    JLPTQuestion,
    JLPTChoice,
)


class Command(BaseCommand):
    help = 'Populate JLPT Practice test data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before populating',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            JLPTTest.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Cleared!'))

        self.stdout.write('Populating JLPT Practice data...')

        # Create N5 Tests
        self.create_n5_tests()

        self.stdout.write(self.style.SUCCESS('Successfully populated JLPT Practice data!'))

    def create_n5_tests(self):
        """Create 2 N5 tests with sample questions"""
        
        # Test 1 - N5
        test1 = JLPTTest.objects.create(
            level='N5',
            order=1,
            title='Test 1',
            description='Đề thi thử JLPT N5 - Test 1',
            duration_minutes=140,
            total_score=180
        )
        
        self.stdout.write(f'Created test: {test1}')
        
        # Section 1: Vocabulary (文字・語彙)
        vocab_section = JLPTSection.objects.create(
            test=test1,
            section_type='vocabulary',
            title_jp='文字・語彙',
            title_vn='Từ vựng',
            order=1,
            max_score=60
        )
        
        # Sub-categories for vocabulary
        subsec_kanji_reading = JLPTSubSection.objects.create(
            section=vocab_section,
            name='Cách đọc kanji',
            order=1
        )
        subsec_hiragana_reading = JLPTSubSection.objects.create(
            section=vocab_section,
            name='Cách đọc Hiragana',
            order=2
        )
        
        # Vocabulary Questions
        vocab_questions = [
            {
                'question_number': 1,
                'instruction': '問題＿＿＿の読み方として最もよいものを、１・２・３・４から一つ選びなさい。',
                'sentence': '若いとき夢中で星座の名前を覚えた。',
                'underlined_word': '若い',
                'subsection': subsec_kanji_reading,
                'choices': [
                    {'text': 'ちいさい', 'order': 1, 'is_correct': False},
                    {'text': 'すくない', 'order': 2, 'is_correct': False},
                    {'text': 'わかい', 'order': 3, 'is_correct': True},
                    {'text': 'おさない', 'order': 4, 'is_correct': False},
                ],
                'explanation': '「若い」có nghĩa là "trẻ, trẻ tuổi", đọc là "わかい".'
            },
            {
                'question_number': 2,
                'instruction': '',
                'sentence': '若いとき夢中で星座の名前を覚えた。',
                'underlined_word': '夢中',
                'subsection': subsec_kanji_reading,
                'choices': [
                    {'text': 'むちゅう', 'order': 1, 'is_correct': True},
                    {'text': 'むじゅう', 'order': 2, 'is_correct': False},
                    {'text': 'むちゅ', 'order': 3, 'is_correct': False},
                    {'text': 'むじゅ', 'order': 4, 'is_correct': False},
                ],
                'explanation': '「夢中」có nghĩa là "say mê, mê mẩn", đọc là "むちゅう".'
            },
            {
                'question_number': 3,
                'instruction': '',
                'sentence': '若いとき夢中で星座の名前を覚えた。',
                'underlined_word': '星座',
                'subsection': subsec_kanji_reading,
                'choices': [
                    {'text': 'せいざ', 'order': 1, 'is_correct': True},
                    {'text': 'せいさ', 'order': 2, 'is_correct': False},
                    {'text': 'せざ', 'order': 3, 'is_correct': False},
                    {'text': 'せさ', 'order': 4, 'is_correct': False},
                ],
                'explanation': '「星座」có nghĩa là "chòm sao", đọc là "せいざ".'
            },
        ]
        
        for q_data in vocab_questions:
            choices_data = q_data.pop('choices')
            question = JLPTQuestion.objects.create(
                section=vocab_section,
                **q_data
            )
            
            for choice_data in choices_data:
                JLPTChoice.objects.create(
                    question=question,
                    **choice_data
                )
        
        # Section 2: Grammar (文法・読解)
        grammar_section = JLPTSection.objects.create(
            test=test1,
            section_type='grammar',
            title_jp='文法・読解',
            title_vn='Ngữ pháp',
            order=2,
            max_score=60
        )
        
        # Sub-categories for grammar
        subsec_grammar = JLPTSubSection.objects.create(
            section=grammar_section,
            name='Chọn dạng ngữ pháp',
            order=1
        )
        
        # Grammar Questions
        grammar_questions = [
            {
                'question_number': 21,
                'instruction': '問題＿＿＿に入る最もよいものを、１・２・３・４から一つ選びなさい。',
                'sentence': 'この本は＿＿＿読むほど面白くなる。',
                'underlined_word': '＿＿＿',
                'subsection': subsec_grammar,
                'choices': [
                    {'text': '読む', 'order': 1, 'is_correct': False},
                    {'text': '読んだ', 'order': 2, 'is_correct': False},
                    {'text': '読んで', 'order': 3, 'is_correct': False},
                    {'text': '読めば', 'order': 4, 'is_correct': True},
                ],
                'explanation': 'Cấu trúc ～ば～ほど (càng ... càng ...)'
            },
            {
                'question_number': 22,
                'instruction': '',
                'sentence': '彼は＿＿＿来ないと言っていた。',
                'underlined_word': '＿＿＿',
                'subsection': subsec_grammar,
                'choices': [
                    {'text': 'きっと', 'order': 1, 'is_correct': False},
                    {'text': 'たぶん', 'order': 2, 'is_correct': True},
                    {'text': 'ぜひ', 'order': 3, 'is_correct': False},
                    {'text': '必ず', 'order': 4, 'is_correct': False},
                ],
                'explanation': '「たぶん」có nghĩa là "có lẽ" phù hợp với câu.'
            },
        ]
        
        for q_data in grammar_questions:
            choices_data = q_data.pop('choices')
            question = JLPTQuestion.objects.create(
                section=grammar_section,
                **q_data
            )
            
            for choice_data in choices_data:
                JLPTChoice.objects.create(
                    question=question,
                    **choice_data
                )
        
        # Section 3: Listening (聴解)
        listening_section = JLPTSection.objects.create(
            test=test1,
            section_type='listening',
            title_jp='聴解',
            title_vn='Nghe hiểu',
            order=3,
            max_score=60
        )
        
        # Sub-categories for listening
        subsec_listening = JLPTSubSection.objects.create(
            section=listening_section,
            name='Hiểu nội dung',
            order=1
        )
        
        # Listening Questions (without audio for now)
        listening_questions = [
            {
                'question_number': 89,
                'instruction': '音声を聞いて、質問に答えなさい。',
                'sentence': '若いとき夢中で星座の名前を覚えた。',
                'underlined_word': '若い',
                'subsection': subsec_listening,
                'duration_seconds': 83,
                'choices': [
                    {'text': 'ちいさい', 'order': 1, 'is_correct': False},
                    {'text': 'すくない', 'order': 2, 'is_correct': False},
                    {'text': 'わかい', 'order': 3, 'is_correct': True},
                    {'text': 'おさない', 'order': 4, 'is_correct': False},
                ],
                'explanation': 'Audio nói về "若い" (trẻ).'
            },
            {
                'question_number': 90,
                'instruction': '',
                'sentence': '',
                'underlined_word': '',
                'subsection': subsec_listening,
                'duration_seconds': 83,
                'choices': [
                    {'text': '1', 'order': 1, 'is_correct': False},
                    {'text': '2', 'order': 2, 'is_correct': True},
                    {'text': '3', 'order': 3, 'is_correct': False},
                    {'text': '4', 'order': 4, 'is_correct': False},
                ],
                'explanation': 'Đáp án đúng là hình 2.'
            },
        ]
        
        for q_data in listening_questions:
            choices_data = q_data.pop('choices')
            question = JLPTQuestion.objects.create(
                section=listening_section,
                **q_data
            )
            
            for choice_data in choices_data:
                JLPTChoice.objects.create(
                    question=question,
                    **choice_data
                )
        
        self.stdout.write(self.style.SUCCESS(f'Created {vocab_section.questions.count()} vocabulary questions'))
        self.stdout.write(self.style.SUCCESS(f'Created {grammar_section.questions.count()} grammar questions'))
        self.stdout.write(self.style.SUCCESS(f'Created {listening_section.questions.count()} listening questions'))
        
        # Test 2 - N5 (not attempted yet)
        test2 = JLPTTest.objects.create(
            level='N5',
            order=2,
            title='Test 2',
            description='Đề thi thử JLPT N5 - Test 2',
            duration_minutes=140,
            total_score=180
        )
        
        self.stdout.write(f'Created test: {test2}')
        self.stdout.write(self.style.WARNING('(Test 2 has no questions yet - add later)'))

