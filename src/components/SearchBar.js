import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { FontSizes, FontWeights } from '../constants/Fonts';
import { Spacing } from '../constants/Spacing';

export const SearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = 'Nhật Bản, nihon, 日本',
  onFocus,
  onBlur,
  isFocused = false,
}) => {
  return (
    <View style={[styles.container, isFocused && styles.containerFocused]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textPlaceholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        autoCapitalize="none"
      />
      
      <TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
        <Ionicons name="search" size={24} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.textPlaceholder,
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
  },
  containerFocused: {
    borderColor: Colors.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.regular,
    color: Colors.textPrimary,
  },
  searchButton: {
    padding: Spacing.xs,
  },
});

