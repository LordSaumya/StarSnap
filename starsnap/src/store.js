import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

const persistConfig = {
    key: 'root',
    storage,
}

const reducer = (state = {}, action) => {
    switch (action.type) {
      case 'LOGIN':
        return {
          ...state,
          username: action.username,
          id: action.id,
        };
      case 'LOGOUT':
        return {
          ...state,
            username: null,
            id: null,
        };
      default:
        return state;
    }
};

const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk],
});
const persistor = persistStore(store);
export {store, persistor};