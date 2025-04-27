// Utility functions for working with JWT tokens
// Only generic helpers should be here, domain-specific logic goes in auth/

/**
 * Decodes a JWT token and returns its payload as an object.
 * @param token JWT string
 * @returns Decoded payload or null if invalid
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(decoded)));
  } catch (e) {
    return null;
  }
}

/**
 * Checks if a JWT token is expired.
 * @param token JWT string
 * @returns true if expired, false if valid or undetermined
 */
export function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  // exp is in seconds since epoch
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}
