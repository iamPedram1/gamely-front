import useLoadingStore from './slice';

export const getLoadingState = () => useLoadingStore.getState().loading;
