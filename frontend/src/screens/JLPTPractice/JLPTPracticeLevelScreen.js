import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { getJLPTTests } from '../../services/jlptPracticeService';

export default function JLPTPracticeLevelScreen({ navigation, route }) {
  const { level = 'N5' } = route?.params || {};
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, [level]);

  const loadTests = async () => {
    try {
      setLoading(true);
      const data = await getJLPTTests(level);
      setTests(data);
    } catch (error) {
      console.error('Error loading tests:', error);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonPress = (test, action, lastAttemptId = null) => {
    if (action === 'start' || action === 'retake') {
      navigation.navigate('JLPTPracticeTest', { 
        testId: test.id, 
        level: test.level 
      });
    } else if (action === 'view') {
      if (lastAttemptId) {
        navigation.navigate('JLPTPracticeResult', { 
          attemptId: lastAttemptId,
          testId: test.id,
          level: test.level 
        });
      }
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 16, color: Colors.textSecondary }}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Thi thử JLPT / JLPT {level}</Text>
        </View>

        {/* Test Cards */}
        {tests.map((test) => {
          const hasAttempted = test.has_attempted;
          const bestScore = test.user_best_score;
          
          return (
            <View key={test.id} style={styles.testCard}>
              <Text style={styles.testTitle}>{test.title}</Text>

              {/* Time Row */}
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color="#1D1B20" />
                <Text style={styles.infoLabel}>Thời gian:</Text>
                <Text style={styles.infoValue}>{test.duration_minutes} phút</Text>
              </View>

              {/* Score Row */}
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="trophy-outline" size={16} color="#1E1E1E" />
                <Text style={styles.infoLabel}>Điểm:</Text>
                {hasAttempted && bestScore !== null ? (
                  <Text style={styles.infoValue}>{bestScore}/{test.total_score}</Text>
                ) : (
                  <View style={{ flex: 1 }} />
                )}
              </View>

              {/* Buttons */}
              <View style={styles.buttonsRow}>
                {hasAttempted ? (
                  <>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: Colors.primary }]}
                      onPress={() => handleButtonPress(test, 'retake')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.actionButtonText}>Thi lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: Colors.secondary }]}
                      onPress={() => handleButtonPress(test, 'view', test.last_attempt_id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.actionButtonText}>Xem kết quả</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: Colors.primary }]}
                    onPress={() => handleButtonPress(test, 'start')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.actionButtonText}>Bắt đầu thi</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        {tests.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: Colors.textSecondary }}>
              Chưa có đề thi nào cho level {level}
            </Text>
          </View>
        )}

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
    paddingHorizontal: 17,
    paddingTop: 15,
  },
  subtitleContainer: {
    marginBottom: 15,
  },
  subtitle: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 14,
    color: Colors.textSecondary,
  },
  testCard: {
    width: 360,
    minHeight: 134,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  testTitle: {
    fontFamily: 'Nunito',
    fontWeight: '800',
    fontSize: 20,
    lineHeight: 27,
    color: Colors.textPrimary,
    marginBottom: 11,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
    gap: 10,
  },
  infoLabel: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
  },
  infoValue: {
    fontFamily: 'Nunito',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
    marginLeft: 'auto',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 12,
    gap: 119,
  },
  actionButton: {
    width: 100,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  actionButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 16,
    color: Colors.white,
  },
});
