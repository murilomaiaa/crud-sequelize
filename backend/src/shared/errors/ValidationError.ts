import AppError from './AppError';

export default class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'validation');
  }
}
