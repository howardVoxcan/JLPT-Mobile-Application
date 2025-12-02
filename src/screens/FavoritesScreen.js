import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getAllWords, getWordById } from '../data/vocabulary';
import useVocabStore from '../stores/vocabStore';

const FavoritesScreen = ({ onGoBack }) => {
  const favorites = useVocabStore(state => state.favorites);
  const toggleFavorite = useVocabStore(state => state.toggleFavorite);
  
  const favoriteWords = favorites
    .map(id => getWordById(id))
    .filter(word => word !== null);
  
  const renderFavoriteItem = ({ item }) => (
    <View style={styles.wordCard}>
      <View style={styles.wordContent}>
        <View style={styles.numberCircle}>
          <Text style={styles.numberText}>
            {favoriteWords.indexOf(item) + 1}
          </Text>
        </View>
        
        <View style={styles.wordInfo}>
          <Text style={styles.kanji}>{item.kanji}</Text>
          <Text style={styles.vietnamese}>{item.vietnamese}</Text>
          <Text style={styles.meaning}>{item.meaning}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.heartButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <MaterialIcons name="favorite" size={28} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="favorite-border" size={80} color="#ddd" />
      <Text style={styles.emptyTitle}>Chưa có từ yêu thích</Text>
      <Text style={styles.emptyText}>
        Hãy thêm từ vào danh sách yêu thích khi học từ vựng
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Danh sách yêu thích</Text>
          {favoriteWords.length > 0 && (
            <Text style={styles.headerSubtitle}>
              {favoriteWords.length} từ
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>Danh sách yêu thích</Text>
        <Text style={styles.instructionText}>
          Click vào ❤ để bỏ yêu thích.
        </Text>
      </View>
      
      <FlatList
        data={favoriteWords}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9f5',
  },
  header: {
    backgroundColor: '#d4f4e7',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  instructionBox: {
    backgroundColor: '#ffe0f0',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  wordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  wordContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  wordInfo: {
    flex: 1,
  },
  kanji: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  vietnamese: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  meaning: {
    fontSize: 14,
    color: '#999',
  },
  heartButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default FavoritesScreen;
