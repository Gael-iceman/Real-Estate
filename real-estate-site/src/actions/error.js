const ACTION_ERROR = "ACTION_ERROR";
const CLEAR_ERRORS = "CLEAR_ERRORS";
const CLEAR_SUCCESS = "CLEAR_SUCCESS";

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

export const featurectErrorMessage = error => {
  if (!error) {
    return DEFAULT_ERROR_MESSAGE;
  }

  const response = error.response || error;
  const data = response.data ?? response;

  if (typeof data === "string") {
    return data;
  }

  if (data && typeof data.message === "string") {
    return data.message;
  }

  if (data && typeof data.error === "string") {
    return data.error;
  }

  if (typeof error.message === "string") {
    return error.message;
  }

  return DEFAULT_ERROR_MESSAGE;
};

export const newError = error => ({
  type: ACTION_ERROR,
  error: featurectErrorMessage(error)
});

export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};

export const clearSuccess = () => dispatch => {
  dispatch({ type: CLEAR_SUCCESS });
};
