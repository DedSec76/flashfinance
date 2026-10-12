import { cookies } from "next/headers";

import { AppError } from "@/src/lib/errors/app-error";
import { getUserBySessionToken  } from "@/src/services/session/session.service";

export async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sessionToken")?.value;

  if (!token) {
    throw new AppError(
      "SESSION_INVALID", 
      "Authentication required.", 
      401
    );
  }

  const user = await getUserBySessionToken(token);

  return user._id.toString();
}
