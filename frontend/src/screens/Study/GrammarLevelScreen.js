import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { getGrammarLessons } from "../../services/grammarService";

/**
 * Map skill key -> label tiếng Việt (chỉ dùng cho UI)
 */
const SKILL_LABELS = {
  grammar: "Ngữ pháp",
  vocab: "Từ vựng",
  kanji: "Kanji",
  reading: "Đọc hiểu",
  listening: "Nghe hiểu",
};

export default function GrammarLevelScreen({ navigation, route }) {
  const { skill = "grammar", level = "N5" } = route?.params || {};

  const [activeFilter, setActiveFilter] = useState("all");
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLessonPress = (lessonId) => {
    navigation.navigate("GrammarLesson", {
      lessonId,
      level,
      skill,
    });
  };

  /* ======================
     LOAD DATA FROM API
     ====================== */
  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      (async () => {
        try {
          setLoading(true);
          const res = await getGrammarLessons(level);
          if (!mounted) return;

          const mappedLessons = res.data.map((item) => {
            const progress = item.progress;
            const total = progress?.total_questions || 0;
            const correct = progress?.correct_count || 0;

            let status = "not-started";
            let percent = 0;

            if (progress && total > 0) {
              percent = Math.round((correct / total) * 100);

              if (correct === 0) status = "not-started";
              else if (correct === total) status = "completed";
              else status = "in-progress";
            }

            return {
              id: item.id,
              title: `Bài ${item.order}: ${item.title}`,
              grammarCount: item.grammar_point_count,
              correctCount: correct,
              totalQuestions: total,
              percent,
              status,
              borderColor:
                status === "completed"
                  ? "#B5EAD7"
                  : status === "in-progress"
                  ? "#95D4EB"
                  : "#E1E1E1",
              buttonText:
                status === "completed"
                  ? "Học lại"
                  : status === "in-progress"
                  ? "Học tiếp"
                  : "Bắt đầu",
              buttonColor:
                status === "completed"
                  ? "#9CD9C3"
                  : status === "in-progress"
                  ? "#95D4EB"
                  : "#FFB7C5",
            };
          });

          setLessons(mappedLessons);
        } catch (err) {
          console.log("Reload lessons error:", err);
        } finally {
          setLoading(false);
        }
      })();

      return () => {
        mounted = false;
      };
    }, [level])
  );

  /* ======================
     FILTER + STATS
     ====================== */
  const filteredLessons =
    activeFilter === "all"
      ? lessons
      : lessons.filter((l) => l.status === activeFilter);

  const completedCount = lessons.filter((l) => l.status === "completed").length;
  const inProgressCount = lessons.filter(
    (l) => l.status === "in-progress"
  ).length;
  const notStartedCount = lessons.filter(
    (l) => l.status === "not-started"
  ).length;

  const totalProgress =
    lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text>Đang tải bài học...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Progress Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Tiến độ tổng thể</Text>
              <Text style={styles.progressPercent}>
                {Math.round(totalProgress)}%
              </Text>
            </View>

            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${totalProgress}%` }]}
              />
            </View>

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
              onPress={() => handleLessonPress(lesson.id)}
            >
              <View style={styles.lessonHeader}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: lesson.buttonColor },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handleLessonPress(lesson.id)}
                >
                  <Ionicons name="play" size={16} color={Colors.white} />
                  <Text style={styles.actionButtonText}>
                    {lesson.buttonText}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.lessonSubtitle} numberOfLines={1}>
                {lesson.grammarExamples || 'は、です、か、は、です、か'}
              </Text>

              <View style={styles.lessonInfo}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="text-box-outline"
                    size={18}
                    color="#C5B9E8"
                  />
                  <Text style={styles.infoText}>
                    Ngữ pháp ({lesson.grammarCount})
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Ionicons name="book-outline" size={18} color="#FFCBA4" />
                  <Text style={styles.infoText}>
                    Bài tập ({lesson.totalQuestions})
                  </Text>
                </View>
              </View>

              {lesson.status === 'completed' && (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.secondaryHover} />
                  <Text style={styles.completedText}>Đã hoàn thành bài học và bài tập</Text>
                </View>
              )}

              {lesson.status === 'in-progress' && (
                <View style={styles.progressInfo}>
                  <Text style={styles.progressInfoText}>Tiến độ</Text>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBgSmall}>
                      <View style={[styles.progressBarFillSmall, { width: `${lesson.percent}%` }]} />
                    </View>
                    <Text style={styles.progressInfoValue}>{lesson.percent}%</Text>
                  </View>
                </View>
              )}
              
              {lesson.status === 'not-started' && (
                <View style={styles.progressInfo}>
                  <Text style={styles.progressInfoText}>Tiến độ</Text>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBgSmall}>
                      <View style={[styles.progressBarFillSmall, { width: '0%' }]} />
                    </View>
                    <Text style={styles.progressInfoValue}>0%</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ======================
   STYLES
   ====================== */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  container: { flex: 1 },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 100,
  },

  progressCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFB7C5',
    borderRadius: 5,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    height: 7,
    backgroundColor: Colors.formStrokeDefault,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: '#FFB7C5',
    borderRadius: 5,
    minWidth: 0,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
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
    borderTopColor: '#FFB7C5',
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
    height: 17,
    backgroundColor: '#FFE4DC',
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
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },

  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: 8,
  },

  lessonTitle: {
    flex: 1,
    fontWeight: "700",
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },

  lessonSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    gap: 4,
  },

  actionButtonText: {
    fontWeight: "700",
    fontSize: 11,
    color: Colors.white,
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  progressText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  lessonInfo: {
    flexDirection: "row",
    gap: 35,
    marginTop: 6,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  infoText: {
    fontWeight: '400',
    fontSize: 13,
    color: '#000000',
  },

  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 244, 231, 0.5)',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#9CD9C3',
  },

  completedText: {
    fontWeight: '400',
    fontSize: 12,
    color: Colors.secondaryHover,
  },

  progressInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.formStrokeDefault,
  },

  progressInfoText: {
    fontSize: 11,
    color: '#000000',
    marginBottom: 4,
  },

  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  progressBarBgSmall: {
    flex: 1,
    height: 7,
    backgroundColor: '#E1E1E1',
    borderRadius: 5,
    overflow: 'hidden',
  },

  progressBarFillSmall: {
    height: '100%',
    backgroundColor: '#95D4EB',
    borderRadius: 5,
  },

  progressInfoValue: {
    fontSize: 10,
    fontWeight: '400',
    color: '#000000',
    minWidth: 22,
  },
});
