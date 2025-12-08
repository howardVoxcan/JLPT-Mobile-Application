import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DecorativeBackground } from '../../components/Auth/DecorativeBackground';
import { BackButton } from '../../components/Auth/BackButton';
import { InputField } from '../../components/Auth/InputField';
import { PrimaryButton } from '../../components/Auth/PrimaryButton';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';

export const NewPasswordScreen = ({ navigation, route }) => {
  const { email, otp } = route.params || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = () => {
    // TODO: Implement password reset logic
    console.log('Reset password:', { email, otp, password });
    navigation.navigate('PasswordSuccess');
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
          
          <Text style={styles.title}>Tạo mật khẩu mới</Text>
          
          <Text style={styles.subtitle}>
            Nhập và xác nhận mật khẩu mới của bạn. Mật khẩu cần ít nhất 8 ký tự, bao gồm chữ và số.
          </Text>
          
          <View style={styles.formContainer}>
            <InputField
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              iconType="password"
              secureTextEntry
            />
            
            <InputField
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              iconType="password"
              secureTextEntry
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <PrimaryButton 
              title="Tạo mật khẩu mới" 
              onPress={handleResetPassword}
              disabled={!password || !confirmPassword || password !== confirmPassword}
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
  },
  formContainer: {
    gap: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  buttonContainer: {
    marginTop: Spacing.lg,
  },
});

