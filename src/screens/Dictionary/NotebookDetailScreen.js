import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';

export const NotebookDetailScreen = ({ navigation, route }) => {
  const { notebookType = 'Từ vựng' } = route?.params || {};

  const handleBack = () => {
    navigation.goBack();
  };

  const getIconConfig = (type) => {
    switch (type) {
      case 'Từ vựng':
        return { name: 'book-outline', bgColor: '#FFE4DC', iconColor: '#DF6992' };
      case 'Kanji':
        return { name: 'language-outline', bgColor: '#D4F4E7', iconColor: '#63B37B' };
      case 'Ngữ pháp':
        return { name: 'text-outline', bgColor: 'rgba(197, 185, 232, 0.5)', iconColor: '#BB64D3' };
      case 'Đọc hiểu':
        return { name: 'book-open-outline', bgColor: 'rgba(255, 244, 163, 0.5)', iconColor: '#D4CF73' };
      case 'Nghe hiểu':
        return { name: 'headset-outline', bgColor: 'rgba(149, 212, 235, 0.4)', iconColor: '#446498' };
      case 'Thi JLPT':
        return { name: 'document-text-outline', bgColor: 'rgba(255, 203, 164, 0.5)', iconColor: '#CB8561' };
      default:
        return { name: 'book-outline', bgColor: '#FFE4DC', iconColor: '#DF6992' };
    }
  };

  const iconConfig = getIconConfig(notebookType);

  const levels = [
    {
      level: 'N5',
      status: 'Hoàn thành',
      lessonsCompleted: '25/25',
      vocabulary: '250 từ',
      completionPercent: '100%',
      reviewedWords: '250/300',
      completionWidth: 100,
      reviewWidth: 83,
      icon: 'checkmark-done-circle-outline',
      borderColor: Colors.secondary,
      locked: false,
    },
    {
      level: 'N4',
      status: 'Đang học',
      lessonsCompleted: '15/25',
      vocabulary: '50 từ',
      completionPercent: '60%',
      reviewedWords: '50/300',
      completionWidth: 57,
      reviewWidth: 22,
      icon: 'time-outline',
      borderColor: '#95D4EB',
      locked: false,
    },
    {
      level: 'N3',
      status: 'Đang học',
      lessonsCompleted: '15/25',
      vocabulary: '50 từ',
      completionPercent: '60%',
      reviewedWords: '50/300',
      completionWidth: 57,
      reviewWidth: 22,
      icon: 'time-outline',
      borderColor: '#95D4EB',
      locked: false,
    },
    {
      level: 'N2',
      status: 'Chưa học',
      locked: true,
      lockMessage: `Quay lại học tập ${notebookType} cấp độ N2 trước để mở khóa`,
    },
    {
      level: 'N1',
      status: 'Chưa học',
      locked: true,
      lockMessage: `Quay lại học tập ${notebookType} cấp độ N1 trước để mở khóa`,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sổ tay học tập</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <MaterialCommunityIcons name="chart-line" size={20} color={Colors.secondaryHover} />
          <Text style={styles.subtitle}>
            Theo dõi chi tiết tiến độ từng kỹ năng và cấp độ
          </Text>
        </View>

        {/* Subject Info */}
        <View style={styles.subjectCard}>
          <View style={[styles.iconBox, { backgroundColor: iconConfig.bgColor }]}>
            <Ionicons name={iconConfig.name} size={24} color={iconConfig.iconColor} />
          </View>
          <View style={styles.subjectInfo}>
            <Text style={styles.subjectTitle}>{notebookType}</Text>
            <Text style={styles.subjectSubtitle}>1 cấp độ hoàn thành • 2 đang học</Text>
          </View>
        </View>

        {/* Level Details Title */}
        <Text style={styles.sectionTitle}>Chi tiết các cấp độ</Text>

        {/* Levels List */}
        {levels.map((level, index) => (
          <View key={index} style={[
            styles.levelCard,
            level.locked && styles.levelCardLocked,
            level.status === 'Hoàn thành' && styles.levelCardCompleted
          ]}>
            {level.locked ? (
              <>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={24} 
                  color={Colors.textPlaceholder} 
                  style={styles.lockIcon}
                />
                <View style={styles.lockedContent}>
                  <Text style={styles.levelText}>{level.level}</Text>
                  <Text style={styles.statusText}>{level.status}</Text>
                  <Text style={styles.lockMessage}>{level.lockMessage}</Text>
                </View>
              </>
            ) : (
              <>
                <Ionicons 
                  name={level.icon} 
                  size={24} 
                  color={level.status === 'Hoàn thành' ? Colors.success : '#95D4EB'} 
                  style={styles.statusIcon}
                />
                <View style={styles.levelContent}>
                  <View style={styles.levelHeader}>
                    <View>
                      <Text style={styles.levelText}>{level.level}</Text>
                      <Text style={styles.statusText}>{level.status}</Text>
                    </View>
                    <View style={styles.statsContainer}>
                      <View style={styles.statColumn}>
                        <Text style={styles.statLabel}>Bài đã học</Text>
                        <Text style={styles.statValue}>{level.lessonsCompleted}</Text>
                      </View>
                      <View style={styles.statColumn}>
                        <Text style={styles.statLabel}>Thành thạo</Text>
                        <Text style={styles.statValue}>{level.vocabulary}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Progress Bars */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressRow}>
                      <Text style={styles.progressLabel}>Hoàn thành</Text>
                      <Text style={styles.progressPercent}>{level.completionPercent}</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${level.completionWidth}%` }]} />
                    </View>
                  </View>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressRow}>
                      <Text style={styles.progressLabel}>Từ đã ôn tập</Text>
                      <Text style={styles.progressPercent}>{level.reviewedWords}</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${level.reviewWidth}%` }]} />
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        ))}

        {/* Study Button */}
        <View style={styles.studyButtonContainer}>
          <TouchableOpacity style={styles.studyButton} activeOpacity={0.7}>
            <Text style={styles.studyButtonText}>Học tập</Text>
          </TouchableOpacity>
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
  header: {
    width: '100%',
    height: 88,
    backgroundColor: Colors.secondaryLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 52,
    width: 20,
    height: 20,
  },
  headerTitle: {
    position: 'absolute',
    top: 45,
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 33,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 21,
    marginHorizontal: 23,
    gap: 8,
  },
  subtitle: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 13,
    marginTop: 19,
    backgroundColor: Colors.white,
    height: 62,
    borderRadius: 5,
    paddingHorizontal: 10,
    shadowColor: '#E1E1E1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectInfo: {
    marginLeft: 13,
    flex: 1,
  },
  subjectTitle: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  subjectSubtitle: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    marginTop: 8,
    marginLeft: 22,
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
  },
  levelCard: {
    marginHorizontal: 24,
    marginTop: 14,
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 16,
    borderWidth: 1,
    borderColor: '#95D4EB',
  },
  levelCardCompleted: {
    borderColor: Colors.secondary,
  },
  levelCardLocked: {
    opacity: 0.5,
    borderColor: Colors.textPlaceholder,
  },
  statusIcon: {
    position: 'absolute',
    top: 16,
    left: 14,
  },
  lockIcon: {
    position: 'absolute',
    top: 16,
    left: 14,
  },
  levelContent: {
    marginLeft: 28,
  },
  lockedContent: {
    marginLeft: 38,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  levelText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
  },
  statusText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 13,
  },
  statColumn: {
    alignItems: 'flex-end',
  },
  statLabel: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 15,
    color: Colors.textSecondary,
  },
  statValue: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 15,
    color: '#000000',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 15,
    color: '#000000',
  },
  progressPercent: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 14,
    color: '#000000',
  },
  progressBarBg: {
    height: 7,
    backgroundColor: Colors.formStrokeDefault,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  lockMessage: {
    marginTop: 4,
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 15,
    color: Colors.textSecondary,
  },
  studyButtonContainer: {
    alignItems: 'flex-end',
    marginHorizontal: 24,
    marginTop: 16,
  },
  studyButton: {
    width: 87,
    height: 36,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.formStrokeDefault,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studyButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 18,
    color: Colors.success,
  },
  bottomSpacer: {
    height: 100,
  },
});

