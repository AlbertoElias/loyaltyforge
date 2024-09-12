import jwt from "jsonwebtoken";

export function extractSubFromJwt(token: string | undefined): string | null {
  if (!token) return null;

  try {
    console.log("token", token);
    const decoded = jwt.decode(token) as { sub?: string } | null;
    console.log("decoded", decoded);
    return decoded?.sub || null;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}