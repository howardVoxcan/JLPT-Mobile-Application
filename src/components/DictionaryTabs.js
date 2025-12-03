import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { FontSizes, FontWeights } from '../constants/Fonts';
import { Spacing } from '../constants/Spacing';

export const DictionaryTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'vocabulary', label: 'Từ vựng' },
    { id: 'grammar', label: 'Ngữ pháp' },
    { id: 'kanji', label: 'Hán tự' },
    { id: 'translate', label: 'Dịch câu' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => onTabChange(tab.id)}
          activeOpacity={0.7}
        >
          <View style={[
            styles.tabInner,
            activeTab === tab.id && styles.tabActive
          ]}>
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.tabTextActive
            ]}>
              {tab.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 0,
  },
  tab: {
    height: 30,
    backgroundColor: Colors.white,
  },
  tabInner: {
    height: '100%',
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  tabActive: {
    backgroundColor: Colors.primaryLight,
  },
  tabText: {
    fontSize: 13,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  tabTextActive: {
    color: Colors.textSecondary,
  },
});

