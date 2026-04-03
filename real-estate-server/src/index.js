require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const pool = require("./db");
const {
  buildCloudinaryPublicId,
  destroyCloudinaryAsset,
  getCloudinaryPublicIdFromUrl,
  isCloudinaryConfigured,
  uploadBufferToCloudinary
} = require("./cloudinary");
const { requireAuth } = require("./auth");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PASSWORD_FIELDS = new Set([
  "password",
  "repeatpassword",
  "passwordconfirm",
  "newpassword",
  "oldpassword"
]);
const DANGEROUS_PATTERN = /<|>|javascript:|data:text\/html/i;
const CONTROL_CHARS_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const sanitizeString = (value, key, path, issues) => {
  const original = String(value);
  const keyLower = String(key || "").toLowerCase();
  let sanitized = original;

  if (!PASSWORD_FIELDS.has(keyLower)) {
    sanitized = sanitized.trim();
  }

  if (CONTROL_CHARS_PATTERN.test(sanitized)) {
    sanitized = sanitized.replace(CONTROL_CHARS_PATTERN, "");
    issues.push({ path, reason: "Control characters are not allowed." });
  }

  if (!PASSWORD_FIELDS.has(keyLower) && DANGEROUS_PATTERN.test(sanitized)) {
    issues.push({ path, reason: "Potentially dangerous content detected." });
  }

  return sanitized;
};

const sanitizeValue = (value, key, path, issues) => {
  if (value === null || value === undefined) return value;

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return typeof value === "string"
      ? sanitizeString(value, key, path, issues)
      : value;
  }

  if (Array.isArray(value)) {
    return value.map((entry, index) =>
      sanitizeValue(entry, key, `${path}[${index}]`, issues)
    );
  }

  if (typeof value === "object") {
    const sanitizedObj = {};
    Object.entries(value).forEach(([childKey, childValue]) => {
      if (childKey === "__proto__" || childKey === "constructor" || childKey === "prototype") {
        issues.push({ path: `${path}.${childKey}`, reason: "Invalid field name." });
        return;
      }
      sanitizedObj[childKey] = sanitizeValue(
        childValue,
        childKey,
        `${path}.${childKey}`,
        issues
      );
    });
    return sanitizedObj;
  }

  return value;
};

const ALLOWED_IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".bmp",
  ".tiff",
  ".avif"
]);

const isAllowedImageFile = file => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
    return false;
  }
  if (file.mimetype && !file.mimetype.toLowerCase().startsWith("image/")) {
    return false;
  }
  return true;
};

const storage = multer.memoryStorage();

const IMAGE_UPLOAD_MAX_MB = Number.parseInt(
  process.env.IMAGE_UPLOAD_MAX_MB || "10",
  10
);
const imageUploadLimitBytes = Number.isFinite(IMAGE_UPLOAD_MAX_MB)
  ? IMAGE_UPLOAD_MAX_MB * 1024 * 1024
  : 10 * 1024 * 1024;

const upload = multer({
  storage,
  limits: { fileSize: imageUploadLimitBytes },
  fileFilter: (req, file, cb) => {
    if (!isAllowedImageFile(file)) {
      req.fileValidationError = "Only image files with supported extensions are allowed.";
      return cb(null, false);
    }
    return cb(null, true);
  }
});

const videoUpload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

const {
  JWT_SECRET = "",
  PORT = 4000,
  CLIENT_ORIGIN = "http://localhost:3000",
  JWT_COOKIE_NAME = "re_auth",
  COOKIE_SAMESITE = "",
  COOKIE_SECURE = ""
} = process.env;

const allowedOrigins = CLIENT_ORIGIN.split(",").map(origin => origin.trim()).filter(Boolean);

const isProduction = process.env.NODE_ENV === "production";
const parseEnvBool = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(normalized)) return true;
  if (["false", "0", "no", "n"].includes(normalized)) return false;
  return fallback;
};

const normalizedSameSite = String(COOKIE_SAMESITE || "").trim().toLowerCase();
const sameSiteDefault = isProduction ? "none" : "lax";
const sameSiteValue = ["lax", "strict", "none"].includes(normalizedSameSite)
  ? normalizedSameSite
  : sameSiteDefault;
const secureValue = sameSiteValue === "none"
  ? true
  : parseEnvBool(COOKIE_SECURE, isProduction);

const authCookieOptions = {
  httpOnly: true,
  sameSite: sameSiteValue,
  secure: secureValue,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/"
};

const setAuthCookie = (res, token) => {
  res.cookie(JWT_COOKIE_NAME, token, authCookieOptions);
};

const clearAuthCookie = res => {
  res.clearCookie(JWT_COOKIE_NAME, { ...authCookieOptions, maxAge: 0 });
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

const asyncHandler = fn => (req, res, next) => {
  const issues = [];
  req.body = sanitizeValue(req.body, "body", "body", issues);
  req.query = sanitizeValue(req.query, "query", "query", issues);
  req.params = sanitizeValue(req.params, "params", "params", issues);

  if (issues.length) {
    const fields = issues.map(issue => issue.path).slice(0, 10);
    return res.status(400).json({
      message: "Invalid input detected.",
      fields
    });
  }

  return Promise.resolve(fn(req, res, next)).catch(next);
};

const toBool = value => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return false;
};

const normalizeAmenities = input => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map(item => String(item || "").trim()).filter(Boolean);
  }
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(item => String(item || "").trim()).filter(Boolean);
      }
    } catch (err) {
      // fall through to comma split
    }
    return trimmed
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeRole = role => String(role || "").toLowerCase();
const MAX_SQR_METER = 99999999.99;

const parseNumberOrNull = value => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const parseCoordinate = value => {
  if (value === null || value === undefined) {
    return { value: null, hasValue: false };
  }
  const trimmed = String(value).trim();
  if (!trimmed) {
    return { value: null, hasValue: false };
  }
  const num = Number(trimmed);
  return { value: Number.isFinite(num) ? num : null, hasValue: true };
};

const isValidLatitude = value => Number.isFinite(value) && value >= -90 && value <= 90;
const isValidLongitude = value => Number.isFinite(value) && value >= -180 && value <= 180;

let propertyColumnsCache = null;
const loadPropertyColumns = async () => {
  if (propertyColumnsCache) return propertyColumnsCache;
  const [rows] = await pool.query(
    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'properties'"
  );
  propertyColumnsCache = new Set(rows.map(row => row.COLUMN_NAME));
  return propertyColumnsCache;
};

const isAdminRole = role => {
  const normalized = normalizeRole(role);
  return normalized === "admin";
};

const getPublicIdFromUrl = url => getCloudinaryPublicIdFromUrl(url);

const resolveStoredPublicId = (storedPublicId, url) =>
  storedPublicId || getPublicIdFromUrl(url);

const destroyStoredAsset = async (publicId, resourceType) => {
  if (!publicId) return;

  try {
    await destroyCloudinaryAsset(publicId, resourceType);
  } catch (err) {
    console.error(`Failed to delete Cloudinary ${resourceType}:`, err.message);
  }
};

const mapPropertyImageRow = row => ({
  imageId: row.id,
  image: {
    id: row.id,
    url: row.image_url,
    public_id: resolveStoredPublicId(row.public_id, row.image_url),
    isPrimary: Boolean(row.is_primary),
    displayOrder: row.display_order,
    caption: row.caption
  }
});

const mapAgencyRow = row =>
  row
    ? {
      id: row.id,
      name: row.name,
      description: row.description,
      phone: row.phone,
      email: row.email,
      website: row.website,
      address: row.address,
      logoUrl: row.logo_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
    : null;

const mapAgencyPublic = row =>
  row
    ? {
      id: row.id,
      name: row.name,
      logoUrl: row.logo_url
    }
    : null;

const mapUserRow = row => ({
  id: row.id,
  username: row.username,
  email: row.email,
  phoneNumber: row.phone_number,
  reachoutEmail: row.reachout_email,
  reachoutPhone: row.reachout_phone,
  role: row.role,
  agencyId: row.agency_id,
  agentConfirmedByManager: true,
  freepropertyLimit: 0,
  paidpropertyLimit: 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const mapUserPublic = (row, agencyRow) => ({
  id: row.id,
  username: row.username,
  reachoutEmail: row.reachout_email,
  reachoutPhone: row.reachout_phone,
  agency: mapAgencyPublic(agencyRow)
});

const mapUserSession = user => ({
  id: user.id,
  username: user.username,
  email: user.email,
  phoneNumber: user.phoneNumber,
  reachoutEmail: user.reachoutEmail,
  reachoutPhone: user.reachoutPhone,
  role: user.role,
  agency: user.agency
    ? {
      id: user.agency.id,
      name: user.agency.name,
      logoUrl: user.agency.logoUrl
    }
    : null,
  property_user_likes: Array.isArray(user.property_user_likes)
    ? user.property_user_likes
    : [],
  freepropertyLimit: user.freepropertyLimit ?? 0,
  paidpropertyLimit: user.paidpropertyLimit ?? 0
});

const mappropertyRow = row => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  description: row.description,
  price: Number(row.price),
  currency: row.currency || "RWF",
  address: row.address,
  city: row.city,
  postcode: row.postcode,
  country: row.country,
  contactEmail: row.contact_email,
  contactPhone: row.contact_phone,
  nrOfRooms: row.nrOfRooms,
  nrOfBathrooms: row.nrOfBathrooms,
  sqrMeter: row.sqrMeter,
  cubicMeter: row.cubicMeter,
  nrOfFloors: row.nrOfFloors,
  locatedOnFloor: row.locatedOnFloor,
  monthlyContribution: row.monthlyContribution,
  constructionYear: row.constructionYear,
  renovationYear: row.renovationYear,
  heating: row.heating,
  warmWater: row.warmWater,
  storage: row.storage,
  wifi: row.wifi,
  propertyType: row.propertyType,
  isForSale: Boolean(row.isForSale),
  isForRent: Boolean(row.isForRent),
  parking: row.parking,
  hasGarden: Boolean(row.hasGarden),
  hasBalcony: Boolean(row.hasBalcony),
  hasElevator: Boolean(row.hasElevator),
  isFurnished: Boolean(row.isFurnished),
  lat: row.latitude,
  lon: row.longitude,
  videoUrl: row.video_url,
  videoPublicId: resolveStoredPublicId(row.video_public_id, row.video_url),
  propertiestatus: row.status,
  featured: Boolean(row.featured),
  views: row.views,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  publishedAt: row.published_at,
  property_images: [],
  property_features: []
});

const getAgencyById = async agencyId => {
  const [rows] = await pool.query(
    "SELECT id, name, description, phone, email, website, address, logo_url, created_at, updated_at FROM agencies WHERE id = :agencyId",
    { agencyId }
  );
  return rows[0] || null;
};

const getUserRowById = async userId => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = :userId", {
    userId
  });
  return rows[0] || null;
};

const ensureAdminUser = async userId => {
  const userRow = await getUserRowById(userId);
  if (!userRow) {
    return { ok: false, status: 404, message: "User not found" };
  }
  if (!isAdminRole(userRow.role)) {
    return { ok: false, status: 403, message: "Admin access required" };
  }
  return { ok: true, userRow };
};

const getUserLikes = async userId => {
  const [rows] = await pool.query(
    "SELECT id, property_id AS propertyId FROM property_user_likes WHERE user_id = :userId",
    { userId }
  );
  return rows;
};

const buildUser = async userRow => {
  const user = mapUserRow(userRow);
  if (userRow.agency_id) {
    const agency = await getAgencyById(userRow.agency_id);
    user.agency = mapAgencyRow(agency);
  }
  user.property_user_likes = await getUserLikes(userRow.id);
  return user;
};

const attachImagesToproperties = async properties => {
  if (!properties.length) return;
  const propertyIds = properties.map(property => property.id);
  const [rows] = await pool.query(
    "SELECT id, property_id, image_url, public_id, is_primary, display_order, caption FROM property_images WHERE property_id IN (:propertyIds) ORDER BY is_primary DESC, display_order ASC, id ASC",
    { propertyIds }
  );

  const imageMap = new Map();
  rows.forEach(row => {
    if (!imageMap.has(row.property_id)) {
      imageMap.set(row.property_id, []);
    }
    imageMap.get(row.property_id).push(mapPropertyImageRow(row));
  });

  properties.forEach(property => {
    property.property_images = imageMap.get(property.id) || [];
  });
};

const attachfeaturesToproperties = async properties => {
  if (!properties.length) return;
  const propertyIds = properties.map(property => property.id);
  const [rows] = await pool.query(
    "SELECT id, property_id, amenity_name, amenity_type, description FROM property_extras WHERE property_id IN (:propertyIds)",
    { propertyIds }
  );

  const featureMap = new Map();
  rows.forEach(row => {
    if (!featureMap.has(row.property_id)) {
      featureMap.set(row.property_id, []);
    }
    featureMap.get(row.property_id).push({
      featureId: row.id,
      feature: { id: row.id, text: row.amenity_name }
    });
  });

  properties.forEach(property => {
    property.property_features = featureMap.get(property.id) || [];
  });
};

const findpropertyById = async propertyId => {
  if (!Number.isFinite(propertyId)) {
    return null;
  }
  const [rows] = await pool.query("SELECT * FROM properties WHERE id = :propertyId", {
    propertyId
  });
  return rows[0] || null;
};

const ensurepropertyOwner = async (propertyId, userId) => {
  const propertyRow = await findpropertyById(propertyId);
  if (!propertyRow) {
    return { ok: false, status: 404, message: "property_listing not found" };
  }
  if (propertyRow.user_id !== userId) {
    return { ok: false, status: 403, message: "Not allowed" };
  }
  return { ok: true, propertyRow };
};

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post(
  "/user/create",
  asyncHandler(async (req, res) => {
    const username = String(req.body.username || "").trim();
    const email = String(req.body.email || "").trim();
    const phoneNumber = String(req.body.phoneNumber || "").trim();
    const password = req.body.password;

    if (
      req.body.role !== undefined ||
      req.body.isAdmin !== undefined ||
      req.body.admin !== undefined
    ) {
      return res.status(400).json({ message: "Role cannot be set during registration" });
    }

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = :email",
      { email }
    );
    if (existing.length) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const insertWithNames =
      "INSERT INTO users (username, email, phone_number, password_hash, role) VALUES (:username, :email, :phoneNumber, :passwordHash, :role)";
    const insertParams = {
      username,
      email,
      phoneNumber: phoneNumber || null,
      passwordHash: hashed,
      role: "client"
    };
    let result;
    [result] = await pool.query(insertWithNames, insertParams);

    const [userRows] = await pool.query(
      "SELECT * FROM users WHERE id = :userId",
      { userId: result.insertId }
    );

    const user = await buildUser(userRows[0]);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d"
    });

    setAuthCookie(res, token);
    res.json({
      user: mapUserSession(user),
      justRegistered: true
    });
  })
);

app.post(
  "/user/login",
  asyncHandler(async (req, res) => {
    const identifier = String(
      req.body.identifier || req.body.email || req.body.username || ""
    ).trim();
    const password = req.body.password;
    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email or username and password required"
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = :identifier OR username = :identifier",
      { identifier }
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userRow = rows[0];
    const ok = await bcrypt.compare(password, userRow.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = await buildUser(userRow);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d"
    });

    setAuthCookie(res, token);
    res.json({ user: mapUserSession(user) });
  })
);

app.get(
  "/auth/session",
  requireAuth,
  asyncHandler(async (req, res) => {
    const userRow = await getUserRowById(req.userId);
    if (!userRow) {
      clearAuthCookie(res);
      return res.status(404).json({ message: "User not found" });
    }
    const user = await buildUser(userRow);
    res.json({ user: mapUserSession(user) });
  })
);

app.post("/auth/logout", (req, res) => {
  clearAuthCookie(res);
  res.json({ logout: true });
});

app.get(
  "/user/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.id);
    if (!Number.isFinite(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (req.userId !== userId) {
      const adminCheck = await ensureAdminUser(req.userId);
      if (!adminCheck.ok) {
        return res.status(403).json({ message: "Not allowed" });
      }
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE id = :userId", {
      userId
    });
    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = await buildUser(rows[0]);
    res.json({ ...mapUserSession(user), tickets: [] });
  })
);

app.get(
  "/agency/findby",
  asyncHandler(async (req, res) => {
    const name = req.query.name ? `%${req.query.name}%` : "%";
    const [rows] = await pool.query(
      "SELECT id, name FROM agencies WHERE name LIKE :name ORDER BY name ASC LIMIT 10",
      { name }
    );
    res.json(rows);
  })
);

app.get(
  "/agency",
  requireAuth,
  asyncHandler(async (req, res) => {
    const [userRows] = await pool.query("SELECT * FROM users WHERE id = :id", {
      id: req.userId
    });
    if (!userRows.length) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!userRows[0].agency_id) {
      return res.status(400).json({ message: "User has no agency" });
    }

    const agency = await getAgencyById(userRows[0].agency_id);
    const [users] = await pool.query(
      "SELECT * FROM users WHERE agency_id = :agencyId",
      { agencyId: userRows[0].agency_id }
    );

    const mappedUsers = await Promise.all(users.map(buildUser));

    res.json({
      ...mapAgencyRow(agency),
      users: mappedUsers
    });
  })
);

app.get(
  "/agency/agent/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const agentId = Number(req.params.id);
    const [agentRows] = await pool.query("SELECT * FROM users WHERE id = :agentId", {
      agentId
    });
    if (!agentRows.length) {
      return res.status(404).json({ message: "Agent not found" });
    }

    const updated = await buildUser(agentRows[0]);
    res.json(updated);
  })
);

app.post(
  "/admin/create",
  requireAuth,
  asyncHandler(async (req, res) => {
    const adminCheck = await ensureAdminUser(req.userId);
    if (!adminCheck.ok) {
      return res
        .status(adminCheck.status)
        .json({ message: adminCheck.message });
    }

    const username = String(req.body.username || "").trim();
    const email = String(req.body.email || "").trim();
    const phoneNumber = String(req.body.phoneNumber || "").trim();
    const password = req.body.password;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = :email OR username = :username",
      { email, username }
    );
    if (existing.length) {
      return res.status(400).json({ message: "Username or email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const insertSql =
      "INSERT INTO users (username, email, phone_number, password_hash, role) VALUES (:username, :email, :phoneNumber, :passwordHash, :role)";
    const insertParams = {
      username,
      email,
      phoneNumber: phoneNumber || null,
      passwordHash: hashed,
      role: "admin"
    };

    let result;
    [result] = await pool.query(insertSql, insertParams);

    const [userRows] = await pool.query(
      "SELECT * FROM users WHERE id = :userId",
      { userId: result.insertId }
    );

    const newAdmin = await buildUser(userRows[0]);
    res.json({ admin: mapUserSession(newAdmin) });
  })
);

app.put(
  "/admin/profile",
  requireAuth,
  asyncHandler(async (req, res) => {
    const adminCheck = await ensureAdminUser(req.userId);
    if (!adminCheck.ok) {
      return res
        .status(adminCheck.status)
        .json({ message: adminCheck.message });
    }

    const updates = [];
    const params = { userId: req.userId };

    if (req.body.username !== undefined) {
      const username = String(req.body.username || "").trim();
      if (!username) {
        return res.status(400).json({ message: "Username cannot be empty" });
      }
      updates.push("username = :username");
      params.username = username;
    }

    if (req.body.email !== undefined) {
      const email = String(req.body.email || "").trim();
      if (!email) {
        return res.status(400).json({ message: "Email cannot be empty" });
      }
      updates.push("email = :email");
      params.email = email;
    }

    if (req.body.password !== undefined) {
      const password = String(req.body.password || "");
      if (!password) {
        return res.status(400).json({ message: "Password cannot be empty" });
      }
      const hashed = await bcrypt.hash(password, 10);
      updates.push("password_hash = :passwordHash");
      params.passwordHash = hashed;
    }

    if (req.body.reachoutEmail !== undefined) {
      const reachoutEmail = String(req.body.reachoutEmail || "").trim();
      updates.push("reachout_email = :reachoutEmail");
      params.reachoutEmail = reachoutEmail || null;
    }

    if (req.body.reachoutPhone !== undefined) {
      const reachoutPhone = String(req.body.reachoutPhone || "").trim();
      updates.push("reachout_phone = :reachoutPhone");
      params.reachoutPhone = reachoutPhone || null;
    }

    if (!updates.length) {
      return res.status(400).json({ message: "No profile fields to update" });
    }

    const conflictChecks = [];
    if (params.username) conflictChecks.push("username = :username");
    if (params.email) conflictChecks.push("email = :email");
    if (conflictChecks.length) {
      const [existing] = await pool.query(
        `SELECT id FROM users WHERE (${conflictChecks.join(" OR ")}) AND id != :userId`,
        params
      );
      if (existing.length) {
        return res.status(400).json({ message: "Username or email already registered" });
      }
    }

    await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = :userId`,
      params
    );

    const [userRows] = await pool.query(
      "SELECT * FROM users WHERE id = :userId",
      { userId: req.userId }
    );
    if (!userRows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await buildUser(userRows[0]);
    res.json({ user: mapUserSession(updatedUser) });
  })
);

app.post(
  "/property",
  requireAuth,
  asyncHandler(async (req, res) => {
    const adminCheck = await ensureAdminUser(req.userId);
    if (!adminCheck.ok) {
      return res
        .status(adminCheck.status)
        .json({ message: adminCheck.message });
    }

    const userRow = adminCheck.userRow;
    const statusValue = req.body.propertiestatus || req.body.status || "active";
    const normalizedStatus =
      statusValue === "published" ? "active" : statusValue;
    const latParsed = parseCoordinate(req.body.lat ?? req.body.latitude);
    const lonParsed = parseCoordinate(req.body.lon ?? req.body.longitude);
    const propertyColumns = await loadPropertyColumns();
    const supportsCurrency = propertyColumns?.has("currency");
    const rawCurrency = String(req.body.currency || req.body.priceCurrency || "RWF")
      .trim()
      .toUpperCase();
    const normalizedCurrency = rawCurrency === "USD" ? "USD" : "RWF";

    if (latParsed.hasValue && !isValidLatitude(latParsed.value)) {
      return res.status(400).json({
        message: "Latitude must be between -90 and 90."
      });
    }
    if (lonParsed.hasValue && !isValidLongitude(lonParsed.value)) {
      return res.status(400).json({
        message: "Longitude must be between -180 and 180."
      });
    }

    const payload = {
      userId: req.userId,
      title: (req.body.title || req.body.address || "Untitled property").trim(),
      description: req.body.description || "",
      price: Number(req.body.price) || 0,
      currency: normalizedCurrency,
      address: req.body.address || "",
      city: req.body.city || "",
      postcode: req.body.postcode || "",
      country: req.body.country || "Rwanda",
      contactEmail: String(req.body.contactEmail || req.body.contact_email || "").trim() || null,
      contactPhone: String(req.body.contactPhone || req.body.contact_phone || "").trim() || null,
      nrOfRooms: Number(req.body.nrOfRooms) || 0,
      nrOfBathrooms: Number(req.body.nrOfBathrooms) || 0,
      nrOfFloors: parseNumberOrNull(req.body.nrOfFloors),
      sqrMeter: parseNumberOrNull(req.body.sqrMeter),
      constructionYear: parseNumberOrNull(req.body.constructionYear),
      renovationYear: parseNumberOrNull(req.body.renovationYear),
      propertyType: String(req.body.propertyType || "house").trim().toLowerCase(),
      isForSale: toBool(req.body.isForSale),
      isForRent: toBool(req.body.isForRent),
      parking: req.body.parking || null,
      hasGarden: toBool(req.body.hasGarden),
      hasBalcony: toBool(req.body.hasBalcony),
      hasElevator: toBool(req.body.hasElevator),
      isFurnished: toBool(req.body.isFurnished),
      latitude: latParsed.value,
      longitude: lonParsed.value,
      videoUrl: req.body.videoUrl || null,
      status: normalizedStatus,
      featured: toBool(req.body.featured),
      views: Number(req.body.views) || 0
    };

    if (payload.sqrMeter !== null && payload.sqrMeter !== undefined) {
      if (!Number.isFinite(payload.sqrMeter)) {
        return res.status(400).json({ message: "Square meter must be a number." });
      }
      if (payload.sqrMeter < 0 || payload.sqrMeter > MAX_SQR_METER) {
        return res.status(400).json({
          message: `Square meter must be between 0 and ${MAX_SQR_METER}.`
        });
      }
    }

    const buildPropertyInsertStatements = (includeContact, includeCurrency) => {
      const contactColumns = includeContact ? ", contact_email, contact_phone" : "";
      const contactValues = includeContact ? ", :contactEmail, :contactPhone" : "";
      const currencyColumn = includeCurrency ? ", currency" : "";
      const currencyValue = includeCurrency ? ", :currency" : "";
      return {
        insertWithVideo:
          "INSERT INTO properties (user_id, title, description, price, address, city, postcode, country" +
          contactColumns +
          currencyColumn +
          ", nrOfRooms, nrOfBathrooms, nrOfFloors, sqrMeter, constructionYear, renovationYear, propertyType, isForSale, isForRent, parking, hasGarden, hasBalcony, hasElevator, isFurnished, latitude, longitude, video_url, status, featured, views) VALUES (:userId, :title, :description, :price, :address, :city, :postcode, :country" +
          contactValues +
          currencyValue +
          ", :nrOfRooms, :nrOfBathrooms, :nrOfFloors, :sqrMeter, :constructionYear, :renovationYear, :propertyType, :isForSale, :isForRent, :parking, :hasGarden, :hasBalcony, :hasElevator, :isFurnished, :latitude, :longitude, :videoUrl, :status, :featured, :views)",
        insertWithoutVideo:
          "INSERT INTO properties (user_id, title, description, price, address, city, postcode, country" +
          contactColumns +
          currencyColumn +
          ", nrOfRooms, nrOfBathrooms, nrOfFloors, sqrMeter, constructionYear, renovationYear, propertyType, isForSale, isForRent, parking, hasGarden, hasBalcony, hasElevator, isFurnished, latitude, longitude, status, featured, views) VALUES (:userId, :title, :description, :price, :address, :city, :postcode, :country" +
          contactValues +
          currencyValue +
          ", :nrOfRooms, :nrOfBathrooms, :nrOfFloors, :sqrMeter, :constructionYear, :renovationYear, :propertyType, :isForSale, :isForRent, :parking, :hasGarden, :hasBalcony, :hasElevator, :isFurnished, :latitude, :longitude, :status, :featured, :views)",
        insertWithVideoNoRenovation:
          "INSERT INTO properties (user_id, title, description, price, address, city, postcode, country" +
          contactColumns +
          currencyColumn +
          ", nrOfRooms, nrOfBathrooms, nrOfFloors, sqrMeter, constructionYear, propertyType, isForSale, isForRent, parking, hasGarden, hasBalcony, hasElevator, isFurnished, latitude, longitude, video_url, status, featured, views) VALUES (:userId, :title, :description, :price, :address, :city, :postcode, :country" +
          contactValues +
          currencyValue +
          ", :nrOfRooms, :nrOfBathrooms, :nrOfFloors, :sqrMeter, :constructionYear, :propertyType, :isForSale, :isForRent, :parking, :hasGarden, :hasBalcony, :hasElevator, :isFurnished, :latitude, :longitude, :videoUrl, :status, :featured, :views)",
        insertWithoutVideoNoRenovation:
          "INSERT INTO properties (user_id, title, description, price, address, city, postcode, country" +
          contactColumns +
          currencyColumn +
          ", nrOfRooms, nrOfBathrooms, nrOfFloors, sqrMeter, constructionYear, propertyType, isForSale, isForRent, parking, hasGarden, hasBalcony, hasElevator, isFurnished, latitude, longitude, status, featured, views) VALUES (:userId, :title, :description, :price, :address, :city, :postcode, :country" +
          contactValues +
          currencyValue +
          ", :nrOfRooms, :nrOfBathrooms, :nrOfFloors, :sqrMeter, :constructionYear, :propertyType, :isForSale, :isForRent, :parking, :hasGarden, :hasBalcony, :hasElevator, :isFurnished, :latitude, :longitude, :status, :featured, :views)"
      };
    };

    const insertProperty = async includeContact => {
      const statements = buildPropertyInsertStatements(includeContact, supportsCurrency);
      const insertPayload = { ...payload };
      if (!includeContact) {
        delete insertPayload.contactEmail;
        delete insertPayload.contactPhone;
      }
      if (!supportsCurrency) {
        delete insertPayload.currency;
      }
      let propertyResult;
      try {
        [propertyResult] = await pool.query(statements.insertWithVideo, insertPayload);
      } catch (err) {
        const errorMessage = String(err.sqlMessage || err.message || "");
        const isBadField = err.code === "ER_BAD_FIELD_ERROR";
        if (isBadField && errorMessage.includes("video_url")) {
          const fallbackPayload = { ...insertPayload };
          delete fallbackPayload.videoUrl;
          try {
            [propertyResult] = await pool.query(
              statements.insertWithoutVideo,
              fallbackPayload
            );
          } catch (innerErr) {
            const innerMessage = String(innerErr.sqlMessage || innerErr.message || "");
            if (innerErr.code === "ER_BAD_FIELD_ERROR" && innerMessage.includes("renovationYear")) {
              [propertyResult] = await pool.query(
                statements.insertWithoutVideoNoRenovation,
                fallbackPayload
              );
            } else {
              throw innerErr;
            }
          }
        } else if (isBadField && errorMessage.includes("renovationYear")) {
          try {
            [propertyResult] = await pool.query(
              statements.insertWithVideoNoRenovation,
              insertPayload
            );
          } catch (innerErr) {
            const innerMessage = String(innerErr.sqlMessage || innerErr.message || "");
            if (innerErr.code === "ER_BAD_FIELD_ERROR" && innerMessage.includes("video_url")) {
              const fallbackPayload = { ...insertPayload };
              delete fallbackPayload.videoUrl;
              [propertyResult] = await pool.query(
                statements.insertWithoutVideoNoRenovation,
                fallbackPayload
              );
            } else {
              throw innerErr;
            }
          }
        } else {
          throw err;
        }
      }
      return propertyResult;
    };

    let propertyResult;
    try {
      propertyResult = await insertProperty(true);
    } catch (err) {
      const errorMessage = String(err.sqlMessage || err.message || "");
      const isBadField = err.code === "ER_BAD_FIELD_ERROR";
      if (
        isBadField &&
        (errorMessage.includes("contact_email") || errorMessage.includes("contact_phone"))
      ) {
        propertyResult = await insertProperty(false);
      } else {
        throw err;
      }
    }

    const [newpropertyRows] = await pool.query(
      "SELECT * FROM properties WHERE id = :propertyId",
      { propertyId: propertyResult.insertId }
    );

    const property = mappropertyRow(newpropertyRows[0]);
    property.property_images = [];
    property.property_features = [];

    const amenities = normalizeAmenities(req.body.amenities);
    if (amenities.length) {
      const uniqueAmenities = [...new Set(amenities)];
      for (const text of uniqueAmenities) {
        if (!text) continue;
        const [featureRows] = await pool.query(
          "SELECT id, text FROM features WHERE text = :text",
          { text }
        );
        if (!featureRows.length) {
          await pool.query("INSERT INTO features (text) VALUES (:text)", { text });
        }
        await pool.query(
          "INSERT INTO property_extras (property_id, amenity_name, amenity_type) VALUES (:propertyId, :text, 'amenity')",
          { propertyId: property.id, text }
        );
      }
      await attachfeaturesToproperties([property]);
    }

    const [updatedUserRows] = await pool.query(
      "SELECT * FROM users WHERE id = :userId",
      { userId: req.userId }
    );
    const updatedUser = await buildUser(updatedUserRows[0]);

    res.json({ newproperty: property, user: mapUserSession(updatedUser) });
  })
);

app.get(
  "/property/all",
  asyncHandler(async (req, res) => {
    const offset = Number(req.query.offset) || 0;
    const limit = 12;
    const filters = [];
    const params = {};

    if (req.query.city && req.query.city !== "any") {
      filters.push("LOWER(city) = LOWER(:city)");
      params.city = req.query.city;
    }
    const propertyType =
      req.query.propertytype || req.query.propertyType || req.query.type;
    if (propertyType && propertyType !== "any") {
      filters.push("LOWER(propertyType) = LOWER(:propertyType)");
      params.propertyType = propertyType;
    }

    const priceFrom = Number(req.query.pricefrom || req.query.priceFrom || 0);
    const priceTo = Number(req.query.priceto || req.query.priceTo || 0);
    if (priceFrom) {
      filters.push("price >= :priceFrom");
      params.priceFrom = priceFrom;
    }
    if (priceTo) {
      filters.push("price <= :priceTo");
      params.priceTo = priceTo;
    }

    const forRent = req.query.forrent === "true";
    const forSale = req.query.forsale === "true";

    if (forRent && !forSale) {
      filters.push("isForRent = 1");
    }
    if (forSale && !forRent) {
      filters.push("isForSale = 1");
    }

    const whereSql = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS count FROM properties ${whereSql}`,
      params
    );

    const [rows] = await pool.query(
      `SELECT * FROM properties ${whereSql} ORDER BY created_at DESC LIMIT :limit OFFSET :offset`,
      { ...params, limit, offset }
    );

    const properties = rows.map(mappropertyRow);
    await attachImagesToproperties(properties);

    res.json({ data: properties, count: countRows[0].count });
  })
);

app.get(
  "/property/myproperty",
  requireAuth,
  asyncHandler(async (req, res) => {
    const adminCheck = await ensureAdminUser(req.userId);
    if (!adminCheck.ok) {
      return res
        .status(adminCheck.status)
        .json({ message: adminCheck.message });
    }

    const [rows] = await pool.query(
      "SELECT * FROM properties WHERE user_id = :userId ORDER BY created_at DESC",
      { userId: req.userId }
    );
    const properties = rows.map(mappropertyRow);
    await attachImagesToproperties(properties);
    await attachfeaturesToproperties(properties);
    res.json(properties);
  })
);

app.get(
  "/property/favorites",
  requireAuth,
  asyncHandler(async (req, res) => {
    const [likes] = await pool.query(
      "SELECT id, property_id FROM property_user_likes WHERE user_id = :userId",
      { userId: req.userId }
    );

    const propertyIds = likes.map(like => like.property_id);
    if (!propertyIds.length) {
      return res.json([]);
    }

    const [propertyRows] = await pool.query(
      "SELECT * FROM properties WHERE id IN (:propertyIds)",
      { propertyIds }
    );
    const properties = propertyRows.map(mappropertyRow);
    await attachImagesToproperties(properties);

    const propertyMap = new Map();
    properties.forEach(property => propertyMap.set(property.id, property));

    const response = likes
      .map(like => ({
        id: like.id,
        propertyId: like.property_id,
        property: propertyMap.get(like.property_id)
      }))
      .filter(entry => entry.property);

    res.json(response);
  })
);

app.get(
  "/property/:id",
  asyncHandler(async (req, res) => {
    const propertyId = Number(req.params.id);
    if (!Number.isFinite(propertyId)) {
      return res.status(400).json({ message: "Invalid property id" });
    }
    const propertyRow = await findpropertyById(propertyId);
    if (!propertyRow) {
      return res.status(404).json({ message: "property_listing not found" });
    }

    const property = mappropertyRow(propertyRow);
    await attachImagesToproperties([property]);
    await attachfeaturesToproperties([property]);

    const [userRows] = await pool.query("SELECT * FROM users WHERE id = :id", {
      id: propertyRow.user_id
    });
    if (userRows.length) {
      const ownerRow = userRows[0];
      const agencyRow = ownerRow.agency_id
        ? await getAgencyById(ownerRow.agency_id)
        : null;
      property.user = mapUserPublic(ownerRow, agencyRow);
    }

    res.json(property);
  })
);

app.put(
  "/property/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const adminCheck = await ensureAdminUser(req.userId);
    if (!adminCheck.ok) {
      return res
        .status(adminCheck.status)
        .json({ message: adminCheck.message });
    }

    const propertyId = Number(req.params.id);
    if (!Number.isFinite(propertyId)) {
      return res.status(400).json({ message: "Invalid property id" });
    }

    const ownership = await ensurepropertyOwner(propertyId, req.userId);
    if (!ownership.ok) {
      return res.status(ownership.status).json({ message: ownership.message });
    }

    let updates = [];
    const params = { propertyId };
    const existingVideoPublicId = resolveStoredPublicId(
      ownership.propertyRow.video_public_id,
      ownership.propertyRow.video_url
    );
    let shouldDeleteExistingCloudinaryVideo = false;

    if (req.body.title !== undefined) {
      const title = String(req.body.title || "").trim();
      if (!title) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      updates.push("title = :title");
      params.title = title;
    }

    if (req.body.description !== undefined) {
      updates.push("description = :description");
      params.description = String(req.body.description || "");
    }

    if (req.body.price !== undefined) {
      const price = parseNumberOrNull(req.body.price);
      updates.push("price = :price");
      params.price = price || 0;
    }

    if (req.body.currency !== undefined || req.body.priceCurrency !== undefined) {
      const rawCurrency = String(req.body.currency || req.body.priceCurrency || "RWF")
        .trim()
        .toUpperCase();
      updates.push("currency = :currency");
      params.currency = rawCurrency === "USD" ? "USD" : "RWF";
    }

    if (req.body.address !== undefined) {
      const address = String(req.body.address || "").trim();
      updates.push("address = :address");
      params.address = address;
    }

    if (req.body.city !== undefined) {
      updates.push("city = :city");
      params.city = String(req.body.city || "").trim();
    }

    if (req.body.postcode !== undefined) {
      updates.push("postcode = :postcode");
      params.postcode = String(req.body.postcode || "").trim();
    }

    if (req.body.country !== undefined) {
      updates.push("country = :country");
      params.country = String(req.body.country || "").trim();
    }

    if (req.body.nrOfRooms !== undefined) {
      updates.push("nrOfRooms = :nrOfRooms");
      params.nrOfRooms = parseNumberOrNull(req.body.nrOfRooms) || 0;
    }

    if (req.body.nrOfBathrooms !== undefined) {
      updates.push("nrOfBathrooms = :nrOfBathrooms");
      params.nrOfBathrooms = parseNumberOrNull(req.body.nrOfBathrooms) || 0;
    }

    if (req.body.nrOfFloors !== undefined) {
      updates.push("nrOfFloors = :nrOfFloors");
      params.nrOfFloors = parseNumberOrNull(req.body.nrOfFloors);
    }

    if (req.body.sqrMeter !== undefined) {
      updates.push("sqrMeter = :sqrMeter");
      params.sqrMeter = parseNumberOrNull(req.body.sqrMeter);
    }

    if (req.body.cubicMeter !== undefined) {
      updates.push("cubicMeter = :cubicMeter");
      params.cubicMeter = parseNumberOrNull(req.body.cubicMeter);
    }

    if (req.body.locatedOnFloor !== undefined) {
      updates.push("locatedOnFloor = :locatedOnFloor");
      params.locatedOnFloor = parseNumberOrNull(req.body.locatedOnFloor);
    }

    if (req.body.monthlyContribution !== undefined) {
      updates.push("monthlyContribution = :monthlyContribution");
      params.monthlyContribution = parseNumberOrNull(req.body.monthlyContribution);
    }

    if (req.body.constructionYear !== undefined) {
      updates.push("constructionYear = :constructionYear");
      params.constructionYear = parseNumberOrNull(req.body.constructionYear);
    }

    if (req.body.renovationYear !== undefined) {
      updates.push("renovationYear = :renovationYear");
      params.renovationYear = parseNumberOrNull(req.body.renovationYear);
    }

    if (req.body.heating !== undefined) {
      updates.push("heating = :heating");
      params.heating = String(req.body.heating || "").trim();
    }

    if (req.body.warmWater !== undefined) {
      updates.push("warmWater = :warmWater");
      params.warmWater = String(req.body.warmWater || "").trim();
    }

    if (req.body.storage !== undefined) {
      updates.push("storage = :storage");
      params.storage = String(req.body.storage || "").trim();
    }

    if (req.body.wifi !== undefined) {
      updates.push("wifi = :wifi");
      params.wifi = String(req.body.wifi || "").trim();
    }

    if (req.body.propertyType !== undefined) {
      updates.push("propertyType = :propertyType");
      params.propertyType = String(req.body.propertyType || "").trim();
    }

    if (req.body.isForSale !== undefined) {
      updates.push("isForSale = :isForSale");
      params.isForSale = toBool(req.body.isForSale);
    }

    if (req.body.isForRent !== undefined) {
      updates.push("isForRent = :isForRent");
      params.isForRent = toBool(req.body.isForRent);
    }

    if (req.body.parking !== undefined) {
      updates.push("parking = :parking");
      params.parking = String(req.body.parking || "").trim();
    }

    if (req.body.hasGarden !== undefined) {
      updates.push("hasGarden = :hasGarden");
      params.hasGarden = toBool(req.body.hasGarden);
    }

    if (req.body.hasBalcony !== undefined) {
      updates.push("hasBalcony = :hasBalcony");
      params.hasBalcony = toBool(req.body.hasBalcony);
    }

    if (req.body.hasElevator !== undefined) {
      updates.push("hasElevator = :hasElevator");
      params.hasElevator = toBool(req.body.hasElevator);
    }

    if (req.body.isFurnished !== undefined) {
      updates.push("isFurnished = :isFurnished");
      params.isFurnished = toBool(req.body.isFurnished);
    }

    if (req.body.lat !== undefined || req.body.latitude !== undefined) {
      const latParsed = parseCoordinate(req.body.lat ?? req.body.latitude);
      if (latParsed.hasValue && !isValidLatitude(latParsed.value)) {
        return res.status(400).json({
          message: "Latitude must be between -90 and 90."
        });
      }
      updates.push("latitude = :latitude");
      params.latitude = latParsed.value;
    }

    if (req.body.lon !== undefined || req.body.longitude !== undefined) {
      const lonParsed = parseCoordinate(req.body.lon ?? req.body.longitude);
      if (lonParsed.hasValue && !isValidLongitude(lonParsed.value)) {
        return res.status(400).json({
          message: "Longitude must be between -180 and 180."
        });
      }
      updates.push("longitude = :longitude");
      params.longitude = lonParsed.value;
    }

    if (req.body.videoUrl !== undefined) {
      const nextVideoUrl = String(req.body.videoUrl || "").trim() || null;
      updates.push("video_url = :videoUrl");
      params.videoUrl = nextVideoUrl;

      if (
        existingVideoPublicId &&
        nextVideoUrl !== ownership.propertyRow.video_url
      ) {
        updates.push("video_public_id = :videoPublicId");
        params.videoPublicId = null;
        shouldDeleteExistingCloudinaryVideo = true;
      }
    }

    if (req.body.propertiestatus !== undefined || req.body.status !== undefined) {
      const statusValue = req.body.propertiestatus || req.body.status || "active";
      const normalizedStatus =
        statusValue === "published" ? "active" : String(statusValue).trim();
      updates.push("status = :status");
      params.status = normalizedStatus;
    }

    if (req.body.featured !== undefined) {
      updates.push("featured = :featured");
      params.featured = toBool(req.body.featured);
    }

    if (req.body.contactEmail !== undefined) {
      updates.push("contact_email = :contactEmail");
      params.contactEmail = String(req.body.contactEmail || "").trim() || null;
    }

    if (req.body.contactPhone !== undefined) {
      updates.push("contact_phone = :contactPhone");
      params.contactPhone = String(req.body.contactPhone || "").trim() || null;
    }

    const propertyColumns = await loadPropertyColumns();
    if (propertyColumns?.size) {
      updates = updates.filter(update => {
        const column = update.split("=")[0].trim();
        if (propertyColumns.has(column)) {
          return true;
        }
        const paramMatch = update.match(/=\\s*:(\\w+)/);
        if (paramMatch) {
          delete params[paramMatch[1]];
        }
        return false;
      });
    }

    if (!updates.length && req.body.amenities === undefined) {
      return res.status(400).json({ message: "No property fields to update" });
    }

    if (updates.length) {
      const maxAttempts = 6;
      let attempts = 0;
      const missingColumnRegex = /Unknown column '([^']+)'/i;

      while (updates.length && attempts < maxAttempts) {
        try {
          await pool.query(
            `UPDATE properties SET ${updates.join(", ")} WHERE id = :propertyId`,
            params
          );
          break;
        } catch (err) {
          if (err.code !== "ER_BAD_FIELD_ERROR") {
            throw err;
          }
          const message = String(err.sqlMessage || err.message || "");
          const match = message.match(missingColumnRegex);
          const missingColumn = match?.[1];
          if (!missingColumn) {
            throw err;
          }
          const beforeLength = updates.length;
          updates = updates.filter(update => {
            const trimmed = update.trim();
            if (!trimmed.startsWith(`${missingColumn} =`)) {
              return true;
            }
            const paramMatch = trimmed.match(/=\\s*:(\\w+)/);
            if (paramMatch) {
              delete params[paramMatch[1]];
            }
            return false;
          });
          if (updates.length === beforeLength) {
            throw err;
          }
          attempts += 1;
        }
      }
    }

    if (req.body.amenities !== undefined) {
      const amenities = normalizeAmenities(req.body.amenities);
      await pool.query("DELETE FROM property_extras WHERE property_id = :propertyId", {
        propertyId
      });
      if (amenities.length) {
        const uniqueAmenities = [...new Set(amenities)];
        for (const text of uniqueAmenities) {
          if (!text) continue;
          const [featureRows] = await pool.query(
            "SELECT id, text FROM features WHERE text = :text",
            { text }
          );
          if (!featureRows.length) {
            await pool.query("INSERT INTO features (text) VALUES (:text)", { text });
          }
          await pool.query(
            "INSERT INTO property_extras (property_id, amenity_name, amenity_type) VALUES (:propertyId, :text, 'amenity')",
            { propertyId, text }
          );
        }
      }
    }

    if (shouldDeleteExistingCloudinaryVideo) {
      await destroyStoredAsset(existingVideoPublicId, "video");
    }

    const [updatedRows] = await pool.query("SELECT * FROM properties WHERE id = :propertyId", {
      propertyId
    });
    if (!updatedRows.length) {
      return res.status(404).json({ message: "property_listing not found" });
    }
    const updatedProperty = mappropertyRow(updatedRows[0]);
    await attachImagesToproperties([updatedProperty]);
    await attachfeaturesToproperties([updatedProperty]);
    res.json({ property: updatedProperty });
  })
);

app.delete(
  "/property/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const adminCheck = await ensureAdminUser(req.userId);
    if (!adminCheck.ok) {
      return res
        .status(adminCheck.status)
        .json({ message: adminCheck.message });
    }

    const propertyId = Number(req.params.id);
    if (!Number.isFinite(propertyId)) {
      return res.status(400).json({ message: "Invalid property id" });
    }

    const ownership = await ensurepropertyOwner(propertyId, req.userId);
    if (!ownership.ok) {
      return res.status(ownership.status).json({ message: ownership.message });
    }

    const [imageRows] = await pool.query(
      "SELECT image_url, public_id FROM property_images WHERE property_id = :propertyId",
      { propertyId }
    );
    await Promise.all(
      imageRows.map(row =>
        destroyStoredAsset(
          resolveStoredPublicId(row.public_id, row.image_url),
          "image"
        )
      )
    );

    await destroyStoredAsset(
      resolveStoredPublicId(
        ownership.propertyRow.video_public_id,
        ownership.propertyRow.video_url
      ),
      "video"
    );

    await pool.query("DELETE FROM properties WHERE id = :propertyId", {
      propertyId
    });

    res.json({ removed: true, propertyId });
  })
);

app.get(
  "/property/:id/like",
  requireAuth,
  asyncHandler(async (req, res) => {
    const propertyId = Number(req.params.id);
    const [rows] = await pool.query(
      "SELECT id FROM property_user_likes WHERE user_id = :userId AND property_id = :propertyId",
      { userId: req.userId, propertyId }
    );

    if (rows.length) {
      await pool.query(
        "DELETE FROM property_user_likes WHERE id = :id",
        { id: rows[0].id }
      );
      return res.json({ removed: true, propertyId });
    }

    const [result] = await pool.query(
      "INSERT INTO property_user_likes (user_id, property_id) VALUES (:userId, :propertyId)",
      { userId: req.userId, propertyId }
    );
    res.json({ id: result.insertId, propertyId });
  })
);

app.get(
  "/feature/all",
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query("SELECT id, text FROM features ORDER BY text");
    res.json(rows);
  })
);

app.post(
  "/feature/add/:propertyId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const adminCheck = await ensureAdminUser(req.userId);
    if (!adminCheck.ok) {
      return res
        .status(adminCheck.status)
        .json({ message: adminCheck.message });
    }

    const propertyId = Number(req.params.propertyId);
    const text = (req.body.text || "").trim();

    if (!text) {
      return res.status(400).json({ message: "feature text required" });
    }

    const ownership = await ensurepropertyOwner(propertyId, req.userId);
    if (!ownership.ok) {
      return res.status(ownership.status).json({ message: ownership.message });
    }

    const [existingExtras] = await pool.query(
      "SELECT id, amenity_name FROM property_extras WHERE property_id = :propertyId AND amenity_name = :text",
      { propertyId, text }
    );
    if (existingExtras.length) {
      return res.json({ id: existingExtras[0].id, text: existingExtras[0].amenity_name });
    }

    const [featureRows] = await pool.query(
      "SELECT id, text FROM features WHERE text = :text",
      { text }
    );
    if (!featureRows.length) {
      await pool.query("INSERT INTO features (text) VALUES (:text)", { text });
    }

    const [insertExtra] = await pool.query(
      "INSERT INTO property_extras (property_id, amenity_name, amenity_type) VALUES (:propertyId, :text, 'other')",
      { propertyId, text }
    );

    res.json({ id: insertExtra.insertId, text });
  })
);

app.delete(
  "/feature/:featureId/remove/:propertyId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const adminCheck = await ensureAdminUser(req.userId);
    if (!adminCheck.ok) {
      return res
        .status(adminCheck.status)
        .json({ message: adminCheck.message });
    }

    const propertyId = Number(req.params.propertyId);
    const featureId = Number(req.params.featureId);

    const ownership = await ensurepropertyOwner(propertyId, req.userId);
    if (!ownership.ok) {
      return res.status(ownership.status).json({ message: ownership.message });
    }

    const [rows] = await pool.query(
      "SELECT id, amenity_name FROM property_extras WHERE id = :featureId AND property_id = :propertyId",
      { featureId, propertyId }
    );

    await pool.query(
      "DELETE FROM property_extras WHERE id = :featureId AND property_id = :propertyId",
      { featureId, propertyId }
    );

    res.json(rows[0] ? { id: rows[0].id, text: rows[0].amenity_name } : { id: featureId });
  })
);

app.post(
  "/image/upload/:propertyId",
  requireAuth,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const adminCheck = await ensureAdminUser(req.userId);
    if (!adminCheck.ok) {
      return res
        .status(adminCheck.status)
        .json({ message: adminCheck.message });
    }

    const propertyId = Number(req.params.propertyId);

    const ownership = await ensurepropertyOwner(propertyId, req.userId);
    if (!ownership.ok) {
      return res.status(ownership.status).json({ message: ownership.message });
    }

    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file required" });
    }

    if (!isCloudinaryConfigured) {
      return res.status(500).json({ message: "Cloudinary is not configured" });
    }

    const uploadedImage = await uploadBufferToCloudinary(req.file.buffer, {
      resource_type: "image",
      public_id: buildCloudinaryPublicId("re_property")
    });
    const url = uploadedImage.secure_url;
    const publicId = uploadedImage.public_id;
    const [countRows] = await pool.query(
      "SELECT COUNT(*) AS count FROM property_images WHERE property_id = :propertyId",
      { propertyId }
    );
    const isPrimary = countRows[0].count === 0 ? 1 : 0;
    const displayOrder = countRows[0].count;

    const [imageResult] = await pool.query(
      "INSERT INTO property_images (property_id, image_url, public_id, is_primary, display_order) VALUES (:propertyId, :url, :publicId, :isPrimary, :displayOrder)",
      { propertyId, url, publicId, isPrimary, displayOrder }
    );

    res.json({
      id: imageResult.insertId,
      url,
      public_id: publicId,
      isPrimary: Boolean(isPrimary),
      displayOrder
    });
  })
);

app.post(
  "/video/upload/:propertyId",
  requireAuth,
  videoUpload.single("video"),
  asyncHandler(async (req, res) => {
    const adminCheck = await ensureAdminUser(req.userId);
    if (!adminCheck.ok) {
      return res
        .status(adminCheck.status)
        .json({ message: adminCheck.message });
    }

    const propertyId = Number(req.params.propertyId);

    const ownership = await ensurepropertyOwner(propertyId, req.userId);
    if (!ownership.ok) {
      return res.status(ownership.status).json({ message: ownership.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Video file required" });
    }

    if (!req.file.mimetype || !req.file.mimetype.startsWith("video/")) {
      return res.status(400).json({ message: "Only video files are allowed" });
    }

    if (!isCloudinaryConfigured) {
      return res.status(500).json({ message: "Cloudinary is not configured" });
    }

    const uploadedVideo = await uploadBufferToCloudinary(req.file.buffer, {
      resource_type: "video",
      public_id: buildCloudinaryPublicId("re_video")
    });
    const url = uploadedVideo.secure_url;
    const publicId = uploadedVideo.public_id;
    const existingVideoPublicId = resolveStoredPublicId(
      ownership.propertyRow.video_public_id,
      ownership.propertyRow.video_url
    );

    try {
      await pool.query(
        "UPDATE properties SET video_url = :url, video_public_id = :videoPublicId WHERE id = :propertyId",
        { url, videoPublicId: publicId, propertyId }
      );
    } catch (err) {
      if (err.code === "ER_BAD_FIELD_ERROR") {
        const message = String(err.message || "");
        if (message.includes("video_url") || message.includes("video_public_id")) {
          return res.status(400).json({
            message: "video_url or video_public_id column missing. Please run the database migration."
          });
        }
      }
      throw err;
    }

    if (existingVideoPublicId && existingVideoPublicId !== publicId) {
      await destroyStoredAsset(existingVideoPublicId, "video");
    }

    res.json({
      url,
      public_id: publicId
    });
  })
);

app.delete(
  "/image/:publicId/:propertyId/:imageId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const adminCheck = await ensureAdminUser(req.userId);
    if (!adminCheck.ok) {
      return res
        .status(adminCheck.status)
        .json({ message: adminCheck.message });
    }

    const propertyId = Number(req.params.propertyId);
    const imageId = Number(req.params.imageId);

    const ownership = await ensurepropertyOwner(propertyId, req.userId);
    if (!ownership.ok) {
      return res.status(ownership.status).json({ message: ownership.message });
    }

    const [imageRows] = await pool.query(
      "SELECT is_primary, public_id, image_url FROM property_images WHERE property_id = :propertyId AND id = :imageId",
      { propertyId, imageId }
    );
    if (!imageRows.length) {
      return res.status(404).json({ message: "Image not found" });
    }
    const wasPrimary = imageRows.length ? Boolean(imageRows[0].is_primary) : false;
    const storedPublicId = resolveStoredPublicId(
      imageRows[0].public_id,
      imageRows[0].image_url
    );

    await pool.query(
      "DELETE FROM property_images WHERE property_id = :propertyId AND id = :imageId",
      { propertyId, imageId }
    );

    if (wasPrimary) {
      const [nextRows] = await pool.query(
        "SELECT id FROM property_images WHERE property_id = :propertyId ORDER BY display_order ASC, id ASC LIMIT 1",
        { propertyId }
      );
      if (nextRows.length) {
        await pool.query(
          "UPDATE property_images SET is_primary = CASE WHEN id = :imageId THEN 1 ELSE 0 END WHERE property_id = :propertyId",
          { propertyId, imageId: nextRows[0].id }
        );
      }
    }

    await destroyStoredAsset(storedPublicId, "image");

    const [updatedRows] = await pool.query(
      "SELECT id, property_id, image_url, public_id, is_primary, display_order, caption FROM property_images WHERE property_id = :propertyId ORDER BY is_primary DESC, display_order ASC, id ASC",
      { propertyId }
    );

    res.json({
      removedId: imageId,
      propertyId,
      images: updatedRows.map(mapPropertyImageRow)
    });
  })
);

app.put(
  "/image/primary/:propertyId/:imageId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const adminCheck = await ensureAdminUser(req.userId);
    if (!adminCheck.ok) {
      return res
        .status(adminCheck.status)
        .json({ message: adminCheck.message });
    }

    const propertyId = Number(req.params.propertyId);
    const imageId = Number(req.params.imageId);

    const ownership = await ensurepropertyOwner(propertyId, req.userId);
    if (!ownership.ok) {
      return res.status(ownership.status).json({ message: ownership.message });
    }

    const [imageRows] = await pool.query(
      "SELECT id FROM property_images WHERE property_id = :propertyId AND id = :imageId",
      { propertyId, imageId }
    );
    if (!imageRows.length) {
      return res.status(404).json({ message: "Image not found" });
    }

    await pool.query(
      "UPDATE property_images SET is_primary = CASE WHEN id = :imageId THEN 1 ELSE 0 END WHERE property_id = :propertyId",
      { propertyId, imageId }
    );

    const [updatedRows] = await pool.query(
      "SELECT id, property_id, image_url, public_id, is_primary, display_order, caption FROM property_images WHERE property_id = :propertyId ORDER BY is_primary DESC, display_order ASC, id ASC",
      { propertyId }
    );

    res.json({
      propertyId,
      images: updatedRows.map(mapPropertyImageRow)
    });
  })
);

const getSeoCityCounts = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT city, COUNT(*) AS propertyCount FROM properties GROUP BY city"
  );
  res.json(rows);
});

app.get("/seo/count-cities", getSeoCityCounts);
app.post("/seo/count-cities", getSeoCityCounts);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      const maxMb = Math.round(imageUploadLimitBytes / (1024 * 1024));
      return res.status(400).json({
        message: `Image file too large. Max size is ${maxMb}MB.`
      });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err && err.sqlMessage) {
    return res.status(400).json({ message: err.sqlMessage });
  }
  res.status(500).json({ message: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
