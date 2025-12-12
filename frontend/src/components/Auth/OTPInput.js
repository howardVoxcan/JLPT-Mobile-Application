import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { FontSizes, FontWeights } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';

export const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    // Chỉ cho phép số
    if (text && !/^\d+$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Tự động chuyển sang ô tiếp theo
    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    // Callback khi nhập đủ
    if (newOtp.every(digit => digit !== '')) {
      onComplete && onComplete(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    // Quay lại ô trước khi nhấn Backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array(length).fill(0).map((_, index) => (
        <TextInput
          key={index}
          ref={ref => inputs.current[index] = ref}
          style={[
            styles.input,
            otp[index] && styles.inputFilled
          ]}
          value={otp[index]}
          onChangeText={text => handleChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 9,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: Colors.formStroke,
    borderRadius: 10,
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  inputFilled: {
    borderColor: Colors.secondary,
  },
});

