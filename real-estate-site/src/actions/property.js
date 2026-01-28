import axios from "axios";
import { newError } from "./error";
import apiBaseUrl from "../apiBase";

const baseUrl = apiBaseUrl;

const CREATE_NEW_property = "CREATE_NEW_property";
const FETCH_ALL_properties = "FETCH_ALL_properties";
const FETCH_SEARCHED_properties = "FETCH_SEARCHED_properties";
const FETCH_ONE_property = "FETCH_ONE_property";
const GET_AGENCY_AGENTS = "GET_AGENCY_AGENTS";
const TOGGLE_AGENT_CONFIRMATION = "TOGGLE_AGENT_CONFIRMATION";
const GET_MY_properties = "GET_MY_properties";
const CLEAR_SEARCHED_properties = "CLEAR_SEARCHED_properties";
const UPDATE_PROPERTY = "UPDATE_PROPERTY";
const DELETE_PROPERTY = "DELETE_PROPERTY";

const propertyCreateSuccess = property => ({
  type: CREATE_NEW_property,
  property: { ...property.newproperty },
  user: { ...property.user }
});

export const createproperty = data => (dispatch, getState) => {
  return axios
    .post(`${baseUrl}/property`, {
      ...data
    })
    .then(response => {
      dispatch(propertyCreateSuccess(response.data));
      return response.data;
    })
    .catch(err => {
      dispatch(newError(err));
      throw err;
    });
};

const propertiesFetchSuccess = (properties, page) => ({
  type: FETCH_ALL_properties,
  properties,
  page
});

export const fetchproperties = page => dispatch => {
  axios
    .get(`${baseUrl}/property/all?offset=${page}`)
    .then(response => {
      dispatch(propertiesFetchSuccess(response, page));
    })
    .catch(err => dispatch(newError(err)));
};

const propertyFetchSuccess = property => ({
  type: FETCH_ONE_property,
  property
});

export const fetchproperty = id => dispatch => {
  axios
    .get(`${baseUrl}/property/${id}`)
    .then(res => {
      dispatch(propertyFetchSuccess(res.data));
    })
    .catch(err => dispatch(newError(err)));
};

const gotAgencyAgents = agency => ({
  type: GET_AGENCY_AGENTS,
  agency
});

export const getAgencyAgents = () => (dispatch, getState) => {
  axios
    .get(`${baseUrl}/agency`)
    .then(response => {
      dispatch(gotAgencyAgents(response.data));
    })
    .catch(err => dispatch(newError(err)));
};

const toggleAgentSuccess = agent => ({
  type: TOGGLE_AGENT_CONFIRMATION,
  agent
});

export const toggleAgentAcc = (id, action) => (dispatch, getState) => {
  axios
    .get(`${baseUrl}/agency/agent/${id}?action=${action}`)
    .then(response => {
      dispatch(toggleAgentSuccess(response.data));
    })
    .catch(err => console.log(err));
};

const getMypropertiesSuccess = properties => ({
  type: GET_MY_properties,
  properties
});

export const getMyproperties = () => (dispatch, getState) => {
  axios
    .get(`${baseUrl}/property/myproperty`)
    .then(response => {
      dispatch(getMypropertiesSuccess(response.data));
    })
    .catch(err => console.log(err));
};

export const updateproperty = (id, data) => (dispatch, getState) => {
  return axios
    .put(`${baseUrl}/property/${id}`, { ...data })
    .then(response => {
      dispatch({ type: UPDATE_PROPERTY, property: response.data.property });
      return response.data;
    })
    .catch(err => {
      dispatch(newError(err));
      throw err;
    });
};

export const deleteproperty = id => (dispatch, getState) => {
  return axios
    .delete(`${baseUrl}/property/${id}`)
    .then(response => {
      dispatch({ type: DELETE_PROPERTY, propertyId: id });
      return response.data;
    })
    .catch(err => {
      dispatch(newError(err));
      throw err;
    });
};

const searchedpropertiesFetchSuccess = properties => ({
  type: FETCH_SEARCHED_properties,
  properties
});

export const fetchpropertiesBySearchTerm = (
  page,
  searchBy,
  searchFor,
  searchObj
) => dispatch => {
  let url;
  if (searchObj) {
    let { priceFrom, priceTo, forRent, forSale } = searchObj;
    priceFrom = priceFrom ? `&pricefrom=${priceFrom}` : "";
    priceTo = priceTo ? `&priceto=${priceTo}` : "";
    forRent = forRent ? `&forrent=true` : "";
    forSale = forSale ? `&forsale=true` : "";

    url = `${baseUrl}/property/all?${searchBy}=${searchFor}&offset=${page}${priceFrom}${priceTo}${forRent}${forSale}`;
  } else {
    url = `${baseUrl}/property/all?${searchBy}=${searchFor}&offset=${page}`;
  }
  axios
    .get(url)
    .then(response => {
      dispatch(searchedpropertiesFetchSuccess(response));
    })
    .catch(err => dispatch(newError(err)));
};

export const clearSearchedproperties = () => dispatch => {
  dispatch({ type: CLEAR_SEARCHED_properties });
};

