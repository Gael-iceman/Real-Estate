import axios from "axios";
import { newError } from "./error";
import apiBaseUrl from "../apiBase";

const baseUrl = apiBaseUrl;

const ADD_NEW_IMAGE = "ADD_NEW_IMAGE";
const DELETE_ONE_IMAGE = "DELETE_ONE_IMAGE";
const SET_PRIMARY_IMAGE = "SET_PRIMARY_IMAGE";

const uploadImageSuccess = (image, propertyId) => ({
  type: ADD_NEW_IMAGE,
  image,
  propertyId
});

export const uploadImage = (data, propertyId) => (dispatch, getState) => {
  const { propertyReducer } = getState();
  const { selectedproperty } = propertyReducer;

  const targetId = propertyId || selectedproperty?.id;
  if (!targetId) {
    const err = new Error("No property selected for image upload");
    dispatch(newError(err));
    return Promise.reject(err);
  }

  return axios
    .post(`${baseUrl}/image/upload/${targetId}`, data)
    .then(res => {
      dispatch(uploadImageSuccess(res.data, targetId));
      return res.data;
    })
    .catch(err => {
      dispatch(newError(err));
      throw err;
    });
};

const removeImageSuccess = (propertyId, payload) => ({
  type: DELETE_ONE_IMAGE,
  propertyId,
  removedId: payload?.removedId || payload?.id,
  images: payload?.images
});

export const removeImage = (publicId, imageId) => (dispatch, getState) => {
  const { propertyReducer } = getState();
  const { selectedproperty } = propertyReducer;
  const propertyId = selectedproperty?.id;
  if (!propertyId) {
    const err = new Error("No property selected for image removal");
    dispatch(newError(err));
    return Promise.reject(err);
  }

  return axios
    .delete(`${baseUrl}/image/${publicId}/${propertyId}/${imageId}`)
    .then(res => {
      dispatch(removeImageSuccess(propertyId, res.data));
      return res.data;
    })
    .catch(err => {
      dispatch(newError(err));
      throw err;
    });
};

const setPrimaryImageSuccess = (propertyId, images) => ({
  type: SET_PRIMARY_IMAGE,
  propertyId,
  images
});

export const setPrimaryImage = (propertyId, imageId) => (dispatch, getState) => {
  return axios
    .put(`${baseUrl}/image/primary/${propertyId}/${imageId}`)
    .then(res => {
      dispatch(setPrimaryImageSuccess(res.data.propertyId, res.data.images));
      return res.data;
    })
    .catch(err => {
      dispatch(newError(err));
      throw err;
    });
};

