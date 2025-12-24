import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import {
  getReadingLessonDetail,
  submitReadingAnswer,
} from "../../services/readingService";

export default function ReadingLessonScreen({ navigation, route }) {
  const { lessonId } = route.params;

  const [lesson, setLesson] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // ✅ mặc định hiển thị tiếng Nhật
  const [showOriginal, setShowOriginal] = useState(true);

  const [correctAnswerId, setCorrectAnswerId] = useState(null);

  useEffect(() => {
    loadLesson();
  }, []);

  const loadLesson = async () => {
    try {
      const data = await getReadingLessonDetail(lessonId);
      setLesson(data);
    } catch (err) {
      console.error("Load lesson failed", err);
    }
  };

  const question = lesson?.questions?.[0];

  const handleSubmit = async () => {
    try {
      const res = await submitReadingAnswer(
        question.id,
        selectedAnswer
      );
      setCorrectAnswerId(res.correct_choice_id);
      setShowResults(true);
    } catch (err) {
      console.error("Submit answer failed", err);
    }
  };

  if (!lesson) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* =====================
            READING TEXT
        ===================== */}
        <View style={styles.textBox}>
          <Text style={styles.readingText}>
            {showOriginal
              ? lesson.readings[0].content_japanese
              : lesson.readings[0].content_vietnamese}
          </Text>

          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => setShowOriginal(!showOriginal)}
          >
            <Text style={styles.toggleText}>
              {showOriginal
                ? "Xem bản dịch tiếng Việt"
                : "Xem bản gốc tiếng Nhật"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* =====================
            QUESTION
        ===================== */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{question.text}</Text>

          {question.choices.map((c) => {
            const isSelected = selectedAnswer === c.id;
            const isCorrect = showResults && c.id === correctAnswerId;
            const isWrong =
              showResults && isSelected && c.id !== correctAnswerId;

            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => !showResults && setSelectedAnswer(c.id)}
                style={styles.choiceRow}
                activeOpacity={0.7}
              >
                {/* ⭕ Trạng thái */}
                <View
                  style={[
                    styles.choiceCircle,
                    isSelected && styles.circleSelected,
                    isCorrect && styles.circleCorrect,
                    isWrong && styles.circleWrong,
                  ]}
                >
                  {isCorrect && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                  {isWrong && (
                    <Ionicons name="close" size={14} color="#fff" />
                  )}
                </View>

                <Text style={styles.choiceText}>{c.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* =====================
            ACTION BUTTON
        ===================== */}
        {!showResults ? (
          <TouchableOpacity
            style={[
              styles.submitButton,
              !selectedAnswer && { opacity: 0.5 },
            ]}
            onPress={handleSubmit}
            disabled={!selectedAnswer}
          >
            <Text style={styles.submitText}>Xem kết quả</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.submitText}>Hoàn thành</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

/* =====================
   STYLES
===================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  /* Reading */
  textBox: {
    backgroundColor: "#EAF9F3",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },

  readingText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#222",
  },

  toggleBtn: {
    marginTop: 10,
    alignSelf: "flex-end",
  },

  toggleText: {
    fontSize: 12,
    color: "#FF7A8A",
    fontWeight: "500",
  },

  /* Question */
  questionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },

  questionText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },

  choiceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  choiceCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CCC",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },

  circleSelected: {
    borderColor: "#FFB7C5",
    backgroundColor: "#FFB7C5",
  },

  circleCorrect: {
    borderColor: "#4CAF50",
    backgroundColor: "#4CAF50",
  },

  circleWrong: {
    borderColor: "#F44336",
    backgroundColor: "#F44336",
  },

  choiceText: {
    fontSize: 14,
    color: "#333",
  },

  /* Button */
  submitButton: {
    backgroundColor: "#FFB7C5",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
  },

  submitText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
