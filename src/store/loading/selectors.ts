import useLoadingStore from './slice';

export const useSelectLoading = () => useLoadingStore((state) => state.loading);
