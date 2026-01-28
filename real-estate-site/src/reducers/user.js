const initialState = null;

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case "SIGN_UP_USER": {
      return action.user;
    }
    case "LOG_IN__USER": {
      return action.user;
    }
    case "LOG_OUT_USER": {
      return initialState;
    }
    case "UPDATE_USER_PROFILE": {
      if (!state?.user) {
        return state;
      }
      const updatedState = {
        ...state,
        user: { ...state.user, ...action.user }
      };
      return updatedState;
    }
    case "ADD_feature_properties": {
      if (!state?.user) {
        return state;
      }
      return {
        ...state,
        user: { ...state.user, ...action.user }
      };
    }
    case "CREATE_NEW_property": {
      if (!state?.user) {
        return state;
      }
      return {
        ...state,
        user: { ...state.user, ...action.user }
      };
    }
    case "LIKE_property": {
      if (!state?.user) {
        return state;
      }
      const currentLikes = Array.isArray(state.user.property_user_likes)
        ? state.user.property_user_likes
        : [];
      const nextLikes = [...currentLikes, action.liked];
      const updatedState = {
        ...state,
        user: { ...state.user, property_user_likes: nextLikes }
      };
      return updatedState;
    }
    case "DISLIKE_property": {
      if (!state?.user) {
        return state;
      }
      const currentLikes = Array.isArray(state.user.property_user_likes)
        ? state.user.property_user_likes
        : [];
      const nextLikes = currentLikes.filter(
        like => like.propertyId !== action.propertyId
      );
      const updatedState = {
        ...state,
        user: { ...state.user, property_user_likes: nextLikes }
      };
      return updatedState;
    }
    default: {
      return state;
    }
  }
}
