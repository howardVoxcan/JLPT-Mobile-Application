import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { getNotebookCategories } from '../../services/notebookService';

const ICON_CONFIG = {
  'Từ vựng': { name: 'book-outline', bgColor: '#FFE4DC', iconColor: '#DF6992' },
  'Kanji': { name: 'language-outline', bgColor: '#D4F4E7', iconColor: '#63B37B' },
  'Ngữ pháp': { name: 'text-outline', bgColor: 'rgba(197, 185, 232, 0.5)', iconColor: '#BB64D3' },
  'Đọc hiểu': { name: 'book-open-outline', bgColor: 'rgba(255, 244, 163, 0.5)', iconColor: '#D4CF73' },
  'Nghe hiểu': { name: 'headset-outline', bgColor: 'rgba(149, 212, 235, 0.4)', iconColor: '#446498' },
  'Thi JLPT': { name: 'document-text-outline', bgColor: 'rgba(255, 203, 164, 0.5)', iconColor: '#CB8561' },
};

export const NotebookScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getNotebookCategories();
      
      const formattedCategories = data.map(item => ({
        title: item.category,
        icon: ICON_CONFIG[item.category] || ICON_CONFIG['Từ vựng'],
        subtitle: `${item.completed_levels} cấp độ hoàn thành • ${item.in_progress_levels} đang học`,
      }));
      
      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryTitle) => {
    navigation.navigate('NotebookDetail', { notebookType: categoryTitle });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 16, color: Colors.textSecondary }}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <MaterialCommunityIcons name="chart-line" size={20} color={Colors.secondaryHover} />
          <Text style={styles.subtitle}>
            Theo dõi chi tiết tiến độ từng kỹ năng và mức độ
          </Text>
        </View>

        {/* Categories List */}
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(category.title)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: category.icon.bgColor }]}>
              <Ionicons name={category.icon.name} size={24} color={category.icon.iconColor} />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 17,
  },
  subtitleIcon: {
    marginRight: 2,
  },
  subtitle: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 13,
    marginTop: 14,
    backgroundColor: Colors.white,
    height: 62,
    borderRadius: 5,
    paddingHorizontal: 10,
    shadowColor: '#E1E1E1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInfo: {
    marginLeft: 13,
    flex: 1,
  },
  categoryTitle: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  categorySubtitle: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  bottomSpacer: {
    height: 100,
  },
});
