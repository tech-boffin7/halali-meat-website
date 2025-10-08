import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string; // Add role property
    } & DefaultSession["user"];
  }

  interface JWT extends DefaultJWT {
    id: string;
    role?: string; // Add role property
  }
}
