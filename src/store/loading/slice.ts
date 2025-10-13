import { create } from 'zustand';

interface LoadingStateProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

export const useLoadingStore = create<LoadingStateProps>()((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
}));

export default useLoadingStore;
