import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';

export const InputField = ({ 
  placeholder, 
  value, 
  onChangeText, 
  iconType = 'user',
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const renderIcon = () => {
    switch (iconType) {
      case 'user':
        return <Ionicons name="person-outline" size={24} color={Colors.textSecondary} />;
      case 'email':
        return <MaterialCommunityIcons name="email-outline" size={24} color={Colors.textSecondary} />;
      case 'password':
        return <MaterialCommunityIcons name="lock-outline" size={28} color={Colors.textSecondary} />;
      default:
        return null;
    }
  };

  return (
    <View style={[
      styles.container, 
      isFocused && styles.containerFocused,
      value && value.length > 0 && styles.containerFilled
    ]}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      
      {secureTextEntry && (
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'} 
            size={20} 
            color={Colors.textSecondary} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 47,
    borderWidth: 2,
    borderColor: Colors.formStroke,
    borderRadius: 15,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
  },
  containerFocused: {
    borderColor: Colors.primary,
  },
  containerFilled: {
    borderColor: Colors.secondary,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.regular,
    color: Colors.textPrimary,
    fontWeight: FontWeights.regular,
  },
  eyeIcon: {
    padding: Spacing.xs,
  },
});

