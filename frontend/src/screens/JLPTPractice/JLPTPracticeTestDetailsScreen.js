import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';

export default function JLPTPracticeTestDetailsScreen({ navigation, route }) {
  const { testId = 1, level = 'N5' } = route?.params || {};
  const [activeTab, setActiveTab] = useState('vocabulary');

  // Mock questions with answers
  const questions = [
    {
      id: 1,
      type: 'vocabulary',
      questionNumber: 'Câu 1',
      sentence: '若いとき夢中で星座の名前を覚えた。',
      underlinedWord: '若い',
      options: [
        { id: 1, text: 'ちいさい', isCorrect: false },
        { id: 2, text: 'すくない', isCorrect: false },
        { id: 3, text: 'わかい', isCorrect: true },
        { id: 4, text: 'おさない', isCorrect: false },
      ],
      userAnswer: 3,
      isCorrect: true,
    },
    {
      id: 2,
      type: 'vocabulary',
      questionNumber: 'Câu 2',
      sentence: '若いとき夢中で星座の名前を覚えた。',
      underlinedWord: '若い',
      options: [
        { id: 1, text: 'ちいさい', isCorrect: false },
        { id: 2, text: 'すくない', isCorrect: false },
        { id: 3, text: 'わかい', isCorrect: true },
        { id: 4, text: 'おさない', isCorrect: false },
      ],
      userAnswer: 2,
      isCorrect: false,
    },
    {
      id: 21,
      type: 'grammar',
      questionNumber: 'Câu 21',
      sentence: 'この本は＿＿＿読むほど面白くなる。',
      underlinedWord: '＿＿＿',
      options: [
        { id: 1, text: '読む', isCorrect: false },
        { id: 2, text: '読んだ', isCorrect: true },
        { id: 3, text: '読んで', isCorrect: false },
        { id: 4, text: '読めば', isCorrect: false },
      ],
      userAnswer: 2,
      isCorrect: true,
    },
    {
      id: 22,
      type: 'grammar',
      questionNumber: 'Câu 22',
      sentence: '彼は＿＿＿来ないと言っていた。',
      underlinedWord: '＿＿＿',
      options: [
        { id: 1, text: 'きっと', isCorrect: false },
        { id: 2, text: 'たぶん', isCorrect: true },
        { id: 3, text: 'ぜひ', isCorrect: false },
        { id: 4, text: '必ず', isCorrect: false },
      ],
      userAnswer: 1,
      isCorrect: false,
    },
    {
      id: 89,
      type: 'listening',
      questionNumber: 'Câu 89',
      hasAudio: true,
      audioDuration: '1:23',
      sentence: '若いとき夢中で星座の名前を覚えた。',
      underlinedWord: '若い',
      options: [
        { id: 1, text: 'ちいさい', isCorrect: false },
        { id: 2, text: 'すくない', isCorrect: false },
        { id: 3, text: 'わかい', isCorrect: true },
        { id: 4, text: 'おさない', isCorrect: false },
      ],
      userAnswer: 2,
      isCorrect: false,
    },
  ];

  const filteredQuestions = questions.filter(q => {
    if (activeTab === 'vocabulary') return q.type === 'vocabulary';
    if (activeTab === 'grammar') return q.type === 'grammar';
    if (activeTab === 'listening') return q.type === 'listening';
    return true;
  });

  const renderQuestionCard = (question) => {
    const correctAnswer = question.options.find(opt => opt.isCorrect);

    return (
      <View key={question.id} style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>{question.questionNumber}</Text>
          {question.isCorrect ? (
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

        {question.hasAudio && (
          <View style={styles.audioPlayer}>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={22} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.audioTime}>0:00 / {question.audioDuration}</Text>
            <View style={styles.timeline}>
              <View style={styles.timelineBg} />
              <View style={styles.timelineFill} />
            </View>
            <TouchableOpacity style={styles.audioControl}>
              <Ionicons name="volume-high-outline" size={22} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.audioControl}>
              <Ionicons name="ellipsis-vertical" size={22} color="#000000" />
            </TouchableOpacity>
          </View>
        )}

        {question.sentence && (
          <Text style={styles.sentence}>
            {question.sentence.split(question.underlinedWord).map((part, index, array) => (
              <Text key={index}>
                {part}
                {index < array.length - 1 && <Text style={styles.underlinedWord}>{question.underlinedWord}</Text>}
              </Text>
            ))}
          </Text>
        )}

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => {
            const isUserAnswer = option.id === question.userAnswer;
            const isCorrectAnswer = option.isCorrect;
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

        {!question.isCorrect && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>Đáp án đúng:</Text>
            <Text style={styles.explanationText}>
              {String.fromCharCode(0x2460 + question.options.findIndex(opt => opt.isCorrect))} {correctAnswer?.text}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'vocabulary' && styles.tabActive]}
          onPress={() => setActiveTab('vocabulary')}
          activeOpacity={0.7}
        >
          {activeTab === 'vocabulary' && <View style={styles.tabHighlight} />}
          <Text style={styles.tabText}>文字・語彙</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'grammar' && styles.tabActive]}
          onPress={() => setActiveTab('grammar')}
          activeOpacity={0.7}
        >
          {activeTab === 'grammar' && <View style={styles.tabHighlight} />}
          <Text style={styles.tabText}>文法・読解</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'listening' && styles.tabActive]}
          onPress={() => setActiveTab('listening')}
          activeOpacity={0.7}
        >
          {activeTab === 'listening' && <View style={styles.tabHighlight} />}
          <Text style={styles.tabText}>聴解</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredQuestions.map(renderQuestionCard)}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    width: 300,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tab: {
    width: 100,
    height: 30,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    backgroundColor: Colors.white,
  },
  tabHighlight: {
    position: 'absolute',
    width: 75,
    height: 17,
    backgroundColor: Colors.primaryLight,
    borderRadius: 4,
  },
  tabText: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 16,
    color: Colors.textSecondary,
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  questionCard: {
    width: 360,
    minHeight: 200,
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 15,
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
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
    borderRadius: 200,
    paddingVertical: 15,
    paddingHorizontal: 14,
    marginBottom: 10,
    gap: 12,
  },
  playButton: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioTime: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
    color: '#000000',
    minWidth: 67,
    flexShrink: 0,
  },
  timeline: {
    flex: 1,
    height: 4,
    borderRadius: 200,
    position: 'relative',
  },
  timelineBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 200,
  },
  timelineFill: {
    position: 'absolute',
    width: '58%',
    height: '100%',
    backgroundColor: '#595959',
    borderRadius: 200,
  },
  audioControl: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sentence: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  underlinedWord: {
    textDecorationLine: 'underline',
  },
  optionsContainer: {
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    borderRadius: 5,
  },
  correctOption: {
    backgroundColor: '#E8F5E9',
  },
  incorrectOption: {
    backgroundColor: '#FFEBEE',
  },
  optionNumber: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 16,
    color: Colors.textPrimary,
    marginRight: 8,
  },
  optionText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  correctOptionText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  incorrectOptionText: {
    color: '#C62828',
    fontWeight: '600',
  },
  optionIcon: {
    marginLeft: 8,
  },
  explanationBox: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 5,
    marginTop: 8,
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
});
