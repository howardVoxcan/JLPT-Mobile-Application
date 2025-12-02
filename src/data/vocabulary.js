export const vocabularyData = [
  {
    unitId: 1,
    unitName: 'Unit 01 - Bài 1',
    unitTitle: 'Từ vựng N3',
    words: [
      {
        id: '1-1',
        kanji: '男性',
        hiragana: 'だんせい',
        vietnamese: 'NAM TÍNH',
        meaning: 'nam giới, đàn ông',
        example: '理想の男性と結婚する。',
        exampleMeaning: 'Kết hôn với người đàn ông lý tưởng.'
      },
      {
        id: '1-2',
        kanji: '女性',
        hiragana: 'じょせい',
        vietnamese: 'NỮ TÍNH',
        meaning: 'nữ giới, phụ nữ, giới tính nữ',
        example: '女性専用の車両に乗る。',
        exampleMeaning: 'Lên toa dành riêng cho phụ nữ.'
      },
      {
        id: '1-3',
        kanji: '高齢',
        hiragana: 'こうれい',
        vietnamese: 'CAO LINH',
        meaning: 'tuổi cao',
        example: '高齢者向けのサービスを提供する。',
        exampleMeaning: 'Cung cấp dịch vụ dành cho người cao tuổi.'
      },
      {
        id: '1-4',
        kanji: '成人',
        hiragana: 'せいじん',
        vietnamese: 'THÀNH NHÂN',
        meaning: 'người trưởng thành',
        example: '成人式に出席する。',
        exampleMeaning: 'Tham dự lễ trưởng thành.'
      },
      {
        id: '1-5',
        kanji: '誕生',
        hiragana: 'たんじょう',
        vietnamese: 'ĐẢN SINH',
        meaning: 'sự ra đời, sinh nhật',
        example: '新しい時代の誕生を祝う。',
        exampleMeaning: 'Chúc mừng sự ra đời của kỷ nguyên mới.'
      }
    ]
  },
  {
    unitId: 2,
    unitName: 'Unit 01 - Bài 2',
    unitTitle: 'Từ vựng N3',
    words: [
      {
        id: '2-1',
        kanji: '笑顔',
        hiragana: 'えがお',
        vietnamese: 'TIẾU NHAN',
        meaning: 'nụ cười, khuôn mặt cười',
        example: '彼女の笑顔に癒される。',
        exampleMeaning: 'Được chữa lành bởi nụ cười của cô ấy.'
      },
      {
        id: '2-2',
        kanji: '表情',
        hiragana: 'ひょうじょう',
        vietnamese: 'BIỂU TÌNH',
        meaning: 'biểu cảm, nét mặt',
        example: '彼の表情から不安が読み取れる。',
        exampleMeaning: 'Có thể đọc được sự lo lắng từ biểu cảm của anh ấy.'
      },
      {
        id: '2-3',
        kanji: '視線',
        hiragana: 'しせん',
        vietnamese: 'THỊ TUYẾN',
        meaning: 'tầm nhìn, ánh mắt',
        example: '彼女の視線を感じる。',
        exampleMeaning: 'Cảm nhận được ánh mắt của cô ấy.'
      }
    ]
  }
];

export const getAllWords = () => {
  return vocabularyData.flatMap(unit => unit.words);
};

export const getWordById = (wordId) => {
  const allWords = getAllWords();
  return allWords.find(word => word.id === wordId) || null;
};

export const getUnitById = (unitId) => {
  return vocabularyData.find(unit => unit.unitId === unitId) || null;
};
