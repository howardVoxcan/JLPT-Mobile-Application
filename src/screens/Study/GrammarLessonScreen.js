import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function GrammarLessonScreen({ navigation, route }) {
  const { category = 'Ngữ pháp', level = 'N5', lessonId = 1 } = route?.params || {};
  const [activeTab, setActiveTab] = useState('grammar'); // 'grammar' or 'practice'
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Mock grammar data
  const grammarItems = [
    {
      id: 1,
      title: '1. Khẳng định và phủ định của một danh từ',
      structure: {
        noun: 'N',
        affirmative: 'N　です',
        negative: 'N　ではありません'
      },
      meaning: {
        affirmative: 'Khẳng định: là~',
        negative: 'Phủ định: không phải là~',
        notes: [
          '※です　Danh từ đi cùng です để cấu thành vị ngữ. です vừa biểu thị phán đoán, khẳng định vừa biểu thị thái độ lịch sự đối với người nghe.',
          '※じゃ　ありません　thường được dùng trong hội thoại hằng ngày. では　ありません　thường được dùng trong các bài phát biểu hay văn viết.'
        ]
      },
      examples: [
        'がくせい。',
        'がくせいです。',
        'がくせいじゃありません。',
        '',
        'やまだ。',
        'やまだです。',
        'やまだじゃありません。'
      ]
    },
    {
      id: 2,
      title: '2. Khẳng định và phủ định của một danh từ',
      structure: {
        noun: 'N',
        affirmative: 'N　です',
        negative: 'N　ではありません'
      },
      meaning: {
        affirmative: 'Khẳng định: là~',
        negative: 'Phủ định: không phải là~',
        notes: []
      },
      examples: []
    },
    {
      id: 3,
      title: '3. Khẳng định và phủ định của một danh từ',
      structure: {
        noun: 'N',
        affirmative: 'N　です',
        negative: 'N　ではありません'
      },
      meaning: {
        affirmative: 'Khẳng định: là~',
        negative: 'Phủ định: không phải là~',
        notes: []
      },
      examples: []
    },
    {
      id: 4,
      title: '4. Khẳng định và phủ định của một danh từ',
      structure: {
        noun: 'N',
        affirmative: 'N　です',
        negative: 'N　ではありません'
      },
      meaning: {
        affirmative: 'Khẳng định: là~',
        negative: 'Phủ định: không phải là~',
        notes: []
      },
      examples: []
    },
  ];

  // Mock practice questions
  const practiceQuestions = [
    {
      id: 1,
      questionNumber: 'Câu 1',
      sentence: '問題＿＿＿の読み方として最もよいものを、１・２・３・４から一つ選びなさい。',
      options: [
        { id: 1, text: '選択肢１' },
        { id: 2, text: '選択肢２' },
        { id: 3, text: '選択肢３' },
        { id: 4, text: '選択肢４' },
      ],
      correctAnswer: 2,
    },
    {
      id: 2,
      questionNumber: 'Câu 2',
      sentence: '問題＿＿＿の読み方として最もよいものを、１・２・３・４から一つ選びなさい。',
      options: [
        { id: 1, text: '選択肢１' },
        { id: 2, text: '選択肢２' },
        { id: 3, text: '選択肢３' },
        { id: 4, text: '選択肢４' },
      ],
      correctAnswer: 3,
    },
    {
      id: 3,
      questionNumber: 'Câu 3',
      sentence: '問題＿＿＿の読み方として最もよいものを、１・２・３・４から一つ選びなさい。',
      options: [
        { id: 1, text: '選択肢１' },
        { id: 2, text: '選択肢２' },
        { id: 3, text: '選択肢３' },
        { id: 4, text: '選択肢４' },
      ],
      correctAnswer: 1,
    },
    {
      id: 4,
      questionNumber: 'Câu 4',
      sentence: '問題＿＿＿の読み方として最もよいものを、１・２・３・４から一つ選びなさい。',
      options: [
        { id: 1, text: '選択肢１' },
        { id: 2, text: '選択肢２' },
        { id: 3, text: '選択肢３' },
        { id: 4, text: '選択肢４' },
      ],
      correctAnswer: 4,
    },
  ];

  const renderGrammarTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {grammarItems.map((item, index) => (
        <View key={item.id}>
          {/* Grammar Title */}
          <View style={styles.grammarTitleBox}>
            <Text style={styles.grammarTitle}>{item.title}</Text>
          </View>

          {/* Structure Section */}
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cấu trúc</Text>
            </View>
            <View style={styles.structureTable}>
              <View style={styles.tableRow}>
                <View style={styles.nounCell}>
                  <Text style={styles.nounText}>{item.structure.noun}</Text>
                </View>
                <View style={styles.headerCell}>
                  <Text style={styles.headerText}>Khẳng định</Text>
                </View>
                <View style={styles.headerCell}>
                  <Text style={styles.headerText}>Phủ định</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.nounCell} />
                <View style={styles.contentCell}>
                  <Text style={styles.structureText}>{item.structure.affirmative}</Text>
                </View>
                <View style={styles.contentCell}>
                  <Text style={styles.structureText}>{item.structure.negative}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Meaning Section */}
          {item.meaning && (
            <View style={styles.contentSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ý nghĩa</Text>
              </View>
              <View style={styles.meaningBox}>
                <Text style={styles.meaningText}>
                  {item.meaning.affirmative}{'\n'}
                  {item.meaning.negative}
                  {item.meaning.notes.length > 0 && '\n\n'}
                  {item.meaning.notes.join('\n\n')}
                </Text>
              </View>
            </View>
          )}

          {/* Examples Section */}
          {item.examples && item.examples.length > 0 && (
            <View style={styles.contentSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ví dụ</Text>
              </View>
              <View style={styles.examplesBox}>
                {item.examples.map((example, idx) => (
                  <Text key={idx} style={styles.exampleText}>
                    {example || ' '}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      ))}
      <View style={{ height: 20 }} />
    </ScrollView>
  );

  const handleSubmit = () => {
    setShowResults(true);
  };

  const renderPracticeTab = () => {
    if (showResults) {
      return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {practiceQuestions.map((q) => {
            const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
            const correctOption = q.options.find(opt => opt.id === q.correctAnswer);
            const userOption = q.options.find(opt => opt.id === selectedAnswers[q.id]);

            return (
              <View key={q.id} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionNumber}>{q.questionNumber}</Text>
                  {isCorrect ? (
                    <View style={styles.correctBadge}>
                      <Ionicons name="checkmark-circle" size={20} color="#7FDEAD" />
                      <Text style={styles.correctText}>Đúng</Text>
                    </View>
                  ) : (
                    <View style={styles.incorrectBadge}>
                      <Ionicons name="close-circle" size={20} color="#FF6B6B" />
                      <Text style={styles.incorrectText}>Sai</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.sentence}>{q.sentence}</Text>

                <View style={styles.optionsContainer}>
                  {q.options.map((option, index) => {
                    const isUserAnswer = option.id === selectedAnswers[q.id];
                    const isCorrectAnswer = option.id === q.correctAnswer;
                    let optionStyle = styles.optionRow;
                    let optionTextStyle = styles.optionText;

                    if (isCorrectAnswer) {
                      optionStyle = [styles.optionRow, styles.correctOption];
                      optionTextStyle = [styles.optionText, styles.correctOptionText];
                    } else if (isUserAnswer && !isCorrectAnswer) {
                      optionStyle = [styles.optionRow, styles.incorrectOption];
                      optionTextStyle = [styles.optionText, styles.incorrectOptionText];
                    }

                    return (
                      <View key={option.id} style={optionStyle}>
                        <Text style={styles.optionNumber}>{String.fromCharCode(0x2460 + index)}</Text>
                        <Text style={optionTextStyle}>{option.text}</Text>
                        {isCorrectAnswer && (
                          <Ionicons name="checkmark-circle" size={18} color="#7FDEAD" style={styles.optionIcon} />
                        )}
                        {isUserAnswer && !isCorrectAnswer && (
                          <Ionicons name="close-circle" size={18} color="#FF6B6B" style={styles.optionIcon} />
                        )}
                      </View>
                    );
                  })}
                </View>

                {!isCorrect && (
                  <View style={styles.explanationBox}>
                    <Text style={styles.explanationTitle}>Đáp án đúng:</Text>
                    <Text style={styles.explanationText}>
                      {String.fromCharCode(0x2460 + q.options.findIndex(opt => opt.id === q.correctAnswer))} {correctOption?.text}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
          <View style={{ height: 20 }} />
        </ScrollView>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Instruction Box */}
        <View style={styles.instructionBox}>
          <Text style={styles.instructionText}>
            問題１〜５ の文について、あとの １・２・３・４ の中からいちばんいいものを 一つ 選（えら）び なさい。
          </Text>
        </View>

        {/* Questions */}
        {practiceQuestions.map((q) => (
          <View key={q.id} style={styles.questionCard}>
            <Text style={[styles.questionNumber, styles.questionNumberMargin]}>{q.questionNumber}</Text>
            
            <Text style={styles.sentence}>{q.sentence}</Text>

            <View style={styles.optionsContainer}>
              {q.options.map((option, index) => (
                <View key={option.id} style={styles.optionRow}>
                  <Text style={styles.optionNumber}>{String.fromCharCode(0x2460 + index)}</Text>
                  <Text style={styles.optionText}>{option.text}</Text>
                </View>
              ))}
            </View>

            <View style={styles.radioButtonsRow}>
              {[1, 2, 3, 4].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.radioButtonGroup}
                  onPress={() => handleAnswerSelect(q.id, num)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.radioOuter,
                    selectedAnswers[q.id] === num && styles.radioOuterSelected
                  ]}>
                    {selectedAnswers[q.id] === num && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>Nộp bài</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'grammar' && styles.tabActive]}
              onPress={() => setActiveTab('grammar')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'grammar' && styles.tabTextActive]}>
                Ngữ pháp
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'practice' && styles.tabActive]}
              onPress={() => setActiveTab('practice')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'practice' && styles.tabTextActive]}>
                Luyện tập
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'grammar' ? renderGrammarTab() : renderPracticeTab()}
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  contentCard: {
    flex: 1,
    marginHorizontal: 13,
    marginTop: 14,
    marginBottom: 80,
    backgroundColor: Colors.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 60,
    paddingTop: 14,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    borderRadius: 5,
    shadowColor: 'rgba(93, 0, 212, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  tabText: {
    fontWeight: '700',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  tabTextActive: {
    color: Colors.white,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.formStrokeDefault,
    marginHorizontal: 16,
  },
  tabContent: {
    flex: 1,
    paddingTop: 14,
  },
  grammarTitleBox: {
    backgroundColor: 'rgba(197, 185, 232, 0.5)',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.formStrokeDefault,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 10,
  },
  grammarTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  contentSection: {
    marginHorizontal: 16,
  },
  sectionHeader: {
    backgroundColor: 'rgba(255, 203, 164, 0.5)',
    borderWidth: 1,
    borderColor: Colors.formStrokeDefault,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  structureTable: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.formStrokeDefault,
    backgroundColor: Colors.white,
  },
  tableRow: {
    flexDirection: 'row',
  },
  nounCell: {
    width: 46,
    borderRightWidth: 1,
    borderColor: Colors.formStrokeDefault,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  nounText: {
    fontWeight: '700',
    fontSize: 13,
    color: '#000000',
  },
  headerCell: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.formStrokeDefault,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
  },
  headerText: {
    fontWeight: '700',
    fontSize: 13,
    color: '#000000',
  },
  contentCell: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: Colors.formStrokeDefault,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  structureText: {
    fontWeight: '400',
    fontSize: 13,
    color: '#F4899E',
  },
  meaningBox: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.formStrokeDefault,
    backgroundColor: Colors.white,
    padding: 12,
  },
  meaningText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19,
    color: '#000000',
  },
  examplesBox: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.formStrokeDefault,
    backgroundColor: Colors.white,
    padding: 12,
  },
  exampleText: {
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    marginBottom: 2,
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  instructionBox: {
    width: 360,
    minHeight: 70,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  instructionText: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 17,
    color: Colors.textPrimary,
  },
  questionCard: {
    width: 360,
    minHeight: 228,
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  questionNumberMargin: {
    marginBottom: 8,
  },
  correctBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  correctText: {
    fontFamily: 'Nunito',
    fontWeight: '600',
    fontSize: 14,
    color: '#7FDEAD',
  },
  incorrectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  incorrectText: {
    fontFamily: 'Nunito',
    fontWeight: '600',
    fontSize: 14,
    color: '#FF6B6B',
  },
  sentence: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  optionsContainer: {
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
  },
  correctOption: {
    backgroundColor: 'rgba(127, 222, 173, 0.1)',
    borderRadius: 5,
  },
  correctOptionText: {
    color: '#7FDEAD',
    fontWeight: '600',
  },
  incorrectOption: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 5,
  },
  incorrectOptionText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  optionNumber: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 16,
    color: Colors.textPrimary,
    marginRight: 8,
    minWidth: 20,
  },
  optionText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  optionIcon: {
    marginLeft: 8,
  },
  explanationBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(127, 222, 173, 0.1)',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#7FDEAD',
  },
  explanationTitle: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  explanationText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  radioButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
    width: 300,
  },
  radioButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: 24,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.textPrimary,
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.textPrimary,
  },
  radioLabel: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 18,
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  submitButton: {
    width: 200,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  submitButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.white,
  },
});

