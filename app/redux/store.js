import {configureStore} from '@reduxjs/toolkit';
import bluetoothReducer from './slices/bluetooth.slice';
import testReducer from './slices/test.slice';

export const store = configureStore({
  reducer: {
    test: testReducer,
    bluetooth: bluetoothReducer,
  },
});
