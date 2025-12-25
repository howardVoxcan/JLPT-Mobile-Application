import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import { useFavorites } from '../../context/FavoritesContext';
import { getKanjiLessonDetail, updateKanjiProgress } from '../../services/kanjiService';

const { width } = Dimensions.get('window');

export default function KanjiFlashcardScreen({ navigation, route }) {
  const { lessonId, unit = '第1週', lesson = '(1)', level = 'N5' } = route?.params || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardState, setCardState] = useState('detail');
  const [kanjiList, setKanjiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lessonData, setLessonData] = useState(null);
  const { addKanjiFavorite, removeKanjiFavorite, isKanjiFavorite } = useFavorites();

  // Load kanji data from API
  useEffect(() => {
    const loadKanjiLesson = async () => {
      if (!lessonId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Loading lesson with ID:', lessonId);
        const data = await getKanjiLessonDetail(lessonId);
        console.log('Lesson data received:', data);
        console.log('Number of kanjis:', data.kanjis?.length);
        setLessonData(data);
        
        // Map data từ API sang format UI (stroke_count -> strokeCount)
        const mappedKanjis = data.kanjis.map(k => ({
          id: k.id,
          kanji: k.kanji,
          hiragana: k.hiragana,
          vietnamese: k.vietnamese,
          strokeCount: k.stroke_count,
          kunyomi: k.kunyomi,
          onyomi: k.onyomi,
          meaning: k.meaning,
          vocabulary: k.vocabulary,
        }));
        
        console.log('Mapped kanjis:', mappedKanjis);
        setKanjiList(mappedKanjis);
        
        // Load saved progress
        try {
          const progressKey = `lesson_progress_${lessonId}`;
          const savedProgress = await AsyncStorage.getItem(progressKey);
          if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            if (progress.status === 'in-progress' && progress.currentIndex < mappedKanjis.length) {
              setCurrentIndex(progress.currentIndex);
              console.log('Restored progress:', progress);
            }
          }
        } catch (error) {
          console.error('Error loading saved progress:', error);
        }
      } catch (error) {
        console.error('Error loading kanji lesson:', error);
        console.error('Error details:', error.response?.data || error.message);
        // Fallback to empty array nếu lỗi
        setKanjiList([]);
      } finally {
        setLoading(false);
      }
    };

    loadKanjiLesson();
  }, [lessonId]);
  const currentKanji = kanjiList[currentIndex];
  const totalKanji = kanjiList.length;
  const progress = ((currentIndex + 1) / totalKanji) * 100;
  
  // Calculate progress indicator position (limit to prevent overflow)
  const progressBarWidth = 310;
  const indicatorWidth = 72;
  const maxLeft = progressBarWidth - indicatorWidth;
  const indicatorLeft = Math.min((progress / 100) * progressBarWidth - indicatorWidth / 2, maxLeft);

  const isFavorite = isKanjiFavorite(currentKanji?.id);

  const handleNext = async () => {
    if (currentIndex < totalKanji - 1) {
      // Chưa hết bài -> chuyển sang kanji tiếp theo
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCardState('detail');
      
      // Lưu progress in-progress
      try {
        const progressKey = `lesson_progress_${lessonId}`;
        await AsyncStorage.setItem(progressKey, JSON.stringify({
          lessonId,
          currentIndex: nextIndex,
          totalKanji,
          progress: Math.round((nextIndex / totalKanji) * 100),
          status: 'in-progress',
          lastUpdated: new Date().toISOString()
        }));
        
        // Cập nhật progress cho kanji hiện tại (đã học)
        await updateKanjiProgress(currentKanji.id, {
          is_learned: true,
          is_mastered: false,
          review_count: 1,
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    } else {
      // Đã hết bài -> đánh dấu kanji cuối cùng và hoàn thành
      try {
        const progressKey = `lesson_progress_${lessonId}`;
        await AsyncStorage.setItem(progressKey, JSON.stringify({
          lessonId,
          currentIndex: totalKanji,
          totalKanji,
          progress: 100,
          status: 'completed',
          lastUpdated: new Date().toISOString()
        }));
        
        await updateKanjiProgress(currentKanji.id, {
          is_learned: true,
          is_mastered: true,
          review_count: 1,
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
      
      // Navigate back (dùng goBack thay vì navigate)
      navigation.goBack();
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

  // Show loading
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 16, color: Colors.textSecondary }}>Đang tải...</Text>
      </View>
    );
  }

  // Show error if no data
  if (!kanjiList || kanjiList.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.textSecondary} />
        <Text style={{ marginTop: 16, fontSize: 16, color: Colors.textPrimary, textAlign: 'center' }}>
          Không có dữ liệu kanji
        </Text>
        <TouchableOpacity 
          style={{ marginTop: 20, padding: 12, backgroundColor: Colors.primary, borderRadius: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: Colors.white, fontWeight: '600' }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
