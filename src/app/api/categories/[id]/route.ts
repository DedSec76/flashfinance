import { getCurrentUserId } from "@/src/lib/auth/current-user";
import { errorResponse, validationError } from "@/src/lib/http/error-response";
import {
  deleteCategoryService,
  updateCategoryService,
} from "@/src/services/category/category.service";
import { updateCategorySchema } from "@/src/validations/category.validation";

type CategoryRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: CategoryRouteContext) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const result = updateCategorySchema.safeParse(body);

    if (!result.success) {
      const flattened = result.error.flatten();
      return validationError(
        flattened.fieldErrors,
        flattened.formErrors[0] ?? "Invalid request data.",
      );
    }

    const userId = await getCurrentUserId();
    const category = await updateCategoryService(userId, id, result.data);

    return Response.json(category);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: CategoryRouteContext) {
  try {
    const { id } = await params;
    const userId = await getCurrentUserId();
    const deleted = await deleteCategoryService(userId, id);

    return Response.json(deleted);
  } catch (error) {
    return errorResponse(error);
  }
}
