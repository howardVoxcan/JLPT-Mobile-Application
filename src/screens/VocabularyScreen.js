import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getUnitById } from '../data/vocabulary';
import useVocabStore from '../stores/vocabStore';

const { width } = Dimensions.get('window');

const VocabularyScreen = ({ route, navigation }) => {
  const { unitId } = route.params;
  const unit = getUnitById(unitId);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const favorites = useVocabStore(state => state.favorites);
  const toggleFavorite = useVocabStore(state => state.toggleFavorite);
  
  if (!unit) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Không tìm thấy Unit</Text>
      </SafeAreaView>
    );
  }
  
  const currentWord = unit.words[currentIndex];
  const isCurrentFavorite = favorites.includes(currentWord.id);
  
  const handleNext = () => {
    if (currentIndex < unit.words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };
  
  const handleSkip = () => {
    if (currentIndex < unit.words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      navigation.goBack();
    }
  };
  
  const handleToggleFavorite = () => {
    toggleFavorite(currentWord.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{unit.unitName}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentIndex + 1) / unit.words.length) * 100}%` }
            ]} 
          />
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity 
          style={styles.flashcard}
          onPress={() => setIsFlipped(!isFlipped)}
          activeOpacity={0.9}
        >
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation(); 
              }}
            >
              <Ionicons name="volume-high" size={28} color="#ff6b6b" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleToggleFavorite();
              }}
            >
              <MaterialIcons 
                name={isCurrentFavorite ? "favorite" : "favorite-border"} 
                size={32} 
                color={isCurrentFavorite ? "#ff6b6b" : "#ccc"}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.wordContent}>
            {!isFlipped ? (
              <Text style={styles.kanji}>{currentWord.kanji}</Text>
            ) : (
              <>
                <Text style={styles.vietnamese}>{currentWord.vietnamese}</Text>
                <Text style={styles.meaning}>{currentWord.meaning}</Text>
                <Text style={styles.example}>{currentWord.example}</Text>
                <Text style={styles.exampleMeaning}>{currentWord.exampleMeaning}</Text>
              </>
            )}
          </View>
          
          <Text style={styles.hintText}>
            {isFlipped ? '👆 Ấn để xem Kanji' : '👆 Ấn để xem nghĩa'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      <View style={styles.bottomButtons}>
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
          disabled={currentIndex >= unit.words.length - 1}
        >
          <Text style={styles.nextButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Bỏ qua từ này</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d5f4e6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    fontSize: 24,
    color: '#333',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff9999',
    borderRadius: 4,
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  flashcard: {
    width: width - 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    minHeight: 400,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffe0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  kanji: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#333',
  },
  vietnamese: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  meaning: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  example: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  exampleMeaning: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  hintText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  bottomButtons: {
    padding: 16,
    alignItems: 'center',
  },
  nextButton: {
    width: '100%',
    backgroundColor: '#ff9999',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipText: {
    color: '#999',
    fontSize: 14,
  },
});

export default VocabularyScreen;
