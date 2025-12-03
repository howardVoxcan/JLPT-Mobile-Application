# JLPT Master

Ứng dụng học tiếng Nhật cho kỳ thi JLPT được xây dựng bằng React Native + Expo.

## 🚀 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm start
```

## 📱 Chạy trên thiết bị

### Android
```bash
npm run android
```

### iOS (chỉ trên macOS)
```bash
npm run ios
```

### Web
```bash
npm run web
```

## 📂 Cấu trúc thư mục

```
JLPT_Master/
├── src/
│   ├── components/        # Reusable components
│   │   ├── BackButton.js
│   │   ├── DecorativeBackground.js
│   │   ├── InputField.js
│   │   ├── OTPInput.js
│   │   └── PrimaryButton.js
│   ├── constants/         # Constants (colors, fonts, spacing)
│   │   ├── Colors.js
│   │   ├── Fonts.js
│   │   └── Spacing.js
│   ├── navigation/        # Navigation configuration
│   │   └── AuthNavigator.js
│   └── screens/          # App screens
│       ├── SignUpScreen.js
│       ├── LoginScreen.js
│       ├── ForgotPasswordScreen.js
│       ├── OTPInputScreen.js
│       ├── NewPasswordScreen.js
│       └── PasswordSuccessScreen.js
├── assets/               # Images, fonts, etc.
├── App.js               # Entry point
└── package.json         # Dependencies
```

## 🎨 Màn hình Authentication

1. **Đăng ký** - SignUpScreen
2. **Đăng nhập** - LoginScreen
3. **Quên mật khẩu** - ForgotPasswordScreen
4. **Nhập mã OTP** - OTPInputScreen (6 ô nhập)
5. **Tạo mật khẩu mới** - NewPasswordScreen
6. **Thành công** - PasswordSuccessScreen

## 🎨 Design System

### Colors
- Background: `#FFF9F5`
- Primary: `#FFB7C5`
- Primary Hover: `#FF9FB0`
- Text Primary: `#343232`
- Text Secondary: `#7A7A7A`

### Typography
- Font Family: Nunito
- Font Sizes: 12px - 32px
- Font Weights: 400, 600, 700

### Spacing
- XS: 4px
- SM: 8px
- MD: 12px
- LG: 16px
- XL: 24px
- XXL: 32px

## 📦 Dependencies

- React Native
- Expo
- React Navigation
- @expo/vector-icons

## 🛠️ Technologies

- **React Native** - Framework phát triển app
- **Expo** - Công cụ phát triển và build
- **React Navigation** - Điều hướng giữa các màn hình
- **JavaScript (JSX)** - Ngôn ngữ lập trình

