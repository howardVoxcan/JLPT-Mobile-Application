import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { getJLPTTestDetail, submitJLPTTest } from '../../services/jlptPracticeService';

export default function JLPTPracticeTestScreen({ navigation, route }) {
  const { testId = 1, level = 'N5' } = route?.params || {};
  const [activeTab, setActiveTab] = useState('vocabulary');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    loadTest();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [testId]);

  useEffect(() => {
    if (testData && timeRemaining > 0) {
      startTimer();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [testData]);

  const loadTest = async () => {
    try {
      setLoading(true);
      const data = await getJLPTTestDetail(testId);
      setTestData(data);
      setTimeRemaining(data.duration_minutes * 60); // Convert to seconds
      
      // Set active tab to first section type
      if (data.sections && data.sections.length > 0) {
        setActiveTab(data.sections[0].section_type);
      }
    } catch (error) {
      console.error('Error loading test:', error);
      Alert.alert('Lỗi', 'Không thể tải đề thi. Vui lòng thử lại!');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAutoSubmit = () => {
    Alert.alert(
      'Hết giờ',
      'Thời gian làm bài đã hết. Bài thi sẽ được nộp tự động.',
      [{ text: 'OK', onPress: () => handleSubmit() }],
      { cancelable: false }
    );
  };

  const formatTimer = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, choiceId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: choiceId
    }));
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const allQuestions = testData.sections.flatMap(s => s.questions);
    const unansweredCount = allQuestions.filter(q => !selectedAnswers[q.id]).length;
    
    if (unansweredCount > 0) {
      Alert.alert(
        'Cảnh báo',
        `Bạn còn ${unansweredCount} câu chưa trả lời. Bạn có muốn nộp bài không?`,
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Nộp bài', onPress: () => submitAnswers() }
        ]
      );
    } else {
      Alert.alert(
        'Xác nhận',
        'Bạn có chắc chắn muốn nộp bài không?',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Nộp bài', onPress: () => submitAnswers() }
        ]
      );
    }
  };

  const submitAnswers = async () => {
    try {
      setSubmitting(true);
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Format answers for API
      const formattedAnswers = Object.entries(selectedAnswers).map(([qId, cId]) => ({
        question_id: parseInt(qId),
        choice_id: cId
      }));
      
      const result = await submitJLPTTest(testId, formattedAnswers);
      
      // Navigate to result screen
      navigation.replace('JLPTPracticeResult', {
        attemptId: result.attempt_id,
        testId: testId,
        level: level,
        resultData: result
      });
    } catch (error) {
      console.error('Error submitting test:', error);
      Alert.alert('Lỗi', 'Không thể nộp bài. Vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 16, color: Colors.textSecondary }}>Đang tải đề thi...</Text>
      </View>
    );
  }

  if (!testData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.textSecondary }}>Không tìm thấy đề thi</Text>
      </View>
    );
  }

  // Get current section and questions
  const currentSection = testData.sections.find(s => s.section_type === activeTab);
  const questions = currentSection?.questions || [];
  const currentInstruction = questions.length > 0 ? questions[0].instruction : '';
  
  // Get section order for navigation
  const sectionTypes = testData.sections.map(s => s.section_type);
  const currentSectionIndex = sectionTypes.indexOf(activeTab);
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === sectionTypes.length - 1;

  const renderAudioPlayer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const durationText = `${minutes}:${secs.toString().padStart(2, '0')}`;
    
    return (
      <View style={styles.audioPlayer}>
        <TouchableOpacity style={styles.playButton}>
          <Ionicons name="play" size={22} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.audioTime}>0:00 / {durationText}</Text>
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
  };

  const renderQuestionCard = (question) => {
    const choices = question.choices || [];
    
    return (
      <View key={question.id} style={styles.questionCard}>
        <Text style={styles.questionNumber}>Câu {question.question_number}</Text>
        
        {question.audio_url && question.duration_seconds && renderAudioPlayer(question.duration_seconds)}
        
        {question.image_url && (
          <View style={styles.questionImage}>
            <Image source={{ uri: question.image_url }} style={styles.image} resizeMode="contain" />
          </View>
        )}
        
        {question.sentence && (
          <Text style={styles.sentence}>
            {question.underlined_word ? (
              question.sentence.split(question.underlined_word).map((part, index, array) => (
                <Text key={index}>
                  {part}
                  {index < array.length - 1 && <Text style={styles.underlinedWord}>{question.underlined_word}</Text>}
                </Text>
              ))
            ) : (
              question.sentence
            )}
          </Text>
        )}

        {choices.length > 0 && (
          <View style={styles.optionsContainer}>
            {choices.map((choice, index) => (
              <View key={choice.id} style={styles.optionRow}>
                <Text style={styles.optionNumber}>{String.fromCharCode(0x2460 + index)}</Text>
                <Text style={styles.optionText}>{choice.text}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.radioButtonsRow}>
          {choices.map((choice, index) => {
            const isSelected = selectedAnswers[question.id] === choice.id;
            
            return (
              <TouchableOpacity
                key={choice.id}
                style={styles.radioButtonGroup}
                onPress={() => handleAnswerSelect(question.id, choice.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.radioOuter,
                  isSelected && styles.radioOuterSelected
                ]}>
                  {isSelected && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>{index + 1}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Timer */}
      <View style={styles.timerContainer}>
        <Ionicons name="alarm-outline" size={26} color={Colors.textPrimary} />
        <Text style={[
          styles.timerText,
          timeRemaining < 300 && { color: '#FF6B6B' } // Red if less than 5 minutes
        ]}>
          {formatTimer(timeRemaining)}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {testData.sections.map((section, index) => {
          const isActive = activeTab === section.section_type;
          return (
            <TouchableOpacity
              key={section.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(section.section_type)}
              activeOpacity={0.7}
            >
              {isActive && <View style={styles.tabHighlight} />}
              <Text style={styles.tabText}>{section.title_jp}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Instruction Box */}
        {currentInstruction && (
          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>
              {currentInstruction}
            </Text>
          </View>
        )}

        {/* Questions */}
        {questions.map(renderQuestionCard)}

        {questions.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: Colors.textSecondary }}>
              Phần này chưa có câu hỏi
            </Text>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {!isFirstSection && (
            <TouchableOpacity 
              style={styles.navButton} 
              activeOpacity={0.7}
              onPress={() => {
                const prevSectionType = sectionTypes[currentSectionIndex - 1];
                setActiveTab(prevSectionType);
              }}
            >
              <Text style={styles.navButtonText}>{'< Trang trước'}</Text>
            </TouchableOpacity>
          )}
          {isLastSection ? (
            <TouchableOpacity 
              style={[styles.navButton, styles.submitButton]} 
              activeOpacity={0.7}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.navButtonText}>Nộp bài</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.navButton, styles.nextButton]} 
              activeOpacity={0.7}
              onPress={() => {
                const nextSectionType = sectionTypes[currentSectionIndex + 1];
                setActiveTab(nextSectionType);
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
