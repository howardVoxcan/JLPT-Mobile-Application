import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DictionaryHeader } from '../../components/Dictionary/DictionaryHeader';
import { SearchBar } from '../../components/Dictionary/SearchBar';
import { DictionaryTabs } from '../../components/Dictionary/DictionaryTabs';
import { SearchResultDropdown } from '../../components/Dictionary/SearchResultDropdown';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';

export const DictionaryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('vocabulary');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  // Mock search results
  const mockResults = {
    'hi': [
      { kanji: '火', hiragana: 'ひ', meaning: 'lửa, ngọn lửa, đám cháy' },
      { kanji: '日', hiragana: 'ひ', meaning: 'ngày, các ngày' },
      { kanji: '灯', hiragana: 'ひ', meaning: 'ánh sáng, đèn' },
      { kanji: '妃', hiragana: 'ひ', meaning: 'công chúa, phi tần' },
      { kanji: '比', hiragana: 'ひ', meaning: 'tỷ lệ, tỉ lệ' },
    ],
    'youni': [
      { kanji: 'ように', hiragana: 'N3', meaning: 'Hãy làm.../Đừng làm' },
      { kanji: 'ように', hiragana: 'N3', meaning: 'Như/Theo như...' },
      { kanji: 'ように', hiragana: 'N4', meaning: 'Để/Để tránh' },
      { kanji: 'ようにする・ようにしている', hiragana: 'N4', meaning: 'Chắc chắn làm..., cố gắng làm...' },
      { kanji: 'ようになている', hiragana: 'N4', meaning: 'Được, để' },
    ],
    'nhật': [
      { kanji: '日本', hiragana: 'にほん', meaning: 'nhật bản' },
      { kanji: '日本', hiragana: 'にっぽん', meaning: 'nhật bản' },
      { kanji: '日本化', hiragana: 'にほんか', meaning: 'nhật bản hóa' },
      { kanji: '日本語', hiragana: 'にほんご', meaning: 'tiếng nhật' },
      { kanji: '日本学', hiragana: 'にほんがく', meaning: 'nhật bản học' },
    ],
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    
    if (text.trim().length > 0) {
      // Simulate search
      const lowerText = text.toLowerCase();
      if (mockResults[lowerText]) {
        setSearchResults(mockResults[lowerText]);
      } else {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Keep focused if there are results
    if (searchResults.length === 0) {
      setIsFocused(false);
    }
  };

  const handleSelectResult = (result) => {
    console.log('Selected:', result);
    setIsFocused(false);
    setSearchResults([]);
  };

  const getSuggestionText = () => {
    switch (activeTab) {
      case 'vocabulary':
        return 'Gợi ý:\n• Dịch và phân tích đoạn văn: 朝食は1日の中で...\n• Tra Hiragana bằng cách viết thường: omoshiroi\n• Tra Katakana bằng cách viết hoa: Betonamu\n• Tra biến thể: たべません\n• Nhấn vào từ để nghe phát âm.\n• Bôi đen tiếng Nhật để hiện tìm kiếm nhanh.';
      case 'grammar':
        return 'Gợi ý:\n• Bạn chỉ cần gõ ngữ pháp để thực hiện tìm kiếm nhanh.\n• Ngữ pháp sẽ được tìm kiếm tức thì, phần nội dung tìm thấy sẽ được bôi vàng.\n• Nhấn vào ngữ pháp để xem thông tin chi tiết.';
      case 'kanji':
        return 'Gợi ý:\n• Nhấn vào âm On, Kun để nghe phát âm.\n• Nhấn vào dấu ⊞ trong mục phân tích để xem thành phần của Kanji.\n• Nhấn vào (bộ thủ) trong mục phân tích để xem thông tin về bộ thủ.';
      case 'translate':
        return 'Gợi ý:\n• Nhập câu tiếng Nhật hoặc tiếng Việt để dịch.\n• Nhấn vào từng từ trong câu để xem chi tiết.\n• Hệ thống sẽ tự động phát hiện ngôn ngữ.';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <DictionaryHeader onProfilePress={handleProfilePress} />

          {/* Search Container */}
          <View style={styles.searchContainer}>
            <View style={styles.searchCard}>


              {/* Search Bar */}
              <View style={styles.searchBarWrapper}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={handleSearch}
                  placeholder={
                    activeTab === 'vocabulary' ? 'Nhật Bản, nihon, 日本' :
                    activeTab === 'grammar' ? 'が, nhưng' :
                    activeTab === 'kanji' ? '日, NHẬT' :
                    '日本語は面白いです。'
                  }
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  isFocused={isFocused && searchResults.length > 0}
                />
                
                {/* Search Results Dropdown */}
                {isFocused && searchResults.length > 0 && (
                  <SearchResultDropdown
                    results={searchResults}
                    onSelectResult={handleSelectResult}
                  />
                )}
              </View>
              {/* Tabs */}
              <View style={styles.tabsWrapper}>
                <DictionaryTabs 
                  activeTab={activeTab} 
                  onTabChange={setActiveTab} 
                />
              </View>
            </View>
          </View>

          {/* Suggestions */}
          <Text style={styles.suggestionText}>
            {getSuggestionText()}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  searchContainer: {
    marginTop: -50,
    paddingHorizontal: 21,
  },
  searchCard: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    overflow: 'visible',
  },
  tabsWrapper: {
    paddingHorizontal: 10,
    paddingTop: 51,
    paddingBottom: 8,
  },
  searchBarWrapper: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  suggestionText: {
    marginTop: Spacing.xl,
    marginHorizontal: 14,
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.regular,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
});

