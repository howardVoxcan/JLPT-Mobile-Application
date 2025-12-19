import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';

export const FavoritesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('vocabulary'); // vocabulary or kanji

  // Mock data - replace with real data
  const favoriteItems = [
    { id: 1, image: null }, // placeholder for images
    { id: 2, image: null },
    { id: 3, image: null },
    { id: 4, image: null },
    { id: 5, image: null },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[
              styles.tab,
              activeTab === 'vocabulary' && styles.tabActive
            ]}
            onPress={() => setActiveTab('vocabulary')}
            activeOpacity={0.7}
          >
            {activeTab === 'vocabulary' && <View style={styles.tabHighlight} />}
            <Text style={[
              styles.tabText,
              activeTab === 'vocabulary' && styles.tabTextActive
            ]}>
              Từ vựng
            </Text>
          </TouchableOpacity>
          
          <View style={styles.tabDivider} />
          
          <TouchableOpacity 
            style={[
              styles.tab,
              activeTab === 'kanji' && styles.tabActive
            ]}
            onPress={() => setActiveTab('kanji')}
            activeOpacity={0.7}
          >
            {activeTab === 'kanji' && <View style={styles.tabHighlight} />}
            <Text style={[
              styles.tabText,
              activeTab === 'kanji' && styles.tabTextActive
            ]}>
              Kanji
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instructions Card */}
        <View style={styles.instructionsCard}>
          <View style={styles.instructionsContent}>
            <Text style={styles.instructionsTitle}>Hướng dẫn:</Text>
            <Text style={styles.instructionsText}>
              Click vào từng khung để ẩn/hiện ví dụ.
            </Text>
          </View>
          <TouchableOpacity style={styles.flashcardButton} activeOpacity={0.7}>
            <Text style={styles.flashcardButtonText}>Flashcard</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
          <View style={styles.logoIndicator}>
            <Image 
              source={require('../../../assets/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Favorites List */}
        <View style={styles.favoritesList}>
          {favoriteItems.map((item) => (
            <View key={item.id} style={styles.favoriteItem}>
              <View style={styles.itemContent}>
                {/* Placeholder for word image/content */}
                <View style={styles.wordPlaceholder}>
                  <Text style={styles.placeholderText}>
                    {activeTab === 'vocabulary' ? '男性' : '駐'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.heartButton}
                activeOpacity={0.7}
              >
                <Ionicons name="heart" size={22} color={Colors.primaryHover} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

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
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 56,
    marginTop: 14,
    height: 30,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    backgroundColor: Colors.white,
  },
  tabHighlight: {
    position: 'absolute',
    width: 90,
    height: 20,
    backgroundColor: Colors.primaryLight,
    borderRadius: 4,
  },
  tabText: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    zIndex: 1,
  },
  tabTextActive: {
    color: Colors.textSecondary,
  },
  tabDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.formStrokeDefault,
  },
  instructionsCard: {
    marginHorizontal: 13,
    marginTop: 20,
    backgroundColor: 'rgba(255, 183, 197, 0.5)',
    borderRadius: 5,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  instructionsContent: {
    flex: 1,
  },
  instructionsTitle: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 16,
    color: Colors.textPrimary,
  },
  instructionsText: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 16,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  flashcardButton: {
    width: 87,
    height: 36,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.formStrokeDefault,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashcardButtonText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 18,
    color: Colors.success,
  },
  progressSection: {
    marginHorizontal: 42,
    marginTop: 24,
    position: 'relative',
    height: 40,
  },
  progressBarBg: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
  },
  progressBarFill: {
    width: '35%', // 110/310
    height: '100%',
    backgroundColor: Colors.secondaryLight,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 20,
  },
  logoIndicator: {
    position: 'absolute',
    top: 0,
    left: '31%', // 120/393
    width: 71.86,
    height: 40,
    borderRadius: 135.593,
    borderWidth: 1,
    borderColor: '#000000',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  favoritesList: {
    marginHorizontal: 13,
    marginTop: 24,
  },
  favoriteItem: {
    height: 85,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.formStrokeDefault,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  itemContent: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  wordPlaceholder: {
    height: 57,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  placeholderText: {
    fontFamily: 'Noto Sans JP',
    fontWeight: '400',
    fontSize: 24,
    color: Colors.textPrimary,
  },
  heartButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacer: {
    height: 100,
  },
});

