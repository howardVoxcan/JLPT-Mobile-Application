import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { vocabularyData } from '../data/vocabulary';
import useVocabStore from '../stores/vocabStore';

const HomeScreen = ({ navigation, onGoToFavorites }) => {
  const favorites = useVocabStore(state => state.favorites);
  
  const renderUnitItem = ({ item }) => (
    <TouchableOpacity
      style={styles.unitCard}
      onPress={() => navigation.navigate('vocab', { unitId: item.unitId })}
    >
      <View style={styles.unitInfo}>
        <Text style={styles.unitTitle}>{item.unitTitle}</Text>
        <Text style={styles.unitName}>{item.unitName}</Text>
        <Text style={styles.wordCount}>{item.words.length} từ</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Từ vựng N3</Text>
        
        <TouchableOpacity
          style={styles.favButton}
          onPress={onGoToFavorites}
        >
          <MaterialIcons name="favorite" size={32} color="#ff6b6b" />
          {favorites.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{favorites.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={vocabularyData}
        renderItem={renderUnitItem}
        keyExtractor={(item) => item.unitId.toString()}
        contentContainerStyle={styles.listContainer}
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  favButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  unitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  unitInfo: {
    padding: 16,
  },
  unitTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  unitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  wordCount: {
    fontSize: 14,
    color: '#999',
  },
});

export default HomeScreen;
