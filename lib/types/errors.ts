export class RestaurantError extends Error {
  constructor(
    message: string,
    public code:
      | "NOT_FOUND"
      | "UNAUTHORIZED"
      | "VALIDATION_ERROR"
      | "DATABASE_ERROR"
      | "FETCH_FAILED"
  ) {
    super(message);
    this.name = "RestaurantError";
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof Error && error.name === "ValidationError";
}

export function isRestaurantError(error: unknown): error is RestaurantError {
  return error instanceof Error && error.name === "RestaurantError";
}
