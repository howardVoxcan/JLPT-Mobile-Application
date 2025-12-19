import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 24;

export default function StudyScreen({ navigation }) {
  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };
  const handleLevelPress = (category, level) => {
    // Navigate to appropriate level screen based on category
    if (category === 'Từ vựng') {
      navigation.navigate('VocabularyLevel', { category, level });
    } else if (category === 'Kanji') {
      navigation.navigate('KanjiLevel', { category, level });
    } else if (category === 'Đọc hiểu') {
      navigation.navigate('ReadingLevel', { category, level });
    } else if (category === 'Nghe hiểu') {
      navigation.navigate('ListeningLevel', { category, level });
    } else {
      navigation.navigate('GrammarLevel', { category, level });
    }
  };

  const renderLevelButton = (title, color, marginTop = 10, category) => (
    <TouchableOpacity 
      key={title}
      style={[styles.levelButton, { backgroundColor: color, marginTop }]}
      activeOpacity={0.7}
      onPress={() => {
        const level = title.split(' ')[1]; // Extract N5, N4, etc.
        handleLevelPress(category, level);
      }}
    >
      <Text style={styles.levelButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderSection = (title, icon, iconColor, levels, baseColor) => (
    <View key={title} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={24} color={iconColor} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {levels.map((level) => renderLevelButton(level, baseColor, 10, title))}
    </View>
  );

  return (
    <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={require('../../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.rightIcons}>
            <Text style={styles.flagEmoji}>🇻🇳</Text>
            <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
              <Ionicons name="person-circle-outline" size={40} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title Bar */}
        <View style={styles.titleBar}>
          <MaterialCommunityIcons name="book-open-page-variant-outline" size={32} color="#343232" />
          <Text style={styles.title}>Học tập</Text>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
        {/* Từ vựng */}
        {renderSection(
          'Từ vựng',
          'book',
          '#DF6992',
          ['Từ vựng N5', 'Từ vựng N4', 'Từ vựng N3', 'Từ vựng N2', 'Từ vựng N1'],
          'rgba(255, 183, 197, 0.5)'
        )}

        {/* Kanji */}
        {renderSection(
          'Kanji',
          'language',
          '#63B37B',
          ['Kanji N5', 'Kanji N4', 'Kanji N3', 'Kanji N2', 'Kanji N1'],
          'rgba(181, 234, 215, 0.5)'
        )}

        {/* Ngữ pháp */}
        {renderSection(
          'Ngữ pháp',
          'text',
          '#BB64D3',
          ['Ngữ pháp N5', 'Ngữ pháp N4', 'Ngữ pháp N3', 'Ngữ pháp N2', 'Ngữ pháp N1'],
          'rgba(197, 185, 232, 0.5)'
        )}

        {/* Đọc hiểu */}
        {renderSection(
          'Đọc hiểu',
          'document-text',
          '#D4CF73',
          ['Đọc hiểu N5', 'Đọc hiểu N4', 'Đọc hiểu N3', 'Đọc hiểu N2', 'Đọc hiểu N1'],
          'rgba(255, 244, 163, 0.5)'
        )}

        {/* Nghe hiểu */}
        {renderSection(
          'Nghe hiểu',
          'headset',
          '#446498',
          ['Nghe hiểu N5', 'Nghe hiểu N4', 'Nghe hiểu N3', 'Nghe hiểu N2', 'Nghe hiểu N1'],
          'rgba(149, 212, 235, 0.5)'
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
  header: {
    width: '100%',
    height: 100 + STATUSBAR_HEIGHT - 20,
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 16,
    paddingTop: STATUSBAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flagEmoji: {
    fontSize: 28,
  },
  titleBar: {
    width: '100%',
    height: 68,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(225, 225, 225, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    fontWeight: '700',
    fontSize: 24,
    color: '#343232',
  },
  scrollContent: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#343232',
    marginLeft: 10,
  },
  levelButton: {
    width: '100%',
    height: 47,
    borderRadius: 16,
    justifyContent: 'center',
    paddingLeft: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  levelButtonText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#343232',
  },
});