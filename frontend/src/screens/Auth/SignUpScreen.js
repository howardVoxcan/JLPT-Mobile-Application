import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DecorativeBackground } from '../../components/Auth/DecorativeBackground';
import { BackButton } from '../../components/Auth/BackButton';
import { InputField } from '../../components/Auth/InputField';
import { PrimaryButton } from '../../components/Auth/PrimaryButton';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';
import { register } from '../../services/authService';

export const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await register({ name, email, password, confirmPassword });

      navigation.reset({
        index: 0,
        routes: [{ name: "MainNavigator" }],
      });
    } catch (error) {
      const data = error.response?.data;

      let message = "Đăng ký thất bại";

      if (data) {
        if (data.full_name) {
          message = data.full_name[0];
        } else if (data.email) {
          message = data.email[0];
        } else if (data.password) {
          message = data.password[0];
        } else if (data.confirm_password) {
          message = data.confirm_password[0];
        }
      }

      alert(message);
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
          
          <Text style={styles.title}>Đăng ký</Text>
          
          <View style={styles.formContainer}>
            <InputField
              placeholder="Họ tên"
              value={name}
              onChangeText={setName}
              iconType="user"
              autoCapitalize="words"
            />
            
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
              title="Đăng ký" 
              onPress={handleSignUp}
              // disabled={!name || !email || !password || !confirmPassword}
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Bạn đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Đăng nhập</Text>
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
    marginTop: 140,
    marginBottom: Spacing.xl,
  },
  formContainer: {
    gap: 30,
    marginBottom: Spacing.xxl,
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

