// Colors for JLPT Master App
export const Colors = {
  // Màu chính
  primary: '#FF9AA2',           // Nút chính, tiêu đề nổi bật, màu chủ đạo
  primaryHover: '#FF6B7A',      // Hover button, icon, nhấn mạnh
  primaryLight: '#FFD3D6',      // Background nhẹ, badge, tag từ vựng
  
  // Màu phụ chủ đạo
  secondary: '#B5EAD7',         // Màu phụ chủ đạo, nút phụ, background card, header section
  secondaryActive: '#7FCDCD',   // Secondary button hover state, active state
  secondaryLight: '#C7CEEA',    // Card background, panel bài tập, input focus
  
  // Màu nhấn
  accent: '#C7CEEA',            // Highlight từ vựng khó, nhấn ngữ pháp (N1-N5), modal header
  accentSecondary: '#FFCC8F',   // Badge thành tích, điểm số, streak days, level indicator
  accentTertiary: '#FFE66D',    // Highlight ghi chú, tooltip background, star rating
  
  // Màu nền
  background: '#F5F5F5',        // Nền tổng thể màn hình, trang đọc, splash screen
  
  // Màu chữ - Theo thiết kế thực tế
  textPrimary: '#343232',       // Chữ chính, tiêu đề, nội dung bài học
  textSecondary: '#7A7A7A',     // Chữ phụ, mô tả ngắn, caption, label form
  textPlaceholder: '#B0B0B0',   // Placeholder text trong input
  textDisabled: '#A8A8A8',      // Disabled text, helper text
  
  // Màu trạng thái (Status)
  success: '#7FCDCD',           // Trả lời đúng, hoàn thành bài học, check icon, toast success
  error: '#FF9AA2',             // Trả lời sai, validation error, alert, border error input
  warning: '#FFCC8F',           // Cảnh báo, sắp hết hạn ôn tập, pending state
  info: '#87CEEB',              // Thông tin hướng dẫn, tooltip, hint box, gợi ý
  
  // Màu nền đặc biệt
  backgroundSecondary: '#FFF9F5',  // Nền phụ (theo thiết kế)
  
  // Khác
  border: '#E1E1E1',            // Đường viền form mặc định (theo thiết kế)
  
  // White & Black
  white: '#FFFFFF',
  black: '#000000',
  
  // JLPT Level Colors (sử dụng màu nhấn làm base)
  jlpt: {
    N5: '#7FCDCD',    // Beginner - Success color
    N4: '#FFCC8F',    // Elementary - Warning color  
    N3: '#87CEEB',    // Intermediate - Info color
    N2: '#C7CEEA',    // Upper Intermediate - Accent color
    N1: '#FF9AA2'     // Advanced - Primary color
  }
};

// Dark Theme Colors (optional)
export const DarkColors = {
  ...Colors,
  
  // Màu nền dark mode
  background: '#1A1A1A',
  
  // Màu chữ dark mode
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textDisabled: '#666666',
  
  // Border dark mode
  border: '#333333'
};

export default Colors;
