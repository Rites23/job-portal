import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_HOST: z.string().min(1),
    DB_PORT: z.string().min(1),
    DB_NAME: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
  },
  createFinalSchema: (shape) => {
    const baseSchema = z.object(shape);
    return baseSchema.transform((val) => ({
      ...val,
      DATABASE_URL: `postgres://${val.DB_USER}:${val.DB_PASSWORD}@${val.DB_HOST}:${val.DB_PORT}/${val.DB_NAME}`,
    }));
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
});
