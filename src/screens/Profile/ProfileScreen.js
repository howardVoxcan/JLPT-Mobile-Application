import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';

export default function ProfileScreen({ navigation }) {
  const handleBack = () => {
    navigation.goBack();
  };

  const handleNavigateToSection = (section) => {
    console.log('Navigate to:', section);
    if (section === 'favorites') {
      navigation.navigate('Favorites');
    } else if (section === 'settings') {
      // TODO: Navigate to settings
      console.log('Settings not implemented yet');
    } else if (section === 'switch-user') {
      // TODO: Navigate to switch user
      console.log('Switch user not implemented yet');
    }
  };

  const notebooks = [
    [
      { title: 'Từ vựng', level: 'N3' },
      { title: 'Kanji', level: 'N4' },
      { title: 'Ngữ pháp', level: 'N3' },
    ],
    [
      { title: 'Đọc hiểu', level: 'N5' },
      { title: 'Nghe Hiểu', level: 'N5' },
      { title: 'Thi JLPT', level: 'N5' },
    ],
  ];

  const handleNotebookPress = (notebookTitle) => {
    navigation.navigate('NotebookDetail', { notebookType: notebookTitle });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>Tài khoản người học</Text>

        {/* User Info Section */}
        <View style={styles.section}>
          <View style={styles.userInfo}>
            <View style={styles.userIconContainer}>
              <Ionicons name="person-circle-outline" size={64} color="#000000" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Nguyễn Văn A</Text>
              <Text style={styles.userSubtext}>Thông tin tài khoản</Text>
            </View>
            <TouchableOpacity 
              style={styles.switchUserButton}
              onPress={() => handleNavigateToSection('switch-user')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons 
                name="account-switch" 
                size={16} 
                color={Colors.secondaryHover} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Favorites and Settings Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleNavigateToSection('favorites')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons 
              name="heart-outline" 
              size={32} 
              color={Colors.secondaryHover} 
            />
            <Text style={styles.menuText}>Lưu trữ yêu thích</Text>
            <Ionicons 
              name="chevron-forward" 
              size={30} 
              color={Colors.secondaryHover} 
              style={styles.chevronIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleNavigateToSection('settings')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="settings-outline" 
              size={32} 
              color={Colors.secondaryHover} 
            />
            <Text style={styles.menuText}>Cài đặt chung</Text>
            <Ionicons 
              name="chevron-forward" 
              size={30} 
              color={Colors.secondaryHover} 
              style={styles.chevronIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Notebook Section */}
        <View style={styles.notebookSection}>
          <View style={styles.notebookHeader}>
            <MaterialCommunityIcons 
              name="notebook-outline" 
              size={32} 
              color={Colors.secondaryHover} 
            />
            <Text style={styles.menuText}>Sổ tay học tập</Text>
          </View>

          {notebooks.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.notebookRow}>
              {row.map((notebook, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.notebookCard}
                  onPress={() => handleNotebookPress(notebook.title)}
                  activeOpacity={0.7}
                >
                  <View style={styles.notebookTop}>
                    <Text style={styles.notebookTitle}>{notebook.title}</Text>
                  </View>
                  <View style={styles.notebookBottom}>
                    <Text style={styles.notebookLevel}>{notebook.level}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Bottom spacing for navigation bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    width: '100%',
    height: 88,
    backgroundColor: Colors.secondaryLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 52,
    width: 20,
    height: 20,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    width: 225,
    height: 33,
    marginLeft: 84,
    marginTop: 17,
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 33,
    color: Colors.textPrimary,
  },
  section: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(225, 225, 225, 0.5)',
    marginTop: 7,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 68,
    paddingHorizontal: 26,
  },
  userIconContainer: {
    width: 64,
    height: 64,
  },
  userDetails: {
    marginLeft: 7,
    flex: 1,
  },
  userName: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 17,
    lineHeight: 23,
    color: Colors.textPrimary,
  },
  userSubtext: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  switchUserButton: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingLeft: 42,
  },
  menuText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 17,
    lineHeight: 23,
    color: Colors.textPrimary,
    marginLeft: 23,
    flex: 1,
  },
  chevronIcon: {
    marginRight: 29,
  },
  notebookSection: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(225, 225, 225, 0.5)',
    marginTop: 7,
    paddingBottom: 16,
  },
  notebookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingLeft: 42,
  },
  notebookRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 46,
    marginBottom: 11,
  },
  notebookCard: {
    width: 86,
    height: 40,
  },
  notebookTop: {
    height: 20,
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.formStrokeDefault,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notebookBottom: {
    height: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.formStrokeDefault,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notebookTitle: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    color: '#000000',
    textAlign: 'center',
  },
  notebookLevel: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    color: '#000000',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 100,
  },
});

