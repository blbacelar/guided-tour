import { create } from "zustand";

interface TourStore {
  selectedPoiId: string | null;
  setSelectedPoiId: (id: string) => void;
  favorites: string[]; // Array of POI IDs
  toggleFavorite: (id: string) => void;
}

export const useTourStore = create<TourStore>((set) => ({
  selectedPoiId: null,
  setSelectedPoiId: (id) => set({ selectedPoiId: id }),
  favorites: [],
  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((fid) => fid !== id)
        : [...state.favorites, id],
    })),
}));
