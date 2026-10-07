import { getCurrentUserId } from "@/src/lib/auth/current-user";
import { errorResponse, validationError } from "@/src/lib/http/error-response";
import { getFinancialSummary } from "@/src/services/summary/summary.service";
import { summaryMonthSchema } from "@/src/validations/summary.validation";

export async function GET(request: Request) {
  try {
    const month = new URL(request.url).searchParams.get("month");
    const userId = await getCurrentUserId();

    if (!month) {
      const summary = await getFinancialSummary(userId);
      return Response.json(summary);
    }

    const parsedMonth = summaryMonthSchema.safeParse(month);

    if (!parsedMonth.success) {
      return validationError({
        month: parsedMonth.error.issues.map((issue) => issue.message),
      });
    }

    const summary = await getFinancialSummary(userId, { month: parsedMonth.data });
    return Response.json(summary);
  } catch (error) {
    return errorResponse(error);
  }
}
