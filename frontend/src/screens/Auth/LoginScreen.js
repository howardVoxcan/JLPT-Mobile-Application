import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DecorativeBackground } from '../../components/Auth/DecorativeBackground';
import { BackButton } from '../../components/Auth/BackButton';
import { InputField } from '../../components/Auth/InputField';
import { PrimaryButton } from '../../components/Auth/PrimaryButton';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';
import { login } from '../../services/authService';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  try {
    await login(email, password);
    navigation.reset({
      index: 0,
      routes: [{ name: "MainNavigator" }],
    });
  } catch (error) {
    alert("Email hoặc mật khẩu không đúng");
  }
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
          
          <Text style={styles.title}>Đăng nhập</Text>
          
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Image 
              source={require('../../../assets/login-illustration.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.formContainer}>
            <InputField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              iconType="email"
              keyboardType="email-address"
            />
            
            <InputField
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              iconType="password"
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          
          <View style={styles.buttonContainer}>
            <PrimaryButton 
              title="Đăng nhập" 
              onPress={handleLogin}
              disabled={!email || !password}
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Bạn chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerLink}>Đăng ký</Text>
            </TouchableOpacity>
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
    marginTop: 110,
    marginBottom: Spacing.xl,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  illustration: {
    width: 139,
    height: 146,
  },
  formContainer: {
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.xxl,
    paddingVertical: Spacing.sm,
  },
  forgotPasswordText: {
    fontSize: FontSizes.regular,
    fontWeight: FontWeights.bold,
    color: Colors.textSecondary,
  },
  buttonContainer: {
    marginBottom: Spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSizes.regular,
    fontWeight: FontWeights.regular,
    color: Colors.textPrimary,
  },
  footerLink: {
    fontSize: FontSizes.regular,
    fontWeight: FontWeights.bold,
    color: Colors.primaryHover,
  },
});

