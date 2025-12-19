import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function ListeningLessonScreen({ navigation, route }) {
  const { category = 'Nghe hiểu', level = 'N5', lessonId = 1, title = 'Bài 1: Giới thiệu bản thân' } = route?.params || {};
  const [showScript, setShowScript] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [showScriptTranslation, setShowScriptTranslation] = useState(false); // false = Japanese, true = Vietnamese
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(150); // 2:30 in seconds
  const [showResults, setShowResults] = useState(false);

  // Ensure showScriptTranslation is always defined
  const isShowingTranslation = showScriptTranslation === true;

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock data
  const scriptJP = '若いとき夢中で星座の名前を覚えた。夜空を見上げながら、一つ一つの星の位置を確認し、その美しさに感動した。';
  const scriptVN = 'Khi còn trẻ, tôi đã say mê học thuộc tên các chòm sao. Tôi ngước nhìn bầu trời đêm, xác nhận vị trí của từng ngôi sao và cảm động trước vẻ đẹp của chúng.';

  const vocabulary = [
    { word: '若い', reading: 'わかい', meaning: 'trẻ, trẻ tuổi' },
    { word: '夢中', reading: 'むちゅう', meaning: 'say mê, mê mẩn' },
    { word: '星座', reading: 'せいざ', meaning: 'chòm sao' },
  ];

  const questions = [
    {
      id: 1,
      questionNumber: 'Câu 1:',
      sentence: '若いとき夢中で星座の名前を覚えた。',
      underlinedWord: '若い',
      options: [
        { id: 1, text: 'ちいさい' },
        { id: 2, text: 'すくない' },
        { id: 3, text: 'わかい' },
        { id: 4, text: 'おさない' },
      ],
      correctAnswer: 3,
      explanation: '「若い」có nghĩa là "trẻ, trẻ tuổi", đọc là "わかい".',
      image: null,
    },
    {
      id: 2,
      questionNumber: 'Câu 2:',
      sentence: '若いとき夢中で星座の名前を覚えた。',
      underlinedWord: '夢中',
      options: [
        { id: 1, text: 'むちゅう' },
        { id: 2, text: 'むじゅう' },
        { id: 3, text: 'むちゅ' },
        { id: 4, text: 'むじゅ' },
      ],
      correctAnswer: 1,
      explanation: '「夢中」có nghĩa là "say mê, mê mẩn", đọc là "むちゅう".',
      image: null,
    },
    {
      id: 3,
      questionNumber: 'Câu 3:',
      sentence: '若いとき夢中で星座の名前を覚えた。',
      underlinedWord: '星座',
      options: [
        { id: 1, text: 'せいざ' },
        { id: 2, text: 'せいさ' },
        { id: 3, text: 'せざ' },
        { id: 4, text: 'せさ' },
      ],
      correctAnswer: 1,
      explanation: '「星座」có nghĩa là "chòm sao", đọc là "せいざ".',
      image: null,
    },
    {
      id: 4,
      questionNumber: 'Câu 4:',
      sentence: '若いとき夢中で星座の名前を覚えた。',
      underlinedWord: '覚えた',
      options: [
        { id: 1, text: 'おぼえた' },
        { id: 2, text: 'おぼえた' },
        { id: 3, text: 'おぼえた' },
        { id: 4, text: 'おぼえた' },
      ],
      correctAnswer: 1,
      explanation: '「覚えた」là thể quá khứ của "覚える" (nhớ, học thuộc), đọc là "おぼえた".',
      image: null,
    },
  ];

  const handleSubmit = () => {
    setShowResults(true);
  };

  const getQuestionResult = (question) => {
    const userAnswer = selectedAnswers[question.id];
    const isCorrect = userAnswer === question.correctAnswer;
    return { isCorrect, userAnswer };
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Audio Player Card */}
        <View style={styles.audioCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="headset-outline" size={20} color="#446498" />
            <Text style={styles.cardTitle}>Nghe đoạn hội thoại</Text>
          </View>
          <View style={styles.audioPlayer}>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => setIsPlaying(!isPlaying)}
              activeOpacity={0.7}
            >
              <Ionicons name={isPlaying ? "pause" : "play"} size={22} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.audioTime}>{formatTime(currentTime)} / {formatTime(duration)}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(currentTime / duration) * 100}%` }]} />
            </View>
            <TouchableOpacity style={styles.audioControl} activeOpacity={0.7}>
              <Ionicons name="volume-medium-outline" size={22} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.audioControl} activeOpacity={0.7}>
              <Ionicons name="ellipsis-vertical" size={22} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Script Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text-outline" size={20} color="#446498" />
            <Text style={styles.cardTitle}>Script</Text>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setShowScript(!showScript)}
              activeOpacity={0.7}
            >
              <Ionicons name={showScript ? "eye" : "eye-off"} size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {showScript && (
            <View>
              <Text style={[
                styles.scriptText,
                !isShowingTranslation && styles.scriptTextJP
              ]}>
                {isShowingTranslation ? scriptVN : scriptJP}
              </Text>
              <TouchableOpacity 
                style={styles.toggleScriptButton}
                onPress={() => setShowScriptTranslation(!isShowingTranslation)}
                activeOpacity={0.7}
              >
                <Text style={styles.toggleScriptText}>
                  {isShowingTranslation ? 'Xem bản gốc' : 'Xem bản dịch'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Vocabulary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="book-outline" size={20} color="#446498" />
            <Text style={styles.cardTitle}>Từ vựng</Text>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setShowVocabulary(!showVocabulary)}
              activeOpacity={0.7}
            >
              <Ionicons name={showVocabulary ? "eye" : "eye-off"} size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {showVocabulary && (
            <View style={styles.vocabularyList}>
              {vocabulary.map((item, index) => (
                <View key={index} style={styles.vocabularyItem}>
                  <Text style={styles.vocabWord}>{item.word}</Text>
                  <Text style={styles.vocabReading}>{item.reading}</Text>
                  <Text style={styles.vocabMeaning}>{item.meaning}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Questions Card */}
        <View style={styles.questionsCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="time-outline" size={20} color="#446498" />
            <Text style={styles.cardTitle}>Câu hỏi</Text>
          </View>

          {questions.map((q, index) => {
            const result = showResults ? getQuestionResult(q) : null;
            const isCorrect = result?.isCorrect;
            const userAnswer = result?.userAnswer;
            
            return (
              <View key={q.id}>
                {index > 0 && <View style={styles.questionDivider} />}
                
                <View style={styles.questionHeader}>
                  <Text style={styles.questionNumber}>{q.questionNumber}</Text>
                  {showResults && (
                    <View style={[styles.resultBadge, isCorrect ? styles.resultBadgeCorrect : styles.resultBadgeIncorrect]}>
                      <Text style={styles.resultBadgeText}>{isCorrect ? 'Đúng' : 'Sai'}</Text>
                    </View>
                  )}
                </View>
                
                {q.image && (
                  <Image source={{ uri: q.image }} style={styles.questionImage} resizeMode="contain" />
                )}
                
                <Text style={styles.questionSentence}>
                  {q.sentence.split(q.underlinedWord).map((part, i, arr) => (
                    <Text key={i}>
                      {part}
                      {i < arr.length - 1 && <Text style={styles.underlined}>{q.underlinedWord}</Text>}
                    </Text>
                  ))}
                </Text>

                <View style={styles.optionsContainer}>
                  {q.options.map((option, optIndex) => {
                    const optionNum = optIndex + 1;
                    const isSelected = selectedAnswers[q.id] === optionNum;
                    const isCorrectAnswer = showResults && optionNum === q.correctAnswer;
                    const isWrongAnswer = showResults && isSelected && !isCorrectAnswer;
                    
                    return (
                      <View 
                        key={option.id} 
                        style={[
                          styles.optionRow,
                          isCorrectAnswer && styles.optionRowCorrect,
                          isWrongAnswer && styles.optionRowIncorrect
                        ]}
                      >
                        <Text style={styles.optionNumber}>{String.fromCharCode(0x2460 + optIndex)}</Text>
                        <Text style={styles.optionText}>{option.text}</Text>
                        {showResults && isCorrectAnswer && (
                          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.resultIcon} />
                        )}
                        {showResults && isWrongAnswer && (
                          <Ionicons name="close-circle" size={20} color="#F44336" style={styles.resultIcon} />
                        )}
                      </View>
                    );
                  })}
                </View>

                <View style={styles.radioButtonsRow}>
                  {[1, 2, 3, 4].map((num) => {
                    const isSelected = selectedAnswers[q.id] === num;
                    const isCorrectAnswer = showResults && num === q.correctAnswer;
                    const isWrongAnswer = showResults && isSelected && !isCorrectAnswer;
                    
                    return (
                      <TouchableOpacity
                        key={num}
                        style={styles.radioButtonGroup}
                        onPress={() => !showResults && handleAnswerSelect(q.id, num)}
                        activeOpacity={0.7}
                        disabled={showResults}
                      >
                        <View style={[
                          styles.radioOuter,
                          isSelected && styles.radioOuterSelected,
                          isCorrectAnswer && styles.radioOuterCorrect,
                          isWrongAnswer && styles.radioOuterIncorrect
                        ]}>
                          {isSelected && (
                            <View style={[
                              styles.radioInner,
                              isCorrectAnswer && styles.radioInnerCorrect,
                              isWrongAnswer && styles.radioInnerIncorrect
                            ]} />
                          )}
                        </View>
                        <Text style={[
                          styles.radioLabel,
                          isCorrectAnswer && styles.radioLabelCorrect,
                          isWrongAnswer && styles.radioLabelIncorrect
                        ]}>{num}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {showResults && !isCorrect && (
                  <View style={styles.explanationBox}>
                    <Text style={styles.explanationText}>{q.explanation}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Submit Button */}
        {!showResults && (
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>Xem kết quả</Text>
          </TouchableOpacity>
        )}

        {showResults && (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.completeButtonText}>Hoàn thành</Text>
          </TouchableOpacity>
        )}

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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
    alignItems: 'center',
  },
  audioCard: {
    width: 360,
    minHeight: 80,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#95D4EB',
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignSelf: 'center',
  },
  card: {
    width: 360,
    minHeight: 40,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#95D4EB',
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  cardTitle: {
    flex: 1,
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
  },
  toggleButton: {
    padding: 4,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
    borderRadius: 200,
    paddingHorizontal: 14,
    paddingVertical: 15,
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
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#D9D9D9',
    borderRadius: 200,
    overflow: 'hidden',
  },
  progressFill: {
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
  scriptText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  scriptTextJP: {
    fontFamily: 'Noto Sans JP',
  },
  toggleScriptButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  toggleScriptText: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 14,
    color: '#446498',
    textDecorationLine: 'underline',
  },
  vocabularyList: {
    gap: 8,
  },
  vocabularyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vocabWord: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  vocabReading: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  vocabMeaning: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  questionsCard: {
    width: 360,
    minHeight: 820,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#95D4EB',
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignSelf: 'center',
  },
  questionDivider: {
    height: 1,
    backgroundColor: '#95D4EB',
    marginVertical: 20,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  questionNumber: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resultBadgeCorrect: {
    backgroundColor: '#E8F5E9',
  },
  resultBadgeIncorrect: {
    backgroundColor: '#FFEBEE',
  },
  resultBadgeText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 12,
    color: '#000000',
  },
  questionImage: {
    width: 267.63,
    height: 158.68,
    borderRadius: 5,
    marginBottom: 12,
    alignSelf: 'center',
  },
  questionSentence: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  underlined: {
    textDecorationLine: 'underline',
  },
  optionsContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
  },
  optionRowCorrect: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  optionRowIncorrect: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  resultIcon: {
    marginLeft: 8,
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
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  radioButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
    alignSelf: 'center',
  },
  radioButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 24,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.21,
    borderColor: Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.textPrimary,
  },
  radioOuterCorrect: {
    borderColor: '#4CAF50',
  },
  radioOuterIncorrect: {
    borderColor: '#F44336',
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.textPrimary,
  },
  radioInnerCorrect: {
    backgroundColor: '#4CAF50',
  },
  radioInnerIncorrect: {
    backgroundColor: '#F44336',
  },
  radioLabel: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 18,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  radioLabelCorrect: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  radioLabelIncorrect: {
    color: '#F44336',
    fontWeight: '700',
  },
  explanationBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FF9800',
    borderRadius: 5,
  },
  explanationText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  submitButton: {
    width: 360,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
    alignSelf: 'center',
  },
  submitButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.white,
  },
  completeButton: {
    width: 360,
    height: 48,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
    alignSelf: 'center',
  },
  completeButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.white,
  },
});

