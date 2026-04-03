const crypto = require("crypto");
const { v2: cloudinary } = require("cloudinary");

const {
  CLOUDINARY_URL = "",
  CLOUDINARY_CLOUD_NAME = "",
  CLOUDINARY_API_KEY = "",
  CLOUDINARY_API_SECRET = ""
} = process.env;

const hasCloudinaryUrl = Boolean(String(CLOUDINARY_URL || "").trim());
const hasSeparateConfig = Boolean(
  CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET
);

const isCloudinaryConfigured = hasCloudinaryUrl || hasSeparateConfig;

if (isCloudinaryConfigured) {
  if (hasSeparateConfig) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true
    });
  } else {
    cloudinary.config({ secure: true });
  }
}

const buildCloudinaryPublicId = prefix => `${prefix}_${crypto.randomUUID()}`;

const uploadBufferToCloudinary = (buffer, options) => {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary is not configured");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });

    stream.end(buffer);
  });
};

const destroyCloudinaryAsset = async (publicId, resourceType = "image") => {
  if (!publicId || !isCloudinaryConfigured) {
    return null;
  }

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true
  });
};

const getCloudinaryPublicIdFromUrl = url => {
  if (!url) return null;

  const safeUrl = String(url).split("?")[0];
  const uploadMarker = "/upload/";
  const markerIndex = safeUrl.indexOf(uploadMarker);

  if (markerIndex === -1) {
    return null;
  }

  const uploadPath = safeUrl.slice(markerIndex + uploadMarker.length);
  const segments = uploadPath.split("/").filter(Boolean);

  while (segments.length && /^v\d+$/.test(segments[0])) {
    segments.shift();
  }

  if (!segments.length) {
    return null;
  }

  const filename = segments.pop();
  const extensionIndex = filename.lastIndexOf(".");
  const lastSegment =
    extensionIndex === -1 ? filename : filename.slice(0, extensionIndex);

  return [...segments, lastSegment].join("/");
};

module.exports = {
  buildCloudinaryPublicId,
  destroyCloudinaryAsset,
  getCloudinaryPublicIdFromUrl,
  isCloudinaryConfigured,
  uploadBufferToCloudinary
};
