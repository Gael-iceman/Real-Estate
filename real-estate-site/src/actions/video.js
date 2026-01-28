import axios from "axios";
import { newError } from "./error";
import apiBaseUrl from "../apiBase";

const baseUrl = apiBaseUrl;

const UPDATE_PROPERTY_VIDEO = "UPDATE_PROPERTY_VIDEO";

const videoUploadSuccess = video => ({
  type: UPDATE_PROPERTY_VIDEO,
  video
});

export const uploadVideo = (data, propertyId) => (dispatch, getState) => {
  const { propertyReducer } = getState();
  const { selectedproperty } = propertyReducer;

  const targetId = propertyId || selectedproperty?.id;
  if (!targetId) {
    const err = new Error("No property selected for video upload");
    dispatch(newError(err));
    return Promise.reject(err);
  }

  return axios
    .post(`${baseUrl}/video/upload/${targetId}`, data)
    .then(res => {
      dispatch(videoUploadSuccess({ url: res.data.url, propertyId: targetId }));
      return res.data;
    })
    .catch(err => {
      dispatch(newError(err));
      throw err;
    });
};
