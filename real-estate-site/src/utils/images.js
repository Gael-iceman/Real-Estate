export const getPrimaryImageUrl = property => {
  if (!property) return "";
  const images = property.property_images || [];
  const primary = images.find(imageCon => imageCon?.image?.isPrimary);
  if (primary?.image?.url) return primary.image.url;
  if (images[0]?.image?.url) return images[0].image.url;
  if (property.image) return property.image;
  return "";
};
