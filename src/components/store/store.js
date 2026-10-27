import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlices';
import themeReducer from './slices/themeSlice';
import userReducer from './slices/userSlices';

export const store = configureStore({
    reducer: {
        cart: cartReducer, 
        theme: themeReducer,
        user: userReducer,
    }
})