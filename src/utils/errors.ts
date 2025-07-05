import type { ErrorInfo } from '../types/common';

export class AppError extends Error {
  public readonly code: string;
  public readonly details?: string;
  public readonly timestamp: Date;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', details?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  public toJSON(): ErrorInfo {
    return {
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

export const handleError = (error: unknown, context: string = 'Unknown'): ErrorInfo => {
  console.error(`[${context}] Error occurred:`, error);
  
  if (error instanceof AppError) {
    return error.toJSON();
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'GENERIC_ERROR',
      details: `Context: ${context}`,
      timestamp: new Date(),
    };
  }
  
  return {
    message: 'An unknown error occurred',
    code: 'UNKNOWN_ERROR',
    details: `Context: ${context}`,
    timestamp: new Date(),
  };
};

export const safeExecute = async <T>(
  fn: () => Promise<T>,
  context: string = 'Unknown'
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    handleError(error, context);
    return null;
  }
};

export const validateRequired = (value: any, fieldName: string): void => {
  if (value === undefined || value === null || value === '') {
    throw new AppError(`${fieldName} is required`, 'VALIDATION_ERROR');
  }
};

export const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Invalid email format', 'VALIDATION_ERROR');
  }
};

export const validateUrl = (url: string): void => {
  try {
    new URL(url);
  } catch {
    throw new AppError('Invalid URL format', 'VALIDATION_ERROR');
  }
};