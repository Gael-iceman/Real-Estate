import { getPrimaryImageUrl } from "../utils/images";

const initialState = {
  allproperties: [],
  propertiesCount: 0
};

export default function eventReducer(state = initialState, action) {
  // console.log(action);
  const withPrimaryImage = property => {
    if (!property) return property;
    const primaryUrl = getPrimaryImageUrl(property);
    return primaryUrl ? { ...property, image: primaryUrl } : property;
  };
  const updatePropertyList = list => {
    if (!Array.isArray(list)) return list;
    return list.map(withPrimaryImage);
  };
  const mergeUniqueById = (existing, incoming) => {
    const result = [];
    const seen = new Set();
    const add = item => {
      if (!item || item.id === undefined || item.id === null) return;
      const idKey = String(item.id);
      if (seen.has(idKey)) return;
      seen.add(idKey);
      result.push(item);
    };
    (existing || []).forEach(add);
    (incoming || []).forEach(add);
    return result;
  };
  const replacePropertyInList = (list, updated) => {
    if (!Array.isArray(list)) return list;
    return list.map(property =>
      property.id === updated.id ? withPrimaryImage(updated) : property
    );
  };
  const updatePropertyImagesById = (property, updater) => {
    if (!property) return property;
    if (action.propertyId && property.id !== action.propertyId) {
      return property;
    }
    const updated = updater(property);
    return withPrimaryImage(updated);
  };
  switch (action.type) {
    case "CREATE_NEW_property": {
      return {
        ...state,
        lastAddedproperty: action.property,
        allproperties: [...state.allproperties, action.property],
        propertiesCount: state.propertiesCount + 1
      };
    }
    case "FETCH_ALL_properties": {
      const { data, count } = action.properties.data;
      const modifiedproperties = data.map(withPrimaryImage);
      if (action.page === 0) {
        return {
          ...state,
          allproperties: modifiedproperties,
          propertiesCount: count
        };
      }
      if (state.allproperties) {
        return {
          ...state,
          allproperties: mergeUniqueById(state.allproperties, modifiedproperties),
          propertiesCount: count
        };
      }
      return {
        ...state,
        allproperties: modifiedproperties,
        propertiesCount: count
      };
    }
    case "FETCH_SEARCHED_properties": {
      const { data, count } = action.properties.data;
      if (state.searchedproperties) {
        const modifiedproperties = data.map(withPrimaryImage);

        return {
          ...state,
          searchedproperties: [...state.searchedproperties, ...modifiedproperties],
          propertiesCount: count
        };
      }
      return {
        ...state,
        searchedproperties: data,
        propertiesCount: count
      };
    }
    case "FETCH_ONE_property": {
      return {
        ...state,
        selectedproperty: action.property
      };
    }
    case "GET_AGENCY_AGENTS": {
      const agencyAgents = action.agency.users.filter(
        agent => agent.role === "agencyAgent"
      );
      return {
        ...state,
        agencyAgents
      };
    }
    case "CLEAR_SEARCHED_properties": {
      return {
        ...state,
        searchedproperties: [],
        propertiesCount: 0,
        allproperties: []
      };
    }
    case "TOGGLE_AGENT_CONFIRMATION": {
      const agencyAgents = state.agencyAgents.map(agent => {
        if (agent.id === action.agent.id) {
          return { ...action.agent };
        }
        return agent;
      });

      return {
        ...state,
        agencyAgents
      };
    }
    case "GET_MY_properties": {
      return {
        ...state,
        myproperties: updatePropertyList(action.properties),
        mypropertyIds: [...action.properties.map(property => property.id)]
      };
    }
    case "ADD_NEW_IMAGE": {
      const updateImages = property =>
        updatePropertyImagesById(property, current => {
          const currentImages = current.property_images || [];
          return {
            ...current,
            property_images: [
              ...currentImages,
              { image: { ...action.image }, imageId: action.image.id }
            ]
          };
        });
      return {
        ...state,
        selectedproperty: updateImages(state.selectedproperty),
        lastAddedproperty: updateImages(state.lastAddedproperty),
        myproperties: updatePropertyList(
          Array.isArray(state.myproperties)
            ? state.myproperties.map(updateImages)
            : state.myproperties
        ),
        allproperties: updatePropertyList(
          Array.isArray(state.allproperties)
            ? state.allproperties.map(updateImages)
            : state.allproperties
        ),
        searchedproperties: updatePropertyList(
          Array.isArray(state.searchedproperties)
            ? state.searchedproperties.map(updateImages)
            : state.searchedproperties
        )
      };
    }
    case "DELETE_ONE_IMAGE": {
      const removeFromProperty = property =>
        updatePropertyImagesById(property, current => {
          const currentImages = current.property_images || [];
          let nextImages = currentImages;
          if (Array.isArray(action.images)) {
            nextImages = action.images;
          } else if (action.removedId) {
            nextImages = currentImages.filter(
              image =>
                image.imageId !== action.removedId &&
                image.image?.id !== action.removedId
            );
          }
          return { ...current, property_images: nextImages };
        });
      return {
        ...state,
        selectedproperty: removeFromProperty(state.selectedproperty),
        lastAddedproperty: removeFromProperty(state.lastAddedproperty),
        myproperties: updatePropertyList(
          Array.isArray(state.myproperties)
            ? state.myproperties.map(removeFromProperty)
            : state.myproperties
        ),
        allproperties: updatePropertyList(
          Array.isArray(state.allproperties)
            ? state.allproperties.map(removeFromProperty)
            : state.allproperties
        ),
        searchedproperties: updatePropertyList(
          Array.isArray(state.searchedproperties)
            ? state.searchedproperties.map(removeFromProperty)
            : state.searchedproperties
        )
      };
    }
    case "SET_PRIMARY_IMAGE": {
      const updatePropertyImages = property => {
        if (!property || property.id !== action.propertyId) {
          return property;
        }
        const primaryUrl = action.images?.[0]?.image?.url;
        const updated = { ...property, property_images: action.images };
        if (primaryUrl) {
          updated.image = primaryUrl;
        }
        return updated;
      };

      const updatePropertyList = list => {
        if (!Array.isArray(list)) return list;
        return list.map(updatePropertyImages);
      };

      return {
        ...state,
        selectedproperty: updatePropertyImages(state.selectedproperty),
        lastAddedproperty: updatePropertyImages(state.lastAddedproperty),
        myproperties: updatePropertyList(state.myproperties),
        allproperties: updatePropertyList(state.allproperties),
        searchedproperties: updatePropertyList(state.searchedproperties)
      };
    }
    case "ONE_feature_ADDED": {
      return {
        ...state,
        selectedproperty: {
          ...state.selectedproperty,
          property_features: [
            ...state.selectedproperty.property_features,
            { featureId: action.feature.id, feature: action.feature }
          ]
        }
      };
    }
    case "ONE_feature_REMOVED": {
      const property_features = state.selectedproperty.property_features.filter(
        propertyCon => propertyCon.featureId !== action.feature.id
      );
      return {
        ...state,
        selectedproperty: {
          ...state.selectedproperty,
          property_features
        }
      };
    }
    case "UPDATE_PROPERTY_VIDEO": {
      const updateVideo = property => {
        if (!property) return property;
        if (action.video?.propertyId && property.id !== action.video.propertyId) {
          return property;
        }
        return {
          ...property,
          videoUrl: action.video.url
        };
      };
      return {
        ...state,
        selectedproperty: updateVideo(state.selectedproperty),
        lastAddedproperty: updateVideo(state.lastAddedproperty)
      };
    }
    case "UPDATE_PROPERTY": {
      const updated = action.property;
      return {
        ...state,
        selectedproperty:
          state.selectedproperty && state.selectedproperty.id === updated.id
            ? withPrimaryImage(updated)
            : state.selectedproperty,
        lastAddedproperty:
          state.lastAddedproperty && state.lastAddedproperty.id === updated.id
            ? withPrimaryImage(updated)
            : state.lastAddedproperty,
        myproperties: replacePropertyInList(state.myproperties, updated),
        allproperties: replacePropertyInList(state.allproperties, updated),
        searchedproperties: replacePropertyInList(state.searchedproperties, updated)
      };
    }
    case "DELETE_PROPERTY": {
      const propertyId = action.propertyId;
      const removeFromList = list =>
        Array.isArray(list) ? list.filter(property => property.id !== propertyId) : list;
      return {
        ...state,
        selectedproperty:
          state.selectedproperty && state.selectedproperty.id === propertyId
            ? null
            : state.selectedproperty,
        lastAddedproperty:
          state.lastAddedproperty && state.lastAddedproperty.id === propertyId
            ? null
            : state.lastAddedproperty,
        myproperties: removeFromList(state.myproperties),
        allproperties: removeFromList(state.allproperties),
        searchedproperties: removeFromList(state.searchedproperties),
        mypropertyIds: Array.isArray(state.mypropertyIds)
          ? state.mypropertyIds.filter(id => id !== propertyId)
          : state.mypropertyIds
      };
    }
    case "LOG_OUT_USER": {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
