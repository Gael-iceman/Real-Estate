const initialState = {
  fetchedfeatures: []
};

export default function featureReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_ALL_features": {
      return {
        ...state,
        fetchedfeatures: action.features
      };
    }
    case "ONE_feature_ADDED": {
      const fetchedfeatures = state.fetchedfeatures.filter(
        feature => feature.id !== action.feature.id
      );
      return {
        ...state,
        fetchedfeatures
      };
    }
    case "ONE_feature_REMOVED": {
      return {
        ...state,
        fetchedfeatures: [...state.fetchedfeatures, action.feature]
      };
    }
    default: {
      return state;
    }
  }
}
