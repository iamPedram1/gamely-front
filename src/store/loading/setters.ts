import useLoadingStore from './slice';

export const setLoadingState = (v: boolean) => useLoadingStore.getState().setLoading(v);
