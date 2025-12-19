import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function ListeningLessonScreen({ navigation, route }) {
  const { category = 'Nghe hiểu', level = 'N5', lessonId = 1, title = 'Bài 1: Giới thiệu bản thân' } = route?.params || {};
  const [showScript, setShowScript] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(150); // 2:30 in seconds

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
  const script = 'Mỗi khi lòng cảm thấy bộn bề và mệt mỏi, tôi thường tìm về với vòng tay dịu dàng của thiên nhiên. Không gian xanh mướt của cánh đồng lúa, tiếng suối chảy róc rách trong veo, hay sự hùng vĩ lặng lẽ của những rặng núi xa xa luôn có một sức mạnh chữa lành phi thường. Ở đó, không có sự hối hả của cuộc sống hiện đại, chỉ có nhịp điệu chậm rãi, thanh bình của gió, của cây cỏ.';

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
      image: null, // Can add image URL later
    },
    {
      id: 2,
      questionNumber: 'Câu 2:',
      sentence: '若いとき夢中で星座の名前を覚えた。',
      underlinedWord: '若い',
      options: [
        { id: 1, text: 'ちいさい' },
        { id: 2, text: 'すくない' },
        { id: 3, text: 'わかい' },
        { id: 4, text: 'おさない' },
      ],
      image: null,
    },
    {
      id: 3,
      questionNumber: 'Câu 3:',
      sentence: '若いとき夢中で星座の名前を覚えた。',
      underlinedWord: '若い',
      options: [
        { id: 1, text: 'ちいさい' },
        { id: 2, text: 'すくない' },
        { id: 3, text: 'わかい' },
        { id: 4, text: 'おさない' },
      ],
      image: null,
    },
    {
      id: 4,
      questionNumber: 'Câu 4:',
      sentence: '若いとき夢中で星座の名前を覚えた。',
      underlinedWord: '若い',
      options: [
        { id: 1, text: 'ちいさい' },
        { id: 2, text: 'すくない' },
        { id: 3, text: 'わかい' },
        { id: 4, text: 'おさない' },
      ],
      image: null,
    },
  ];

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
            <Text style={styles.scriptText}>{script}</Text>
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

          {questions.map((q, index) => (
            <View key={q.id}>
              {index > 0 && <View style={styles.questionDivider} />}
              
              <Text style={styles.questionNumber}>{q.questionNumber}</Text>
              
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
                {q.options.map((option, optIndex) => (
                  <View key={option.id} style={styles.optionRow}>
                    <Text style={styles.optionNumber}>{String.fromCharCode(0x2460 + optIndex)}</Text>
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
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
  },
  audioCard: {
    width: 346,
    minHeight: 80,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#95D4EB',
    borderRadius: 5,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    alignSelf: 'center',
  },
  card: {
    width: 346,
    minHeight: 40,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#95D4EB',
    borderRadius: 5,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
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
    width: 346,
    minHeight: 820,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#95D4EB',
    borderRadius: 5,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    alignSelf: 'center',
  },
  questionDivider: {
    height: 1,
    backgroundColor: '#95D4EB',
    marginVertical: 20,
  },
  questionNumber: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
    marginBottom: 12,
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
  },
  underlined: {
    textDecorationLine: 'underline',
  },
  optionsContainer: {
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    justifyContent: 'flex-start',
    marginTop: 8,
    width: 300,
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
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.21,
    borderColor: Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.textPrimary,
  },
  radioInner: {
    width: 9.08,
    height: 9.08,
    borderRadius: 4.54,
    backgroundColor: Colors.textPrimary,
  },
  radioLabel: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 14.5854,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
});

