import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { getReadingLessons } from "../../services/readingService";

export default function ReadingLevelScreen({ navigation, route }) {
  const { category = "Đọc hiểu", level = "N5" } = route?.params || {};

  const [activeFilter, setActiveFilter] = useState("all");
  const [lessons, setLessons] = useState([]);
  const [totalProgress, setTotalProgress] = useState(0);

  useEffect(() => {
    loadLessons();
  }, [level]);

  const loadLessons = async () => {
    try {
      const data = await getReadingLessons(level);
      setLessons(data.lessons);
      setTotalProgress(data.total_progress);
    } catch (err) {
      console.error("Load reading lessons failed", err);
    }
  };

  const handleLessonPress = (lessonId, lessonTitle) => {
    navigation.navigate("ReadingLesson", {
      category,
      level,
      lessonId,
      title: lessonTitle,
    });
  };

  const filteredLessons = lessons.filter((lesson) => {
    if (activeFilter === "all") return true;
    return lesson.status === activeFilter;
  });

  const completedCount = lessons.filter(l => l.status === "completed").length;
  const inProgressCount = lessons.filter(l => l.status === "in-progress").length;
  const notStartedCount = lessons.filter(l => l.status === "not-started").length;

  const getLessonUI = (lesson) => {
    if (lesson.status === "completed") {
      return {
        borderColor: Colors.secondary,
        buttonText: "Học lại",
        buttonColor: Colors.secondaryHover,
      };
    }
    if (lesson.status === "in-progress") {
      return {
        borderColor: "#95D4EB",
        buttonText: "Học tiếp",
        buttonColor: "#95D4EB",
      };
    }
    return {
      borderColor: "#E1E1E1",
      buttonText: "Bắt đầu",
      buttonColor: Colors.primary,
    };
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Tiến độ tổng thể</Text>
            <Text>{Math.round(totalProgress)}%</Text>
          </View>

          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${totalProgress}%` },
              ]}
            />
          </View>

          <View style={styles.statsRow}>
            <Text>{completedCount} hoàn thành</Text>
            <Text>{inProgressCount} đang học</Text>
            <Text>{notStartedCount} chưa học</Text>
          </View>
        </View>

        {filteredLessons.map((lesson) => {
          const ui = getLessonUI(lesson);
          return (
            <TouchableOpacity
              key={lesson.id}
              style={[styles.lessonCard, { borderColor: ui.borderColor }]}
              onPress={() => handleLessonPress(lesson.id, lesson.title)}
            >
              <View style={styles.lessonHeader}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: ui.buttonColor }]}
                >
                  <Text style={styles.actionButtonText}>{ui.buttonText}</Text>
                </TouchableOpacity>
              </View>

              <Text>{lesson.preview}</Text>

              <Text>
                Đọc hiểu ({lesson.reading_count}) | Bài tập ({lesson.exercise_count})
              </Text>

              <Text>Tiến độ: {lesson.progress}%</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: Colors.backgroundSecondary, }, scrollContent: { paddingHorizontal: 24, paddingTop: 14, paddingBottom: 100, }, progressCard: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.primary, borderRadius: 5, padding: 14, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 5, }, progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, }, progressTitle: { fontWeight: '700', fontSize: 16, color: '#000000', }, progressPercent: { fontWeight: '400', fontSize: 13, color: '#000000', }, progressBarBg: { width: '100%', height: 7, backgroundColor: Colors.formStrokeDefault, borderRadius: 5, overflow: 'hidden', marginBottom: 10, }, progressBarFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 5, }, statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12, }, statItem: { flexDirection: 'row', alignItems: 'center', gap: 4, }, statText: { fontWeight: '400', fontSize: 13, color: '#000000', }, filterTabs: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.primary, paddingTop: 12, }, filterTab: { flex: 1, alignItems: 'center', paddingVertical: 8, position: 'relative', minHeight: 32, justifyContent: 'center', }, filterTabActive: { backgroundColor: 'transparent', }, filterHighlight: { position: 'absolute', width: '100%', height: 25, backgroundColor: Colors.primaryLight, borderRadius: 4, bottom: 6, alignSelf: 'center', }, filterText: { fontWeight: '400', fontSize: 13, color: Colors.textSecondary, zIndex: 1, }, lessonCard: { backgroundColor: Colors.white, borderWidth: 1, borderRadius: 5, padding: 14, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 5, }, lessonHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, }, lessonTitle: { flex: 1, fontWeight: '700', fontSize: 16, color: '#000000', }, actionButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, gap: 4, }, actionButtonText: { fontWeight: '700', fontSize: 11, color: Colors.white, }, readingText: { fontWeight: '400', fontSize: 13, color: '#000000', marginBottom: 10, }, lessonInfo: { flexDirection: 'row', gap: 35, marginBottom: 10, }, infoItem: { flexDirection: 'row', alignItems: 'center', gap: 7, }, infoText: { fontWeight: '400', fontSize: 13, color: '#000000', }, completedBadge: { backgroundColor: 'rgba(212, 244, 231, 0.5)', borderWidth: 1, borderColor: Colors.secondaryHover, borderRadius: 5, paddingVertical: 4, paddingHorizontal: 8, }, completedText: { fontWeight: '400', fontSize: 11, color: '#63B37B', }, progressSection: { marginTop: 8, }, progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, }, progressLabel: { fontWeight: '400', fontSize: 11, color: '#000000', }, progressValue: { fontWeight: '400', fontSize: 10, color: '#000000', }, lessonProgressBarBg: { width: '100%', height: 7, backgroundColor: Colors.formStrokeDefault, borderRadius: 5, overflow: 'hidden', }, lessonProgressBarFill: { height: '100%', backgroundColor: '#95D4EB', borderRadius: 5, }, lessonProgressBarBgGray: { width: '100%', height: 7, backgroundColor: '#E1E1E1', borderRadius: 5, overflow: 'hidden', }, lessonProgressBarFillGray: { height: '100%', backgroundColor: '#E1E1E1', borderRadius: 5, }, });
