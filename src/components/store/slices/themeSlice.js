import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
    name: "theme",
    
    initialState : {
        isDark: JSON.parse(localStorage.getItem("theme")) || false,
    },
    reducers: {
        
        toggle: (state, action) => {
            
            state.isDark = !state.isDark;
            console.log(action.payload);
            localStorage.setItem("theme", JSON.stringify(state.isDark));
            
        }
    }
});

export const {toggle} = themeSlice.actions;
export default themeSlice.reducer;