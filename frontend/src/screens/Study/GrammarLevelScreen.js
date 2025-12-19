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
                  ? Colors.secondary
                  : status === "in-progress"
                  ? "#95D4EB"
                  : Colors.formStrokeDefault,
              buttonText:
                status === "completed"
                  ? "Học lại"
                  : status === "in-progress"
                  ? "Học tiếp"
                  : "Bắt đầu",
              buttonColor:
                status === "completed"
                  ? Colors.secondaryHover
                  : status === "in-progress"
                  ? "#95D4EB"
                  : Colors.primary,
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
              <Text>{completedCount} hoàn thành</Text>
              <Text>{inProgressCount} đang học</Text>
              <Text>{notStartedCount} chưa học</Text>
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

              {/* ✅ TIẾN TRÌNH THEO ĐÚNG / TỔNG */}
              <View style={styles.progressRow}>
                <Text style={styles.progressText}>
                  {lesson.correctCount}/{lesson.totalQuestions} câu đúng
                </Text>
                <Text style={styles.progressText}>{lesson.percent}%</Text>
              </View>

              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${lesson.percent}%` },
                  ]}
                />
              </View>

              <View style={styles.lessonInfo}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="text-box-outline"
                    size={20}
                    color="#C5B9E8"
                  />
                  <Text style={styles.infoText}>
                    Ngữ pháp ({lesson.grammarCount})
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Ionicons name="book-outline" size={20} color="#FFCBA4" />
                  <Text style={styles.infoText}>
                    Bài tập ({lesson.totalQuestions})
                  </Text>
                </View>
              </View>
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

  header: {
    width: "100%",
    height: 88,
    backgroundColor: Colors.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 52,
  },
  headerTitle: {
    fontWeight: "700",
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
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  progressBarBg: {
    height: 7,
    backgroundColor: Colors.formStrokeDefault,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  lessonCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 5,
    padding: 14,
    marginBottom: 14,
  },

  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  lessonTitle: {
    fontWeight: "700",
    fontSize: 16,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    gap: 4,
  },

  actionButtonText: {
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
    fontSize: 13,
  },
});
