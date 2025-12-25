import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
     PARSE CONTENT
     ====================== */
  const parseContent = () => {
    if (!lesson?.content) return { structure: '', meaning: '', examples: '' };
    
    const content = lesson.content.trim();
    
    // Tách các phần: Cấu trúc, Ý nghĩa, Ví dụ
    let structure = '';
    let meaning = '';
    let examples = '';
    
    // Tìm phần Cấu trúc (trước "Ý nghĩa" hoặc "Ví dụ")
    const meaningIndex = content.indexOf('Ý nghĩa');
    const exampleIndex = content.indexOf('Ví dụ');
    
    if (meaningIndex !== -1) {
      structure = content.substring(0, meaningIndex).trim();
    } else if (exampleIndex !== -1) {
      structure = content.substring(0, exampleIndex).trim();
    } else {
      structure = content;
    }
    
    // Tìm phần Ý nghĩa
    if (meaningIndex !== -1) {
      if (exampleIndex !== -1) {
        meaning = content.substring(meaningIndex + 7, exampleIndex).trim(); // +7 để bỏ "Ý nghĩa"
      } else {
        meaning = content.substring(meaningIndex + 7).trim();
      }
    }
    
    // Tìm phần Ví dụ
    if (exampleIndex !== -1) {
      examples = content.substring(exampleIndex + 5).trim(); // +5 để bỏ "Ví dụ"
    }
    
    // Làm sạch: loại bỏ các ký tự dư thừa ở đầu/cuối
    structure = structure.replace(/^[\s\n\r]+|[\s\n\r]+$/g, '');
    meaning = meaning.replace(/^[\s\n\r]+|[\s\n\r]+$/g, '');
    examples = examples.replace(/^[\s\n\r]+|[\s\n\r]+$/g, '');
    
    return { structure, meaning, examples };
  };

  /* ======================
     RENDER GRAMMAR TAB
     ====================== */
  const renderGrammarTab = () => {
    const { structure, meaning, examples } = parseContent();
    
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.grammarTitleBox}>
          <Text style={styles.grammarPointNumber}>
            {lesson.order}. {lesson.title}
          </Text>
        </View>

        {/* Cấu trúc */}
        {structure && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cấu trúc</Text>
            </View>
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{structure}</Text>
            </View>
          </>
        )}

        {/* Ý nghĩa */}
        {meaning && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ý nghĩa</Text>
            </View>
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{meaning}</Text>
            </View>
          </>
        )}

        {/* Ví dụ */}
        {examples && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ví dụ</Text>
            </View>
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{examples}</Text>
            </View>
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    );
  };

  /* ======================
     RENDER PRACTICE TAB
     ====================== */
  const renderPracticeTab = () => {
    const firstQuestion = lesson.questions[0];
    const instruction = firstQuestion?.prompt?.includes('選') 
      ? '問題１～５の文について、あとの１・２・３・４の中からいちばんいいものを一つ選（えら）びなさい。'
      : '';

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {instruction && (
          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        )}

        {lesson.questions.map((q, index) => (
          <View key={q.id} style={styles.questionCard}>
            <Text style={styles.questionPrompt}>{q.prompt}</Text>

            <View style={styles.choicesContainer}>
              {q.choices.map((choice, choiceIndex) => {
                const selected = selectedAnswers[q.id] === choice.id;

                return (
                  <View key={choice.id} style={styles.choiceWrapper}>
                    <TouchableOpacity
                      style={[styles.radioButton, selected && styles.radioButtonSelected]}
                      onPress={() => {
                        if (!submitted) {
                          handleAnswerSelect(q.id, choice.id);
                        }
                      }}
                      disabled={submitted}
                      activeOpacity={0.7}
                    >
                      {selected && <View style={styles.radioButtonInner} />}
                    </TouchableOpacity>
                    <Text style={styles.choiceNumber}>{choiceIndex + 1}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

      {/* ===== SUBMIT BUTTON ===== */}
      {!submitted && (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitAnswers}
          disabled={submitting}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? "Đang kiểm tra..." : "Kiểm tra đáp án"}
          </Text>
        </TouchableOpacity>
      )}

      {/* ===== RESULT ===== */}
      {submitted && result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Kết quả</Text>
          <Text style={styles.resultPercent}>{result.percent}%</Text>
          <Text style={styles.resultText}>
            Đúng: {result.correct_count} / {result.total_questions}
          </Text>
          <TouchableOpacity 
            style={styles.resultDetailButton}
            onPress={() => {
              navigation.navigate('GrammarResult', {
                result,
                lesson,
                answers: selectedAnswers,
                questions: lesson.questions,
              });
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.resultDetailButtonText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
    );
  };

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
        <View style={styles.contentCard}>
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "grammar" && styles.tabActive]}
              onPress={() => setActiveTab("grammar")}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === "grammar" && styles.tabTextActive]}>
                Ngữ pháp
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === "practice" && styles.tabActive]}
              onPress={() => setActiveTab("practice")}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === "practice" && styles.tabTextActive]}>
                Luyện tập
              </Text>
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
  safeArea: { 
    flex: 1, 
    backgroundColor: Colors.backgroundSecondary 
  },
  container: { flex: 1 },

  contentCard: {
    flex: 1,
    margin: 13,
    backgroundColor: Colors.white,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  tabsContainer: { 
    flexDirection: "row", 
    height: 33,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden',
  },
  tab: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  tabActive: { 
    backgroundColor: '#FFB7C5',
    shadowColor: '#5D00D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#343232',
  },
  tabTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },

  divider: { 
    height: 1, 
    backgroundColor: Colors.formStrokeDefault 
  },
  tabContent: { 
    flex: 1,
  },

  scrollContent: {
    padding: 16,
  },

  grammarTitleBox: { 
    backgroundColor: 'rgba(197, 185, 232, 0.5)',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderBottomWidth: 0,
    borderRadius: 5,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 12,
    marginBottom: 0,
  },

  grammarPointNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#343232',
    lineHeight: 22,
  },

  sectionHeader: {
    backgroundColor: 'rgba(255, 203, 164, 0.5)',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderBottomWidth: 0,
    borderRadius: 5,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 8,
    marginTop: 16,
    marginBottom: 0,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#343232',
    lineHeight: 19,
  },

  contentBox: { 
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderTopWidth: 0,
    borderRadius: 5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 12,
    marginBottom: 0,
  },
  contentText: { 
    fontSize: 14, 
    lineHeight: 19,
    color: '#000000',
  },

  instructionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    padding: 12,
    marginBottom: 16,
  },

  instructionText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textPrimary,
  },

  questionCard: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    padding: 16,
    marginBottom: 16,
  },

  questionHeader: {
    marginBottom: 12,
  },

  questionPrompt: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 16,
  },

  choicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 20,
  },

  choiceWrapper: {
    alignItems: 'center',
    gap: 8,
  },

  radioButton: {
    width: 12.11,
    height: 12.11,
    borderRadius: 6.05,
    borderWidth: 1.21,
    borderColor: '#7A7A7A',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },

  radioButtonSelected: {
    borderColor: '#7A7A7A',
  },

  radioButtonInner: {
    width: 9.08,
    height: 9.08,
    borderRadius: 4.54,
    backgroundColor: '#343232',
  },

  choiceNumber: {
    fontSize: 14.59,
    lineHeight: 20,
    color: '#343232',
  },

  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  submitButton: {
    marginTop: 24,
    marginBottom: 16,
    padding: 16,
    borderRadius: 15,
    backgroundColor: '#FFB7C5',
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },

  submitButtonText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 17,
  },

  resultBox: {
    marginTop: 24,
    marginBottom: 16,
    padding: 24,
    borderRadius: 15,
    backgroundColor: '#FFF5F7',
    alignItems: "center",
    borderWidth: 2,
    borderColor: '#FFB7C5',
  },

  resultText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },

  resultPercent: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: "700",
    color: '#FFB7C5',
  },

  resultDetailButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#FFB7C5',
  },

  resultDetailButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFB7C5',
  },
});
