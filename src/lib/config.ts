export const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "change-this-secret-before-production"
);

export const COOKIE_NAME = "admin_token";
