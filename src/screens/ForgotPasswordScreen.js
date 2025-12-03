import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DecorativeBackground } from '../components/DecorativeBackground';
import { BackButton } from '../components/BackButton';
import { InputField } from '../components/InputField';
import { PrimaryButton } from '../components/PrimaryButton';
import { Colors } from '../constants/Colors';
import { FontSizes, FontWeights } from '../constants/Fonts';
import { Spacing } from '../constants/Spacing';

export const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSendOTP = () => {
    // TODO: Implement send OTP logic
    console.log('Send OTP to:', email);
    navigation.navigate('OTPInput', { email });
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
          
          <Text style={styles.title}>Quên mật khẩu</Text>
          
          <Text style={styles.subtitle}>
            Nhập email của bạn để đổi lại mật khẩu
          </Text>
          
          <View style={styles.formContainer}>
            <InputField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              iconType="email"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <PrimaryButton 
              title="Lấy lại mật khẩu" 
              onPress={handleSendOTP}
              disabled={!email}
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
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSizes.xxlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  subtitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
    textAlign: 'left',
    marginBottom: Spacing.xxl,
    letterSpacing: -0.5,
  },
  formContainer: {
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    marginTop: Spacing.lg,
  },
});

