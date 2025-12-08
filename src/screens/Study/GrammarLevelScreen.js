import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function GrammarLevelScreen({ navigation, route }) {
  const { category = 'Ngữ pháp', level = 'N5' } = route?.params || {};
  const [activeFilter, setActiveFilter] = useState('all');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLessonPress = (lessonId) => {
    navigation.navigate('GrammarLesson', { 
      category, 
      level, 
      lessonId 
    });
  };

  // Mock data - danh sách bài học
  const lessons = [
    {
      id: 1,
      title: 'Bài 1: Giới thiệu bản thân',
      grammar: 'は, です, か, は, です, か',
      grammarCount: 4,
      exerciseCount: 4,
      status: 'completed',
      progress: 100,
      borderColor: Colors.secondary,
      buttonText: 'Học lại',
      buttonColor: Colors.secondaryHover,
    },
    {
      id: 2,
      title: 'Bài 2: Giới thiệu bản thân',
      grammar: 'は, です, か, は, です, か',
      grammarCount: 4,
      exerciseCount: 4,
      status: 'completed',
      progress: 100,
      borderColor: Colors.secondary,
      buttonText: 'Học lại',
      buttonColor: Colors.secondaryHover,
    },
    {
      id: 3,
      title: 'Bài 3: Giới thiệu bản thân',
      grammar: 'は, です, か, は, です, か',
      grammarCount: 4,
      exerciseCount: 4,
      status: 'in-progress',
      progress: 60,
      borderColor: '#95D4EB',
      buttonText: 'Học tiếp',
      buttonColor: '#95D4EB',
    },
    {
      id: 4,
      title: 'Bài 4: Giới thiệu bản thân',
      grammar: 'は, です, か, は, です, か',
      grammarCount: 4,
      exerciseCount: 4,
      status: 'in-progress',
      progress: 60,
      borderColor: '#95D4EB',
      buttonText: 'Học tiếp',
      buttonColor: '#95D4EB',
    },
    {
      id: 5,
      title: 'Bài 5: Giới thiệu bản thân',
      grammar: 'は, です, か, は, です, か',
      grammarCount: 4,
      exerciseCount: 4,
      status: 'not-started',
      progress: 0,
      borderColor: Colors.formStrokeDefault,
      buttonText: 'Bắt đầu',
      buttonColor: Colors.primary,
    },
    {
      id: 6,
      title: 'Bài 6: Giới thiệu bản thân',
      grammar: 'は, です, か, は, です, か',
      grammarCount: 4,
      exerciseCount: 4,
      status: 'not-started',
      progress: 0,
      borderColor: Colors.formStrokeDefault,
      buttonText: 'Bắt đầu',
      buttonColor: Colors.primary,
    },
    {
      id: 7,
      title: 'Bài 7: Giới thiệu bản thân',
      grammar: 'は, です, か, は, です, か',
      grammarCount: 4,
      exerciseCount: 4,
      status: 'not-started',
      progress: 0,
      borderColor: Colors.formStrokeDefault,
      buttonText: 'Bắt đầu',
      buttonColor: Colors.primary,
    },
    {
      id: 8,
      title: 'Bài 8: Giới thiệu bản thân',
      grammar: 'は, です, か, は, です, か',
      grammarCount: 4,
      exerciseCount: 4,
      status: 'not-started',
      progress: 0,
      borderColor: Colors.formStrokeDefault,
      buttonText: 'Bắt đầu',
      buttonColor: Colors.primary,
    },
  ];

  const completedCount = lessons.filter(l => l.status === 'completed').length;
  const inProgressCount = lessons.filter(l => l.status === 'in-progress').length;
  const notStartedCount = lessons.filter(l => l.status === 'not-started').length;

  const totalProgress = (completedCount / lessons.length) * 100;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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
          <Text style={styles.headerTitle}>{category} {level}</Text>
        </View>

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
          {lessons.map((lesson) => (
            <TouchableOpacity 
              key={lesson.id}
              style={[styles.lessonCard, { borderColor: lesson.borderColor }]}
              activeOpacity={0.7}
              onPress={() => handleLessonPress(lesson.id)}
            >
              <View style={styles.lessonHeader}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: lesson.buttonColor }]}
                  activeOpacity={0.7}
                  onPress={() => handleLessonPress(lesson.id)}
                >
                  <Ionicons name="play" size={16} color={Colors.white} />
                  <Text style={styles.actionButtonText}>{lesson.buttonText}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.grammarText}>{lesson.grammar}</Text>

              <View style={styles.lessonInfo}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="text-box-outline" size={20} color="#C5B9E8" />
                  <Text style={styles.infoText}>Ngữ pháp ({lesson.grammarCount})</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="book-outline" size={20} color="#FFCBA4" />
                  <Text style={styles.infoText}>Bài tập ({lesson.exerciseCount})</Text>
                </View>
              </View>

              {lesson.status === 'completed' ? (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>✓ Đã hoàn thành bài học và bài tập</Text>
                </View>
              ) : lesson.status === 'in-progress' ? (
                <View style={styles.progressSection}>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>Tiến độ</Text>
                    <Text style={styles.progressValue}>{lesson.progress}%</Text>
                  </View>
                  <View style={styles.lessonProgressBarBg}>
                    <View style={[styles.lessonProgressBarFill, { width: `${lesson.progress}%` }]} />
                  </View>
                </View>
              ) : null}
            </TouchableOpacity>
          ))}

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
    fontWeight: '700',
    fontSize: 24,
    color: Colors.textPrimary,
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
    paddingVertical: 6,
    position: 'relative',
  },
  filterTabActive: {
    backgroundColor: 'transparent',
  },
  filterHighlight: {
    position: 'absolute',
    width: '90%',
    height: 20,
    backgroundColor: Colors.primaryLight,
    borderRadius: 4,
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
  grammarText: {
    fontWeight: '400',
    fontSize: 13,
    color: '#000000',
    marginBottom: 10,
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
  lessonProgressBarBg: {
    width: '100%',
    height: 7,
    backgroundColor: Colors.formStrokeDefault,
    borderRadius: 5,
    overflow: 'hidden',
  },
  lessonProgressBarFill: {
    height: '100%',
    backgroundColor: '#95D4EB',
    borderRadius: 5,
  },
});

