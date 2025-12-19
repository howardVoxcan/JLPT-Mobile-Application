import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';

export const NotebookScreen = ({ navigation }) => {
  const categories = [
    {
      title: 'Từ vựng',
      icon: { name: 'book-outline', bgColor: '#FFE4DC', iconColor: '#DF6992' },
      subtitle: '1 cấp độ hoàn thành • 2 đang học',
    },
    {
      title: 'Kanji',
      icon: { name: 'language-outline', bgColor: '#D4F4E7', iconColor: '#63B37B' },
      subtitle: '1 cấp độ hoàn thành • 2 đang học',
    },
    {
      title: 'Ngữ pháp',
      icon: { name: 'text-outline', bgColor: 'rgba(197, 185, 232, 0.5)', iconColor: '#BB64D3' },
      subtitle: '1 cấp độ hoàn thành • 2 đang học',
    },
    {
      title: 'Đọc hiểu',
      icon: { name: 'book-open-outline', bgColor: 'rgba(255, 244, 163, 0.5)', iconColor: '#D4CF73' },
      subtitle: '1 cấp độ hoàn thành • 2 đang học',
    },
    {
      title: 'Nghe hiểu',
      icon: { name: 'headset-outline', bgColor: 'rgba(149, 212, 235, 0.4)', iconColor: '#446498' },
      subtitle: '1 cấp độ hoàn thành • 2 đang học',
    },
    {
      title: 'Thi JLPT',
      icon: { name: 'document-text-outline', bgColor: 'rgba(255, 203, 164, 0.5)', iconColor: '#CB8561' },
      subtitle: '1 cấp độ hoàn thành • 2 đang học',
    },
  ];

  const handleCategoryPress = (categoryTitle) => {
    navigation.navigate('NotebookDetail', { notebookType: categoryTitle });
  };

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
