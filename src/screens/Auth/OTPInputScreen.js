import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DecorativeBackground } from '../../components/Auth/DecorativeBackground';
import { BackButton } from '../../components/Auth/BackButton';
import { OTPInput } from '../../components/Auth/OTPInput';
import { PrimaryButton } from '../../components/Auth/PrimaryButton';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';

export const OTPInputScreen = ({ navigation, route }) => {
  const { email } = route.params || {};
  const [otp, setOtp] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const handleOTPComplete = (code) => {
    setOtp(code);
    setIsComplete(true);
  };

  const handleVerifyOTP = () => {
    // TODO: Implement OTP verification logic
    console.log('Verify OTP:', otp);
    navigation.navigate('NewPassword', { email, otp });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <DecorativeBackground />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <BackButton 
            text="Quay lại" 
            onPress={() => navigation.goBack()} 
          />
          
          <Text style={styles.title}>Nhập mã OTP</Text>
          
          <Text style={styles.subtitle}>
            Chúng tôi đã gửi mã xác nhận gồm 6 chữ số đến email của bạn. Vui lòng nhập mã để tiếp tục đặt lại mật khẩu.
          </Text>
          
          <View style={styles.otpContainer}>
            <OTPInput 
              length={6} 
              onComplete={handleOTPComplete}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <PrimaryButton 
              title="Xác minh mã OTP" 
              onPress={handleVerifyOTP}
              disabled={!isComplete}
            />
          </View>
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
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSizes.xxlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  subtitle: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
    textAlign: 'left',
    marginBottom: Spacing.xxl,
    letterSpacing: -0.5,
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },
  otpContainer: {
    marginBottom: Spacing.xxl,
    paddingHorizontal: 0,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.sm,
  },
});

