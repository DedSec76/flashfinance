import { getCurrentUserId } from "@/src/lib/auth/current-user";
import { errorResponse, validationError } from "@/src/lib/http/error-response";
import {
  createCategoryService,
  listCategoriesService,
} from "@/src/services/category/category.service";
import { createCategorySchema } from "@/src/validations/category.validation";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const categories = await listCategoriesService(userId);

    return Response.json(categories);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const result = createCategorySchema.safeParse(body);

    if (!result.success) {
      const flattened = result.error.flatten();
      return validationError(
        flattened.fieldErrors,
        flattened.formErrors[0] ?? "Invalid request data.",
      );
    }

    const userId = await getCurrentUserId();
    const category = await createCategoryService(userId, result.data);

    return Response.json(category, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
