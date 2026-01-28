import axios from "axios";
import { newError } from "./error";
import apiBaseUrl from "../apiBase";

const baseUrl = apiBaseUrl;

const LIKE_property = "LIKE_property";
const DISLIKE_property = "DISLIKE_property";
const GET_USER_FAVORITES = "GET_USER_FAVORITES";

const likepropertiesuccess = liked => {
  if (liked.removed) {
    return {
      type: DISLIKE_property,
      propertyId: liked.propertyId
    };
  } else {
    return {
      type: LIKE_property,
      liked
    };
  }
};

export const likeproperty = id => (dispatch, getState) => {
  axios
    .get(`${baseUrl}/property/${id}/like`)
    .then(response => {
      dispatch(likepropertiesuccess(response.data));
      dispatch(getFavorites());
    })
    .catch(err => dispatch(newError(err)));
};

const gotUserFavorites = likes => ({
  type: GET_USER_FAVORITES,
  likes
});

export const getFavorites = () => (dispatch, getState) => {
  axios
    .get(`${baseUrl}/property/favorites`)
    .then(response => {
      dispatch(gotUserFavorites(response.data));
    })
    .catch(err => dispatch(newError(err)));
};

