const initialState = {
  likedproperties: []
};

export default function eventReducer(state = initialState, action) {
  switch (action.type) {
    case "LOG_IN__USER": {
      return {
        ...state,
        likedproperties: [...action.user.user.property_user_likes]
      };
    }
    case "LIKE_property": {
      return {
        ...state,
        likedproperties: [...state.likedproperties, action.liked]
      };
    }
    case "DISLIKE_property": {
      return {
        ...state,
        likedproperties: state.likedproperties.filter(
          property => property.propertyId !== action.propertyId
        )
      };
    }
    case "GET_USER_FAVORITES": {
      return {
        ...state,
        userFavorites: action.likes
      };
    }
    default: {
      return state;
    }
  }
}
