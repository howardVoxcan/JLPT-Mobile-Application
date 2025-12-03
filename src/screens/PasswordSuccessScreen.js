import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DecorativeBackground } from '../components/DecorativeBackground';
import { PrimaryButton } from '../components/PrimaryButton';
import { Colors } from '../constants/Colors';
import { FontSizes, FontWeights } from '../constants/Fonts';
import { Spacing } from '../constants/Spacing';

export const PasswordSuccessScreen = ({ navigation }) => {
  const handleGoToLogin = () => {
    // Navigate to Dictionary (user is now logged in)
    navigation.navigate('Dictionary');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <DecorativeBackground />
      
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.successIconContainer}>
            <View style={styles.successCircle}>
              <View style={styles.checkmark}>
                <View style={styles.checkmarkStem} />
                <View style={styles.checkmarkKick} />
              </View>
            </View>
          </View>
          
          <Text style={styles.title}>
            Tạo mật khẩu mới{'\n'}thành công
          </Text>
          
          <View style={styles.buttonContainer}>
            <PrimaryButton 
              title="Quay lại trang đăng nhập" 
              onPress={handleGoToLogin}
            />
          </View>
        </View>
      </View>
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
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  content: {
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: Spacing.xxl,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 40,
    height: 40,
    position: 'relative',
  },
  checkmarkStem: {
    position: 'absolute',
    width: 4,
    height: 20,
    backgroundColor: Colors.primary,
    left: 20,
    top: 8,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },
  checkmarkKick: {
    position: 'absolute',
    width: 4,
    height: 10,
    backgroundColor: Colors.primary,
    left: 12,
    top: 18,
    transform: [{ rotate: '-45deg' }],
    borderRadius: 2,
  },
  title: {
    fontSize: FontSizes.xlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: 32,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
});

