import React from 'react';
import { connect } from 'react-redux';
import PropertyCard from '../property/PropertyCard/PropertyCard';
import { likeproperty } from "../../actions/likes";
import { isAdminUser } from "../../utils/roles";

/**
 * propertyCard Wrapper
 * Maintains backward compatibility while using new PropertyCard
 */
const propertyCard = ({ property, userReducer, likeReducer, likeproperty }) => {
  // Check if property is favorited - with proper array checks
  const isFavorite = userReducer?.user?.property_user_likes?.some(
    like => like.propertyId === property.id
  ) || (Array.isArray(likeReducer?.likedproperties) && likeReducer.likedproperties.some(like => like.propertyId === property.id));
  const isAdmin = isAdminUser(userReducer?.user);
  const detailPath = isAdmin ? `/update/${property.id}` : `/view/${property.id}`;

  // Handle favorite toggle (TODO: Connect to Redux action)
  const handleFavoriteToggle = (id) => {
    if (!userReducer?.user?.id) {
      window.location.href = "/login";
      return;
    }
    likeproperty(id);
  };

  return (
    <PropertyCard
      property={property}
      isFavorite={isFavorite}
      onFavoriteToggle={handleFavoriteToggle}
      detailPath={detailPath}
    />
  );
};

function mapStateToProps(state) {
  return {
    userReducer: state.userReducer,
    likeReducer: state.likeReducer
  };
}

export default connect(mapStateToProps, { likeproperty })(propertyCard);
