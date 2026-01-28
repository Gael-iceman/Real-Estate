const jwt = require("jsonwebtoken");

const { JWT_SECRET = "", JWT_COOKIE_NAME = "re_auth" } = process.env;

const parseCookies = cookieHeader => {
  if (!cookieHeader) return {};
  return cookieHeader.split(";").reduce((acc, item) => {
    const [rawKey, ...rawValue] = item.trim().split("=");
    if (!rawKey) return acc;
    const value = rawValue.join("=");
    acc[rawKey] = decodeURIComponent(value || "");
    return acc;
  }, {});
};

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const headerToken = header.startsWith("Bearer ") ? header.slice(7) : null;
  const cookies = parseCookies(req.headers.cookie || "");
  const cookieToken = cookies[JWT_COOKIE_NAME] || null;
  const token = headerToken || cookieToken;
  if (!token) {
    return res.status(401).json({ message: "Missing authorization token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    return next();
  } catch (err) {
    if (headerToken && cookieToken && headerToken !== cookieToken) {
      try {
        const payload = jwt.verify(cookieToken, JWT_SECRET);
        req.userId = payload.userId;
        return next();
      } catch (cookieErr) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
    }
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };
