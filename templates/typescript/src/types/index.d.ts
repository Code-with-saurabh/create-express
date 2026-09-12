declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
    DATABASE_URL?: string;
    JWT_SECRET?: string;
    JWT_REFRESH_SECRET?: string;
    CORS_ORIGINS?: string;
    LOG_LEVEL?: string;
    SERVICE_NAME?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        id: string;
        email: string;
        role?: string;
      };
    }
  }
}

export {};
