import axios from "axios";
import { clearErrors, featurectErrorMessage } from "./error";
import apiBaseUrl from "../apiBase";

const SIGN_UP_USER = "SIGN_UP_USER";
const LOG_IN_USER = "LOG_IN__USER";
const FETCH_USER_TICKETS = "FETCH_USER_TICKETS";
const LOG_OUT_USER = "LOG_OUT_USER";
const USER_ACTION_ERROR = "USER_ACTION_ERROR";
const ADD_feature_properties = "ADD_feature_properties";
const UPDATE_USER_PROFILE = "UPDATE_USER_PROFILE";

const baseUrl = apiBaseUrl;

const userCreateError = error => ({
  type: USER_ACTION_ERROR,
  error: featurectErrorMessage(error)
});

const userCreateSuccess = user => ({
  type: SIGN_UP_USER,
  user
});

export const createUser = data => dispatch => {
  const payload = {
    username: data.username,
    email: data.email,
    phoneNumber: data.phoneNumber,
    password: data.password
  };
  axios
    .post(`${baseUrl}/user/create`, payload)
    .then(response => {
      dispatch(userCreateSuccess(response.data));
      dispatch(clearErrors());
    })
    .catch(err => dispatch(userCreateError(err)));
};

export const createAdminUser = data => (dispatch, getState) => {
  const payload = {
    username: data.username,
    email: data.email,
    phoneNumber: data.phoneNumber,
    password: data.password
  };
  return axios
    .post(`${baseUrl}/admin/create`, payload)
    .then(response => {
      dispatch(clearErrors());
      return response.data;
    })
    .catch(err => {
      dispatch(userCreateError(err));
      throw err;
    });
};

export const updateAdminProfile = data => (dispatch, getState) => {
  const payload = {};
  if (data.username) {
    payload.username = data.username;
  }
  if (data.email) {
    payload.email = data.email;
  }
  if (data.reachoutEmail) {
    payload.reachoutEmail = data.reachoutEmail;
  }
  if (data.reachoutPhone) {
    payload.reachoutPhone = data.reachoutPhone;
  }
  if (data.password) {
    payload.password = data.password;
  }
  return axios
    .put(`${baseUrl}/admin/profile`, payload)
    .then(response => {
      dispatch({ type: UPDATE_USER_PROFILE, user: response.data.user });
      dispatch(clearErrors());
      return response.data;
    })
    .catch(err => {
      dispatch(userCreateError(err));
      throw err;
    });
};

const userLoginSuccess = user => ({
  type: LOG_IN_USER,
  user
});

export const loginUser = data => dispatch => {
  axios
    .post(`${baseUrl}/user/login`, { ...data })
    .then(response => {
      dispatch(userLoginSuccess(response.data));
      dispatch(clearErrors());
    })
    .catch(err => {
      // console.log(err);
      dispatch(userCreateError(err))
    });
};

const userTicketsFetchSuccess = user => ({
  type: FETCH_USER_TICKETS,
  tickets: user.tickets
});

export const fetchUserTickets = userId => (dispatch, getState) => {
  axios
    .get(`${baseUrl}/user/${userId}`)
    .then(response => {
      dispatch(userTicketsFetchSuccess(response.data));
    })
    .catch(err => dispatch(userCreateError(err)));
};

const userLogOutSuccess = () => ({
  type: LOG_OUT_USER,
  logout: true
});

export const logMeOut = () => dispatch => {
  return axios
    .post(`${baseUrl}/auth/logout`)
    .catch(() => {})
    .finally(() => {
      dispatch(userLogOutSuccess());
    });
};

export const restoreSession = () => dispatch => {
  return axios
    .get(`${baseUrl}/auth/session`)
    .then(response => {
      dispatch(userLoginSuccess(response.data));
      dispatch(clearErrors());
      return response.data;
    })
    .catch(() => null);
};

export const creditAddSuccess = user => ({
  type: ADD_feature_properties,
  user
});

