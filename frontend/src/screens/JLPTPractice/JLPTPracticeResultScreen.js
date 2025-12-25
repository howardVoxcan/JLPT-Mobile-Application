import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { getSectionColor } from '../../services/jlptPracticeService';

export default function JLPTPracticeResultScreen({ navigation, route }) {
  const { attemptId, testId = 1, level = 'N5', resultData, testTitle } = route?.params || {};
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (resultData && resultData.sections) {
      console.log('ResultData received:', JSON.stringify(resultData, null, 2));
      
      // Use data passed from TestScreen
      const mappedResults = resultData.sections.map((section, index) => {
        const colors = getSectionColor(section.section_type);
        console.log(`Section ${index}:`, {
          type: section.section_type,
          title: section.title_vn,
          correct: section.correct,
          total: section.total,
          percentage: section.percentage,
          subsections: section.subsections
        });
        
        return {
          id: index + 1,
          category: section.title_vn,
          correct: section.correct,
          total: section.total,
          percentage: section.percentage,
          color: colors.color,
          borderColor: colors.borderColor,
          subCategories: section.subsections || [],
        };
      });
      
      console.log('Mapped results:', JSON.stringify(mappedResults, null, 2));
      setResults(mappedResults);
    }
  }, [resultData]);

  const renderResultCard = (result) => {
    return (
      <View key={result.id} style={[styles.resultCard, { borderColor: result.borderColor }]}>
        {/* Header section with colored background */}
        <View style={[styles.cardHeader, { backgroundColor: result.color }]}>
          {/* Percentage Badge - Top Left */}
          <View style={[styles.percentageBadge, { backgroundColor: result.color, borderColor: '#FFFFFF' }]}>
            <Text style={styles.percentageText}>{result.percentage || 0}%</Text>
          </View>
          
          {/* Title and Score - Right side of header */}
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{result.category}</Text>
            <Text style={styles.cardSubtitle}>Đúng {result.correct}/{result.total}</Text>
          </View>
        </View>

        {/* Sub-categories */}
        {result.subCategories && result.subCategories.length > 0 && (
          <View style={styles.subCategoriesContainer}>
            {result.subCategories.map((sub, index) => {
              const subPercentage = sub.total > 0 ? Math.round((sub.correct / sub.total) * 100) : 0;
              const progressWidth = sub.total > 0 ? (sub.correct / sub.total) * 112 : 0;
              
              return (
                <View key={index} style={styles.subCategoryRow}>
                  <Text style={styles.subCategoryName}>{sub.name}</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: progressWidth }]} />
                    </View>
                    <Text style={styles.progressText}>{sub.correct}/{sub.total}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{testTitle || `Kết quả Test ${testId}`}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Results Cards */}
          {results.map(renderResultCard)}

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            {attemptId && (
              <TouchableOpacity 
                style={styles.detailsButton}
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate('JLPTPracticeTestDetails', { 
                    attemptId, 
                    testId, 
                    level 
                  });
                }}
              >
                <Text style={styles.detailsButtonText}>Xem chi tiết</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.retryButton}
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate('JLPTPracticeTest', { 
                  testId, 
                  level 
                });
              }}
            >
              <Text style={styles.retryButtonText}>Làm lại</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.secondaryLight,
    borderBottomWidth: 2,
    borderBottomColor: Colors.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 36,
  },
  scrollContent: {
    padding: 13,
    paddingTop: 26,
    paddingBottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  resultCard: {
    width: 280,
    minHeight: 100,
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
    paddingTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  percentageBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 8,
    top: 7,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0,
    marginTop: 0,
  },
  cardTitle: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: '#202244',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontFamily: 'Mulish',
    fontWeight: '800',
    fontSize: 12,
    lineHeight: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  subCategoriesContainer: {
    padding: 10,
    paddingTop: 20,
    paddingBottom: 10,
  },
  subCategoryRow: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subCategoryName: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textPrimary,
    width: 100,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
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
    minWidth: 18,
    textAlign: 'right',
  },
  actionButtonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },
  detailsButton: {
    width: 200,
    height: 48,
    backgroundColor: '#FFB7C5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
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
  retryButton: {
    width: 200,
    height: 48,
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
  retryButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.white,
  },
});
