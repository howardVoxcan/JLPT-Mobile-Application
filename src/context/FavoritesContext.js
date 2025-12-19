import React, { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteVocabulary, setFavoriteVocabulary] = useState([]);
  const [favoriteKanji, setFavoriteKanji] = useState([]);

  const addVocabularyFavorite = (vocab) => {
    setFavoriteVocabulary(prev => {
      // Check if already exists
      if (prev.find(item => item.id === vocab.id)) {
        return prev;
      }
      return [...prev, vocab];
    });
  };

  const removeVocabularyFavorite = (vocabId) => {
    setFavoriteVocabulary(prev => prev.filter(item => item.id !== vocabId));
  };

  const addKanjiFavorite = (kanji) => {
    setFavoriteKanji(prev => {
      // Check if already exists
      if (prev.find(item => item.id === kanji.id)) {
        return prev;
      }
      return [...prev, kanji];
    });
  };

  const removeKanjiFavorite = (kanjiId) => {
    setFavoriteKanji(prev => prev.filter(item => item.id !== kanjiId));
  };

  const isVocabularyFavorite = (vocabId) => {
    return favoriteVocabulary.some(item => item.id === vocabId);
  };

  const isKanjiFavorite = (kanjiId) => {
    return favoriteKanji.some(item => item.id === kanjiId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteVocabulary,
        favoriteKanji,
        addVocabularyFavorite,
        removeVocabularyFavorite,
        addKanjiFavorite,
        removeKanjiFavorite,
        isVocabularyFavorite,
        isKanjiFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

