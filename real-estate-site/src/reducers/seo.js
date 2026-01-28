const initialState = {
  fetchedCities: []
};

export default function featureReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_ALL_CITIES": {
      return {
        ...state,
        fetchedCities: action.cities.sort((a, b) => b.propertyCount - a.propertyCount).filter((property, i) => i < 20)
      };
    }
    default: {
      return state;
    }
  }
}
