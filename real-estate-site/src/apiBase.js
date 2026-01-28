const fallbackBaseUrl = "http://localhost:4000";
const apiBaseUrl = (process.env.REACT_APP_API_URL || fallbackBaseUrl).replace(
  /\/+$/,
  ""
);

export default apiBaseUrl;
