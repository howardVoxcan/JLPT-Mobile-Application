import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';

export default function JLPTPracticeCenterScreen({ navigation }) {
  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];

  const handleLevelPress = (level) => {
    navigation.navigate('JLPTPracticeLevel', { level });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <MaterialCommunityIcons name="book-open-page-variant-outline" size={20} color="#DF6992" />
          <Text style={styles.subtitle}>Thi thử JLPT</Text>
        </View>

        {/* Levels List */}
        {levels.map((level, index) => (
          <TouchableOpacity
            key={index}
            style={styles.levelButton}
            onPress={() => handleLevelPress(level)}
            activeOpacity={0.7}
          >
            <Text style={styles.levelText}>JLPT {level}</Text>
          </TouchableOpacity>
        ))}

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
    paddingHorizontal: 29,
    paddingTop: 15,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  subtitle: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  levelButton: {
    width: 335,
    height: 47,
    backgroundColor: 'rgba(255, 183, 197, 0.5)',
    borderRadius: 16,
    justifyContent: 'center',
    paddingLeft: 25,
    marginBottom: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  levelText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
});