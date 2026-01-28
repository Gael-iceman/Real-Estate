import axios from "axios";
import { newError } from "./error";
import apiBaseUrl from "../apiBase";

const baseUrl = apiBaseUrl;

const FETCH_ALL_features = "FETCH_ALL_features";
const ONE_feature_ADDED = "ONE_feature_ADDED";
const ONE_feature_REMOVED = "ONE_feature_REMOVED";

const fetchfeaturesSuccess = features => ({
  type: FETCH_ALL_features,
  features
});

export const fetchfeatures = () => (dispatch, getState) => {
  axios
    .get(`${baseUrl}/feature/all`)
    .then(response => {
      dispatch(fetchfeaturesSuccess(response.data));
    })
    .catch(err => dispatch(newError(err)));
};

const addfeaturesSuccess = feature => ({
  type: ONE_feature_ADDED,
  feature
});

export const addfeature = text => (dispatch, getState) => {
  const { propertyReducer } = getState();
  const { selectedproperty } = propertyReducer;

  axios
    .post(`${baseUrl}/feature/add/${selectedproperty.id}`, { text })
    .then(response => {
      dispatch(addfeaturesSuccess(response.data));
    })
    .catch(err => dispatch(newError(err)));
};

const featureRemoveSuccess = feature => ({
  type: ONE_feature_REMOVED,
  feature
});

export const removefeature = featureId => (dispatch, getState) => {
  const { propertyReducer } = getState();
  const { selectedproperty } = propertyReducer;

  axios
    .delete(`${baseUrl}/feature/${featureId}/remove/${selectedproperty.id}`)
    .then(response => {
      dispatch(featureRemoveSuccess(response.data));
    })
    .catch(err => dispatch(newError(err)));
};

