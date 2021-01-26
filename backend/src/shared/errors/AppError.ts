class AppError extends Error {
  public readonly message: string;

  public readonly statusCode: number;

  public readonly type: string;

  constructor(message: string, statusCode = 400, type = 'AppError') {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.type = type;
  }
}

export default AppError;
