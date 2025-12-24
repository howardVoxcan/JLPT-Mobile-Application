import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { FontSizes, FontWeights } from "../../constants/Fonts";
import { Spacing } from "../../constants/Spacing";

export const SearchResultDropdown = ({ results, onSelectResult }) => {
  if (!results || results.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        {results.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.resultItem,
              index < results.length - 1 && styles.resultItemBorder,
            ]}
            onPress={() => onSelectResult(item)}
            activeOpacity={0.7}
          >
            <View style={styles.resultContent}>
              <View style={styles.resultHeader}>
                <Text style={styles.kanjiText}>{item.keyword}</Text>
                {item.reading ? (
                  <Text style={styles.hiraganaText}>{item.reading}</Text>
                ) : null}
                <Text style={styles.meaningText} numberOfLines={1}>
                  {item.meaning}
                </Text>
              </View>
              <Text style={styles.meaningText} numberOfLines={1}>
                {item.meaning}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 10,
    overflow: "hidden",
  },
  scrollView: {
    flexGrow: 0,
  },
  resultItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    minHeight: 43,
    justifyContent: "center",
  },
  resultItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.formStroke,
  },
  resultContent: {
    gap: 3,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  kanjiText: {
    fontSize: 14,
    fontWeight: FontWeights.regular,
    color: Colors.textPrimary,
    fontFamily: Platform.OS === "ios" ? "Nunito" : "Nunito-Regular",
  },
  hiraganaText: {
    fontSize: 14,
    fontWeight: FontWeights.regular,
    color: Colors.textPrimary,
    fontFamily: Platform.OS === "ios" ? "Nunito" : "Nunito-Regular",
  },
  meaningText: {
    fontSize: 13,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    fontFamily: Platform.OS === "ios" ? "Nunito" : "Nunito-Regular",
  },
});
