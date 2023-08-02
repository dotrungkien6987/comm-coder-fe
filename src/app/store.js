import { configureStore } from "@reduxjs/toolkit";
import friendReducer from '../features/friend/friendSlice'
import userReducer from '../features/user/userSlice'
import commentReducer from '../features/comment/commentSlice'
import postReducer from '../features/post/postSlice'

const rootReducer = {
  comment:commentReducer,
  friend:friendReducer,
  post:postReducer,
  user:userReducer,
};

const store = configureStore({
  reducer:rootReducer
})

export default store;