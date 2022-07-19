import { configureStore } from "@reduxjs/toolkit";
import goal from "./modules/goal";
import favorite from "./modules/favorite";
import post from "./modules/post"
import comment from "./modules/comment"
import user from "./modules/user"
import saved from "./modules/saved";
import item from "./modules/item"
import info from "./modules/info";
import rank from "./modules/rank";


const store = configureStore({
  reducer: { goal, favorite, post, comment, user, saved, info, item, rank },
});

export default store;