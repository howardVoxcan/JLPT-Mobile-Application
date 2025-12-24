import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { useFavorites } from "../../context/FavoritesContext";
import {
  getVocabularyLessonDetail,
  updateVocabularyProgress,
  toggleVocabularyFavorite,
} from "../../services/vocabService";

export default function VocabularyFlashcardScreen({ navigation, route }) {
  const { lessonId, title, level, category } = route?.params || {};

  const [lesson, setLesson] = useState(null);
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  const { addVocabularyFavorite, removeVocabularyFavorite, isVocabularyFavorite } =
    useFavorites();

  // =========================
  // FETCH LESSON DETAIL
  // =========================
  useEffect(() => {
    let isMounted = true;

    const fetchLesson = async () => {
      try {
        setLoading(true);
        const data = await getVocabularyLessonDetail(lessonId);

        if (!isMounted) return;

        setLesson(data);
        setWords(data.words || []);
      } catch (error) {
        console.error("❌ Fetch vocabulary lesson detail error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (lessonId) {
      fetchLesson();
    }

    return () => {
      isMounted = false;
    };
  }, [lessonId]);

  // =========================
  // DERIVED DATA
  // =========================
  const totalWords = words.length;
  const currentWord = words[currentIndex];

  const progress = totalWords
    ? ((currentIndex + 1) / totalWords) * 100
    : 0;

  const isFirstWord = currentIndex === 0;
  const isLastWord = currentIndex === totalWords - 1;

  const isFavorite = useMemo(() => {
    if (!currentWord) return false;
    return isVocabularyFavorite(currentWord.id);
  }, [currentWord, isVocabularyFavorite]);

  // progress indicator position
  const progressBarWidth = 310;
  const indicatorWidth = 72;
  const maxLeft = progressBarWidth - indicatorWidth;
  const indicatorLeft = Math.min(
    (progress / 100) * progressBarWidth - indicatorWidth / 2,
    maxLeft
  );

  // =========================
  // HANDLERS
  // =========================
  const handleNext = async () => {
    if (currentIndex < totalWords - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setIsFlipped(false);

      // update progress backend
      await updateVocabularyProgress(lessonId, nextIndex + 1);
    } else {
      // hoàn thành bài
      await updateVocabularyProgress(lessonId, totalWords);

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

  const handlePlayAudio = () => {
    if (!currentWord) return;
    console.log("🔊 Play audio for:", currentWord.hiragana);
    // TODO: play audio when backend audio ready
  };

  const handleToggleFavorite = async () => {
    if (!currentWord) return;

    try {
      const res = await toggleVocabularyFavorite(currentWord.id);

      if (res.favorite) {
        addVocabularyFavorite(currentWord);
      } else {
        removeVocabularyFavorite(currentWord.id);
      }
    } catch (e) {
      console.error("❌ Toggle favorite error:", e);
    }
  };

  // =========================
  // RENDER
  // =========================
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!currentWord) {
    return (
      <View style={styles.container}>
        <Text>Không có dữ liệu từ vựng</Text>
      </View>
    );
  }

  const example = currentWord.examples?.[0];

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          <View style={[styles.progressIndicator, { left: indicatorLeft }]}>
            <View style={styles.indicatorCircle}>
              <Image
                source={require("../../../assets/logo.png")}
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
        {/* Audio */}
        <TouchableOpacity
          style={styles.audioButton}
          onPress={(e) => {
            e.stopPropagation();
            handlePlayAudio();
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="volume-high-outline"
            size={28}
            color={Colors.primary}
          />
        </TouchableOpacity>

        {/* Favorite */}
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

        {/* Content */}
        <View style={styles.wordContent}>
          {!isFlipped ? (
            <>
              <Text style={styles.reading}>{currentWord.hiragana}</Text>
              <Text style={styles.kanji}>{currentWord.kanji}</Text>
            </>
          ) : (
            <>
              <Text style={styles.meaningLarge}>
                {currentWord.vietnamese}
              </Text>
              <Text style={styles.meaning}>{currentWord.meaning}</Text>

              {example && (
                <View style={styles.exampleContainer}>
                  <Text style={styles.exampleJP}>
                    {example.sentence_jp}
                  </Text>
                  <Text style={styles.exampleVN}>
                    {example.sentence_vi}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        <View style={styles.pointerIcon}>
          <Ionicons
            name="hand-left-outline"
            size={30}
            color={Colors.primary}
          />
          <Text style={styles.pointerText}>
            {isFlipped ? "Ấn để xem từ vựng" : "Ấn để xem chi tiết"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Navigation */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[styles.previousButton, isFirstWord && styles.buttonDisabled]}
          onPress={handlePrevious}
          disabled={isFirstWord}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={isFirstWord ? Colors.textPlaceholder : Colors.white}
          />
          <Text
            style={[
              styles.previousButtonText,
              isFirstWord && styles.buttonTextDisabled,
            ]}
          >
            Quay lại
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.continueButtonText}>
            {isLastWord ? "Hoàn thành" : "Tiếp tục"}
          </Text>
          {!isLastWord && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.white}
              style={{ marginLeft: 4 }}
            />
          )}
        </TouchableOpacity>
      </View>

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
