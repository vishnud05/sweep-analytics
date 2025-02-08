export const handleServerError = (error: unknown) => {
  console.error("Server error:", {
    name: error instanceof Error ? error.name : "Unknown",
    message: error instanceof Error ? error.message : "Unknown error occurred",
    stack: error instanceof Error ? error.stack : undefined,
  })

  // Return a structured error response
  return {
    error: error instanceof Error ? error.name : "UnknownError",
    message:
      error instanceof Error ? error.message : "An unexpected error occurred",
    type: "ServerError",
  }
}
