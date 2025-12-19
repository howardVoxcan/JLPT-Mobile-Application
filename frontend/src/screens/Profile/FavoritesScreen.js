import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useFavorites } from '../../context/FavoritesContext';

export const FavoritesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('vocabulary'); // vocabulary or kanji
  const [hiddenExamples, setHiddenExamples] = useState({}); // Track which items have hidden examples
  const [showFlashcard, setShowFlashcard] = useState(false); // Flashcard mode
  const [currentIndex, setCurrentIndex] = useState(0); // Current flashcard index
  const [isFlipped, setIsFlipped] = useState(false); // For vocabulary flashcard
  const [cardState, setCardState] = useState('detail'); // For kanji flashcard: 'detail', 'front', 'back'
  const { favoriteVocabulary, favoriteKanji, removeVocabularyFavorite, removeKanjiFavorite, isVocabularyFavorite, isKanjiFavorite } = useFavorites();

  const handleToggleExample = (itemId) => {
    setHiddenExamples(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleRemoveFavorite = (itemId, type) => {
    if (type === 'vocabulary') {
      removeVocabularyFavorite(itemId);
    } else {
      removeKanjiFavorite(itemId);
    }
  };

  const renderVocabularyItem = (item, index) => {
    const isExampleHidden = hiddenExamples[item.id];
    
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.favoriteItem}
        onPress={() => handleToggleExample(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.itemContent}>
          {/* Number */}
          <Text style={styles.itemNumber}>{index + 1}</Text>
          
          {/* Word Content */}
          <View style={styles.wordContent}>
            {/* Hiragana (furigana) */}
            <Text style={styles.furigana}>{item.hiragana}</Text>
            
            {/* Kanji */}
            <Text style={styles.kanjiText}>{item.kanji}</Text>
            
            {/* Vietnamese Reading (in caps) */}
            <Text style={styles.vietnameseReading}>{item.vietnamese}</Text>
            
            {/* Meaning */}
            <Text style={styles.meaning}>{item.meaning}</Text>
            
            {/* Example (toggleable) */}
            {!isExampleHidden && (
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleJP}>{item.example}</Text>
                <Text style={styles.exampleVN}>{item.exampleMeaning}</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Heart Button */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={(e) => {
            e.stopPropagation();
            handleRemoveFavorite(item.id, 'vocabulary');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="heart" size={28} color="#FF9FB0" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderKanjiItem = (item, index) => {
    const isExampleHidden = hiddenExamples[item.id];
    
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.favoriteItem}
        onPress={() => handleToggleExample(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.kanjiItemContent}>
          {/* Left Column: Kanji and Vietnamese */}
          <View style={styles.kanjiColumn}>
            <Text style={styles.kanjiLarge}>{item.kanji}</Text>
            <Text style={styles.kanjiVietnamese}>{item.vietnamese}</Text>
          </View>
          
          {/* Middle Column: Readings */}
          <View style={styles.readingsColumn}>
            <Text style={styles.readingLabel}>âm on: {item.onyomi || '××'}</Text>
            <Text style={styles.readingLabel}>âm kun: {item.kunyomi || '××'}</Text>
          </View>
          
          {/* Right Column: Examples */}
          {!isExampleHidden && item.vocabulary && (
            <View style={styles.examplesColumn}>
              <Text style={styles.exampleWord}>
                {item.vocabulary.kanji}({item.vocabulary.hiragana}) {item.vocabulary.reading}
              </Text>
              <Text style={styles.exampleMeaning}>{item.vocabulary.meaning}</Text>
            </View>
          )}
        </View>
        
        {/* Heart Button */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={(e) => {
            e.stopPropagation();
            handleRemoveFavorite(item.id, 'kanji');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="heart" size={28} color="#FF9FB0" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const currentFavorites = activeTab === 'vocabulary' ? favoriteVocabulary : favoriteKanji;
  const currentItem = currentFavorites[currentIndex];
  const totalItems = currentFavorites.length;
  const flashcardProgress = totalItems > 0 ? ((currentIndex + 1) / totalItems) * 100 : 0;
  
  // Calculate progress indicator position
  const progressBarWidth = 310;
  const indicatorWidth = 72;
  const maxLeft = progressBarWidth - indicatorWidth;
  const indicatorLeft = Math.min((flashcardProgress / 100) * progressBarWidth - indicatorWidth / 2, maxLeft);

  const handleFlashcardButton = () => {
    if (currentFavorites.length > 0) {
      setShowFlashcard(true);
      setCurrentIndex(0);
      setIsFlipped(false);
      setCardState('detail');
    }
  };

  const handleNext = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setCardState('detail');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setCardState('detail');
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleCardPress = () => {
    if (activeTab === 'vocabulary') {
      setIsFlipped(!isFlipped);
    } else {
      // Kanji: cycle through detail -> front -> back -> detail
      if (cardState === 'detail') {
        setCardState('front');
      } else if (cardState === 'front') {
        setCardState('back');
      } else {
        setCardState('detail');
      }
    }
  };

  const handlePlayAudio = () => {
    // TODO: Implement audio playback
    console.log('Play audio');
  };

  const handleToggleFavorite = () => {
    if (!currentItem) return;
    if (activeTab === 'vocabulary') {
      if (isVocabularyFavorite(currentItem.id)) {
        removeVocabularyFavorite(currentItem.id);
      }
    } else {
      if (isKanjiFavorite(currentItem.id)) {
        removeKanjiFavorite(currentItem.id);
      }
    }
  };

  const isFirstItem = currentIndex === 0;
  const isLastItem = currentIndex === totalItems - 1;
  const isFavorite = currentItem ? (activeTab === 'vocabulary' ? isVocabularyFavorite(currentItem.id) : isKanjiFavorite(currentItem.id)) : false;

  // Render flashcard view
  if (showFlashcard && currentItem) {
    return (
      <View style={styles.container}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${flashcardProgress}%` }]} />
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
          onPress={handleCardPress}
          activeOpacity={0.9}
        >
          {/* Action Buttons */}
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
          <View style={styles.wordContent}>
            {activeTab === 'vocabulary' ? (
              // Vocabulary flashcard
              !isFlipped ? (
                <>
                  <Text style={styles.reading}>{currentItem.hiragana}</Text>
                  <Text style={styles.kanji}>{currentItem.kanji}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.meaningLarge}>{currentItem.vietnamese}</Text>
                  <Text style={styles.meaning}>{currentItem.meaning}</Text>
                  <View style={styles.exampleContainer}>
                    <Text style={styles.exampleJP}>{currentItem.example}</Text>
                    <Text style={styles.exampleVN}>{currentItem.exampleMeaning}</Text>
                  </View>
                </>
              )
            ) : (
              // Kanji flashcard
              cardState === 'detail' ? (
                <>
                  <View style={styles.kanjiBox}>
                    <Text style={styles.strokeCount}>Số nét: {currentItem.strokeCount}</Text>
                    <Text style={styles.kanjiLarge}>{currentItem.kanji}</Text>
                    <Text style={styles.vietnameseReading}>{currentItem.vietnamese}</Text>
                  </View>
                  <View style={styles.readingRow}>
                    {currentItem.kunyomi && (
                      <View style={styles.readingBadge}>
                        <Text style={styles.readingLabel}>Kunyomi</Text>
                        <Text style={styles.readingValue}>{currentItem.kunyomi}</Text>
                      </View>
                    )}
                    <View style={styles.readingBadge}>
                      <Text style={styles.readingLabel}>Onyomi</Text>
                      {currentItem.onyomi && <Text style={styles.readingValue}>{currentItem.onyomi}</Text>}
                    </View>
                  </View>
                  <View style={styles.meaningContainer}>
                    <View style={styles.readingBadge}>
                      <Text style={styles.readingLabel}>Nghĩa</Text>
                    </View>
                    <Text style={styles.meaningText}>{currentItem.meaning}</Text>
                  </View>
                </>
              ) : cardState === 'front' ? (
                <>
                  {currentItem.vocabulary ? (
                    <>
                      <Text style={styles.hiragana}>{currentItem.vocabulary.hiragana}</Text>
                      <Text style={styles.kanji}>{currentItem.vocabulary.kanji}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.hiragana}>{currentItem.hiragana}</Text>
                      <Text style={styles.kanji}>{currentItem.kanji}</Text>
                    </>
                  )}
                </>
              ) : (
                <>
                  {currentItem.vocabulary ? (
                    <>
                      <Text style={styles.vietnameseLarge}>{currentItem.vocabulary.reading}</Text>
                      <Text style={styles.meaning}>{currentItem.vocabulary.meaning}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.vietnameseLarge}>{currentItem.vietnamese}</Text>
                      <Text style={styles.meaning}>{currentItem.meaning}</Text>
                    </>
                  )}
                </>
              )
            )}
          </View>

          {/* Pointer Icon */}
          <View style={styles.pointerIcon}>
            <Ionicons name="hand-left-outline" size={30} color={Colors.primary} />
            <Text style={styles.pointerText}>
              {activeTab === 'vocabulary' 
                ? (isFlipped ? 'Ấn để xem từ vựng' : 'Ấn để xem chi tiết')
                : (cardState === 'detail' ? 'Ấn để xem từ liên quan' : cardState === 'front' ? 'Ấn để xem chi tiết' : 'Ấn để xem kanji')
              }
            </Text>
          </View>
        </TouchableOpacity>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={[styles.previousButton, isFirstItem && styles.buttonDisabled]}
            onPress={handlePrevious}
            disabled={isFirstItem}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color={isFirstItem ? Colors.textPlaceholder : Colors.white} />
            <Text style={[styles.previousButtonText, isFirstItem && styles.buttonTextDisabled]}>Quay lại</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleNext}
            activeOpacity={0.7}
          >
            <Text style={styles.continueButtonText}>
              {isLastItem ? 'Hoàn thành' : 'Tiếp tục'}
            </Text>
            {!isLastItem && <Ionicons name="chevron-forward" size={20} color={Colors.white} style={{ marginLeft: 4 }} />}
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

        {/* Back to List Button */}
        <TouchableOpacity 
          style={styles.backToListButton}
          onPress={() => setShowFlashcard(false)}
          activeOpacity={0.7}
        >
          <Ionicons name="list-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.backToListText}>Quay lại danh sách</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render list view
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'vocabulary' && styles.tabActive]}
            onPress={() => setActiveTab('vocabulary')}
            activeOpacity={0.7}
          >
            {activeTab === 'vocabulary' && <View style={styles.tabHighlight} />}
            <Text style={[styles.tabText, activeTab === 'vocabulary' && styles.tabTextActive]}>
              Từ vựng
            </Text>
          </TouchableOpacity>
          
          <View style={styles.tabDivider} />
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'kanji' && styles.tabActive]}
            onPress={() => setActiveTab('kanji')}
            activeOpacity={0.7}
          >
            {activeTab === 'kanji' && <View style={styles.tabHighlight} />}
            <Text style={[styles.tabText, activeTab === 'kanji' && styles.tabTextActive]}>
              Kanji
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instructions Card */}
        <View style={styles.instructionsCard}>
          <View style={styles.instructionsContent}>
            <Text style={styles.instructionsTitle}>Hướng dẫn:</Text>
            <Text style={styles.instructionsText}>
              Click vào từng khung để ẩn/hiện ví dụ.
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.flashcardButton} 
            onPress={handleFlashcardButton}
            activeOpacity={0.7}
            disabled={currentFavorites.length === 0}
          >
            <Text style={[styles.flashcardButtonText, currentFavorites.length === 0 && styles.flashcardButtonDisabled]}>
              Flashcard
            </Text>
          </TouchableOpacity>
        </View>

        {/* Favorites List */}
        <View style={styles.favoritesList}>
          {currentFavorites.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Chưa có {activeTab === 'vocabulary' ? 'từ vựng' : 'kanji'} yêu thích nào
              </Text>
            </View>
          ) : (
            currentFavorites.map((item, index) =>
              activeTab === 'vocabulary'
                ? renderVocabularyItem(item, index)
                : renderKanjiItem(item, index)
            )
          )}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    width: 282,
    height: 30,
    alignSelf: 'center',
    marginTop: 14,
    backgroundColor: Colors.white,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    backgroundColor: Colors.white,
  },
  tabHighlight: {
    position: 'absolute',
    width: 90,
    height: 20,
    backgroundColor: '#FFE4DC',
    borderRadius: 4,
    alignSelf: 'center',
  },
  tabText: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    zIndex: 1,
  },
  tabTextActive: {
    color: Colors.textSecondary,
  },
  tabDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E1E1E1',
  },
  instructionsCard: {
    marginHorizontal: 13,
    marginTop: 20,
    backgroundColor: 'rgba(255, 183, 197, 0.5)',
    borderRadius: 5,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  instructionsContent: {
    flex: 1,
  },
  instructionsTitle: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 16,
    color: Colors.textPrimary,
  },
  instructionsText: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 16,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  flashcardButton: {
    width: 87,
    height: 36,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashcardButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 18,
    color: '#7FDEAD',
  },
  favoritesList: {
    marginHorizontal: 13,
    marginTop: 20,
    alignItems: 'center',
  },
  favoriteItem: {
    width: '100%',
    maxWidth: 367,
    minHeight: 85,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 50, // Space for heart button
  },
  kanjiItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 50, // Space for heart button
  },
  itemNumber: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 16,
    color: Colors.textPrimary,
    marginRight: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  wordContent: {
    flex: 1,
  },
  furigana: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 16,
  },
  kanjiText: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 6,
    lineHeight: 28,
  },
  vietnameseReading: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 20,
  },
  meaning: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
    lineHeight: 18,
  },
  exampleContainer: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  exampleJP: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 12,
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 16,
  },
  exampleVN: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  kanjiColumn: {
    width: 60,
    alignItems: 'center',
    marginRight: 16,
    justifyContent: 'center',
  },
  kanjiLarge: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 32,
    color: '#7A3E9E',
    marginBottom: 6,
    lineHeight: 40,
  },
  kanjiVietnamese: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 12,
    color: '#7A3E9E',
    lineHeight: 16,
  },
  readingsColumn: {
    width: 110,
    marginRight: 16,
    justifyContent: 'center',
  },
  readingLabel: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 6,
    lineHeight: 15,
  },
  examplesColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  exampleWord: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 11,
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 15,
  },
  exampleMeaning: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  bottomSpacer: {
    height: 100,
  },
  // Flashcard styles
  progressContainer: {
    width: 310,
    height: 40,
    marginTop: 25,
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
    alignItems: 'center',
  },
  skipText: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 19,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
  backToListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    marginTop: 10,
  },
  backToListText: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  flashcardButtonDisabled: {
    opacity: 0.5,
  },
  // Kanji flashcard styles
  kanjiBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  strokeCount: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  kanjiLarge: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '500',
    fontSize: 48,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  vietnameseReading: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 20,
    color: Colors.textPrimary,
  },
  readingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  readingBadge: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  readingLabel: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 10,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  readingValue: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '500',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  meaningContainer: {
    alignItems: 'center',
  },
  meaningText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 8,
  },
  hiragana: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 29,
    color: Colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  vietnameseLarge: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 32,
    lineHeight: 44,
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
});