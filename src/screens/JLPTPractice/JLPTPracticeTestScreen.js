import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';

export default function JLPTPracticeTestScreen({ navigation, route }) {
  const { testId = 1, level = 'N5' } = route?.params || {};
  const [activeTab, setActiveTab] = useState('vocabulary'); // 'vocabulary', 'grammar', 'listening'
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Mock questions data
  const questions = [
    {
      id: 1,
      type: 'vocabulary',
      questionNumber: 'Câu 1',
      image: null, // Can add image URL later
      sentence: '若いとき夢中で星座の名前を覚えた。',
      underlinedWord: '若い',
      options: [
        { id: 1, text: 'ちいさい' },
        { id: 2, text: 'すくない' },
        { id: 3, text: 'わかい' },
        { id: 4, text: 'おさない' },
      ],
    },
    {
      id: 2,
      type: 'vocabulary',
      questionNumber: 'Câu 2',
      image: null,
      sentence: '若いとき夢中で星座の名前を覚えた。',
      underlinedWord: '若い',
      options: [
        { id: 1, text: 'ちいさい' },
        { id: 2, text: 'すくない' },
        { id: 3, text: 'わかい' },
        { id: 4, text: 'おさない' },
      ],
    },
    {
      id: 21,
      type: 'grammar',
      questionNumber: 'Câu 21',
      image: null,
      sentence: 'この本は＿＿＿読むほど面白くなる。',
      underlinedWord: '＿＿＿',
      options: [
        { id: 1, text: '読む' },
        { id: 2, text: '読んだ' },
        { id: 3, text: '読んで' },
        { id: 4, text: '読めば' },
      ],
    },
    {
      id: 22,
      type: 'grammar',
      questionNumber: 'Câu 22',
      image: null,
      sentence: '彼は＿＿＿来ないと言っていた。',
      underlinedWord: '＿＿＿',
      options: [
        { id: 1, text: 'きっと' },
        { id: 2, text: 'たぶん' },
        { id: 3, text: 'ぜひ' },
        { id: 4, text: '必ず' },
      ],
    },
    {
      id: 89,
      type: 'listening',
      questionNumber: 'Câu 89',
      hasAudio: true,
      audioDuration: '1:23',
      image: null,
      sentence: '若いとき夢中で星座の名前を覚えた。',
      underlinedWord: '若い',
      options: [
        { id: 1, text: 'ちいさい' },
        { id: 2, text: 'すくない' },
        { id: 3, text: 'わかい' },
        { id: 4, text: 'おさない' },
      ],
    },
    {
      id: 90,
      type: 'listening',
      questionNumber: 'Câu 90',
      hasAudio: true,
      audioDuration: '1:23',
      image: null, // Can add image grid later
      options: [
        { id: 1, text: '1' },
        { id: 2, text: '2' },
        { id: 3, text: '3' },
        { id: 4, text: '4' },
      ],
    },
  ];

  const filteredQuestions = questions.filter(q => {
    if (activeTab === 'vocabulary') return q.type === 'vocabulary';
    if (activeTab === 'grammar') return q.type === 'grammar';
    if (activeTab === 'listening') return q.type === 'listening';
    return true;
  });

  const renderAudioPlayer = (duration) => (
    <View style={styles.audioPlayer}>
      <TouchableOpacity style={styles.playButton}>
        <Ionicons name="play" size={22} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.audioTime}>0:00 / {duration}</Text>
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
  );

  const renderQuestionCard = (question) => (
    <View key={question.id} style={styles.questionCard}>
      <Text style={styles.questionNumber}>{question.questionNumber}</Text>
      
      {question.hasAudio && renderAudioPlayer(question.audioDuration)}
      
      {question.image && (
        <View style={styles.questionImage}>
          <Image source={{ uri: question.image }} style={styles.image} resizeMode="contain" />
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

      {question.options && (
        <View style={styles.optionsContainer}>
          {question.options.map((option) => (
            <View key={option.id} style={styles.optionRow}>
              <Text style={styles.optionNumber}>①</Text>
              <Text style={styles.optionText}>{option.text}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.radioButtonsRow}>
        {[1, 2, 3, 4].map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.radioButtonGroup}
            onPress={() => handleAnswerSelect(question.id, num)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.radioOuter,
              selectedAnswers[question.id] === num && styles.radioOuterSelected
            ]}>
              {selectedAnswers[question.id] === num && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Text style={styles.radioLabel}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Timer */}
      <View style={styles.timerContainer}>
        <Ionicons name="alarm-outline" size={26} color={Colors.textPrimary} />
        <Text style={styles.timerText}>1:15:54</Text>
      </View>

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
        {/* Instruction Box */}
        <View style={styles.instructionBox}>
          <Text style={styles.instructionText}>
            問題＿＿＿の読み方として最もよいものを、１・２・３・４から一つ選びなさい。
          </Text>
        </View>

        {/* Questions */}
        {filteredQuestions.map(renderQuestionCard)}

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {activeTab !== 'vocabulary' && (
            <TouchableOpacity 
              style={styles.navButton} 
              activeOpacity={0.7}
              onPress={() => {
                if (activeTab === 'grammar') {
                  setActiveTab('vocabulary');
                } else if (activeTab === 'listening') {
                  setActiveTab('grammar');
                }
              }}
            >
              <Text style={styles.navButtonText}>{'< Trang trước'}</Text>
            </TouchableOpacity>
          )}
          {activeTab === 'listening' ? (
            <TouchableOpacity 
              style={[styles.navButton, styles.submitButton]} 
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate('JLPTPracticeResult', { testId, level });
              }}
            >
              <Text style={styles.navButtonText}>Nộp bài</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.navButton, styles.nextButton]} 
              activeOpacity={0.7}
              onPress={() => {
                if (activeTab === 'vocabulary') {
                  setActiveTab('grammar');
                } else if (activeTab === 'grammar') {
                  setActiveTab('listening');
                }
              }}
            >
              <Text style={styles.navButtonText}>{'Trang sau >'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 34,
    marginBottom: 16,
    gap: 12,
    alignSelf: 'center',
  },
  timerText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 26,
    color: Colors.textPrimary,
  },
  tabsContainer: {
    flexDirection: 'row',
    width: 300,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignSelf: 'center',
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
    lineHeight: 18,
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
  questionNumber: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textPrimary,
    marginBottom: 8,
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
  questionImage: {
    width: 249,
    height: 148,
    marginBottom: 10,
    alignSelf: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: '100%',
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
    marginBottom: 4,
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
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  navButton: {
    width: 140,
    height: 40,
    backgroundColor: Colors.secondary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  nextButton: {
    backgroundColor: Colors.secondary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  navButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 19,
    color: Colors.white,
  },
});

