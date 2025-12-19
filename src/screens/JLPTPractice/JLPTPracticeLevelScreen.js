import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';

export default function JLPTPracticeLevelScreen({ navigation, route }) {
  const { level = 'N5' } = route?.params || {};

  // Mock data - danh sách test
  const tests = [
    {
      id: 1,
      title: 'Test 1',
      time: '140 phút',
      score: '95/180',
      hasScore: true,
      buttons: [
        { text: 'Thi lại', color: Colors.primary, action: 'retake' },
        { text: 'Xem kết quả', color: Colors.secondary, action: 'view' },
      ],
    },
    {
      id: 2,
      title: 'Test 2',
      time: '140 phút',
      score: null,
      hasScore: false,
      buttons: [
        { text: 'Bắt đầu thi', color: Colors.primary, action: 'start' },
      ],
    },
  ];

  const handleButtonPress = (testId, action) => {
    if (action === 'start' || action === 'retake') {
      navigation.navigate('JLPTPracticeTest', { testId, level });
    } else if (action === 'view') {
      // TODO: Navigate to results screen
      console.log(`View results for test ${testId}`);
    }
  };

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
        {tests.map((test) => (
          <View key={test.id} style={styles.testCard}>
            <Text style={styles.testTitle}>{test.title}</Text>

            {/* Time Row */}
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color="#1D1B20" />
              <Text style={styles.infoLabel}>Thời gian:</Text>
              <Text style={styles.infoValue}>{test.time}</Text>
            </View>

            {/* Score Row */}
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="trophy-outline" size={16} color="#1E1E1E" />
              <Text style={styles.infoLabel}>Điểm:</Text>
              {test.hasScore ? (
                <Text style={styles.infoValue}>{test.score}</Text>
              ) : (
                <View style={{ flex: 1 }} />
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonsRow}>
              {test.buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.actionButton, { backgroundColor: button.color }]}
                  onPress={() => handleButtonPress(test.id, button.action)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionButtonText}>{button.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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

