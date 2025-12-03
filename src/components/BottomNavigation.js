import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { FontSizes, FontWeights } from '../constants/Fonts';
import { Spacing } from '../constants/Spacing';

export const BottomNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dictionary', label: 'Từ điển', icon: 'book-outline' },
    { id: 'study', label: 'Học tập', icon: 'school-outline' },
    { id: 'support', label: 'Hỗ trợ', icon: 'bulb-outline' },
    { id: 'practice', label: 'Luyện thi', icon: 'document-text-outline' },
    { id: 'profile', label: 'Cá nhân', icon: 'person-circle-outline' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.tabActive
            ]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={tab.icon} 
              size={32} 
              color={activeTab === tab.id ? Colors.secondaryHover : Colors.textSecondary} 
            />
            <Text style={[
              styles.tabLabel,
              activeTab === tab.id && styles.tabLabelActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: Colors.backgroundSecondary,
  },
  separator: {
    height: 2,
    backgroundColor: Colors.secondary,
  },
  tabsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    gap: 12,
    alignItems: 'flex-end',
    paddingBottom: 17,
  },
  tab: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  tabActive: {
    borderWidth: 1,
    borderColor: Colors.secondaryHover,
    borderStyle: 'dashed',
    borderRadius: 4,
    paddingTop: 2,
  },
  tabLabel: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: Colors.secondaryHover,
  },
});

