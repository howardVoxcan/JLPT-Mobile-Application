import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';

export const BackButton = ({ onPress, text = 'Quay lại trang chủ' }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name="chevron-back" size={20} color={Colors.primaryHover} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xxs,
    marginTop: Spacing.xxl,
  },
  text: {
    fontSize: FontSizes.regular,
    fontWeight: FontWeights.bold,
    color: Colors.primaryHover,
    marginLeft: Spacing.xs,
  },
});

