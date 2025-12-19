import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function ReadingLessonScreen({ navigation, route }) {
  const { category = 'Đọc hiểu', level = 'N5', lessonId = 1 } = route?.params || {};
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleShowCorrectAnswer = () => {
    setSelectedAnswer(correctAnswer);
    setShowResults(true);
  };

  // Mock reading data
  const readingText = {
    vietnamese: 'Mỗi khi lòng cảm thấy bộn bề và mệt mỏi, tôi thường tìm về với vòng tay dịu dàng của thiên nhiên. Không gian xanh mướt của cánh đồng lúa, tiếng suối chảy róc rách trong veo, hay sự hùng vĩ lặng lẽ của những rặng núi xa xa luôn có một sức mạnh chữa lành phi thường. Ở đó, không có sự hối hả của cuộc sống hiện đại, chỉ có nhịp điệu chậm rãi, thanh bình của gió, của cây cỏ.',
    japanese: '室びめルて直約ヒクリマ需所よ誌済ホウア院注ロ中20分つびくん左目さ換権2県ひゆトン広木そ太桂ヘ聞壊層恐ッは。葉り準示サマミヘ催月クコレ変講意コナヘユ外残石きねしぐ南作新存モキチヒ記担カ続男びおひだ局寝レケヤエ原幻60講ざ台索異喜栄あも。改ニマ作前流所ケサヱコ歳96使け置画ドあ京覧ゃさクほ際鹿フ再読かわ対責倉エムフユ隊復オラシフ目右たッす生黒比健り。',
  };

  const question = {
    id: 1,
    text: '問１：この文章の内容とあっているものはどれか。',
    options: [
      { id: 1, text: '日本語では、書き言葉と話し言語の文体がよく似ている。' },
      { id: 2, text: '日本語では、書き言葉と話し言語の文体がよく似ている。' },
      { id: 3, text: '日本語では、書き言葉と話し言語の文体がよく似ている。' },
      { id: 4, text: '日本語では、書き言葉と話し言語の文体がよく似ている。' },
    ],
  };

  const correctAnswer = 2;

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Text Box */}
        <View style={styles.textBox}>
          <Text style={styles.textContent}>
            {showOriginal ? readingText.japanese : readingText.vietnamese}
          </Text>
          <TouchableOpacity 
            style={styles.toggleLink}
            onPress={() => setShowOriginal(!showOriginal)}
            activeOpacity={0.7}
          >
            <Text style={styles.toggleLinkText}>
              {showOriginal ? 'Xem bản dịch' : 'Xem bản gốc'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{question.text}</Text>

          {/* Options */}
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrectOption = option.id === correctAnswer;
            const showCheckmark = showResults && isCorrectOption;
            const showX = showResults && isSelected && !isCorrectOption;

            return (
              <View key={option.id} style={styles.optionGroup}>
                <TouchableOpacity
                  style={styles.radioButtonGroup}
                  onPress={() => !showResults && handleAnswerSelect(option.id)}
                  activeOpacity={0.7}
                  disabled={showResults}
                >
                  <View style={[
                    styles.radioOuter,
                    isSelected && styles.radioOuterSelected
                  ]}>
                    {isSelected && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text style={styles.optionText}>{option.text}</Text>
                </TouchableOpacity>
                {showCheckmark && (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={10} color="#7FDEAD" />
                  </View>
                )}
                {showX && (
                  <View style={styles.xCircle}>
                    <Ionicons name="close" size={10} color="#F4899E" />
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Show Correct Answer Link (when wrong) */}
        {showResults && !isCorrect && (
          <TouchableOpacity 
            style={styles.showAnswerLink}
            onPress={handleShowCorrectAnswer}
            activeOpacity={0.7}
          >
            <Text style={styles.showAnswerLinkText}>Xem câu trả lời đúng</Text>
          </TouchableOpacity>
        )}

        {/* Submit/Complete Button */}
        {!showResults ? (
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.7}
            disabled={!selectedAnswer}
          >
            <Text style={styles.submitButtonText}>Xem kết quả</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>Hoàn thành</Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
    alignItems: 'center',
  },
  textBox: {
    width: 353,
    minHeight: 320,
    backgroundColor: '#D4F4E7',
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#E1E1E1',
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
  },
  textContent: {
    width: 313,
    minHeight: 280,
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  toggleLink: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  toggleLinkText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: '#FF9FB0',
  },
  questionCard: {
    width: 353,
    minHeight: 296,
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  questionText: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 19,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  optionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  radioButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
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
  optionText: {
    flex: 1,
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 14.5854,
    lineHeight: 18,
    color: Colors.textPrimary,
  },
  checkCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.white,
    borderWidth: 1.17,
    borderColor: '#7FDEAD',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  xCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.white,
    borderWidth: 1.17,
    borderColor: '#F4899E',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  showAnswerLink: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  showAnswerLinkText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: '#FF9FB0',
  },
  submitButton: {
    width: 200,
    height: 48,
    backgroundColor: '#FFB7C5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.white,
  },
});
