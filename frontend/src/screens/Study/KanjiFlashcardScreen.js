import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useFavorites } from '../../context/FavoritesContext';

const { width } = Dimensions.get('window');

export default function KanjiFlashcardScreen({ navigation, route }) {
  const { unit = '第1週', lesson = '(1)', level = 'N5' } = route?.params || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardState, setCardState] = useState('detail'); // 'detail', 'front', 'back'
  const { addKanjiFavorite, removeKanjiFavorite, isKanjiFavorite } = useFavorites();

  // Mock kanji data - 第1週 (1) - 駐車場
  const week1Lesson1 = [
    {
      id: '1-1',
      kanji: '駐',
      hiragana: 'ちゅう',
      vietnamese: 'TRÚ',
      strokeCount: 15,
      kunyomi: 'ちゅう',
      onyomi: '',
      meaning: 'Đóng. Lưu ở lại chỗ nào cũng gọi là trú.',
      vocabulary: {
        hiragana: 'ちゅうしゃ',
        kanji: '駐車',
        reading: 'TRÚ XA',
        meaning: 'đỗ xe',
      },
    },
    {
      id: '1-2',
      kanji: '車',
      hiragana: 'しゃ',
      vietnamese: 'XA',
      strokeCount: 7,
      kunyomi: 'くるま',
      onyomi: 'シャ',
      meaning: 'xe, xe cộ',
      vocabulary: {
        hiragana: 'じどうしゃ',
        kanji: '自動車',
        reading: 'TỰ ĐỘNG XA',
        meaning: 'ô tô',
      },
    },
    {
      id: '1-3',
      kanji: '場',
      hiragana: 'ば',
      vietnamese: 'TRƯỜNG',
      strokeCount: 12,
      kunyomi: '',
      onyomi: 'ジョウ',
      meaning: 'nơi, chỗ, địa điểm',
      vocabulary: {
        hiragana: 'ばしょ',
        kanji: '場所',
        reading: 'TRƯỜNG SỞ',
        meaning: 'địa điểm',
      },
    },
  ];

  // Mock kanji data - 第1週 (2)
  const week1Lesson2 = [
    {
      id: '2-1',
      kanji: '学',
      hiragana: 'がく',
      vietnamese: 'HỌC',
      strokeCount: 8,
      kunyomi: 'まなぶ',
      onyomi: 'ガク',
      meaning: 'học, học tập',
      vocabulary: {
        hiragana: 'がっこう',
        kanji: '学校',
        reading: 'HỌC HIỆU',
        meaning: 'trường học',
      },
    },
    {
      id: '2-2',
      kanji: '校',
      hiragana: 'こう',
      vietnamese: 'HIỆU',
      strokeCount: 10,
      kunyomi: '',
      onyomi: 'コウ',
      meaning: 'trường học',
      vocabulary: {
        hiragana: 'がっこう',
        kanji: '学校',
        reading: 'HỌC HIỆU',
        meaning: 'trường học',
      },
    },
  ];

  // Get kanji based on unit and lesson params
  const getKanji = () => {
    if (unit === '第1週' && lesson === '(1)') {
      return week1Lesson1;
    } else if (unit === '第1週' && lesson === '(2)') {
      return week1Lesson2;
    }
    return week1Lesson1; // default
  };

  const kanjiList = getKanji();
  const currentKanji = kanjiList[currentIndex];
  const totalKanji = kanjiList.length;
  const progress = ((currentIndex + 1) / totalKanji) * 100;
  
  // Calculate progress indicator position (limit to prevent overflow)
  const progressBarWidth = 310;
  const indicatorWidth = 72;
  const maxLeft = progressBarWidth - indicatorWidth;
  const indicatorLeft = Math.min((progress / 100) * progressBarWidth - indicatorWidth / 2, maxLeft);

  const isFavorite = isKanjiFavorite(currentKanji?.id);

  const handleNext = () => {
    if (currentIndex < totalKanji - 1) {
      setCurrentIndex(currentIndex + 1);
      setCardState('detail');
    } else {
      // Navigate back to KanjiLevelScreen when completed
      navigation.navigate('KanjiLevel', {
        category: route?.params?.category,
        level: route?.params?.level,
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCardState('detail');
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleCardPress = () => {
    if (cardState === 'detail') {
      setCardState('front');
    } else if (cardState === 'front') {
      setCardState('back');
    } else if (cardState === 'back') {
      setCardState('detail');
    }
  };

  const isFirstKanji = currentIndex === 0;
  const isLastKanji = currentIndex === totalKanji - 1;

  const handlePlayAudio = () => {
    // TODO: Implement audio playback
    console.log('Play audio for:', currentKanji.hiragana);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeKanjiFavorite(currentKanji.id);
    } else {
      addKanjiFavorite(currentKanji);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          <View style={[styles.progressIndicator, { left: indicatorLeft }]}>
            <View style={styles.indicatorCircle}>
              <Image 
                source={require('../../../assets/logo.png')} 
                style={styles.indicatorImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.indicatorText}>JLPT Master</Text>
          </View>
        </View>
      </View>

      {/* Flashcard */}
      <TouchableOpacity 
        style={[styles.flashcard, cardState === 'detail' && styles.flashcardDetail]}
        onPress={handleCardPress}
        activeOpacity={0.9}
      >
        {/* Action Buttons - positioned absolutely */}
        <TouchableOpacity 
          style={styles.audioButton}
          onPress={(e) => {
            e.stopPropagation();
            handlePlayAudio();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="volume-high-outline" size={28} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            handleToggleFavorite();
          }}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={28} 
            color={Colors.primary} 
          />
        </TouchableOpacity>

        {/* Card Content */}
        <View style={[styles.cardContent, cardState === 'detail' && styles.cardContentDetail]}>
          {cardState === 'detail' ? (
            <>
              {/* Mặt 1: Chi tiết Kanji */}
              <View style={styles.kanjiBox}>
                <Text style={styles.strokeCount}>Số nét: {currentKanji.strokeCount}</Text>
                <Text style={styles.kanjiLarge}>{currentKanji.kanji}</Text>
                <Text style={styles.vietnameseReading}>{currentKanji.vietnamese}</Text>
              </View>
              
              <View style={styles.readingRow}>
                {currentKanji.kunyomi && (
                  <View style={styles.readingBadge}>
                    <Text style={styles.readingLabel}>Kunyomi</Text>
                    <Text style={styles.readingValue}>{currentKanji.kunyomi}</Text>
                  </View>
                )}
                <View style={styles.readingBadge}>
                  <Text style={styles.readingLabel}>Onyomi</Text>
                  {currentKanji.onyomi && <Text style={styles.readingValue}>{currentKanji.onyomi}</Text>}
                </View>
              </View>

              <View style={styles.meaningContainer}>
                <View style={styles.readingBadge}>
                  <Text style={styles.readingLabel}>Nghĩa</Text>
                </View>
                <Text style={styles.meaningText}>{currentKanji.meaning}</Text>
              </View>
            </>
          ) : cardState === 'front' ? (
            <>
              {/* Trang 2: Từ vựng (Hiragana và Kanji) */}
              {currentKanji.vocabulary ? (
                <>
                  <Text style={styles.hiragana}>{currentKanji.vocabulary.hiragana}</Text>
                  <Text style={styles.kanji}>{currentKanji.vocabulary.kanji}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.hiragana}>{currentKanji.hiragana}</Text>
                  <Text style={styles.kanji}>{currentKanji.kanji}</Text>
                </>
              )}
            </>
          ) : (
            <>
              {/* Trang 3: Cách đọc và nghĩa từ vựng */}
              {currentKanji.vocabulary ? (
                <>
                  <Text style={styles.vietnameseLarge}>{currentKanji.vocabulary.reading}</Text>
                  <Text style={styles.meaning}>{currentKanji.vocabulary.meaning}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.vietnameseLarge}>{currentKanji.vietnamese}</Text>
                  <Text style={styles.meaning}>{currentKanji.meaning}</Text>
                </>
              )}
            </>
          )}
        </View>

        {/* Pointer Icon */}
        <View style={styles.pointerIcon}>
          <Ionicons name="hand-left-outline" size={30} color={Colors.primary} />
          <Text style={styles.pointerText}>
            {cardState === 'detail' ? 'Ấn để xem từ liên quan' : cardState === 'front' ? 'Ấn để xem chi tiết' : 'Ấn để xem kanji'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        {/* Previous Button */}
        <TouchableOpacity 
          style={[styles.previousButton, isFirstKanji && styles.buttonDisabled]}
          onPress={handlePrevious}
          disabled={isFirstKanji}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={isFirstKanji ? Colors.textPlaceholder : Colors.white} />
          <Text style={[styles.previousButtonText, isFirstKanji && styles.buttonTextDisabled]}>Quay lại</Text>
        </TouchableOpacity>

        {/* Continue/Complete Button */}
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.continueButtonText}>
            {isLastKanji ? 'Hoàn thành' : 'Tiếp tục'}
          </Text>
          {!isLastKanji && <Ionicons name="chevron-forward" size={20} color={Colors.white} style={{ marginLeft: 4 }} />}
        </TouchableOpacity>
      </View>

      {/* Skip Link */}
      <TouchableOpacity 
        style={styles.skipLink}
        onPress={handleSkip}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Bỏ qua từ này</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    paddingTop: 25,
  },
  progressContainer: {
    width: 310,
    height: 40,
    marginBottom: 45,
    position: 'relative',
    alignSelf: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 20,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    marginTop: 10,
    position: 'relative',
  },
  progressBarFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: Colors.secondaryLight,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 20,
  },
  progressIndicator: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  indicatorCircle: {
    width: 72,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -12,
  },
  indicatorImage: {
    width: 50,
    height: 36,
  },
  indicatorText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 10,
    color: Colors.textPrimary,
  },
  audioButton: {
    position: 'absolute',
    top: -24,
    left: 50,
    width: 48,
    height: 48,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  favoriteButton: {
    position: 'absolute',
    top: -24,
    right: 50,
    width: 48,
    height: 48,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  flashcard: {
    width: 300,
    minHeight: 400,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
    position: 'relative',
    alignSelf: 'center',
  },
  flashcardDetail: {
    minHeight: 500,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 350,
  },
  cardContentDetail: {
    minHeight: 500,
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  // Mặt 1: Chi tiết Kanji
  kanjiBox: {
    width: 260,
    height: 240,
    backgroundColor: Colors.secondaryLight,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  strokeCount: {
    position: 'absolute',
    top: 20,
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  kanjiLarge: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '300',
    fontSize: 96,
    lineHeight: 115,
    color: Colors.textPrimary,
  },
  vietnameseReading: {
    position: 'absolute',
    bottom: 40,
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 27,
    color: '#000000',
  },
  readingRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  readingBadge: {
    backgroundColor: '#95D4EB',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  readingLabel: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  readingValue: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 17,
    color: '#000000',
  },
  meaningContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  meaningText: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: '#000000',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
    maxWidth: 260,
  },
  // Mặt 2: Hiragana và Kanji
  hiragana: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 29,
    color: Colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  kanji: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '500',
    fontSize: 40,
    lineHeight: 48,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  // Mặt 3: Vietnamese và nghĩa
  vietnameseLarge: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 32,
    lineHeight: 44,
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  meaning: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 27,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  pointerIcon: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pointerText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 15,
    gap: 25,
    marginTop: 20,
  },
  previousButton: {
    width: 120,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 15,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  previousButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.white,
    paddingRight: 10,
  },
  continueButton: {
    width: 120,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  continueButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.white,
    paddingRight: 10,
  },
  buttonDisabled: {
    backgroundColor: Colors.backgroundSecondary,
    opacity: 0.5,
  },
  buttonTextDisabled: {
    color: Colors.textPlaceholder,
  },
  skipLink: {
    marginTop: 10,
  },
  skipText: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 19,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
