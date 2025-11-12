// Fonts configuration for JLPT Master App
export const Fonts = {
  // Font Families
  families: {
    // Font tiếng Việt và tiếng Anh
    primary: 'Nunito',
    primaryBold: 'Nunito-Bold',
    primarySemiBold: 'Nunito-SemiBold',
    primaryLight: 'Nunito-Light',
    
    // Font tiếng Nhật
    japanese: 'Noto Sans JP',
    japaneseBold: 'Noto Sans JP Bold',
    japaneseMedium: 'Noto Sans JP Medium',
    japaneseLight: 'Noto Sans JP Light'
  },
  
  // Font Sizes
  sizes: {
    // Headings
    h1: 32,     // Tiêu đề chính màn hình (Đăng ký)
    h2: 24,     // Tiêu đề section (Sổ tay học tập)
    h3: 20,     // Tiêu đề card, modal
    h4: 18,     // Tiêu đề nhỏ
    h5: 16,     // Sub heading (Từ vựng, Kanji, Ngữ pháp)
    h6: 15,     // Heading nhỏ nhất (Navigation labels)
    
    // Body text
    large: 16,   // Text lớn, nội dung chính (Gợi ý, placeholder)
    medium: 15,  // Text thường (Button text, form labels)
    small: 13,   // Text nhỏ (Tab labels, descriptions)
    tiny: 11,    // Caption, helper text (Bài đã học, Thành thạo)
    micro: 10,   // Text rất nhỏ (Progress percentages)
    
    // Japanese text (có thể cần size khác)
    kanjiLarge: 24,    // Kanji lớn trong bài học
    kanjiMedium: 20,   // Kanji vừa
    kanjiSmall: 16,    // Kanji nhỏ
    
    // Button text
    buttonLarge: 15,   // Button chính (Đăng ký)
    buttonMedium: 13,  // Button phụ (Học tập)
    buttonSmall: 11    // Button nhỏ
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8
  },
  
  // Font Weights
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800'
  }
};

// Typography Styles - Kết hợp font, size, weight theo thiết kế
export const Typography = {
  // Headings
  h1: {
    fontFamily: Fonts.families.primaryBold,
    fontSize: Fonts.sizes.h1,
    fontWeight: Fonts.weights.bold,
    lineHeight: 44  // Theo thiết kế: line-height: 44px
  },
  
  h2: {
    fontFamily: Fonts.families.primaryBold,
    fontSize: Fonts.sizes.h2,
    fontWeight: Fonts.weights.bold,
    lineHeight: 33  // Theo thiết kế: line-height: 33px
  },
  
  h3: {
    fontFamily: Fonts.families.primaryBold,
    fontSize: Fonts.sizes.h5,
    fontWeight: Fonts.weights.bold,
    lineHeight: 22  // Theo thiết kế: line-height: 22px
  },
  
  // Body text
  bodyLarge: {
    fontFamily: Fonts.families.primary,
    fontSize: Fonts.sizes.large,
    fontWeight: Fonts.weights.normal,
    lineHeight: 22  // Theo thiết kế: line-height: 22px
  },
  
  body: {
    fontFamily: Fonts.families.primary,
    fontSize: Fonts.sizes.medium,
    fontWeight: Fonts.weights.normal,
    lineHeight: 20  // Theo thiết kế: line-height: 20px
  },
  
  bodySmall: {
    fontFamily: Fonts.families.primary,
    fontSize: Fonts.sizes.small,
    fontWeight: Fonts.weights.normal,
    lineHeight: 18  // Theo thiết kế: line-height: 18px
  },
  
  // Form labels và placeholders
  formLabel: {
    fontFamily: Fonts.families.primary,
    fontSize: Fonts.sizes.medium,
    fontWeight: Fonts.weights.normal,
    lineHeight: 20
  },
  
  // Navigation labels
  navLabel: {
    fontFamily: Fonts.families.primary,
    fontSize: Fonts.sizes.medium,
    fontWeight: Fonts.weights.normal,
    lineHeight: 20
  },
  
  // Tab labels
  tabLabel: {
    fontFamily: Fonts.families.primary,
    fontSize: Fonts.sizes.small,
    fontWeight: Fonts.weights.normal,
    lineHeight: 18
  },
  
  // Japanese text
  japanese: {
    fontFamily: Fonts.families.japanese,
    fontSize: Fonts.sizes.medium,
    fontWeight: Fonts.weights.normal,
    lineHeight: Fonts.lineHeights.relaxed
  },
  
  japaneseLarge: {
    fontFamily: Fonts.families.japanese,
    fontSize: Fonts.sizes.kanjiLarge,
    fontWeight: Fonts.weights.medium,
    lineHeight: Fonts.lineHeights.relaxed
  },
  
  // Button text
  buttonPrimary: {
    fontFamily: Fonts.families.primaryBold,
    fontSize: Fonts.sizes.buttonLarge,
    fontWeight: Fonts.weights.bold,
    lineHeight: 20
  },
  
  buttonSecondary: {
    fontFamily: Fonts.families.primaryBold,
    fontSize: Fonts.sizes.buttonMedium,
    fontWeight: Fonts.weights.bold,
    lineHeight: 18
  },
  
  // Caption và helper text
  caption: {
    fontFamily: Fonts.families.primary,
    fontSize: Fonts.sizes.tiny,
    fontWeight: Fonts.weights.normal,
    lineHeight: 15  // Theo thiết kế: line-height: 15px
  },
  
  // Micro text (percentages, small numbers)
  micro: {
    fontFamily: Fonts.families.primary,
    fontSize: Fonts.sizes.micro,
    fontWeight: Fonts.weights.normal,
    lineHeight: 14  // Theo thiết kế: line-height: 14px
  }
};

export default Fonts;
