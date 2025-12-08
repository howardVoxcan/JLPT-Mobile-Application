import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function GrammarLessonScreen({ navigation, route }) {
  const { category = 'Ngữ pháp', level = 'N5', lessonId = 1 } = route?.params || {};
  const [activeTab, setActiveTab] = useState('grammar'); // 'grammar' or 'practice'
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleBack = () => {
    navigation.goBack();
  };

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
    { id: 1, question: '問題１〜５ の文について、あとの １・２・３・４ の中からいちばんいいものを 一つ 選（えら）び なさい。', correctAnswer: 2 },
    { id: 2, question: '問題１〜５ の文について、あとの １・２・３・４ の中からいちばんいいものを 一つ 選（えら）び なさい。', correctAnswer: 2 },
    { id: 3, question: '問題１〜５ の文について、あとの １・２・３・４ の中からいちばんいいものを 一つ 選（えら）び なさい。', correctAnswer: 2 },
    { id: 4, question: '問題１〜５ の文について、あとの １・２・３・４ の中からいちばんいいものを 一つ 選（えら）び なさい。', correctAnswer: 2 },
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

  const renderPracticeTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Instructions */}
      <View style={styles.instructionsBox}>
        <Text style={styles.instructionsText}>
          問題１〜５ の文について、あとの １・２・３・４ の中からいちばんいいものを 一つ 選（えら）び なさい。
        </Text>
      </View>

      {/* Questions */}
      {practiceQuestions.map((q) => (
        <View key={q.id} style={styles.questionBox}>
          <View style={styles.optionsRow}>
            {[1, 2, 3, 4].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.optionButton}
                onPress={() => handleAnswerSelect(q.id, option)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.radioOuter,
                  selectedAnswers[q.id] === option && styles.radioOuterSelected
                ]}>
                  {selectedAnswers[q.id] === option && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={{ height: 20 }} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{category} {level}</Text>
        </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    height: 88,
    backgroundColor: Colors.secondaryLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 52,
    width: 20,
    height: 20,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 24,
    color: Colors.textPrimary,
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
  instructionsBox: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.formStrokeDefault,
    borderRadius: 10,
  },
  instructionsText: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 19,
    color: Colors.textPrimary,
  },
  questionBox: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.formStrokeDefault,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioOuter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.21,
    borderColor: Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.textPrimary,
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: Colors.textPrimary,
  },
  optionText: {
    fontWeight: '400',
    fontSize: 14,
    color: Colors.textPrimary,
  },
});

