import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function VocabularyLevelScreen({ navigation, route }) {
  const { category = 'Từ vựng', level = 'N5' } = route?.params || {};
  const [activeFilter, setActiveFilter] = useState('all');

  const handleLessonPress = (unit, lesson) => {
    navigation.navigate('VocabularyFlashcard', { 
      category, 
      level,
      unit,
      lesson
    });
  };

  // Mock data - danh sách bài học từ vựng
  const lessons = [
    {
      id: 1,
      unit: 'Unit 01',
      lesson: 'Bài 1',
      title: 'Bài 1: Giới thiệu bản thân',
      wordCount: 20,
      status: 'completed',
      progress: 100,
      borderColor: Colors.secondary,
      buttonText: 'Học lại',
      buttonColor: Colors.secondaryHover,
    },
    {
      id: 2,
      unit: 'Unit 01',
      lesson: 'Bài 2',
      title: 'Bài 2: Gia đình',
      wordCount: 25,
      status: 'completed',
      progress: 100,
      borderColor: Colors.secondary,
      buttonText: 'Học lại',
      buttonColor: Colors.secondaryHover,
    },
    {
      id: 3,
      unit: 'Unit 02',
      lesson: 'Bài 1',
      title: 'Bài 1: Thời gian',
      wordCount: 30,
      status: 'in-progress',
      progress: 60,
      borderColor: '#95D4EB',
      buttonText: 'Học tiếp',
      buttonColor: '#95D4EB',
    },
    {
      id: 4,
      unit: 'Unit 02',
      lesson: 'Bài 2',
      title: 'Bài 2: Địa điểm',
      wordCount: 28,
      status: 'not-started',
      progress: 0,
      borderColor: '#E1E1E1',
      buttonText: 'Bắt đầu',
      buttonColor: Colors.primary,
    },
  ];

  const completedCount = lessons.filter(l => l.status === 'completed').length;
  const inProgressCount = lessons.filter(l => l.status === 'in-progress').length;
  const notStartedCount = lessons.filter(l => l.status === 'not-started').length;

  const totalProgress = (completedCount / lessons.length) * 100;

  const filteredLessons = lessons.filter(lesson => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return lesson.status === 'completed';
    if (activeFilter === 'in-progress') return lesson.status === 'in-progress';
    if (activeFilter === 'not-started') return lesson.status === 'not-started';
    return true;
  });

  return (
    <View style={styles.container}>
      <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Progress Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Tiến độ tổng thể</Text>
              <Text style={styles.progressPercent}>{Math.round(totalProgress)}%</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${totalProgress}%` }]} />
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="checkmark-done-circle-outline" size={20} color={Colors.success} />
                <Text style={styles.statText}>{completedCount} hoàn thành</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={20} color="#95D4EB" />
                <Text style={styles.statText}>{inProgressCount} đang học</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="book-outline" size={20} color={Colors.textPlaceholder} />
                <Text style={styles.statText}>{notStartedCount} chưa học</Text>
              </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterTabs}>
              <TouchableOpacity 
                style={[styles.filterTab, activeFilter === 'all' && styles.filterTabActive]}
                onPress={() => setActiveFilter('all')}
                activeOpacity={0.7}
              >
                {activeFilter === 'all' && <View style={styles.filterHighlight} />}
                <Text style={styles.filterText}>Tất cả</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.filterTab, activeFilter === 'completed' && styles.filterTabActive]}
                onPress={() => setActiveFilter('completed')}
                activeOpacity={0.7}
              >
                {activeFilter === 'completed' && <View style={styles.filterHighlight} />}
                <Text style={styles.filterText}>Hoàn thành</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.filterTab, activeFilter === 'in-progress' && styles.filterTabActive]}
                onPress={() => setActiveFilter('in-progress')}
                activeOpacity={0.7}
              >
                {activeFilter === 'in-progress' && <View style={styles.filterHighlight} />}
                <Text style={styles.filterText}>Đang học</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.filterTab, activeFilter === 'not-started' && styles.filterTabActive]}
                onPress={() => setActiveFilter('not-started')}
                activeOpacity={0.7}
              >
                {activeFilter === 'not-started' && <View style={styles.filterHighlight} />}
                <Text style={styles.filterText}>Chưa học</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Lessons List */}
          {filteredLessons.map((lesson) => (
            <TouchableOpacity 
              key={lesson.id}
              style={[styles.lessonCard, { borderColor: lesson.borderColor }]}
              activeOpacity={0.7}
              onPress={() => handleLessonPress(lesson.unit, lesson.lesson)}
            >
              <View style={styles.lessonHeader}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: lesson.buttonColor }]}
                  activeOpacity={0.7}
                  onPress={() => handleLessonPress(lesson.unit, lesson.lesson)}
                >
                  <Ionicons name="play" size={16} color={Colors.white} />
                  <Text style={styles.actionButtonText}>{lesson.buttonText}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.lessonInfo}>
                <View style={styles.infoItem}>
                  <Ionicons name="book-outline" size={20} color="#C5B9E8" />
                  <Text style={styles.infoText}>Từ vựng ({lesson.wordCount})</Text>
                </View>
              </View>

              {lesson.status === 'completed' ? (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>✓ Đã hoàn thành bài học</Text>
                </View>
              ) : lesson.status === 'in-progress' ? (
                <View style={styles.progressSection}>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>Tiến độ</Text>
                    <Text style={styles.progressValue}>{lesson.progress}%</Text>
                  </View>
                  <View style={styles.lessonProgressBarBgGray}>
                    <View style={[styles.lessonProgressBarFill, { width: `${lesson.progress}%` }]} />
                  </View>
                </View>
              ) : (
                <View style={styles.progressSection}>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>Tiến độ</Text>
                    <Text style={styles.progressValue}>{lesson.progress}%</Text>
                  </View>
                  <View style={styles.lessonProgressBarBgGray}>
                    <View style={[styles.lessonProgressBarFillGray, { width: `${lesson.progress}%` }]} />
                  </View>
                </View>
              )}
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
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 100,
  },
  progressCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000000',
  },
  progressPercent: {
    fontWeight: '400',
    fontSize: 13,
    color: '#000000',
  },
  progressBarBg: {
    width: '100%',
    height: 7,
    backgroundColor: Colors.formStrokeDefault,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontWeight: '400',
    fontSize: 13,
    color: '#000000',
  },
  filterTabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.primary,
    paddingTop: 12,
  },
  filterTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
    minHeight: 32,
    justifyContent: 'center',
  },
  filterTabActive: {
    backgroundColor: 'transparent',
  },
  filterHighlight: {
    position: 'absolute',
    width: '100%',
    height: 25,
    backgroundColor: Colors.primaryLight,
    borderRadius: 4,
    bottom: 6,
    alignSelf: 'center',
  },
  filterText: {
    fontWeight: '400',
    fontSize: 13,
    color: Colors.textSecondary,
    zIndex: 1,
  },
  lessonCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 5,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lessonTitle: {
    flex: 1,
    fontWeight: '700',
    fontSize: 16,
    color: '#000000',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    gap: 4,
  },
  actionButtonText: {
    fontWeight: '700',
    fontSize: 11,
    color: Colors.white,
  },
  lessonInfo: {
    flexDirection: 'row',
    gap: 35,
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  infoText: {
    fontWeight: '400',
    fontSize: 13,
    color: '#000000',
  },
  completedBadge: {
    backgroundColor: 'rgba(212, 244, 231, 0.5)',
    borderWidth: 1,
    borderColor: Colors.secondaryHover,
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  completedText: {
    fontWeight: '400',
    fontSize: 11,
    color: '#63B37B',
  },
  progressSection: {
    marginTop: 8,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontWeight: '400',
    fontSize: 11,
    color: '#000000',
  },
  progressValue: {
    fontWeight: '400',
    fontSize: 10,
    color: '#000000',
  },
  lessonProgressBarBgGray: {
    width: '100%',
    height: 7,
    backgroundColor: '#E1E1E1',
    borderRadius: 5,
    overflow: 'hidden',
  },
  lessonProgressBarFill: {
    height: '100%',
    backgroundColor: '#95D4EB',
    borderRadius: 5,
  },
  lessonProgressBarFillGray: {
    height: '100%',
    backgroundColor: '#E1E1E1',
    borderRadius: 5,
  },
});
