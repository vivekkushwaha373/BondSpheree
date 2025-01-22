import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";




const rtnSlice = createSlice({
    name: "realTimeNotification",
    initialState: {
        likeNotification: [],
    },
    reducers: {
        setLikeNotification: (state, action) => {
            if (action.payload.type === 'like') {
                
                state.likeNotification.push(action.payload);
            }
            else if (action.payload.type === 'dislike') {
                
                state.likeNotification.push(action.payload);
                // state.likeNotification = state.likeNotification.filter((item) => item.userId !== action.payload.userId);
            }
            else if (action.payload.type === 'comment') {
                state.likeNotification.push(action.payload);
            }
            else if (action.payload.type === 'message') {
                state.likeNotification.push(action.payload);
            }
        },
        deleteLikeNotification: (state) => {
            state.likeNotification.length = 0;
        }
    }
});

export const {setLikeNotification,deleteLikeNotification} = rtnSlice.actions;
export default rtnSlice.reducer;