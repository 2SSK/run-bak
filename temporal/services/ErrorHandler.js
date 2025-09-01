class ErrorHandler {
  static handle(error, context = "") {
    console.error(`Error${context ? " in " + context : ""}: ${error.message}`);

    if (process.env.NODE_ENV === "development") {
      console.error(error.stack);
    }

    return error;
  }
}

export default ErrorHandler;
