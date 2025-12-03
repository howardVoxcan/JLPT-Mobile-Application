import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export const DictionaryHeader = ({ onProfilePress }) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Right Icons */}
      <View style={styles.rightIcons}>
        {/* Vietnam Flag */}
        <View style={styles.flagContainer}>
          <View style={styles.flag}>
            <View style={styles.flagRed} />
            <View style={styles.flagStar}>
              <View style={styles.star} />
            </View>
          </View>
        </View>

        {/* Profile Icon */}
        <TouchableOpacity onPress={onProfilePress} activeOpacity={0.7}>
          <View style={styles.profileIcon}>
            <View style={styles.profileCircle} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.secondaryLight,
    paddingTop: 22,
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoContainer: {
    width: 80,
    height: 80,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  rightIcons: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    marginTop: 23,
    marginRight: 20,
  },
  flagContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  flag: {
    width: '100%',
    height: '100%',
    backgroundColor: '#DA251D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagRed: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#DA251D',
  },
  flagStar: {
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    width: 10,
    height: 10,
    backgroundColor: '#FFFF00',
    transform: [{ rotate: '0deg' }],
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
  },
});

