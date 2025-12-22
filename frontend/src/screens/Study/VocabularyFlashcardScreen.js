import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { useFavorites } from '../../context/FavoritesContext';

export default function VocabularyFlashcardScreen({ navigation, route }) {
  const { unit = 'Unit 01', lesson = 'Bài 1', level = 'N5' } = route?.params || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { addVocabularyFavorite, removeVocabularyFavorite, isVocabularyFavorite } = useFavorites();

  // Mock vocabulary data - Unit 01 - Bài 1
  const unit1Lesson1 = [
    {
      id: '1-1',
      kanji: '男性',
      hiragana: 'だんせい',
      vietnamese: 'NAM TÍNH',
      meaning: 'nam giới, đàn ông',
      example: '理想の男性と結婚する。',
      exampleMeaning: 'Kết hôn với người đàn ông lý tưởng.',
    },
    {
      id: '1-2',
      kanji: '女性',
      hiragana: 'じょせい',
      vietnamese: 'NỮ TÍNH',
      meaning: 'nữ giới, phụ nữ, giới tính nữ',
      example: '女性専用の車両に乗る。',
      exampleMeaning: 'Lên toa dành riêng cho phụ nữ.',
    },
    {
      id: '1-3',
      kanji: '高齢',
      hiragana: 'こうれい',
      vietnamese: 'CAO LINH',
      meaning: 'tuổi cao',
      example: '高齢者向けのサービスを提供する。',
      exampleMeaning: 'Cung cấp dịch vụ dành cho người cao tuổi.',
    },
    {
      id: '1-4',
      kanji: '成人',
      hiragana: 'せいじん',
      vietnamese: 'THÀNH NHÂN',
      meaning: 'người trưởng thành',
      example: '成人式に出席する。',
      exampleMeaning: 'Tham dự lễ trưởng thành.',
    },
    {
      id: '1-5',
      kanji: '誕生',
      hiragana: 'たんじょう',
      vietnamese: 'ĐẢN SINH',
      meaning: 'sự ra đời, sinh nhật',
      example: '新しい時代の誕生を祝う。',
      exampleMeaning: 'Chúc mừng sự ra đời của kỷ nguyên mới.',
    },
  ];

  // Mock vocabulary data - Unit 01 - Bài 2
  const unit1Lesson2 = [
    {
      id: '2-1',
      kanji: '笑顔',
      hiragana: 'えがお',
      vietnamese: 'TIẾU NHAN',
      meaning: 'nụ cười, khuôn mặt cười',
      example: '彼女の笑顔に癒される。',
      exampleMeaning: 'Được chữa lành bởi nụ cười của cô ấy.',
    },
    {
      id: '2-2',
      kanji: '表情',
      hiragana: 'ひょうじょう',
      vietnamese: 'BIỂU TÌNH',
      meaning: 'biểu cảm, nét mặt',
      example: '彼の表情から不安が読み取れる。',
      exampleMeaning: 'Có thể đọc được sự lo lắng từ biểu cảm của anh ấy.',
    },
    {
      id: '2-3',
      kanji: '視線',
      hiragana: 'しせん',
      vietnamese: 'THỊ TUYẾN',
      meaning: 'tầm nhìn, ánh mắt',
      example: '彼女の視線を感じる。',
      exampleMeaning: 'Cảm nhận được ánh mắt của cô ấy.',
    },
  ];

  // Get vocabulary based on unit and lesson params
  const getVocabulary = () => {
    if (lesson === 'Bài 1') {
      return unit1Lesson1;
    } else if (lesson === 'Bài 2') {
      return unit1Lesson2;
    }
    return unit1Lesson1; // default
  };

  const vocabulary = getVocabulary();

  const currentWord = vocabulary[currentIndex];
  const totalWords = vocabulary.length;
  const progress = ((currentIndex + 1) / totalWords) * 100;
  
  // Calculate progress indicator position (limit to prevent overflow)
  const progressBarWidth = 310;
  const indicatorWidth = 72;
  const maxLeft = progressBarWidth - indicatorWidth;
  const indicatorLeft = Math.min((progress / 100) * progressBarWidth - indicatorWidth / 2, maxLeft);

  const isFavorite = isVocabularyFavorite(currentWord?.id);

  const handleNext = () => {
    if (currentIndex < totalWords - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Navigate back to VocabularyLevelScreen when completed
      navigation.goBack();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const isFirstWord = currentIndex === 0;
  const isLastWord = currentIndex === totalWords - 1;

  const handlePlayAudio = () => {
    // TODO: Implement audio playback
    console.log('Play audio for:', currentWord.hiragana);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeVocabularyFavorite(currentWord.id);
    } else {
      addVocabularyFavorite(currentWord);
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
        style={styles.flashcard}
        onPress={() => setIsFlipped(!isFlipped)}
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

        {/* Word Content */}
        <View style={styles.wordContent}>
          {!isFlipped ? (
            <>
              {/* Mặt trước: Hiragana và Kanji */}
              <Text style={styles.reading}>{currentWord.hiragana}</Text>
              <Text style={styles.kanji}>{currentWord.kanji}</Text>
            </>
          ) : (
            <>
              {/* Mặt sau: Meaning và Example */}
              <Text style={styles.meaningLarge}>{currentWord.vietnamese}</Text>
              <Text style={styles.meaning}>{currentWord.meaning}</Text>
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleJP}>{currentWord.example}</Text>
                <Text style={styles.exampleVN}>{currentWord.exampleMeaning}</Text>
              </View>
            </>
          )}
        </View>

        {/* Pointer Icon */}
        <View style={styles.pointerIcon}>
          <Ionicons name="hand-left-outline" size={30} color={Colors.primary} />
          <Text style={styles.pointerText}>
            {isFlipped ? 'Ấn để xem từ vựng' : 'Ấn để xem chi tiết'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        {/* Previous Button */}
        <TouchableOpacity 
          style={[styles.previousButton, isFirstWord && styles.buttonDisabled]}
          onPress={handlePrevious}
          disabled={isFirstWord}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={isFirstWord ? Colors.textPlaceholder : Colors.white} />
          <Text style={[styles.previousButtonText, isFirstWord && styles.buttonTextDisabled]}>Quay lại</Text>
        </TouchableOpacity>

        {/* Continue/Complete Button */}
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.continueButtonText}>
            {isLastWord ? 'Hoàn thành' : 'Tiếp tục'}
          </Text>
          {!isLastWord && <Ionicons name="chevron-forward" size={20} color={Colors.white} style={{ marginLeft: 4 }} />}
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
    height: 400,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 30,
    paddingTop: 50,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
    position: 'relative',
    alignSelf: 'center',
  },
  wordContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reading: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 29,
    color: Colors.textSecondary,
    marginBottom: 8,
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
  meaningLarge: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 32,
    lineHeight: 44,
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  meaning: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 27,
    color: Colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  exampleContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  exampleJP: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  exampleVN: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
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
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
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
  buttonDisabled: {
    backgroundColor: Colors.backgroundSecondary,
    opacity: 0.5,
  },
  previousButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.white,
    paddingRight: 10,
  },
  buttonTextDisabled: {
    color: Colors.textPlaceholder,
  },
  continueButton: {
    width: 120,
    height: 48,
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 15,
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
    paddingLeft: 10,
  },
  skipLink: {
    paddingVertical: 8,
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
