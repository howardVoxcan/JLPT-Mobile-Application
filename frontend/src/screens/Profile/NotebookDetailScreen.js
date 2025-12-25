import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';
import { getNotebookCategoryDetail } from '../../services/notebookService';

export const NotebookDetailScreen = ({ navigation, route }) => {
  const { notebookType = 'Từ vựng' } = route?.params || {};
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ completed: 0, inProgress: 0 });

  useEffect(() => {
    loadLevelDetails();
  }, [notebookType]);

  const loadLevelDetails = async () => {
    try {
      setLoading(true);
      const data = await getNotebookCategoryDetail(notebookType);
      
      let completedCount = 0;
      let inProgressCount = 0;
      
      const formattedLevels = data.map(level => {
        let icon, borderColor;
        
        if (level.status === 'completed') {
          icon = 'checkmark-done-circle-outline';
          borderColor = Colors.secondary;
          completedCount++;
        } else if (level.status === 'in-progress') {
          icon = 'time-outline';
          borderColor = '#95D4EB';
          inProgressCount++;
        } else if (level.locked) {
          icon = 'lock-closed-outline';
          borderColor = Colors.textPlaceholder;
        } else {
          icon = 'book-outline';
          borderColor = Colors.formStrokeDefault;
        }
        
        const statusText = level.status === 'completed' ? 'Hoàn thành' : 
                          level.status === 'in-progress' ? 'Đang học' : 
                          level.locked ? 'Chưa học' : 'Chưa học';
        
        return {
          level: level.level,
          status: statusText,
          lessonsCompleted: `${level.lessons_completed}/${level.total_lessons}`,
          vocabulary: `${level.mastered_items} ${getItemLabel(notebookType)}`,
          completionPercent: `${level.completion_percent}%`,
          reviewedWords: `${level.reviewed_items}/${level.review_total}`,
          completionWidth: level.completion_percent,
          reviewWidth: level.review_total > 0 ? Math.round((level.reviewed_items / level.review_total) * 100) : 0,
          icon,
          borderColor,
          locked: level.locked,
          lockMessage: level.locked ? `Quay lại học tập ${notebookType} cấp độ ${level.level} trước để mở khóa` : null,
        };
      });
      
      setLevels(formattedLevels);
      setSummary({ completed: completedCount, inProgress: inProgressCount });
    } catch (error) {
      console.error('Error loading level details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getItemLabel = (type) => {
    switch (type) {
      case 'Từ vựng': return 'từ';
      case 'Kanji': return 'kanji';
      case 'Ngữ pháp': return 'điểm ngữ pháp';
      case 'Đọc hiểu': return 'bài đọc';
      case 'Nghe hiểu': return 'bài nghe';
      case 'Thi JLPT': return 'đề thi';
      default: return 'mục';
    }
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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 16, color: Colors.textSecondary }}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <MaterialCommunityIcons name="chart-line" size={20} color={Colors.secondaryHover} style={styles.subtitleIcon} />
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
            <Text style={styles.subjectSubtitle}>
              {summary.completed} cấp độ hoàn thành • {summary.inProgress} đang học
            </Text>
          </View>
        </View>

        {/* Level Details Title */}
        <Text style={styles.sectionTitle}>Chi tiết các cấp độ</Text>

        {/* Levels List */}
        <View style={styles.levelsListContainer}>
          {levels.map((level, index) => (
            <View key={index} style={[
              styles.levelCard,
              level.locked && styles.levelCardLocked,
              level.status === 'Hoàn thành' && styles.levelCardCompleted,
              level.status === 'Đang học' && styles.levelCardInProgress
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
                <View style={[
                  styles.statusIconContainer,
                  level.status === 'Hoàn thành' && styles.statusIconContainerCompleted
                ]}>
                  <Ionicons 
                    name={level.icon} 
                    size={24} 
                    color={level.status === 'Hoàn thành' ? Colors.secondaryHover : '#95D4EB'} 
                  />
                </View>
                <View style={styles.levelContent}>
                  <View style={styles.levelHeader}>
                    <View style={styles.levelInfo}>
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
        </View>

        {/* Continue Learning Card */}
        <View style={styles.continueLearningCard}>
          <View style={styles.continueLearningContent}>
            <Text style={styles.continueLearningTitle}>Tiếp tục học tập</Text>
            <Text style={styles.continueLearningText}>
              Hãy duy trì thói quen học mỗi ngày để tiến bộ nhanh hơn!
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.continueLearningButton} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Study')}
          >
            <Text style={styles.continueLearningButtonText}>Học tập</Text>
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
  scrollView: {
    flex: 1,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 17,
  },
  subtitleIcon: {
    marginRight: 2,
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
    marginTop: 12,
    marginLeft: 22,
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
  },
  levelsListContainer: {
    alignItems: 'center',
    width: '100%',
  },
  levelCard: {
    marginTop: 14,
    width: 346,
    minHeight: 134,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B5EAD7',
    alignSelf: 'center',
  },
  levelCardCompleted: {
    borderColor: '#B5EAD7',
  },
  levelCardInProgress: {
    borderColor: '#95D4EB',
  },
  levelCardLocked: {
    opacity: 0.5,
    borderColor: Colors.textPlaceholder,
  },
  statusIconContainer: {
    position: 'absolute',
    top: 16,
    left: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#95D4EB',
  },
  statusIconContainerCompleted: {
    borderColor: '#B5EAD7',
  },
  lockIcon: {
    position: 'absolute',
    top: 16,
    left: 14,
  },
  levelContent: {
    marginLeft: 50,
    paddingLeft: 0,
  },
  lockedContent: {
    marginLeft: 38,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  levelInfo: {
    // Container for level text and status
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
    marginLeft: -50,
    paddingLeft: 0,
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
    backgroundColor: '#E1E1E1',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFB7C5',
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
  continueLearningCard: {
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: '#FFE4DC',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueLearningContent: {
    flex: 1,
    marginRight: 12,
  },
  continueLearningTitle: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  continueLearningText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textPrimary,
  },
  continueLearningButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.secondaryHover,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  continueLearningButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 18,
    color: Colors.secondaryHover,
  },
  bottomSpacer: {
    height: 100,
  },
});
