# JLPT Master - Frontend

Ứng dụng học tiếng Nhật cho kỳ thi JLPT được xây dựng bằng React Native và Expo.

## Cấu trúc thư mục

```
fe/
├── src/
│   ├── components/         # Các component tái sử dụng
│   │   ├── common/         # Component chung
│   │   └── ui/             # Component giao diện
│   ├── screens/            # Các màn hình của ứng dụng
│   │   ├── Auth/           # Màn hình đăng nhập/đăng ký
│   │   ├── Home/           # Màn hình trang chủ
│   │   ├── Lesson/         # Màn hình bài học
│   │   ├── Quiz/           # Màn hình quiz
│   │   └── Profile/        # Màn hình hồ sơ
│   ├── navigation/         # Cấu hình điều hướng
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── constants/          # Hằng số
│   ├── hooks/              # Custom hooks
│   ├── contexts/           # React contexts
│   └── assets/             # Tài nguyên tĩnh
│       ├── images/         # Hình ảnh
│       ├── fonts/          # Font chữ
│       ├── sounds/         # Âm thanh
│       └── icons/          # Biểu tượng
├── assets/                 # Expo assets
├── app.json               # Cấu hình Expo
├── babel.config.js        # Cấu hình Babel
├── metro.config.js        # Cấu hình Metro
└── package.json           # Dependencies
```

