import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';

export default function JLPTPracticeResultScreen({ navigation, route }) {
  const { testId = 1, level = 'N5' } = route?.params || {};

  // Mock results data
  const results = [
    {
      id: 1,
      category: 'Từ vựng',
      correct: 3,
      total: 21,
      percentage: 0,
      color: 'rgba(255, 183, 197, 0.5)',
      borderColor: 'rgba(255, 183, 197, 0.5)',
      subCategories: [
        { name: 'Cách đọc kanji', correct: 3, total: 7 },
        { name: 'Cách đọc Hiragana', correct: 0, total: 5 },
        { name: 'Biểu hiện từ', correct: 0, total: 6 },
        { name: 'Đồng nghĩa', correct: 0, total: 3 },
      ],
    },
    {
      id: 2,
      category: 'Ngữ pháp',
      correct: 3,
      total: 21,
      percentage: 0,
      color: 'rgba(197, 185, 232, 0.5)',
      borderColor: 'rgba(197, 185, 232, 0.5)',
      subCategories: [
        { name: 'Cách đọc kanji', correct: 3, total: 7 },
        { name: 'Cách đọc Hiragana', correct: 0, total: 5 },
        { name: 'Biểu hiện từ', correct: 0, total: 6 },
        { name: 'Đồng nghĩa', correct: 0, total: 3 },
      ],
    },
    {
      id: 3,
      category: 'Đọc hiểu',
      correct: 3,
      total: 21,
      percentage: 0,
      color: 'rgba(255, 244, 163, 0.5)',
      borderColor: 'rgba(255, 244, 163, 0.5)',
      subCategories: [
        { name: 'Cách đọc kanji', correct: 3, total: 7 },
        { name: 'Cách đọc Hiragana', correct: 0, total: 5 },
        { name: 'Biểu hiện từ', correct: 0, total: 6 },
        { name: 'Đồng nghĩa', correct: 0, total: 3 },
      ],
    },
    {
      id: 4,
      category: 'Nghe hiểu',
      correct: 3,
      total: 21,
      percentage: 0,
      color: 'rgba(149, 212, 235, 0.5)',
      borderColor: 'rgba(149, 212, 235, 0.5)',
      subCategories: [
        { name: 'Cách đọc kanji', correct: 3, total: 7 },
        { name: 'Cách đọc Hiragana', correct: 0, total: 5 },
        { name: 'Biểu hiện từ', correct: 0, total: 6 },
        { name: 'Đồng nghĩa', correct: 0, total: 3 },
      ],
    },
  ];

  const renderResultCard = (result) => {
    const percentage = Math.round((result.correct / result.total) * 100);

    return (
      <View key={result.id} style={[styles.resultCard, { borderColor: result.borderColor }]}>
        {/* Header section with colored background */}
        <View style={[styles.cardHeader, { backgroundColor: result.color }]}>
          <View style={[styles.percentageBadge, { backgroundColor: result.color, borderColor: '#FFFFFF' }]}>
            <Text style={styles.percentageText}>{percentage}%</Text>
          </View>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{result.category}</Text>
            <Text style={styles.cardSubtitle}>Đúng {result.correct}/{result.total}</Text>
          </View>
        </View>

        {/* Sub-categories */}
        <View style={styles.subCategoriesContainer}>
          {result.subCategories.map((sub, index) => {
            const subPercentage = sub.total > 0 ? (sub.correct / sub.total) * 100 : 0;
            return (
              <View key={index} style={styles.subCategoryRow}>
                <Text style={styles.subCategoryName}>{sub.name}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${subPercentage}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{sub.correct}/{sub.total}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Results Cards */}
        {results.map(renderResultCard)}

        {/* View Details Button */}
        <TouchableOpacity 
          style={styles.detailsButton}
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('JLPTPracticeTestDetails', { testId, level });
          }}
        >
          <Text style={styles.detailsButtonText}>Xem chi tiết</Text>
        </TouchableOpacity>

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
    paddingTop: 15,
    paddingBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  resultCard: {
    width: 360,
    minHeight: 240,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    height: 70,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  percentageText: {
    fontFamily: 'Nunito',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 22,
    color: '#202244',
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: '#202244',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: 'Mulish',
    fontWeight: '800',
    fontSize: 12,
    lineHeight: 15,
    color: Colors.textSecondary,
  },
  subCategoriesContainer: {
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  subCategoryRow: {
    marginBottom: 8,
  },
  subCategoryName: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBarBg: {
    width: 112,
    height: 5,
    backgroundColor: '#D9D9D9',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7FDEAD',
    borderRadius: 2.5,
  },
  progressText: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textPrimary,
    width: 40,
    textAlign: 'right',
  },
  detailsButton: {
    width: 200,
    height: 48,
    backgroundColor: '#FFB7C5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  detailsButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.white,
  },
});

