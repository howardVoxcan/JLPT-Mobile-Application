import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";
import { FontSizes, FontWeights } from "../../constants/Fonts";
import { Spacing } from "../../constants/Spacing";

export const DictionaryDetail = ({ entry }) => {
  if (!entry) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.keyword}>
        {entry.keyword}
        {entry.reading ? ` (${entry.reading})` : ""}
      </Text>

      <Text style={styles.meaning}>{entry.meaning}</Text>

      {entry.extra ? <Text style={styles.extra}>{entry.extra}</Text> : null}

      {entry.jlpt_level ? (
        <Text style={styles.jlpt}>JLPT: {entry.jlpt_level}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  keyword: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  meaning: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
  },
  extra: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
  },
  jlpt: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.small,
    color: Colors.primary,
  },
});
