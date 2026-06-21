import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { sendEmail } from '@/lib/email/resend';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Reset your password</h2>
            <p>Hi ${user.name || 'there'},</p>
            <p>Click the button below to reset your password. This link expires in 1 hour.</p>
            <a href="${url}" style="display: inline-block; background: #2d6a4f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a>
            <p>Or copy this link: ${url}</p>
          </div>
        `,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Pothos DB!</h2>
            <p>Hi ${user.name || 'there'},</p>
            <p>Thanks for signing up. Please verify your email address to get started.</p>
            <a href="${url}" style="display: inline-block; background: #2d6a4f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Verify Email</a>
            <p>Or copy this link: ${url}</p>
          </div>
        `,
      });
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'USER',
        input: false,
      },
      hasLifetimeAccess: {
        type: 'boolean',
        defaultValue: false,
        input: false,
      },
      username: {
        type: 'string',
        required: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  trustedOrigins: [
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL as string,
  ],
});

export type Session = typeof auth.$Infer.Session;