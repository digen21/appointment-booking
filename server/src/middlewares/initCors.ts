import { Express } from "express";
import cors, { CorsOptions } from "cors";
import { env } from "@configs";

const allowedOrigins = new Set(
  [env.FRONTEND_URL, "http://localhost:5173"].filter(Boolean),
);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked: ${origin}`));
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const initCors = (app: Express) => {
  app.use(cors(corsOptions));
  app.options(/.*/, cors(corsOptions));
};

export default initCors;
