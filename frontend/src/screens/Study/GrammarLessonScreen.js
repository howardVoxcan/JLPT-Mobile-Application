import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import api from "../../services/api";

export default function GrammarLessonScreen({ navigation, route }) {
  const SKILL_LABELS = {
    grammar: "Ngữ pháp",
    vocab: "Từ vựng",
    kanji: "Kanji",
    reading: "Đọc hiểu",
    listening: "Nghe hiểu",
  };

  const { skill = "grammar", level = "N5", lessonId } = route?.params || {};

  const [activeTab, setActiveTab] = useState("grammar"); // grammar | practice
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  // result = { correct_count, total_questions, percent }
  const [submitted, setSubmitted] = useState(false);

  /* ======================
     LOAD LESSON DETAIL
     ====================== */
  useEffect(() => {
    let mounted = true;

    const fetchLesson = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/grammar/lessons/${lessonId}/`);
        if (mounted) setLesson(res.data);
      } catch (error) {
        console.error("Load grammar lesson error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchLesson();
    return () => {
      mounted = false;
    };
  }, [lessonId]);

  const handleBack = () => navigation.goBack();

  const handleAnswerSelect = (questionId, choiceId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  /* ======================
     RENDER GRAMMAR TAB
     ====================== */
  const renderGrammarTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.grammarTitleBox}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.contentText}>{lesson.content}</Text>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );

  /* ======================
     RENDER PRACTICE TAB
     ====================== */
  const renderPracticeTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {lesson.questions.map((q, index) => (
        <View key={q.id} style={styles.questionBox}>
          <Text style={styles.questionText}>
            {index + 1}. {q.prompt}
          </Text>

          {q.choices.map((choice) => {
            const selected = selectedAnswers[q.id] === choice.id;

            return (
              <TouchableOpacity
                key={choice.id}
                style={[styles.optionButton, selected && styles.optionSelected]}
                onPress={() => {
                  if (!submitted) {
                    handleAnswerSelect(q.id, choice.id);
                  }
                }}
                disabled={submitted}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {choice.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* ===== SUBMIT BUTTON ===== */}
      {!submitted && (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitAnswers}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? "Đang kiểm tra..." : "Kiểm tra đáp án"}
          </Text>
        </TouchableOpacity>
      )}

      {/* ===== RESULT ===== */}
      {submitted && result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            ✅ Đúng: {result.correct_count} / {result.total_questions}
          </Text>
          <Text style={styles.resultPercent}>🎯 {result.percent}%</Text>
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );

  const handleSubmitAnswers = async () => {
    try {
      setSubmitting(true);

      const res = await api.post("/grammar/submit/", {
        lesson_id: lesson.id,
        answers: selectedAnswers,
      });

      setResult(res.data);
      setSubmitted(true);
    } catch (error) {
      console.error("Submit answers error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  /* ======================
     LOADING
     ====================== */
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!lesson) return null;

  /* ======================
     MAIN RENDER
     ====================== */
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons
              name="chevron-back"
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {SKILL_LABELS[skill]} {level}
          </Text>
        </View>

        <View style={styles.contentCard}>
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "grammar" && styles.tabActive]}
              onPress={() => setActiveTab("grammar")}
            >
              <Text>Ngữ pháp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === "practice" && styles.tabActive]}
              onPress={() => setActiveTab("practice")}
            >
              <Text>Luyện tập</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.tabContent}>
            {activeTab === "grammar" ? renderGrammarTab() : renderPracticeTab()}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ======================
   STYLES (GIỮ NGUYÊN + BỔ SUNG NHẸ)
   ====================== */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  container: { flex: 1 },
  header: {
    height: 88,
    backgroundColor: Colors.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: { position: "absolute", left: 16, top: 52 },
  headerTitle: { fontSize: 24, fontWeight: "700" },

  contentCard: {
    flex: 1,
    margin: 14,
    backgroundColor: Colors.white,
    borderRadius: 16,
  },

  tabsContainer: { flexDirection: "row", height: 60 },
  tab: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabActive: { backgroundColor: Colors.primary },

  divider: { height: 0.5, backgroundColor: Colors.formStrokeDefault },
  tabContent: { flex: 1 },

  grammarTitleBox: { padding: 16 },
  lessonTitle: { fontSize: 18, fontWeight: "700" },

  contentBox: { paddingHorizontal: 16 },
  contentText: { fontSize: 15, lineHeight: 22 },

  questionBox: { padding: 16 },
  questionText: { fontWeight: "600", marginBottom: 8 },

  optionButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.formStrokeDefault,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  optionText: { fontSize: 14 },
  optionTextSelected: { fontWeight: "700" },

  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  submitButton: {
    margin: 16,
    padding: 14,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },

  submitButtonText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 16,
  },

  resultBox: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
  },

  resultText: {
    fontSize: 16,
    fontWeight: "600",
  },

  resultPercent: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "700",
  },
});
