import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useVocabStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      
      toggleFavorite: (vocabId) => set((state) => {
        const isFavorited = state.favorites.includes(vocabId);
        
        if (isFavorited) {
          return {
            favorites: state.favorites.filter(id => id !== vocabId)
          };
        } else {
          return {
            favorites: [...state.favorites, vocabId]
          };
        }
      }),
      
      isFavorite: (vocabId) => {
        return get().favorites.includes(vocabId);
      },
      
      getFavorites: () => {
        return get().favorites;
      }
    }),
    {
      name: 'vocab-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useVocabStore;
