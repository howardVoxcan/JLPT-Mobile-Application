# JLPT Master - Mobile Application

Ứng dụng di động hỗ trợ học tiếng Nhật và luyện thi JLPT được phát triển bằng React Native kết hợp với Expo framework. Đây là phần frontend của đồ án môn học, tập trung vào trải nghiệm người dùng và tương tác giao diện.

## Giới thiệu

JLPT Master là một giải pháp học tập toàn diện, cung cấp các công cụ và tài nguyên để người học có thể tự ôn luyện và chuẩn bị cho kỳ thi năng lực tiếng Nhật JLPT (Japanese Language Proficiency Test) từ cấp độ N5 đến N1.

Ứng dụng được xây dựng với mục tiêu:
- Tạo trải nghiệm học tập linh hoạt, có thể sử dụng mọi lúc mọi nơi
- Cung cấp nội dung học tập đa dạng và có hệ thống
- Hỗ trợ theo dõi tiến độ và tùy chỉnh lộ trình học tập cá nhân
- Tích hợp công nghệ AI để hỗ trợ học tập thông minh

## Hướng dẫn cài đặt

### Yêu cầu hệ thống

- Node.js phiên bản 14.0 trở lên
- npm hoặc yarn package manager
- Expo CLI (được cài tự động qua npx)
- Thiết bị di động có cài đặt Expo Go app, hoặc Android/iOS emulator

### Các bước cài đặt

1. Cài đặt các thư viện phụ thuộc:

```bash
npm install
```

2. Khởi chạy ứng dụng ở môi trường development:

```bash
npm start
```

3. Quét mã QR hiển thị trên terminal bằng:
   - **Android**: Sử dụng ứng dụng Expo Go
   - **iOS**: Sử dụng ứng dụng Camera (iOS 11+)

### Chạy trên môi trường giả lập

Để chạy ứng dụng trên máy ảo, sử dụng các lệnh sau:

**Android Emulator:**
```bash
npm run android
```
*Lưu ý: Cần cài đặt Android Studio và cấu hình Android SDK*

**iOS Simulator:**
```bash
npm run ios
```
*Lưu ý: Chỉ khả dụng trên macOS với Xcode đã được cài đặt*

**Web Browser:**
```bash
npm run web
```
*Lưu ý: Một số tính năng native có thể không hoạt động đúng trên web*

## Cấu trúc dự án

Dự án được tổ chức theo mô hình Component-Based Architecture với cấu trúc thư mục rõ ràng:

```
frontend/
├── src/
│   ├── screens/           # Các màn hình chính của ứng dụng
│   ├── components/        # Component tái sử dụng (Button, Input, Card...)
│   ├── navigation/        # Cấu hình điều hướng và nested navigators
│   ├── services/          # API integration và business logic
│   ├── constants/         # Định nghĩa hằng số (Colors, Fonts, Spacing)
│   └── context/           # React Context cho state management toàn cục
├── assets/                # Tài nguyên tĩnh (hình ảnh, icon, font chữ)
├── App.js                 # Entry point của ứng dụng
└── package.json           # Quản lý dependencies và scripts
```

## Chức năng chính

### 1. Hệ thống xác thực người dùng (Authentication)

- Đăng ký tài khoản mới với email và mật khẩu
- Đăng nhập và duy trì phiên làm việc
- Khôi phục mật khẩu thông qua mã OTP (One-Time Password)
- Lưu trữ thông tin đăng nhập bảo mật với AsyncStorage

### 2. Các module học tập

**Học từ vựng (Vocabulary)**
- Danh sách từ vựng được phân loại theo cấp độ JLPT (N5-N1)
- Flashcard tương tác với chế độ ôn tập ngẫu nhiên
- Tìm kiếm và lọc từ vựng theo nhiều tiêu chí
- Phát âm âm thanh chuẩn cho từng từ vựng

**Học Kanji**
- Hệ thống 2136 chữ Kanji thông dụng
- Hiển thị bộ thủ, số nét viết, âm on-kun
- Ví dụ minh họa và từ ghép với Kanji
- Tra cứu theo bộ thủ hoặc số nét

**Học ngữ pháp (Grammar)**
- Các mẫu câu ngữ pháp theo từng cấp độ
- Giải thích chi tiết bằng tiếng Việt
- Câu ví dụ có phiên âm và dịch nghĩa
- Bài tập vận dụng ngữ pháp

**Luyện nghe (Listening)**
- Các bài nghe phân loại theo chủ đề và cấp độ
- File âm thanh chất lượng cao
- Transcript và bản dịch đi kèm
- Điều khiển tốc độ phát và lặp lại

**Luyện đọc (Reading)**
- Đoạn văn ngắn và dài theo cấp độ
- Câu hỏi trắc nghiệm đi kèm
- Giải thích từ vựng khó trong bài đọc
- Thống kê độ chính xác

**Shadowing Practice**
- Kỹ thuật luyện nói bằng cách bắt chước
- Ghi âm giọng nói và so sánh với mẫu
- Đánh giá độ chính xác phát âm
- Theo dõi tiến bộ qua thời gian

### 3. Công cụ hỗ trợ học tập

**Từ điển (Dictionary)**
- Tra cứu Nhật-Việt và Việt-Nhật
- Tìm kiếm thông minh với gợi ý tự động
- Lịch sử tra cứu
- Lưu từ yêu thích

**Chatbot AI**
- Trả lời câu hỏi về tiếng Nhật
- Giải thích ngữ pháp, từ vựng
- Tích hợp OpenAI API
- Lưu trữ lịch sử hội thoại

**Sổ tay (Notebook)**
- Lưu trữ từ vựng, ngữ pháp quan trọng
- Ghi chú cá nhân
- Tổ chức theo thư mục
- Đồng bộ với server

### 4. Luyện thi và đánh giá

- Đề thi thử mô phỏng JLPT thực tế
- Tính thời gian làm bài
- Chấm điểm tự động và phân tích kết quả
- Thống kê tiến độ học tập qua biểu đồ
- Đề xuất nội dung cần ôn tập

## Công nghệ sử dụng

### Framework và Thư viện chính

- **React Native**: Framework phát triển ứng dụng mobile đa nền tảng
- **Expo SDK 49+**: Bộ công cụ và thư viện mở rộng cho React Native
- **React Navigation v6**: Thư viện quản lý điều hướng và navigation stack
- **Axios**: HTTP client cho việc gọi API REST
- **AsyncStorage**: Lưu trữ dữ liệu local persistent
- **Expo AV**: Xử lý phát âm thanh và video
- **@expo/vector-icons**: Bộ icon Material, Ionicons, FontAwesome

### Các thư viện bổ trợ

- **React Context API**: Quản lý state toàn cục
- **Expo Font**: Tải và sử dụng custom fonts
- **Expo Image Picker**: Chọn ảnh từ thư viện hoặc camera
- **React Native Chart Kit**: Vẽ biểu đồ thống kê

### Kiến trúc và Design Pattern

- **Component-Based Architecture**: Chia nhỏ giao diện thành các component độc lập
- **Context + Hooks Pattern**: Quản lý state với useContext và custom hooks
- **Service Layer Pattern**: Tách biệt business logic và API calls
- **Atomic Design**: Tổ chức component theo cấp độ (atoms, molecules, organisms)

## Tích hợp Backend

Ứng dụng frontend kết nối với backend API được xây dựng bằng Django REST Framework. Backend cung cấp các endpoints RESTful cho tất cả các chức năng của hệ thống.

### Cấu hình kết nối

Để kết nối với backend, cần cập nhật base URL trong file `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://<SERVER_IP>:8000/api';
```

Trong đó `<SERVER_IP>` là địa chỉ IP của máy chạy backend server.

**Lưu ý:**
- Backend phải được khởi chạy trước khi sử dụng ứng dụng mobile
- Đảm bảo thiết bị mobile và máy chạy backend cùng mạng LAN
- Kiểm tra firewall không chặn port 8000
- Để xem địa chỉ IP: Windows dùng `ipconfig`, macOS/Linux dùng `ifconfig`

## Hệ thống thiết kế (Design System)

### Bảng màu

Ứng dụng sử dụng bảng màu pastel nhẹ nhàng, tạo cảm giác thoải mái cho người học:

- **Background**: `#FFF9F5` - Màu nền chính (kem nhạt)
- **Primary**: `#FFB7C5` - Màu chủ đạo (hồng pastel)
- **Primary Hover**: `#FF9FB0` - Màu khi tương tác
- **Text Primary**: `#343232` - Màu chữ chính (xám đen)
- **Text Secondary**: `#7A7A7A` - Màu chữ phụ

### Typography

- **Font Family**: Nunito (Google Fonts)
- **Font Sizes**: 12px - 32px (responsive theo màn hình)
- **Font Weights**: 
  - 400 (Regular) - Nội dung thông thường
  - 600 (SemiBold) - Tiêu đề phụ
  - 700 (Bold) - Tiêu đề chính

### Spacing

Hệ thống khoảng cách nhất quán:
- XS: 4px | SM: 8px | MD: 12px | LG: 16px | XL: 24px | XXL: 32px

## Lưu ý khi phát triển

### Môi trường Development

1. **Kết nối Backend**: Backend API phải được khởi chạy trước khi chạy ứng dụng mobile
2. **Test Audio**: Nên test tính năng phát âm thanh trên thiết bị thật vì emulator có thể có vấn đề với audio
3. **Permissions**: Android 12+ yêu cầu cấp quyền runtime cho notifications và audio recording
4. **Image Loading**: Lần đầu tải ảnh có thể chậm do caching
5. **Environment Variables**: Không commit các file `.env` chứa thông tin nhạy cảm lên repository

### Performance Optimization

- Sử dụng `React.memo` cho các component render nhiều lần
- Optimize FlatList với `getItemLayout` và `removeClippedSubviews`
- Lazy load các màn hình không cần thiết
- Compress và optimize hình ảnh trước khi sử dụng

## Xử lý sự cố

### Ứng dụng không kết nối được Backend

- Kiểm tra địa chỉ IP trong file cấu hình có chính xác không
- Đảm bảo backend server đang chạy và không có lỗi
- Kiểm tra firewall có chặn kết nối đến port 8000 không
- Xác nhận thiết bị mobile và server cùng mạng LAN

### Lỗi phát âm thanh

- Kiểm tra đường dẫn file audio có chính xác không
- Trên Android, đảm bảo đã cấp quyền WRITE_EXTERNAL_STORAGE
- Thử khởi động lại ứng dụng
- Kiểm tra format file audio có được hỗ trợ không (MP3, M4A)

### Lỗi build hoặc dependencies

```bash
# Xóa cache và cài đặt lại
rm -rf node_modules package-lock.json
npm install

# Clear Expo cache
expo start -c
# hoặc
npx expo start --clear
```

### Lỗi Metro Bundler

```bash
# Reset cache của Metro
npx react-native start --reset-cache
```

## Đóng góp

Dự án này là đồ án môn học. Mọi đóng góp, báo lỗi, hoặc đề xuất cải tiến có thể được gửi qua:
- Tạo Issue trên repository
- Gửi Pull Request với mô tả chi tiết
- Liên hệ trực tiếp với nhóm phát triển

## Giấy phép

Dự án này được phát triển cho mục đích học tập và nghiên cứu.
