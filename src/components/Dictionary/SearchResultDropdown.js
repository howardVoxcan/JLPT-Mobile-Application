import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';

export const SearchResultDropdown = ({ results, onSelectResult }) => {
  if (!results || results.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
      >
        {results.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.resultItem,
              index < results.length - 1 && styles.resultItemBorder
            ]}
            onPress={() => onSelectResult(item)}
            activeOpacity={0.7}
          >
            <View style={styles.resultContent}>
              <View style={styles.resultHeader}>
                <Text style={styles.kanjiText}>{item.kanji}</Text>
                <Text style={styles.hiraganaText}>{item.hiragana}</Text>
              </View>
              <Text style={styles.meaningText}>{item.meaning}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Scrollbar */}
      <View style={styles.scrollbar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    maxHeight: 231,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  resultItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  resultItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.formStroke,
  },
  resultContent: {
    gap: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  kanjiText: {
    fontSize: 14,
    fontWeight: FontWeights.regular,
    color: Colors.textPrimary,
  },
  hiraganaText: {
    fontSize: 14,
    fontWeight: FontWeights.regular,
    color: Colors.textPrimary,
  },
  meaningText: {
    fontSize: 13,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
  },
  scrollbar: {
    position: 'absolute',
    right: 1,
    top: 0,
    width: 10,
    height: 40,
    backgroundColor: '#D9D9D9',
    borderRadius: 5,
  },
});

