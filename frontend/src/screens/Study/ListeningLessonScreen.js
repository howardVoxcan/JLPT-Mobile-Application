import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Colors } from '../../constants/Colors';
import { getListeningLessonDetail, submitListeningAttempt } from '../../services/listeningService';

export default function ListeningLessonScreen({ navigation, route }) {
  const { category = 'Nghe hiểu', level = 'N5', lessonId = 1, title = 'Bài 1: Giới thiệu bản thân' } = route?.params || {};
  const [showScript, setShowScript] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [showScriptTranslation, setShowScriptTranslation] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(150);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  
  const soundRef = useRef(null);

  // Load lesson detail from API
  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true);
        const data = await getListeningLessonDetail(lessonId);
        setLesson(data);
        setDuration(data.duration_seconds || 150);
        
        // Load audio if available
        if (data.audio_url) {
          await loadAudio(data.audio_url);
        }
      } catch (error) {
        console.error('Error loading listening lesson:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (lessonId) {
      loadLesson();
    }
    
    // Cleanup audio on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [lessonId]);

  // Load audio file
  const loadAudio = async (audioUrl) => {
    try {
      setAudioLoading(true);
      
      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      
      // Create and load sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      
      soundRef.current = sound;
    } catch (error) {
      console.error('Error loading audio:', error);
      alert('Không thể tải file âm thanh');
    } finally {
      setAudioLoading(false);
    }
  };

  // Handle playback status updates
  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setCurrentTime(Math.floor(status.positionMillis / 1000));
      
      if (status.durationMillis) {
        setDuration(Math.floor(status.durationMillis / 1000));
      }
      
      // Replay from start when finished
      if (status.didJustFinish) {
        soundRef.current?.setPositionAsync(0);
        setIsPlaying(false);
      }
    }
  };

  // Toggle play/pause
  const togglePlayPause = async () => {
    if (!soundRef.current) {
      alert('File âm thanh chưa sẵn sàng');
      return;
    }
    
    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await soundRef.current.pauseAsync();
        } else {
          await soundRef.current.playAsync();
        }
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const isShowingTranslation = showScriptTranslation === true;

  const handleAnswerSelect = (questionId, choiceId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: choiceId
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Format answers for API
      const formattedAnswers = Object.entries(selectedAnswers).map(([qId, cId]) => ({
        question_id: parseInt(qId),
        choice_id: cId
      }));
      
      const submitResult = await submitListeningAttempt(lessonId, formattedAnswers);
      setResult(submitResult);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Có lỗi khi nộp bài. Vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  };

  // Get data from lesson or use default
  const scriptJP = lesson?.script_jp || '';
  const scriptVN = lesson?.script_vn || '';
  const vocabulary = lesson?.vocabularies || [];
  const questions = lesson?.questions || [];
  const audioUrl = lesson?.audio_url;

  const getQuestionResult = (question) => {
    if (!result || !result.detail) {
      return { isCorrect: false, userAnswer: null };
    }
    
    const resultDetail = result.detail.find(d => d.question_id === question.id);
    if (!resultDetail) {
      return { isCorrect: false, userAnswer: null };
    }
    
    return {
      isCorrect: resultDetail.is_correct,
      userAnswer: resultDetail.selected_choice_id,
      correctAnswer: resultDetail.correct_choice_id,
      explanation: resultDetail.explanation
    };
  };

  // Show loading
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 16, color: Colors.textSecondary }}>Đang tải...</Text>
      </View>
    );
  }

  // Show error if no lesson data
  if (!lesson) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.textSecondary} />
        <Text style={{ marginTop: 16, color: Colors.textSecondary, textAlign: 'center' }}>
          Không thể tải bài học. Vui lòng thử lại!
        </Text>
        <TouchableOpacity 
          style={{ marginTop: 20, padding: 12, backgroundColor: Colors.primary, borderRadius: 8 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#fff' }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            {audioLoading && (
              <ActivityIndicator size="small" color={Colors.primary} style={{ marginLeft: 8 }} />
            )}
          </View>
          <View style={styles.audioPlayer}>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={togglePlayPause}
              activeOpacity={0.7}
              disabled={audioLoading || !audioUrl}
            >
              {audioLoading ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <Ionicons name={isPlaying ? "pause" : "play"} size={22} color="#000000" />
              )}
            </TouchableOpacity>
            <Text style={styles.audioTime}>{formatTime(currentTime)} / {formatTime(duration)}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }]} />
            </View>
            <TouchableOpacity style={styles.audioControl} activeOpacity={0.7}>
              <Ionicons name="volume-medium-outline" size={22} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.audioControl} activeOpacity={0.7}>
              <Ionicons name="ellipsis-vertical" size={22} color="#000000" />
            </TouchableOpacity>
          </View>
          {!audioUrl && (
            <Text style={styles.noAudioText}>Không có file âm thanh</Text>
          )}
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
          {showVocabulary && vocabulary.length > 0 && (
            <View style={styles.vocabularyList}>
              {vocabulary.map((item, index) => (
                <View key={item.id || index} style={styles.vocabularyItem}>
                  <Text style={styles.vocabWord}>{item.word}</Text>
                  <Text style={styles.vocabReading}>{item.reading}</Text>
                  <Text style={styles.vocabMeaning}>{item.meaning}</Text>
                </View>
              ))}
            </View>
          )}
          {showVocabulary && vocabulary.length === 0 && (
            <Text style={styles.emptyText}>Chưa có từ vựng nào</Text>
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
            const correctAnswerId = result?.correctAnswer;
            const userAnswerId = result?.userAnswer;
            const explanation = result?.explanation;
            
            return (
              <View key={q.id}>
                {index > 0 && <View style={styles.questionDivider} />}
                
                <View style={styles.questionHeader}>
                  <Text style={styles.questionNumber}>Câu {q.question_number}:</Text>
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
                  {q.underlined_word ? (
                    q.sentence.split(q.underlined_word).map((part, i, arr) => (
                      <Text key={i}>
                        {part}
                        {i < arr.length - 1 && <Text style={styles.underlined}>{q.underlined_word}</Text>}
                      </Text>
                    ))
                  ) : (
                    q.sentence
                  )}
                </Text>

                <View style={styles.optionsContainer}>
                  {q.options.map((option, optIndex) => {
                    const isSelected = selectedAnswers[q.id] === option.id;
                    const isCorrectAnswer = showResults && option.id === correctAnswerId;
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
                  {q.options.map((option, optIndex) => {
                    const isSelected = selectedAnswers[q.id] === option.id;
                    const isCorrectAnswer = showResults && option.id === correctAnswerId;
                    const isWrongAnswer = showResults && isSelected && !isCorrectAnswer;
                    
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={styles.radioButtonGroup}
                        onPress={() => !showResults && handleAnswerSelect(q.id, option.id)}
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
                        ]}>{optIndex + 1}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {showResults && explanation && (
                  <View style={styles.explanationBox}>
                    <Text style={styles.explanationText}>{explanation}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Submit Button */}
        {!showResults && (
          <TouchableOpacity 
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.7}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Xem kết quả</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Result Summary */}
        {showResults && result && (
          <View style={styles.resultSummary}>
            <Text style={styles.resultTitle}>Kết quả của bạn</Text>
            <Text style={styles.resultScore}>
              {result.score}/{result.total} câu đúng
            </Text>
            <Text style={styles.resultPercent}>
              {result.progress_percent}%
            </Text>
          </View>
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
  noAudioText: {
    fontFamily: 'Nunito',
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
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
  submitButtonDisabled: {
    opacity: 0.6,
  },
  emptyText: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 12,
  },
  resultSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  resultTitle: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  resultScore: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 32,
    color: Colors.primary,
    marginBottom: 4,
  },
  resultPercent: {
    fontFamily: 'Nunito',
    fontWeight: '600',
    fontSize: 24,
    color: Colors.secondary,
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
