import { combineReducers } from "redux";
import userReducer from "./user";
import errorReducer from "./error";
import successReducer from "./success";
import propertyReducer from "./property";
import likeReducer from "./likes";
import imageReducer from "./image";
import featureReducer from "./feature";
import seoReducer from './seo'

export default combineReducers({
  userReducer,
  errorReducer,
  successReducer,
  propertyReducer,
  likeReducer,
  imageReducer,
  featureReducer,
  seoReducer
});
