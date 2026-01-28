const initialState = null;

export default function successReducer(state = initialState, action) {
  switch (action.type) {
    case "CREATE_NEW_property": {
      return {
        text: "You have successfully added a new property_listing."
      };
    }
    case "TOGGLE_AGENT_CONFIRMATION": {
      return {
        text: `Agent profile ${action.agent.agentConfirmedByManager
          ? "confirmed successfully"
          : "successfully blocked"
          }.`
      };
    }
    case "SIGN_UP_USER": {
      return {
        text: "Thank you for your registration. Now you can Login."
      };
    }
    case "LOG_IN__USER": {
      return {
        text: `Welcome back ${action.user.user.username}`
      };
    }
    case "LOG_OUT_USER": {
      return {
        text: `Thank you for your visit. See you soon.`
      };
    }
    case "ONE_feature_ADDED": {
      return {
        text: `Feature was successfully added.`
      };
    }
    case "ONE_feature_REMOVED": {
      return {
        text: `Feature was successfully removed.`
      };
    }
    case "ADD_NEW_IMAGE": {
      return {
        text: `property_listing image succesfully uploaded.`
      };
    }
    case "DELETE_ONE_IMAGE": {
      return {
        text: `property_listing image succesfully removed.`
      };
    }
    case "LIKE_property": {
      return {
        text: `property_listing succesfully added to your Favorites list.`
      };
    }
    case "DISLIKE_property": {
      return {
        text: `property_listing succesfully removed from your Favorites list.`
      };
    }
    case "CLEAR_SUCCESS": {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
