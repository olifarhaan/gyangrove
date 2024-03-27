declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      FRONTEND_BASE_URL: string;
      NODE_ENV: "development" | "production";

      MONGODB_URI: string;
    }
  }
}

export {};
