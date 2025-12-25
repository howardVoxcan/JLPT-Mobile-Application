import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { getJLPTAttemptDetail } from '../../services/jlptPracticeService';

export default function JLPTPracticeTestDetailsScreen({ navigation, route }) {
  const { attemptId, testId = 1, level = 'N5' } = route?.params || {};
  const [activeTab, setActiveTab] = useState(null);
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttemptDetail();
  }, [attemptId]);

  const loadAttemptDetail = async () => {
    try {
      setLoading(true);
      const data = await getJLPTAttemptDetail(attemptId);
      setTestData(data);
      
      // Set active tab to first section type
      if (data.sections && data.sections.length > 0) {
        setActiveTab(data.sections[0].section_type);
      }
    } catch (error) {
      console.error('Error loading attempt detail:', error);
      Alert.alert('Lỗi', 'Không thể tải chi tiết bài thi. Vui lòng thử lại!');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 16, color: Colors.textSecondary }}>Đang tải chi tiết...</Text>
      </View>
    );
  }

  if (!testData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.textSecondary }}>Không tìm thấy dữ liệu</Text>
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
    const userAnswerId = question.user_answer_id;
    const isCorrect = question.is_correct;
    const correctChoice = choices.find(c => c.is_correct);
    const userChoice = choices.find(c => c.id === userAnswerId);
    
    return (
      <View key={question.id} style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>Câu {question.question_number}</Text>
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
            {choices.map((choice, index) => {
              const isUserAnswer = choice.id === userAnswerId;
              const isCorrectAnswer = choice.is_correct;
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
                <View key={choice.id} style={optionStyle}>
                  <Text style={styles.optionNumber}>{String.fromCharCode(0x2460 + index)}</Text>
                  <Text style={optionTextStyle}>{choice.text}</Text>
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
        )}

        {!isCorrect && correctChoice && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>Đáp án đúng:</Text>
            <Text style={styles.explanationText}>
              {String.fromCharCode(0x2460 + choices.findIndex(c => c.is_correct))} {correctChoice.text}
            </Text>
            {question.explanation && (
              <Text style={styles.explanationDetail}>{question.explanation}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
              style={[styles.navButton, styles.retryButton]} 
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate('JLPTPracticeTest', { 
                  testId, 
                  level 
                });
              }}
            >
              <Text style={styles.navButtonText}>Làm lại</Text>
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
  tabsContainer: {
    flexDirection: 'row',
    width: 300,
    marginTop: 20,
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
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  explanationDetail: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
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
  retryButton: {
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
