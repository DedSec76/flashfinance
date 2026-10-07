type AuthErrorBody = {
  error?: {
    message?: string;
    fields?: Record<string, string[] | undefined>;
  };
};

export async function readAuthError(response: Response) {
  let message = "Something went wrong. Please try again.";
  const fields: Record<string, string> = {};

  try {
    const body = (await response.json()) as AuthErrorBody;

    if (body.error?.message) {
      message = body.error.message;
    }

    for (const [key, messages] of Object.entries(body.error?.fields ?? {})) {
      const first = messages?.find((item) => item.trim());

      if (first) {
        fields[key] = first;
      }
    }
  } catch {
    // Keep the fallback when the response has no JSON body.
  }

  return { message, fields };
}
