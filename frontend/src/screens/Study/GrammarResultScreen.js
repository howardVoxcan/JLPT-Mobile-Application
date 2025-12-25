import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

export default function GrammarResultScreen({ navigation, route }) {
  const { result, lesson, answers, questions } = route?.params || {};

  const handleBack = () => {
    navigation.goBack();
  };

  const getQuestionResult = (questionId) => {
    const selectedChoiceId = answers[questionId];
    const question = questions?.find((q) => q.id === questionId);
    if (!question) return null;

    const selectedChoice = question.choices?.find((c) => c.id === selectedChoiceId);
    const correctChoice = question.choices?.find((c) => c.is_correct);

    return {
      question,
      selectedChoice,
      correctChoice,
      isCorrect: correctChoice?.id === selectedChoiceId,
    };
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kết quả bài tập</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Tổng kết</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>
                {result?.correct_count || 0} / {result?.total_questions || 0}
              </Text>
              <Text style={styles.scoreLabel}>câu đúng</Text>
            </View>
            <View style={styles.percentContainer}>
              <Text style={styles.percentText}>{result?.percent || 0}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${result?.percent || 0}%` },
                ]}
              />
            </View>
          </View>

          {/* Questions Detail */}
          <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>Chi tiết từng câu</Text>
            {questions?.map((q, index) => {
              const questionResult = getQuestionResult(q.id);
              if (!questionResult) return null;

              return (
                <View key={q.id} style={styles.questionDetailCard}>
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionNumber}>Câu {index + 1}</Text>
                    {questionResult.isCorrect ? (
                      <View style={styles.correctBadge}>
                        <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                        <Text style={styles.correctText}>Đúng</Text>
                      </View>
                    ) : (
                      <View style={styles.incorrectBadge}>
                        <Ionicons name="close-circle" size={20} color="#F4899E" />
                        <Text style={styles.incorrectText}>Sai</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.questionPrompt}>{q.prompt}</Text>

                  <View style={styles.choicesContainer}>
                    {q.choices?.map((choice, choiceIndex) => {
                      const isSelected = choice.id === questionResult.selectedChoice?.id;
                      const isCorrect = choice.is_correct;

                      return (
                        <View
                          key={choice.id}
                          style={[
                            styles.choiceItem,
                            isSelected && styles.choiceItemSelected,
                            isCorrect && styles.choiceItemCorrect,
                            isSelected && !isCorrect && styles.choiceItemWrong,
                          ]}
                        >
                          <View style={styles.choiceNumberContainer}>
                            <Text style={styles.choiceNumber}>{choiceIndex + 1}</Text>
                          </View>
                          <Text style={styles.choiceText}>{choice.text}</Text>
                          {isCorrect && (
                            <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                          )}
                          {isSelected && !isCorrect && (
                            <Ionicons name="close-circle" size={18} color="#F4899E" />
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.secondaryLight,
    borderBottomWidth: 2,
    borderBottomColor: Colors.secondary,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 36,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: "center",
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.primary,
  },
  scoreLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  percentContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  percentText: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.formStrokeDefault,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  detailSection: {
    marginTop: 8,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  questionDetailCard: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.formStrokeDefault,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  correctBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(127, 222, 173, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  correctText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.success,
  },
  incorrectBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(244, 137, 158, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  incorrectText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#F4899E",
  },
  questionPrompt: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  choicesContainer: {
    gap: 10,
  },
  choiceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.formStrokeDefault,
    backgroundColor: Colors.white,
  },
  choiceItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(255, 183, 197, 0.1)",
  },
  choiceItemCorrect: {
    borderColor: Colors.success,
    backgroundColor: "rgba(127, 222, 173, 0.1)",
  },
  choiceItemWrong: {
    borderColor: "#F4899E",
    backgroundColor: "rgba(244, 137, 158, 0.1)",
  },
  choiceNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.formStrokeDefault,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  choiceNumber: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  choiceText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  actionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: Colors.formStrokeDefault,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
  },
});

