import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { getReadingLessons } from "../../services/readingService";

export default function ReadingLevelScreen({ navigation, route }) {
  const { category = "Đọc hiểu", level = "N5" } = route?.params || {};

  const [activeFilter, setActiveFilter] = useState("all");
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProgress, setTotalProgress] = useState(0);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    let isMounted = true;

    const fetchLessons = async () => {
      try {
        setLoading(true);
        const data = await getReadingLessons(level);

        if (!isMounted) return;

        // Map backend → UI props
        const mapped = data.lessons.map((lesson) => {
          let borderColor = "#E1E1E1";
          let buttonText = "Bắt đầu";
          let buttonColor = Colors.primary;

          if (lesson.status === "completed") {
            borderColor = Colors.secondary;
            buttonText = "Học lại";
            buttonColor = Colors.secondaryHover;
          } else if (lesson.status === "in-progress") {
            borderColor = "#95D4EB";
            buttonText = "Học tiếp";
            buttonColor = "#95D4EB";
          }

          return {
            ...lesson,
            borderColor,
            buttonText,
            buttonColor,
          };
        });

        setLessons(mapped);
        setTotalProgress(data.total_progress || 0);
      } catch (error) {
        console.error("❌ Fetch reading lessons error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLessons();

    return () => {
      isMounted = false;
    };
  }, [level]);

  // =========================
  // DERIVED DATA
  // =========================
  const completedCount = useMemo(
    () => lessons.filter((l) => l.status === "completed").length,
    [lessons]
  );

  const inProgressCount = useMemo(
    () => lessons.filter((l) => l.status === "in-progress").length,
    [lessons]
  );

  const notStartedCount = useMemo(
    () => lessons.filter((l) => l.status === "not-started").length,
    [lessons]
  );

  const filteredLessons = useMemo(() => {
    if (activeFilter === "all") return lessons;
    return lessons.filter((lesson) => lesson.status === activeFilter);
  }, [lessons, activeFilter]);

  // =========================
  // HANDLERS
  // =========================
  const handleLessonPress = (lessonId, lessonTitle) => {
    navigation.navigate("ReadingLesson", {
      category,
      level,
      lessonId,
      title: lessonTitle,
    });
  };

  // =========================
  // RENDER
  // =========================
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Tiến độ tổng thể</Text>
            <Text style={styles.progressPercent}>{Math.round(totalProgress)}%</Text>
          </View>

          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${totalProgress}%` }]} />
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
            {["all", "completed", "in-progress", "not-started"].map((key) => (
              <TouchableOpacity
                key={key}
                style={[styles.filterTab, activeFilter === key && styles.filterTabActive]}
                onPress={() => setActiveFilter(key)}
                activeOpacity={0.7}
              >
                {activeFilter === key && <View style={styles.filterHighlight} />}
                <Text style={styles.filterText}>
                  {key === "all"
                    ? "Tất cả"
                    : key === "completed"
                    ? "Hoàn thành"
                    : key === "in-progress"
                    ? "Đang học"
                    : "Chưa học"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Lessons List */}
        {filteredLessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            style={[styles.lessonCard, { borderColor: lesson.borderColor }]}
            activeOpacity={0.7}
            onPress={() => handleLessonPress(lesson.id, lesson.title)}
          >
            <View style={styles.lessonHeader}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: lesson.buttonColor }]}
                activeOpacity={0.7}
                onPress={() => handleLessonPress(lesson.id, lesson.title)}
              >
                <Ionicons name="play" size={16} color={Colors.white} />
                <Text style={styles.actionButtonText}>{lesson.buttonText}</Text>
              </TouchableOpacity>
            </View>

            {lesson.preview && (
              <Text style={styles.previewText}>{lesson.preview}</Text>
            )}

            <View style={styles.lessonInfo}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="text-box-outline"
                  size={18}
                  color="#C5B9E8"
                />
                <Text style={styles.infoText}>
                  Đọc hiểu ({lesson.reading_count || 0})
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="book-outline" size={18} color="#FFCBA4" />
                <Text style={styles.infoText}>
                  Bài tập ({lesson.exercise_count || 0})
                </Text>
              </View>
            </View>

            {lesson.status === "completed" ? (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.secondaryHover} />
                <Text style={styles.completedText}>Đã hoàn thành bài học và bài tập</Text>
              </View>
            ) : (
              <View style={styles.progressSection}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>Tiến độ</Text>
                  <Text style={styles.progressValue}>{lesson.progress || 0}%</Text>
                </View>
                <View style={styles.lessonProgressBarBgGray}>
                  <View
                    style={[
                      lesson.status === "in-progress"
                        ? styles.lessonProgressBarFill
                        : styles.lessonProgressBarFillGray,
                      { width: `${lesson.progress || 0}%` },
                    ]}
                  />
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
    height: 17,
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
    padding: 16,
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
    marginBottom: 4,
  },
  previewText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
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
    marginTop: 6,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 244, 231, 0.5)',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.secondaryHover,
  },
  completedText: {
    fontWeight: '400',
    fontSize: 11,
    color: '#63B37B',
  },
  progressSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.formStrokeDefault,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
    color: '#000000',
    fontWeight: '400',
  },
  progressValue: {
    fontSize: 10,
    color: '#000000',
    fontWeight: '400',
  },
  lessonProgressBarBgGray: {
    flex: 1,
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
