import { Logger } from '@nestjs/common';
import z from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().max(65535).min(0),
  DATABASE_URL: z.url(),
  ACCESS_TOKEN_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRES_IN: z.coerce.number().int().positive()
});

export function validate(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    const logger = new Logger('EnvValidation');
    logger.error('Env validation failed', z.prettifyError(parsed.error));
    throw new Error('Env validaition failed');
  }
  return parsed.data;
}

export type EnvVariable = z.infer<typeof envSchema>;
