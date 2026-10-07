import { cookies } from "next/headers";

import { AppError } from "@/src/lib/errors/app-error";
import { getSessionByToken } from "@/src/services/session/session.service";

export async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sessionToken")?.value;

  if (!token) {
    throw new AppError("SESSION_INVALID", "Authentication required.", 401);
  }

  const userId = await getSessionByToken(token);
  return userId.toString();
}
