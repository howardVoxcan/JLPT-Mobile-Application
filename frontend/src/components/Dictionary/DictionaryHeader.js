import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 24;

export const DictionaryHeader = ({ onProfilePress }) => {
  return (
    <View style={styles.container}>
      {/* Logo on the left */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Right Icons */}
      <View style={styles.rightIcons}>
        {/* Vietnam Flag - Using Text Emoji */}
        <View style={styles.flagContainer}>
          <Text style={styles.flagEmoji}>🇻🇳</Text>
        </View>

        {/* Profile Icon */}
        <TouchableOpacity onPress={onProfilePress} activeOpacity={0.7}>
          <Ionicons name="person-circle-outline" size={40} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220 + STATUSBAR_HEIGHT - 20,
    backgroundColor: Colors.secondaryLight,
    paddingTop: STATUSBAR_HEIGHT,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoContainer: {
    width: 80,
    height: 80,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 20,
  },
  flagContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagEmoji: {
    fontSize: 28,
  },
});
