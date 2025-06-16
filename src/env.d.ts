/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_BASE_URL: string;
  readonly PUBLIC_JWT_ACCESS_TOKEN_LIFETIME: string;
  readonly PUBLIC_JWT_REFRESH_TOKEN_LIFETIME: string;
  readonly PUBLIC_EMAIL_VERIFICATION_URL: string;
  readonly PUBLIC_PASSWORD_RESET_URL: string;
  readonly PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

