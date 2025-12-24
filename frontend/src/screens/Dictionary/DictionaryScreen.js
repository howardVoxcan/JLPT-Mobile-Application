import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { DictionaryHeader } from "../../components/Dictionary/DictionaryHeader";
import { SearchBar } from "../../components/Dictionary/SearchBar";
import { DictionaryTabs } from "../../components/Dictionary/DictionaryTabs";
import { SearchResultDropdown } from "../../components/Dictionary/SearchResultDropdown";
import { Colors } from "../../constants/Colors";
import { FontSizes, FontWeights } from "../../constants/Fonts";
import { Spacing } from "../../constants/Spacing";
import { DictionaryDetail } from "../../components/Dictionary/DictionaryDetail";
import {
  searchDictionary,
  getDictionaryDetail,
} from "../../services/dictionaryService";

export const DictionaryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("vocabulary");
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  const TAB_TYPE_MAP = {
    vocabulary: "vocab",
    grammar: "grammar",
    kanji: "kanji",
    translate: "sentence",
  };

  const debounceTimer = useRef(null);
  const handleSearch = (text) => {
    setSearchQuery(text);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      if (!text || text.trim().length === 0) {
        setSearchResults([]);
        return;
      }

      try {
        const backendType = TAB_TYPE_MAP[activeTab];
        const data = await searchDictionary(text, backendType);

        const mappedResults = data.map((item) => ({
          id: item.id,
          keyword: item.keyword,
          reading: item.reading,
          meaning: item.meaning,
          extra: item.extra,
          jlpt_level: item.jlpt_level,
        }));

        setSearchResults(mappedResults);
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      }
    }, 50);
  };

  useEffect(() => {
    if (searchQuery && !selectedEntry) {
      handleSearch(searchQuery);
    }
  }, [activeTab]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Delay để cho phép click vào dropdown trước khi đóng
    setTimeout(() => {
      setIsFocused(false);
    }, 150);
  };

  const handleSelectResult = (result) => {
  // Đóng dropdown
  setIsFocused(false);
  setSearchResults([]);

  // Hiển thị text đã chọn lên SearchBar
  setSearchQuery(result.keyword);

  // 🔥 HIỂN THỊ DETAIL NGAY TỪ KẾT QUẢ SEARCH
  setSelectedEntry({
    keyword: result.keyword,
    reading: result.reading,
    meaning: result.meaning,
    extra: result.extra ?? null,
    jlpt_level: result.jlpt_level ?? null,
  });
};


  const getSuggestionText = () => {
    switch (activeTab) {
      case "vocabulary":
        return "Gợi ý:\n• Dịch và phân tích đoạn văn: 朝食は1日の中で...\n• Tra Hiragana bằng cách viết thường: omoshiroi\n• Tra Katakana bằng cách viết hoa: Betonamu\n• Tra biến thể: たべません\n• Nhấn vào từ để nghe phát âm.\n• Bôi đen tiếng Nhật để hiện tìm kiếm nhanh.";
      case "grammar":
        return "Gợi ý:\n• Bạn chỉ cần gõ ngữ pháp để thực hiện tìm kiếm nhanh.\n• Ngữ pháp sẽ được tìm kiếm tức thì, phần nội dung tìm thấy sẽ được bôi vàng.\n• Nhấn vào ngữ pháp để xem thông tin chi tiết.";
      case "kanji":
        return "Gợi ý:\n• Nhấn vào âm On, Kun để nghe phát âm.\n• Nhấn vào dấu ⊞ trong mục phân tích để xem thành phần của Kanji.\n• Nhấn vào (bộ thủ) trong mục phân tích để xem thông tin về bộ thủ.";
      case "translate":
        return "Gợi ý:\n• Nhập câu tiếng Nhật hoặc tiếng Việt để dịch.\n• Nhấn vào từng từ trong câu để xem chi tiết.\n• Hệ thống sẽ tự động phát hiện ngôn ngữ.";
      default:
        return "";
    }
  };

  // Hiển thị dropdown khi ĐANG FOCUS và có kết quả
  const showDropdown = isFocused && searchResults.length > 0;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header - Fixed */}
        <DictionaryHeader onProfilePress={handleProfilePress} />

        {/* Search Container */}
        <View style={styles.searchContainer}>
          {/* Search Card with SearchBar, Tabs and Dropdown */}
          <View
            style={[styles.searchCard, showDropdown && styles.searchCardActive]}
          >
            {/* Search Bar */}
            <View style={styles.searchBarWrapper}>
              <SearchBar
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder={
                  activeTab === "vocabulary"
                    ? "Nhật Bản, nihon, 日本"
                    : activeTab === "grammar"
                    ? "が, nhưng"
                    : activeTab === "kanji"
                    ? "日, NHẬT"
                    : "日本語は面白いです。"
                }
                onFocus={handleFocus}
                onBlur={undefined}
                isFocused={showDropdown}
              />
            </View>

            {/* Tabs - Luôn hiển thị */}
            <View style={styles.tabsWrapper}>
              <DictionaryTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </View>

            {/* Search Results Dropdown - Bên trong searchCard, position absolute */}
            {showDropdown && (
              <View style={styles.dropdownOverlay}>
                <SearchResultDropdown
                  results={searchResults}
                  onSelectResult={handleSelectResult}
                />
              </View>
            )}
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {selectedEntry ? (
            <DictionaryDetail entry={selectedEntry} />
          ) : (
            <Text style={styles.suggestionText}>{getSuggestionText()}</Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
    paddingTop: Spacing.md,
  },
  searchContainer: {
    marginTop: -110,
    paddingHorizontal: 21,
    zIndex: 1000,
    elevation: 1000,
  },
  searchCard: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    overflow: "visible", // Cho phép dropdown hiển thị ra ngoài
  },
  searchCardActive: {
    // Khi dropdown active, giảm shadow
    shadowOpacity: 0.1,
  },
  tabsWrapper: {
    paddingHorizontal: 10,
    paddingBottom: 8,
    alignItems: "center",
  },
  searchBarWrapper: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  dropdownOverlay: {
    position: "absolute",
    top: 46, // paddingTop (8) + SearchBar height (38) = 46, kết nối trực tiếp với SearchBar
    left: Spacing.sm, // 8 - align với searchBarWrapper paddingHorizontal
    right: Spacing.sm, // 8
    zIndex: 9999,
    elevation: 9999,
  },
  suggestionText: {
    marginTop: Spacing.md,
    marginHorizontal: 14,
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.regular,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
});
